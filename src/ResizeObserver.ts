import { ResizeObserverController } from './ResizeObserverController';
import { ResizeObserverCallback } from './ResizeObserverCallback';
import { ResizeObserverOptions } from './ResizeObserverOptions';

export default class ResizeObserver {

  public constructor (callback: ResizeObserverCallback) {
    ResizeObserverController.connect(this, callback);
  }

  public observe (target: Element, options?: ResizeObserverOptions) {
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
