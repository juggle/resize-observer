import { ResizeObserverCls } from "../ResizeObserver";
import { ResizeObserverEntry } from "../ResizeObserverEntry";

export type IsomorphicWindow = Window & {
  ResizeObserver?: ResizeObserverCls;
  ResizeObserverEntry?: typeof ResizeObserverEntry;
};

/* istanbul ignore next */
export const unsafeGlobal: IsomorphicWindow =
  typeof window !== "undefined" ? window : (({} as unknown) as Window);
