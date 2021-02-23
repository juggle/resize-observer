import { freeze } from './utils/freeze';

/**
 * Size of a specific box.
 * 
 * https://drafts.csswg.org/resize-observer-1/#resizeobserversize 
 */
class ResizeObserverSize {
  readonly inlineSize: number;
  readonly blockSize: number;
  constructor (inlineSize: number, blockSize: number) {
    this.inlineSize = inlineSize;
    this.blockSize = blockSize;
    freeze(this);
  }
}

export { ResizeObserverSize };
