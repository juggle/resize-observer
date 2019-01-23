import { ResizeObserver } from './ResizeObserver';
import { ResizeObservation } from './ResizeObservation';
import { ResizeObserverCallback } from './ResizeObserverCallback';

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

export { ResizeObserverDetail };
