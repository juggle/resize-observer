import { DOMRectReadOnly } from './DOMRectReadOnly';
import { ResizeObserverSize } from './ResizeObserverSize';
import { calculateBoxSizes } from './algorithms/calculateBoxSize';

/**
 * https://drafts.csswg.org/resize-observer-1/#resize-observer-entry-interface
 */
class ResizeObserverEntry {
  public target: Element;
  public contentRect: DOMRectReadOnly;
  public borderBoxSize: readonly ResizeObserverSize[];
  public contentBoxSize: readonly ResizeObserverSize[];
  public devicePixelContentBoxSize: readonly ResizeObserverSize[];
  public constructor (target: Element) {
    const boxes = calculateBoxSizes(target);
    this.target = target;
    this.contentRect = boxes.contentRect;
    this.borderBoxSize = Object.freeze([boxes.borderBoxSize]);
    this.contentBoxSize = Object.freeze([boxes.contentBoxSize]);
    this.devicePixelContentBoxSize = Object.freeze([boxes.devicePixelContentBoxSize]);
  }
}

export { ResizeObserverEntry };
