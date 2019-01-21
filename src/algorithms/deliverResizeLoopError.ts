import { ResizeError } from '../ResizeError';

const deliverResizeLoopError = (): void => {
  const msg = 'ResizeObserver loop completed with undelivered notifications.';
  window.dispatchEvent(ResizeError.Event(msg));
}

export { deliverResizeLoopError };
