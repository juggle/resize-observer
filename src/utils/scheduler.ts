import { process } from "./process";
import { queueResizeObserver } from "./queueResizeObserver";
import { IsomorphicWindow, unsafeGlobal } from "./global";

const CATCH_PERIOD = 250; // ms

const observerConfig = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};

const events = [
  // Global Resize
  "resize",
  // Global Load
  "load",
  // Transitions & Animations
  "transitionend",
  "animationend",
  "animationstart",
  "animationiteration",
  // Interactions
  "keyup",
  "keydown",
  "mouseup",
  "mousedown",
  "mouseover",
  "mouseout",
  "blur",
  "focus",
];

class Scheduler {
  public stopped = true;

  private observer: MutationObserver | undefined;
  private listener: () => void;
  private watching = 0;
  private scheduled = false;

  public constructor(private global: IsomorphicWindow) {
    this.listener = (): void => this.schedule();
  }

  isWatching(): boolean {
    return !!this.watching;
  }

  private run(timeout = CATCH_PERIOD): void {
    if (this.scheduled) {
      return;
    }
    this.scheduled = true;
    const until = time(timeout);
    queueResizeObserver((): void => {
      let elementsHaveResized = false;
      try {
        // Process Calculations
        elementsHaveResized = process();
      } finally {
        this.scheduled = false;
        timeout = until - time();
        if (!this.isWatching()) {
          return;
        }
        // Have any changes happened?
        if (elementsHaveResized) {
          this.run(1000);
        }
        // Should we continue to check?
        else if (timeout > 0) {
          this.run(timeout);
        }
        // Start listening again
        else {
          this.start();
        }
      }
    });
  }

  public updateCount(n: number): void {
    !this.watching && n > 0 && this.start();
    this.watching += n;
    !this.watching && this.stop();
  }

  public schedule(): void {
    this.stop(); // Stop listening
    this.run(); // Run schedule
  }

  private observe(): void {
    const cb = (): void =>
      this.observer && this.observer.observe(document.body, observerConfig);
    /* istanbul ignore next */
    document.body ? cb() : this.global.addEventListener("DOMContentLoaded", cb);
  }

  public start(): void {
    if (this.stopped) {
      this.stopped = false;
      this.observer = new MutationObserver(this.listener);
      this.observe();
      events.forEach((name): void =>
        this.global.addEventListener(name, this.listener, true)
      );
    }
  }

  public stop(): void {
    if (!this.stopped) {
      this.observer && this.observer.disconnect();
      events.forEach((name): void =>
        this.global.removeEventListener(name, this.listener, true)
      );
      this.stopped = true;
    }
  }
}

function time(timeout = 0) {
  return Date.now() + timeout;
}

export const createScheduler = (global: IsomorphicWindow): Scheduler => {
  return new Scheduler(global);
};

export const scheduler = createScheduler(unsafeGlobal);
export const updateCount = scheduler.updateCount.bind(scheduler);
