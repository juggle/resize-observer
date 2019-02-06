import { scheduler } from '../../src/utils/scheduler';

const delay = ((callback: () => void): void => {
  setTimeout(() => {
    scheduler.schedule();
    callback();
  }, 100);
})

export { delay }
