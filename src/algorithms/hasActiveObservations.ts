import { resizeObservers } from '../ResizeObserverController';
import { ResizeObserverDetail } from '../ResizeObserverDetail';

const hasActiveObservations = (): boolean => {
  return resizeObservers.some((ro: ResizeObserverDetail) => ro.activeTargets.length > 0);
}

export { hasActiveObservations };
