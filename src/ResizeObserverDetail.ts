import { ResizeObserver } from './ResizeObserver';
import { ResizeObservation } from './ResizeObservation';
import { ResizeObserverCallback } from './ResizeObserverCallback';

/**
 * Holds additional information about a resize observer,
 * to be used internally.
 */
class ResizeObserverDetail {
  public callback: ResizeObserverCallback;
  public observer: ResizeObserver;
  public activeTargets: ResizeObservation[] = [];
  public skippedTargets: ResizeObservation[] = [];
  public observationTargets: ResizeObservation[] = [];

  public constructor (resizeObserver: ResizeObserver, callback: ResizeObserverCallback) {
    this.observer = resizeObserver;
    this.callback = callback;
  }
}

export { ResizeObserverDetail };
