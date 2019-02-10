import { resizeObservers } from '../ResizeObserverController';
import { ResizeObserverDetail } from '../ResizeObserverDetail';
import { ResizeObserverEntry } from '../ResizeObserverEntry';
import { ResizeObservation } from '../ResizeObservation';
import { calculateDepthForNode } from './calculateDepthForNode';
import { calculateBoxSize } from './calculateBoxSize';

/**
 * Broadcasts all active observations.
 * 
 * https://drafts.csswg.org/resize-observer-1/#broadcast-resize-notifications-h
 */
const broadcastActiveObservations = (): number => {
  let shallowestDepth = Infinity;
  const callbacks: (() => void)[] = [];
  resizeObservers.forEach(function processObserver(ro: ResizeObserverDetail) {
    if (ro.activeTargets.length === 0) {
      return;
    }
    const entries: ResizeObserverEntry[] = [];
    ro.activeTargets.forEach(function processTarget(ot: ResizeObservation) {
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
    callbacks.push(function resizeObserverCallback() { ro.callback(entries, ro.observer) });
    ro.activeTargets.splice(0, ro.activeTargets.length);
  })
  callbacks.forEach(function fireCallback(callback) { return callback(); });
  return shallowestDepth;
}

export { broadcastActiveObservations };
