import { ResizeObserverSize } from './ResizeObserverSize';
import { ResizeObserverBoxOptions } from './ResizeObserverBoxOptions';
import { calculateBoxSize } from './algorithms/calculateBoxSize';

/**
 * https://drafts.csswg.org/resize-observer-1/#resize-observation-interface
 */
class ResizeObservation {

  public target: Element;
  public observedBox: ResizeObserverBoxOptions;
  public lastReportedSize: ResizeObserverSize[];

  public constructor (target: Element, observedBox?: ResizeObserverBoxOptions) {
    this.target = target;
    this.observedBox = observedBox || ResizeObserverBoxOptions.CONTENT_BOX;
    this.lastReportedSize = [{
      inline: 0,
      block: 0
    }]
  }

  public isActive (): boolean {
    const size = calculateBoxSize(this.target, this.observedBox);
    for (let i = 0; i < size.length; i += 1) {
      const a = size[i];
      const b = this.lastReportedSize[i];
      if (!(a && b && a.inline === b.inline && a.block === b.block)) {
        return true;
      }
    }
    return false;
  }

}

export { ResizeObservation };
