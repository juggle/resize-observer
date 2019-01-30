import { ResizeObserver } from './ResizeObserver';
import { ResizeObservation } from './ResizeObservation';
import { ResizeObserverDetail } from './ResizeObserverDetail';
import { ResizeObserverCallback } from './ResizeObserverCallback';
import { ResizeObserverOptions } from './ResizeObserverOptions';
import { DOMInteractions } from './DOMInteractions';

import { hasActiveObservations } from './algorithms/hasActiveObservations';
import { hasSkippedObservations } from './algorithms/hasSkippedObservations';
import { deliverResizeLoopError } from './algorithms/deliverResizeLoopError';
import { broadcastActiveObservations } from './algorithms/broadcastActiveObservations';
import { gatherActiveObservationsAtDepth } from './algorithms/gatherActiveObservationsAtDepth';

const resizeObservers: ResizeObserverDetail[] = [];
const observerMap = new Map();

// Helper to find the correct ResizeObservation, based on a target.
const getObservationIndex = (observationTargets: ResizeObservation[], target: Element): number => {
  for (let i = 0; i < observationTargets.length; i+= 1) {
    if (observationTargets[i].target === target) {
      return i;
    }
  }
  return -1;
}

/**
 * Runs through the algorithms and
 * broadcasts and changes that are returned.
 */
const process = (): boolean => {
  let depth = 0;
  gatherActiveObservationsAtDepth(depth);
  while (hasActiveObservations()) {
    depth = broadcastActiveObservations();
    gatherActiveObservationsAtDepth(depth);
  }
  if (hasSkippedObservations()) {
    deliverResizeLoopError();
  }
  return depth > 0;
}

/**
 * Debounces events and processes
 * on the next animation frame.
 */
let frameId: number;
let extraFrames = 0;
const notify = (): void => {
  cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(() => {
    if (process()) {
      extraFrames = 0;
      notify();
    }
    else if (extraFrames < 60) {
      extraFrames += 1;
      notify();
    }
  });
}

/**
 * Used as an interface for connecting resize observers.
 */
export default class ResizeObserverController {
  // Connects an observer to the controller.
  public static connect (resizeObserver: ResizeObserver, callback: ResizeObserverCallback): void {
    const detail = new ResizeObserverDetail(resizeObserver, callback);
    resizeObservers.push(detail);
    observerMap.set(resizeObserver, detail);
  }
  // Informs the controller to watch a new target.
  public static observe (resizeObserver: ResizeObserver, target: Element, options?: ResizeObserverOptions): void {
    if (observerMap.has(resizeObserver)) {
      const detail = observerMap.get(resizeObserver) as ResizeObserverDetail;
      if (getObservationIndex(detail.observationTargets, target) < 0) {
        detail.observationTargets.push(new ResizeObservation(target, options && options.box));
        notify(); // Notify new observation
      }
    }
  }
  // Informs the controller to stop watching a target.
  public static unobserve (resizeObserver: ResizeObserver, target: Element): void {
    if (observerMap.has(resizeObserver)) {
      const detail = observerMap.get(resizeObserver) as ResizeObserverDetail;
      const index = getObservationIndex(detail.observationTargets, target);
      if (index >= 0) {
        detail.observationTargets.splice(index, 1);
      }
    }
  }
  // Informs the controller to disconnect an observer.
  public static disconnect (resizeObserver: ResizeObserver): void {
    if (observerMap.has(resizeObserver)) {
      const detail = observerMap.get(resizeObserver) as ResizeObserverDetail;
      resizeObservers.splice(resizeObservers.indexOf(detail), 1);
      observerMap.delete(resizeObserver);
    }
  }
}

DOMInteractions.watch(notify);

export { ResizeObserverController, resizeObservers };
