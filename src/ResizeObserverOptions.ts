import { ResizeObserverBoxOptions } from './ResizeObserverBoxOptions';

/**
 * Options to be given to the resize observer,
 * when oberving a new element.
 *
 * https://drafts.csswg.org/resize-observer-1/#dictdef-resizeobserveroptions
 */
interface ResizeObserverOptions {
  box: ResizeObserverBoxOptions | undefined;
}

export { ResizeObserverOptions };
