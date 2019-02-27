import { DOMRectReadOnly } from './DOMRectReadOnly';
import { ResizeObserverSize } from './ResizeObserverSize';
import { calculateBoxSizes } from './algorithms/calculateBoxSize';

/**
 * https://drafts.csswg.org/resize-observer-1/#resize-observer-entry-interface
 */
class ResizeObserverEntry {
  public target: Element;
  public contentRect: DOMRectReadOnly;
  public borderBox: ResizeObserverSize[];
  public contentBox: ResizeObserverSize[];
  public constructor (target: Element) {
    const boxes = calculateBoxSizes(target);
    this.target = target;
    this.contentRect = boxes.contentRect;
    this.borderBox = boxes.borderBox;
    this.contentBox = boxes.contentBox;
  }
}

export { ResizeObserverEntry };
