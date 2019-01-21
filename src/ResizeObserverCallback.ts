import { ResizeObserver } from './ResizeObserver';
import { ResizeObserverEntry } from './ResizeObserverEntry';

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => any;

export { ResizeObserverCallback };