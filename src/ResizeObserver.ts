import { ResizeObserverController } from './ResizeObserverController';
import { ResizeObserverCallback } from './ResizeObserverCallback';
import { ResizeObserverBoxOptions } from './ResizeObserverBoxOptions';
import { ResizeObserverOptions } from './ResizeObserverOptions';

const DPPB = ResizeObserverBoxOptions.DEVICE_PIXEL_BORDER_BOX;

/**
 * https://drafts.csswg.org/resize-observer-1/#resize-observer-interface
 */
export default class ResizeObserver {

  public constructor (callback: ResizeObserverCallback) {
    ResizeObserverController.connect(this, callback);
  }

  public observe (target: Element, options?: ResizeObserverOptions): void {
    if (options && options.box === DPPB && target.tagName !== 'CANVAS') {
      throw new Error(`Can only watch ${options.box} on canvas elements.`);
    }
    ResizeObserverController.observe(this, target, options);
  }

  public unobserve (target: Element): void {
    ResizeObserverController.unobserve(this, target);
  }

  public disconnect (): void {
    ResizeObserverController.disconnect(this);
  }

  public static toString (): string {
    return 'function ResizeObserver () { [polyfill code] }';
  }

}

export { ResizeObserver };
