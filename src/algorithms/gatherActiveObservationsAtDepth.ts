import { ResizeObservation } from '../ResizeObservation';
import { ResizeObserverDetail } from '../ResizeObserverDetail';
import { resizeObservers } from '../ResizeObserverController';
import { calculateDepthForNode } from './calculateDepthForNode';
import { cache as sizeCache } from './calculateBoxSize';

/**
 * Finds all active observations at a give depth
 * 
 * https://drafts.csswg.org/resize-observer-1/#gather-active-observations-h
 */
const gatherActiveObservationsAtDepth = (depth: number): void => {
  sizeCache.clear(); // clear target size cache
  resizeObservers.forEach(function processObserver(ro: ResizeObserverDetail) {
    ro.activeTargets.splice(0, ro.activeTargets.length);
    ro.skippedTargets.splice(0, ro.skippedTargets.length);
    ro.observationTargets.forEach(function processTarget(ot: ResizeObservation) {
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
