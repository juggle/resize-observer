import { process } from '../ResizeObserverController';
import { prettifyConsoleOutput } from './prettify';

const CATCH_FRAMES = 60 / 5; // Fifth of a second

// Keep original reference of raf to use later
const requestAnimationFrame = window.requestAnimationFrame;

const observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };

const events = [
  // Global Resize
  'resize',
  // Global Load
  'load',
  // Transitions & Animations
  'transitionend',
  'animationend',
  'animationstart',
  'animationiteration',
  // Interactions
  'keyup',
  'keydown',
  'mouseup',
  'mousedown',
  'mouseover',
  'mouseout',
  'blur',
  'focus'
];

const rafSlot = new Map();
const resizeObserverSlot = new Map();

let scheduled: boolean;
const dispatchCallbacksOnNextFrame = (): void => {
  if (scheduled) {
    return;
  }
  scheduled = true;
  function runSchedule(t: number): void {
    scheduled = false;
    const frameCallbacks: FrameRequestCallback[] = [];
    const resizeObserverCallbacks: FrameRequestCallback[] = [];
    rafSlot.forEach((callback): number => frameCallbacks.push(callback));
    resizeObserverSlot.forEach((callback): number => resizeObserverCallbacks.push(callback));
    rafSlot.clear(); resizeObserverSlot.clear();
    try { // Try to run animation frame callbacks
      for (let callback of frameCallbacks) {
        callback(t);
      }
    }
    finally { // Finally, run schedule
      for (let callback of resizeObserverCallbacks) {
        callback(t);
      }
    }
  };
  requestAnimationFrame(runSchedule)
}

class Scheduler {

  private observer: MutationObserver | undefined;
  private listener: () => void;
  public stopped: boolean = true;

  public constructor () {
    this.listener = (): void => this.schedule();
  }

  public run (frames: number): void {
    const scheduler = this;
    resizeObserverSlot.set(this, function ResizeObserver (): void {
      let elementsHaveResized = false;
      try {
        // Process Calculations
        elementsHaveResized = process();
      }
      finally {
        // Have any changes happened?
        if (elementsHaveResized) {
          scheduler.run(60);
        }
        // Should we continue to check?
        else if (frames) {
          scheduler.run(frames - 1);
        }
        // Start listening again
        else {
          scheduler.start();
        }
      }
    });
    dispatchCallbacksOnNextFrame();
  }

  public schedule (): void {
    this.stop(); // Stop listeneing
    this.run(CATCH_FRAMES); // Run schedule
  }

  private observe (): void {
    const cb = (): void => this.observer && this.observer.observe(document.body, observerConfig);
    /* istanbul ignore next */
    document.body ? cb() : window.addEventListener('DOMContentLoaded', cb);
  }

  public start (): void {
    if (this.stopped) {
      this.stopped = false;
      if ('MutationObserver' in window) {
        this.observer = new MutationObserver(this.listener);
        this.observe();
      }
      events.forEach((name): void => window.addEventListener(name, this.listener, true));
    }
  }

  public stop (): void {
    if (!this.stopped) {
      this.observer && this.observer.disconnect();
      events.forEach((name): void => window.removeEventListener(name, this.listener, true));
      this.stopped = true;
    }
  }
}

const scheduler = new Scheduler();
let rafIdBase = 0;

// Override requestAnimationFrame to make sure
// calculations are performed after any changes may occur.
// * Is there another way to schedule without modifying the whole function?
window.requestAnimationFrame = function (callback): number {
  if (typeof callback !== 'function') {
    throw new Error('requestAnimationFrame expects 1 callback argument of type function.');
  }
  const handle = rafIdBase += 1;
  rafSlot.set(handle, function AnimationFrame (t: number): void { return callback(t) });
  dispatchCallbacksOnNextFrame();
  return handle;
}
// Override cancelAnimationFrame
// as we need to handle custom removal
window.cancelAnimationFrame = function (handle): void {
  rafSlot.delete(handle);
}
prettifyConsoleOutput(window.requestAnimationFrame);
prettifyConsoleOutput(window.cancelAnimationFrame);

export { scheduler };
