import { ResizeObserverSize } from './ResizeObserverSize';
import { ResizeObserverBoxOptions } from './ResizeObserverBoxOptions';
import { calculateBoxSize } from './algorithms/calculateBoxSize';

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
    const last = this.lastReportedSize;
    const size = calculateBoxSize(this.target, this.observedBox);
    if (last.inlineSize !== size.inlineSize || last.blockSize !== size.blockSize) {
      return true;
    }
    return false;
  }

}

export { ResizeObservation };
