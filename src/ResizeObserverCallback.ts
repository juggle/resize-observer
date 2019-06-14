import { ResizeObserver } from './ResizeObserver.js';
import { ResizeObserverEntry } from './ResizeObserverEntry.js';

/**
 * https://drafts.csswg.org/resize-observer-1/#resize-observer-callback
 */
type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

export { ResizeObserverCallback };