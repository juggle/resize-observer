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

import { find, findIndex } from './utils/array';

const ObservationLoop: { loop: number } = { loop: 0 };
const resizeObservers: ResizeObserverDetail[] = [];

const process = (): boolean => {
  let depth = 0;
  ObservationLoop.loop += 1;
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

let frameId: number;
let extraFrames: number = 0;
const notify = () => {
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

export default class ResizeObserverController {
  static connect (resizeObserver: ResizeObserver, callback: ResizeObserverCallback) {
    const detail = new ResizeObserverDetail(resizeObserver, callback);
    resizeObservers.push(detail);
  }
  static observe (resizeObserver: ResizeObserver, target: Element, options?: ResizeObserverOptions) {
    const detail = find.call(resizeObservers, (detail: ResizeObserverDetail) => detail.observer === resizeObserver);
    if (detail) {
      const index = findIndex
      .call(detail.observationTargets, (item: ResizeObservation) => item.target === target);
      if (index === -1) {
        detail.observationTargets.push(new ResizeObservation(target, options && options.box));
        notify(); // Notify new observation
      }
    }
  }
  static unobserve (resizeObserver: ResizeObserver, target: Element) {
    const detail = find.call(resizeObservers, (detail: ResizeObserverDetail) => detail.observer === resizeObserver);
    if (detail) {
      const index = findIndex
      .call(detail.observationTargets, (item: ResizeObservation) => item.target === target);
      if (index > -1) {
        detail.observationTargets.splice(index, 1);
      }
    }
  }
  static disconnect (resizeObserver: ResizeObserver) {
    const index = findIndex
    .call(resizeObservers, (detail: ResizeObserverDetail) => detail.observer === resizeObserver);
    if (index > -1) {
      resizeObservers.splice(index, 1);
    }
  }
}

DOMInteractions.watch(notify);

export { ResizeObserverController, ObservationLoop, resizeObservers };
