import { schedule } from '../../src/utils/scheduler';

const delay = ((callback: () => void): void => {
  setTimeout(() => {
    schedule();
    callback();
  }, 100);
})

export { delay }
