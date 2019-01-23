import { ResizeObserverController } from './ResizeObserverController';
import { ResizeObserverCallback } from './ResizeObserverCallback';
import { ResizeObserverBoxOptions } from './ResizeObserverBoxOptions';
import { ResizeObserverOptions } from './ResizeObserverOptions';

const DPPB = ResizeObserverBoxOptions.DEVICE_PIXEL_BORDER_BOX;

export default class ResizeObserver {

  public constructor (callback: ResizeObserverCallback) {
    ResizeObserverController.connect(this, callback);
  }

  public observe (target: Element, options?: ResizeObserverOptions) {
    if (options && options.box === DPPB && target.tagName !== 'CANVAS') {
      throw new Error(`Can only watch ${options.box} on canvas elements.`);
    }
    ResizeObserverController.observe(this, target, options);
  }

  public unobserve (target: Element) {
    ResizeObserverController.unobserve(this, target);
  }

  public disconnect () {
    ResizeObserverController.disconnect(this);
  }

}

export { ResizeObserver };
