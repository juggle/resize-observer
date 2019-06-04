/**
 * Size of a specific box.
 * 
 * https://drafts.csswg.org/resize-observer-1/#resizeobserversize 
 */
interface ResizeObserverSize {
  readonly inlineSize: number;
  readonly blockSize: number;
}

export { ResizeObserverSize };
