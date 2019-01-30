import { resizeObservers } from '../ResizeObserverController';
import { ResizeObserverDetail } from '../ResizeObserverDetail';

/**
 * Checks to see if there are any active observations.
 * 
 * https://drafts.csswg.org/resize-observer-1/#has-active-observations-h
 */
const hasActiveObservations = (): boolean => {
  return resizeObservers.some((ro: ResizeObserverDetail) => ro.activeTargets.length > 0);
}

export { hasActiveObservations };
