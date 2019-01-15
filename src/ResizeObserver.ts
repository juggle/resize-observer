import ResizeObserverController from './ResizeObserverController';
import ResizeObserverCallback from './ResizeObserverCallback';

export default class ResizeObserver {

  public constructor (callback: ResizeObserverCallback) {
    ResizeObserverController.connect(this, callback);
  }

  public observe (target: Element) {
    ResizeObserverController.observe(this, target);
  }

  public unobserve (target: Element) {
    ResizeObserverController.unobserve(this, target);
  }

  public disconnect () {
    ResizeObserverController.disconnect(this);
  }

}
