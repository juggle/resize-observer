import { DOMRectReadOnly } from './DOMRectReadOnly';
import { ResizeObserverSize } from './ResizeObserverSize';
import { calculateBoxSizes } from './algorithms/calculateBoxSize';

/**
 * https://drafts.csswg.org/resize-observer-1/#resize-observer-entry-interface
 */
class ResizeObserverEntry {
  public target: Element;
  public contentRect: DOMRectReadOnly;
  public borderBoxSize: ResizeObserverSize;
  public contentBoxSize: ResizeObserverSize;
  public devicePixelContentBoxSize: ResizeObserverSize;
  public constructor (target: Element) {
    const boxes = calculateBoxSizes(target);
    this.target = target;
    this.contentRect = boxes.contentRect;
    this.borderBoxSize = boxes.borderBoxSize;
    this.contentBoxSize = boxes.contentBoxSize;
    this.devicePixelContentBoxSize = boxes.devicePixelContentBoxSize;
  }
}

export { ResizeObserverEntry };
