import { ResizeObserverSize } from './ResizeObserverSize';
import { ResizeObserverBoxOptions } from './ResizeObserverBoxOptions';
import { calculateBoxSize } from './algorithms/calculateBoxSize';

class ResizeObservation {

  public target: Element;
  public observedBox: ResizeObserverBoxOptions;
  public lastReportedSize: ResizeObserverSize;

  constructor (target: Element, observedBox?: ResizeObserverBoxOptions) {
    this.target = target;
    this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX;
    this.lastReportedSize = {
      inlineSize: 0,
      blockSize: 0
    }
  }

  isActive() {
    const size = calculateBoxSize(this.target, this.observedBox);
    return this.lastReportedSize.inlineSize !== size.inlineSize
      || this.lastReportedSize.blockSize !== size.blockSize;
  }

}

export { ResizeObservation };
