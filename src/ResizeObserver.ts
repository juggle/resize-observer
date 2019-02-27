import { ResizeObserverController } from './ResizeObserverController';
import { ResizeObserverCallback } from './ResizeObserverCallback';
import { ResizeObserverOptions } from './ResizeObserverOptions';
import { POLYFILL_CONSOLE_OUTPUT } from './utils/prettify';

/**
 * https://drafts.csswg.org/resize-observer-1/#resize-observer-interface
 */
class ResizeObserver {

  public constructor (callback: ResizeObserverCallback) {
    if (arguments.length === 0) {
      throw new TypeError(`Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.`)
    }
    if (typeof callback !== 'function') {
      throw new TypeError(`Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.`);
    }
    ResizeObserverController.connect(this, callback);
  }

  public observe (target: Element, options?: ResizeObserverOptions): void {
    if (arguments.length === 0) {
      throw new TypeError(`Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.`)
    }
    if (target instanceof Element === false) {
      throw new TypeError(`Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element`);
    }
    ResizeObserverController.observe(this, target, options);
  }

  public unobserve (target: Element): void {
    if (arguments.length === 0) {
      throw new TypeError(`Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.`)
    }
    if (target instanceof Element === false) {
      throw new TypeError(`Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element`);
    }
    ResizeObserverController.unobserve(this, target);
  }

  public disconnect (): void {
    ResizeObserverController.disconnect(this);
  }

  public static toString (): string {
    return POLYFILL_CONSOLE_OUTPUT;
  }

}
export default ResizeObserver;
export { ResizeObserver };
