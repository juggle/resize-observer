import { ResizeObservation } from '../ResizeObservation';
import { ResizeObserverDetail } from '../ResizeObserverDetail';
import { resizeObservers } from '../ResizeObserverController';
import { calculateDepthForNode } from './calculateDepthForNode';

const gatherActiveObservationsAtDepth = (depth: number): void => {
  resizeObservers.forEach((ro: ResizeObserverDetail) => {
    ro.activeTargets.splice(0, ro.activeTargets.length);
    ro.skippedTargets.splice(0, ro.skippedTargets.length);
    ro.observationTargets.forEach((ot: ResizeObservation) => {
      if (ot.isActive()) {
        if (calculateDepthForNode(ot.target) > depth) {
          ro.activeTargets.push(ot);
        }
        else {
          ro.skippedTargets.push(ot);
        }
      }
    })
  })
}

export { gatherActiveObservationsAtDepth };
