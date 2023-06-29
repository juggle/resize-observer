import { hasActiveObservations } from '../algorithms/hasActiveObservations';
import { hasSkippedObservations } from '../algorithms/hasSkippedObservations';
import { deliverResizeLoopError } from '../algorithms/deliverResizeLoopError';
import { broadcastActiveObservations } from '../algorithms/broadcastActiveObservations';
import { gatherActiveObservationsAtDepth } from '../algorithms/gatherActiveObservationsAtDepth';

/**
 * Runs through the algorithms and
 * broadcasts and changes that are returned.
 */
const processAlgorithm = (): boolean => {
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

export { processAlgorithm as process };
