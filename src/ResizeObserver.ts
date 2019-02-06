import { ResizeObserverController } from './ResizeObserverController';
import { ResizeObserverCallback } from './ResizeObserverCallback';
import { ResizeObserverBoxOptions } from './ResizeObserverBoxOptions';
import { ResizeObserverOptions } from './ResizeObserverOptions';
import { POLYFILL_CONSOLE_OUTPUT } from './utils/prettify';

const DPPB = ResizeObserverBoxOptions.DEVICE_PIXEL_BORDER_BOX;

/**
 * https://drafts.csswg.org/resize-observer-1/#resize-observer-interface
 */
export default class ResizeObserver {

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
    if (options && options.box === DPPB && target.tagName !== 'CANVAS') {
      throw new Error(`Can only watch ${options.box} on canvas elements.`);
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

export { ResizeObserver };
