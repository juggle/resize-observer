import { process } from '../ResizeObserverController';
import { global } from './global';
import { queueResizeObserver } from './queueResizeObserver';

const CATCH_FRAMES = 60 / 5; // Fifth of a second

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

let scheduled = false;
class Scheduler {

  private observer: MutationObserver | undefined;
  private listener: () => void;
  public stopped: boolean = true;

  public constructor () {
    this.listener = (): void => this.schedule();
  }


  public run (frames: number): void {
    if (scheduled) {
      return;
    }
    scheduled = true;
    queueResizeObserver((): void => {
      let elementsHaveResized = false;
      try {
        // Process Calculations
        elementsHaveResized = process();
      }
      finally {
        scheduled = false;
        // Have any changes happened?
        if (elementsHaveResized) {
          this.run(60);
        }
        // Should we continue to check?
        else if (frames) {
          this.run(frames - 1);
        }
        // Start listening again
        else {
          this.start();
        }
      }
    });
  }

  public schedule (): void {
    this.stop(); // Stop listeneing
    this.run(CATCH_FRAMES); // Run schedule
  }

  private observe (): void {
    const cb = (): void => this.observer && this.observer.observe(document.body, observerConfig);
    /* istanbul ignore next */
    document.body ? cb() : global.addEventListener('DOMContentLoaded', cb);
  }

  public start (): void {
    if (this.stopped) {
      this.stopped = false;
      this.observer = new MutationObserver(this.listener);
      this.observe();
      events.forEach((name): void => global.addEventListener(name, this.listener, true));
    }
  }

  public stop (): void {
    if (!this.stopped) {
      this.observer && this.observer.disconnect();
      events.forEach((name): void => global.removeEventListener(name, this.listener, true));
      this.stopped = true;
    }
  }
}

const scheduler = new Scheduler();

export { scheduler };
