import { process } from '../ResizeObserverController';

// Keep original reference of raf to use later
const requestAnimationFrame = window.requestAnimationFrame;

const observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };

const events = [
  // Global Resize
  'resize',
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

class Scheduler {

  private id: number | undefined;
  private observer: MutationObserver | undefined;
  private listener: () => void;
  public stopped: boolean = true

  public constructor () {
    this.listener = (): void => this.schedule();
  }

  public schedule (): void {
    this.run(1);
  }

  private run (frames: number): void {
    if (this.id) {
      cancelAnimationFrame(this.id);
    }
    this.id = requestAnimationFrame(() => {
      // Have any changes happened?
      if (process()) {
        this.run(60);
      }
      // Continue checking any additional frames
      else if (frames) {
        this.run(frames - 1);
      }
    });
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
      events.forEach(name => window.addEventListener(name, this.listener, true));
    }
  }

  public stop (): void {
    if (!this.stopped) {
      this.observer && this.observer.disconnect();
      events.forEach(name => window.removeEventListener(name, this.listener, true));
      this.stopped = true;
    }
  }
}

const scheduler = new Scheduler();

// Override raf to make sure calculations are performed after any changes may occur.
window.requestAnimationFrame = function (callback) {
  const id = requestAnimationFrame(callback); // Callback should run first
  scheduler.schedule(); // Reschedule observation checks to run afterwards
  return id;
}

export { scheduler };
