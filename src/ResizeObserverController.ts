import ResizeObserver from './ResizeObserver';
import ResizeObservation from './ResizeObservation';
import ResizeObserverEntry from './ResizeObserverEntry';
import ResizeObserverCallback from './ResizeObserverCallback';
import DOMInteractions from './DOMInteractions';

const find = function (this: any[], checkFn: any) {
  for (let i = 0; i < this.length; i += 1) {
    if (checkFn(this[i], i)) {
      return this[i];
    }
  }
};

const findIndex = function (this: any[], checkFn: any) {
  for (let i = 0; i < this.length; i += 1) {
    if (checkFn(this[i], i)) {
      return i;
    }
  }
  return -1;
};

const resizeObservers: ResizeObserverDetail[] = [];

class ResizeObserverDetail {
  public callback: ResizeObserverCallback;
  public observer: ResizeObserver;
  public activeTargets: [] = [];
  public skippedTargets: [] = [];
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
        DOMInteractions.notify(); // Notify new observation
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

const dispatch = () => {
  let count = 0;
  resizeObservers.forEach((ro: ResizeObserverDetail) => {
    const observationTargets = ro.observationTargets.filter(ot => ot.isActive());
    if (observationTargets.length) {
      count += observationTargets.length;
      ro.callback(observationTargets.map(ot => {
        const entry = new ResizeObserverEntry(ot.target);
        ot.broadcastWidth = entry.contentRect.width;
        ot.broadcastHeight = entry.contentRect.height;
        return entry;
      }), ro.observer);
    }
  });
  return count;
}

DOMInteractions.watch(dispatch);
