import { resizeObservers } from '../ResizeObserverController';
import { ResizeObserverDetail } from '../ResizeObserverDetail';

/**
 * Checks to see if there are any skipped observations.
 * This is used to deliver the resize loop error.
 * 
 * https://drafts.csswg.org/resize-observer-1/#has-skipped-observations-h
 */
const hasSkippedObservations = (): boolean => {
  return resizeObservers.some((ro: ResizeObserverDetail): boolean => ro.skippedTargets.length > 0);
}

export { hasSkippedObservations }
