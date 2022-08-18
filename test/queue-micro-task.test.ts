import { queueMicroTask } from '../src/utils/queueMicroTask';

describe('queueMicroTask', (): void => {

  test('queueMicroTask should execute a callback', (done): void => {
    queueMicroTask(done);
  })

})
