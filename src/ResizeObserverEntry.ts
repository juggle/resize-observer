import { DOMRectReadOnly } from './DOMRectReadOnly.js';
import { ResizeObserverSize } from './ResizeObserverSize.js';
import { calculateBoxSizes } from './algorithms/calculateBoxSize.js';

/**
 * https://drafts.csswg.org/resize-observer-1/#resize-observer-entry-interface
 */
class ResizeObserverEntry {
  public target: Element;
  public contentRect: DOMRectReadOnly;
  public borderBoxSize: ResizeObserverSize;
  public contentBoxSize: ResizeObserverSize;
  public constructor (target: Element) {
    const boxes = calculateBoxSizes(target);
    this.target = target;
    this.contentRect = boxes.contentRect;
    this.borderBoxSize = boxes.borderBoxSize;
    this.contentBoxSize = boxes.contentBoxSize;
  }
}

export { ResizeObserverEntry };
