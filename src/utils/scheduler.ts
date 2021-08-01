import { process } from './process';
import { queueResizeObserver } from './queueResizeObserver';

const CATCH_PERIOD = 250; // ms

const time = (timeout = 0) => Date.now() + timeout;

let scheduled = false;
class Scheduler {

  private observer: MutationObserver | undefined;
  private listener: () => void;
  public stopped = true;

  public constructor () {
    this.listener = (): void => this.schedule();
  }

  private run (timeout = CATCH_PERIOD): void {
    if (scheduled) {
      return;
    }
    scheduled = true;
    const until = time(timeout);
    queueResizeObserver((): void => {
      let elementsHaveResized = false;
      try {
        // Process Calculations
        elementsHaveResized = process();
      }
      finally {
        scheduled = false;
        timeout = until - time();
        // Have any changes happened?
        if (elementsHaveResized) {
          this.run(1000);
        }
        // Should we continue to check?
        else if (timeout > 0) {
          this.run(timeout);
        }
      }
    });
  }

  public schedule (): void {
    this.run(); // Run schedule
  }

  public get scheduled (): boolean {
    return scheduled;
  }
}

const scheduler = new Scheduler();

export { scheduler };
