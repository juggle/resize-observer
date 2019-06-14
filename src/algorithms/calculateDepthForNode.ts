import { isHidden } from '../utils/element.js';
/**
 * Calculates the depth of a node.
 * 
 * https://drafts.csswg.org/resize-observer-1/#calculate-depth-for-node-h
 */
const calculateDepthForNode = (node: Element): number => {
  if (isHidden(node)) {
    return Infinity;
  }
  let depth = 0;
  let parent = node.parentNode;
  while (parent) {
    depth += 1;
    parent = parent.parentNode;
  }
  return depth;
}

export { calculateDepthForNode };
