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
