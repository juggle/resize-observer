import { ResizeObserverSize } from './ResizeObserverSize';
import { ResizeObserverBoxOptions } from './ResizeObserverBoxOptions';
import { calculateBoxSize } from './algorithms/calculateBoxSize';
import { isSVG, isReplacedElement } from './utils/element';

const skipNotifyOnElement = (target: Element): boolean => {
  return !isSVG(target)
  && !isReplacedElement(target)
  && getComputedStyle(target).display === 'inline';
}

/**
 * https://drafts.csswg.org/resize-observer-1/#resize-observation-interface
 */
class ResizeObservation {

  public target: Element;
  public observedBox: ResizeObserverBoxOptions;
  public lastReportedSize: ResizeObserverSize;

  public constructor (target: Element, observedBox?: ResizeObserverBoxOptions) {
    this.target = target;
    this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX;
    this.lastReportedSize = {
      inlineSize: 0,
      blockSize: 0
    }
  }

  public isActive (): boolean {
    const size = calculateBoxSize(this.target, this.observedBox);
    if (skipNotifyOnElement(this.target)) {
      this.lastReportedSize = size;
    }
    if (this.lastReportedSize.inlineSize !== size.inlineSize
      || this.lastReportedSize.blockSize !== size.blockSize) {
      return true;
    }
    return false;
  }

}

export { ResizeObservation };
