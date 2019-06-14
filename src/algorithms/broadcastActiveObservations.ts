import { resizeObservers } from '../ResizeObserverController.js';
import { ResizeObserverDetail } from '../ResizeObserverDetail.js';
import { ResizeObserverEntry } from '../ResizeObserverEntry.js';
import { ResizeObservation } from '../ResizeObservation.js';
import { calculateDepthForNode } from './calculateDepthForNode.js';
import { calculateBoxSize } from './calculateBoxSize.js';

/**
 * Broadcasts all active observations.
 * 
 * https://drafts.csswg.org/resize-observer-1/#broadcast-resize-notifications-h
 */
const broadcastActiveObservations = (): number => {
  let shallowestDepth = Infinity;
  const callbacks: (() => void)[] = [];
  resizeObservers.forEach(function processObserver(ro: ResizeObserverDetail): void {
    if (ro.activeTargets.length === 0) {
      return;
    }
    const entries: ResizeObserverEntry[] = [];
    ro.activeTargets.forEach(function processTarget(ot: ResizeObservation): void {
      const entry = new ResizeObserverEntry(ot.target);
      const targetDepth = calculateDepthForNode(ot.target);
      entries.push(entry);
      ot.lastReportedSize = calculateBoxSize(ot.target, ot.observedBox);
      if (targetDepth < shallowestDepth) {
        shallowestDepth = targetDepth;
      }
    })
    // Gather all entries before firing callbacks
    // otherwise entries may change in the same loop
    callbacks.push(function resizeObserverCallback(): void { ro.callback(entries, ro.observer) });
    ro.activeTargets.splice(0, ro.activeTargets.length);
  })
  for (let callback of callbacks) {
    callback();
  }
  return shallowestDepth;
}

export { broadcastActiveObservations };
