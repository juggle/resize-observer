import { ResizeObserver } from '../ResizeObserver';
import { ResizeObserverEntry } from '../ResizeObserverEntry';

type IsomorphicWindow = Window & {
  ResizeObserver?: typeof ResizeObserver;
  ResizeObserverEntry?: typeof ResizeObserverEntry;
}

/* istanbul ignore next */
export const global: IsomorphicWindow =
typeof window !== 'undefined' ? window : {} as unknown as Window;
