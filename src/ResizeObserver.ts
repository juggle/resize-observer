import { ResizeObserverController } from './ResizeObserverController';
import { ResizeObserverCallback } from './ResizeObserverCallback';
import { ResizeObserverOptions } from './ResizeObserverOptions';
import { isElement } from './utils/element';

/**
 * The ResizeObserver API is an interface for observing changes to Element’s size.
 * It is an Element's counterpart to window.resize event.
 * 
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

  /**
   * Observes an element,
   * notifying the handler of the current and subsequent sizes.
   * @param target Element to observe
   * @param options Options to pass to the observer
   * @returns {void}
   */
  public observe (target: Element, options?: ResizeObserverOptions): void {
    if (arguments.length === 0) {
      throw new TypeError(`Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.`)
    }
    if (!isElement(target)) {
      throw new TypeError(`Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element`);
    }
    ResizeObserverController.observe(this, target, options);
  }

  /**
   * Stops observing the element for any further changes.
   * @param target Element to stop observing
   * @returns {void}
   */
  public unobserve (target: Element): void {
    if (arguments.length === 0) {
      throw new TypeError(`Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.`)
    }
    if (!isElement(target)) {
      throw new TypeError(`Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element`);
    }
    ResizeObserverController.unobserve(this, target);
  }

  /**
   * Disconnects all observed targets.
   * @returns {void}
   */
  public disconnect (): void {
    ResizeObserverController.disconnect(this);
  }

  /**
   * @override
   */
  public static toString (): string {
    return 'function ResizeObserver () { [polyfill code] }';
  }

}

export { ResizeObserver };
