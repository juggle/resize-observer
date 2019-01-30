/**
 * Calculates the depth of a node.
 * 
 * https://drafts.csswg.org/resize-observer-1/#calculate-depth-for-node-h
 */
const calculateDepthForNode = (node: Element): number => {
  let depth = 0;
  let parent = node.parentNode;
  while (parent) {
    depth += 1;
    parent = parent.parentNode;
  }
  return depth;
}

export { calculateDepthForNode };
