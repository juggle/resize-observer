import { scheduler } from '../../src/utils/scheduler';

const delay = ((callback: () => void): void => {
  setTimeout((): void => {
    scheduler.schedule();
    callback();
  }, 100);
})

export { delay }
