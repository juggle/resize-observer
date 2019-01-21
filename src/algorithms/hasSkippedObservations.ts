import { resizeObservers } from '../ResizeObserverController';
import { ResizeObserverDetail } from '../ResizeObserverDetail';

const hasSkippedObservations = (): boolean => {
  return resizeObservers.some((ro: ResizeObserverDetail) => ro.skippedTargets.length > 0);
}

export { hasSkippedObservations }
