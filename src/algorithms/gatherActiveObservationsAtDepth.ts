import { ResizeObservation } from '../ResizeObservation.js';
import { ResizeObserverDetail } from '../ResizeObserverDetail.js';
import { resizeObservers } from '../ResizeObserverController.js';
import { calculateDepthForNode } from './calculateDepthForNode.js';
import { cache as sizeCache } from './calculateBoxSize.js';

/**
 * Finds all active observations at a give depth
 * 
 * https://drafts.csswg.org/resize-observer-1/#gather-active-observations-h
 */
const gatherActiveObservationsAtDepth = (depth: number): void => {
  sizeCache.clear(); // clear target size cache
  resizeObservers.forEach(function processObserver(ro: ResizeObserverDetail): void {
    ro.activeTargets.splice(0, ro.activeTargets.length);
    ro.skippedTargets.splice(0, ro.skippedTargets.length);
    ro.observationTargets.forEach(function processTarget(ot: ResizeObservation): void {
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
