import { queueMicroTask } from './queueMicroTask';

const queueResizeObserver = (cb: () => void): void => {
  queueMicroTask(function ResizeObserver (): void {
    requestAnimationFrame(cb);
  });
}

export { queueResizeObserver }
