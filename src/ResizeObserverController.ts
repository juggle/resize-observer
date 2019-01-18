import ResizeObserver from './ResizeObserver';
import ResizeObservation from './ResizeObservation';
import ResizeObserverEntry from './ResizeObserverEntry';
import ResizeObserverCallback from './ResizeObserverCallback';
import DOMInteractions from './DOMInteractions';

const resizeObservers: ResizeObserverDetail[] = [];

const calculateDepthForNode = (node: Element): number => {
  let depth = 0;
  let parent = node.parentElement;
  while (parent) {
    depth += 1;
    parent = parent.parentElement;
  }
  return depth;
}

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

const hasActiveObservations = (): boolean => {
  return resizeObservers.some((ro: ResizeObserverDetail) => ro.activeTargets.length > 0);
}

const hasSkippedObservations = (): boolean => {
  return resizeObservers.some((ro: ResizeObserverDetail) => ro.skippedTargets.length > 0);
}

const broadcastActiveObservations = (): number => {
  let shallowestDepth: number = Infinity;
  const callbacks: (() => void)[] = [];
  resizeObservers.forEach((ro: ResizeObserverDetail) => {
    if (ro.activeTargets.length === 0) {
      return;
    }
    const entries: ResizeObserverEntry[] = [];
    ro.activeTargets.forEach((ot: ResizeObservation) => {
      const entry = new ResizeObserverEntry(ot.target);
      const targetDepth = calculateDepthForNode(ot.target);
      entries.push(entry);
      ot.broadcastWidth = entry.contentRect.width;
      ot.broadcastHeight = entry.contentRect.height;
      if (targetDepth < shallowestDepth) {
        shallowestDepth = targetDepth;
      }
    })
    // Gather all entries before firing callbacks
    // otherwise entries may change in the same loop
    callbacks.push(() => ro.callback(entries, ro.observer));
    ro.activeTargets.splice(0, ro.activeTargets.length);
  })
  callbacks.forEach(callback => callback());
  return shallowestDepth;
}

const deliverResizeLoopError = (): void => {
  const error = new ErrorEvent('error', {
    message: 'ResizeObserver loop completed with undelivered notifications.'
  })
  window.dispatchEvent(error);
}

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

// Basic find function, to support IE
const find = function (this: any[], checkFn: any) {
  for (let i = 0; i < this.length; i += 1) {
    if (checkFn(this[i], i)) {
      return this[i];
    }
  }
};

// Basic findIndex function, to support IE
const findIndex = function (this: any[], checkFn: any) {
  for (let i = 0; i < this.length; i += 1) {
    if (checkFn(this[i], i)) {
      return i;
    }
  }
  return -1;
};

class ResizeObserverDetail {
  public callback: ResizeObserverCallback;
  public observer: ResizeObserver;
  public activeTargets: ResizeObservation[] = [];
  public skippedTargets: ResizeObservation[] = [];
  public observationTargets: ResizeObservation[] = [];

  constructor (resizeObserver: ResizeObserver, callback: ResizeObserverCallback) {
    this.observer = resizeObserver;
    this.callback = callback;
  }
}

export default class ResizeObserverController {
  static connect (resizeObserver: ResizeObserver, callback: ResizeObserverCallback) {
    const detail = new ResizeObserverDetail(resizeObserver, callback);
    resizeObservers.push(detail);
  }
  static observe (resizeObserver: ResizeObserver, target: Element) {
    const detail = find.call(resizeObservers, (detail: ResizeObserverDetail) => detail.observer === resizeObserver);
    if (detail) {
      const index = findIndex
      .call(detail.observationTargets, (item: ResizeObservation) => item.target === target);
      if (index === -1) {
        detail.observationTargets.push(new ResizeObservation(target));
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
