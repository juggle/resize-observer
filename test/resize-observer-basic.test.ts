import { ResizeObserver } from '../src/ResizeObserver';
import { scheduler } from '../src/utils/scheduler';
import { delay } from './helpers/delay';
import './helpers/offset';

describe('Basics', () => {

  let el: HTMLElement;
  let ro: ResizeObserver | null;

  beforeEach(() => {
    el = document.createElement('div');
    el.style.width = '100px';
    document.body.appendChild(el);
  })

  afterEach(() => {
    while (document.body.firstElementChild) {
      document.body.removeChild(document.body.firstElementChild);
    }
    if (ro) {
      ro.disconnect();
      ro = null;
    }
  })

  test('console.log(ResizeObserver) should be prettified', () => {
    expect(ResizeObserver.toString()).toBe('function ResizeObserver () { [polyfill code] }');
  })

  test('Throw error when no callback is passed to constructor', () => {
    const fn = (): void => {
      // @ts-ignore
      new ResizeObserver();
    };
    expect(fn).toThrowError(`Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.`);
  })

  test('Throw error when an invalid callback is passed to constructor', () => {
    const fn = (): void => {
      // @ts-ignore
      new ResizeObserver(1);
    };
    expect(fn).toThrowError(`Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.`);
  })

  test('Throw error when no target is passed to observe()', () => {
    const fn = (): void => {
      ro = new ResizeObserver(() => {});
      // @ts-ignore
      ro.observe();
    };
    expect(fn).toThrowError(`Failed to execute 'observe' on 'ResizeObserver': 1 argument required, but only 0 present.`);
  })

  test('Throw error when an invalid target is passed to observe()', () => {
    const fn = (): void => {
      ro = new ResizeObserver(() => {});
      // @ts-ignore
      ro.observe(1);
    };
    expect(fn).toThrowError(`Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element`);
  })

  test('Throw error when no target is passed to unobserve()', () => {
    const fn = (): void => {
      ro = new ResizeObserver(() => {});
      // @ts-ignore
      ro.unobserve();
    };
    expect(fn).toThrowError(`Failed to execute 'unobserve' on 'ResizeObserver': 1 argument required, but only 0 present.`);
  })

  test('Throw error when an invalid target is passed to unobserve()', () => {
    const fn = (): void => {
      ro = new ResizeObserver(() => {});
      // @ts-ignore
      ro.unobserve(1);
    };
    expect(fn).toThrowError(`Failed to execute 'unobserve' on 'ResizeObserver': parameter 1 is not of type 'Element`);
  })

  test('Observer should not fire initially when size is 0,0', (done) => {
    ro = new ResizeObserver(() => {
      expect(false).toBe(true); // Should not fire
    })
    el.style.width = '0';
    el.style.height = '0';
    ro.observe(el);
    delay(done);
  })

  test('Observer should not fire initially when display:none', (done) => {
    ro = new ResizeObserver(() => {
      expect(false).toBe(true); // Should not fire
    })
    el.style.display = 'none';
    ro.observe(el);
    delay(done);
  })

  test('Observer should not fire initially when parent element is display:none', (done) => {
    ro = new ResizeObserver(() => {
      expect(false).toBe(true); // Should not fire
    })
    const child = document.createElement('div');
    el.style.display = 'none';
    child.style.display = 'block';
    el.append(child);
    expect(el.style.display).toBe('none');
    expect(child.style.display).toBe('block');
    ro.observe(child);
    delay(done);
  })

  test('Observer should not fire when an element has no document', (done) => {
    el = el.cloneNode() as HTMLElement;
    ro = new ResizeObserver(() => {
      expect(false).toBe(true); // Should not fire
    })
    el.style.width = '0';
    el.style.height = '0';
    ro.observe(el);
    delay(done);
  })

  test('Observer should fire initially when element has size and display', (done) => {
    ro = new ResizeObserver(entries => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(entries[0].contentRect).toMatchObject({
        top: 0,
        left: 0,
        width: 100,
        height: 0
      });
      done();
    })
    ro.observe(el);
  })

  test('Observer should only allow watching the same element once', (done) => {
    ro = new ResizeObserver(entries => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(entries[0].contentRect).toMatchObject({
        top: 0,
        left: 0,
        width: 100,
        height: 0
      });
      done();
    })
    ro.observe(el);
    ro.observe(el);
  })

  test('Observer should fire when element size changes', (done) => {
    ro = new ResizeObserver(entries => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(entries[0].contentRect).toMatchObject({
        top: 0,
        left: 0,
        width: 100,
        height: 200
      });
      done();
    })
    el.style.width = '0';
    el.style.height = '0';
    ro.observe(el);
    delay(() => {
      el.style.width = '100px';
      el.style.height = '200px';
    })
  })

  test('Observer should fire when the element\'s hidden state is toggled', (done) => {
    let count = 0;
    ro = new ResizeObserver(entries => {
      count += 1;
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(entries[0].contentRect).toMatchObject({
        top: 0,
        left: 0,
        width: count !== 2 ? 100 : 0,
        height: 0
      });
      if (count === 3) {
        done();
      }
    })
    ro.observe(el);
    delay(() => {
      el.style.display = 'none';
      delay(() => {
        el.style.removeProperty('display');
      })
    })
  })

  test('Observer should fire when only the width changes', (done) => {
    ro = new ResizeObserver(entries => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(entries[0].contentRect).toMatchObject({
        top: 0,
        left: 0,
        width: 100,
        height: 0
      });
      done();
    })
    el.style.width = '0';
    el.style.height = '0';
    ro.observe(el);
    delay(() => {
      el.style.width = '100px';
    })
  })

  test('Observer should fire when only the height changes', (done) => {
    ro = new ResizeObserver(entries => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(entries[0].contentRect).toMatchObject({
        top: 0,
        left: 0,
        width: 0,
        height: 100
      });
      done();
    })
    el.style.width = '0';
    el.style.height = '0';
    ro.observe(el);
    delay(() => {
      el.style.height = '100px';
    })
  })

  test('Observer should handle padding on an element.', (done) => {
    ro = new ResizeObserver(entries => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(entries[0].contentRect).toMatchObject({
        top: 1,
        left: 4,
        width: 100,
        height: 200
      });
      done();
    });
    el.style.width = '100px';
    el.style.height = '200px';
    el.style.padding = '1px 2px 3px 4px';
    ro.observe(el);
  })

  test('Observer should handle vertical scrollbars on an element.', (done) => {
    ro = new ResizeObserver(entries => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(entries[0].contentRect).toMatchObject({
        width: 85,
        height: 200
      });
      done();
    });
    Object.defineProperty(el, 'offsetWidth', {
      get: function () {
        return 100
      }
    })
    Object.defineProperty(el, 'offsetHeight', {
      get: function () {
        return 200
      }
    })
    Object.defineProperty(el, 'clientWidth', {
      get: function () {
        return 85
      }
    })
    Object.defineProperty(el, 'clientHeight', {
      get: function () {
        return 200
      }
    })
    el.style.overflowY = 'scroll';
    el.style.width = '100px';
    el.style.height = '200px';
    ro.observe(el);
  })

  test('Observer should handle horizontal scrollbars on an element.', (done) => {
    ro = new ResizeObserver(entries => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(entries[0].contentRect).toMatchObject({
        width: 100,
        height: 185
      });
      done();
    });
    Object.defineProperty(el, 'offsetWidth', {
      get: function () {
        return 100
      }
    })
    Object.defineProperty(el, 'offsetHeight', {
      get: function () {
        return 200
      }
    })
    Object.defineProperty(el, 'clientWidth', {
      get: function () {
        return 100
      }
    })
    Object.defineProperty(el, 'clientHeight', {
      get: function () {
        return 185
      }
    })
    el.style.overflowX = 'scroll';
    el.style.width = '100px';
    el.style.height = '200px';
    ro.observe(el);
  })

  test('Observer should handle horizontal and vertical scrollbars on an element.', (done) => {
    ro = new ResizeObserver(entries => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(entries[0].contentRect).toMatchObject({
        width: 85,
        height: 185
      });
      done();
    });
    Object.defineProperty(el, 'offsetWidth', {
      get: function () {
        return 100
      }
    })
    Object.defineProperty(el, 'offsetHeight', {
      get: function () {
        return 200
      }
    })
    Object.defineProperty(el, 'clientWidth', {
      get: function () {
        return 85
      }
    })
    Object.defineProperty(el, 'clientHeight', {
      get: function () {
        return 185
      }
    })
    el.style.overflowX = 'scroll';
    el.style.overflowY = 'scroll';
    el.style.width = '100px';
    el.style.height = '200px';
    ro.observe(el);
  })

  test('Observer should handle box-sizing and padding correctly.', (done) => {
    ro = new ResizeObserver(entries => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(entries[0].contentRect).toMatchObject({
        top: 1,
        left: 4,
        width: 94,
        height: 196
      });
      done();
    });
    el.style.width = '100px';
    el.style.height = '200px';
    el.style.padding = '1px 2px 3px 4px';
    el.style.boxSizing = 'border-box';
    ro.observe(el);
  })

  test('Observer should unobserve elements correctly.', (done) => {
    const el2 = el.cloneNode() as HTMLElement;
    document.body.appendChild(el2);
    ro = new ResizeObserver((entries, observer) => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(observer).toBe(ro);
      done();
    });
    ro.observe(el);
    ro.observe(el2);
    ro.unobserve(el2);
  })

  test('Observer should allow trying to unobserve multiple times.', (done) => {
    const el2 = el.cloneNode() as HTMLElement;
    document.body.appendChild(el2);
    ro = new ResizeObserver((entries, observer) => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(observer).toBe(ro);
      done();
    });
    ro.observe(el);
    ro.observe(el2);
    ro.unobserve(el2);
    ro.unobserve(el2);
  })

  test('Observer should disconnect correctly.', (done) => {
    ro = new ResizeObserver(() => {
      expect(false).toBe(true); // Should not fire
    });
    ro.observe(el);
    ro.disconnect();
    delay(done);
  })

  test('Observer should allow trying to disconnect multiple times.', (done) => {
    ro = new ResizeObserver(() => {
      expect(false).toBe(true); // Should not fire
    });
    ro.observe(el);
    ro.disconnect();
    ro.disconnect();
    delay(done);
  })

  test('Observer should not observe after a disconnect.', (done) => {
    ro = new ResizeObserver(() => {
      expect(false).toBe(true); // Should not fire
    });
    ro.observe(el);
    ro.disconnect();
    ro.observe(el);
    delay(done);
  })

  test('Observer should allow disconnect and unobserve to be called.', (done) => {
    ro = new ResizeObserver(() => {
      expect(false).toBe(true); // Should not fire
    });
    ro.observe(el);
    ro.disconnect();
    ro.unobserve(el);
    delay(done);
  })

  test('Observer should fire resize loop errors.', (done) => {
    window.addEventListener('error', e => {
      expect(e.type).toBe('error');
      expect(e.message).toBe('ResizeObserver loop completed with undelivered notifications.');
      done();
    })
    ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        target.style.width = `${entry.contentRect.width + 1000}px`;
      });
    });
    ro.observe(el);
  })

  test('Observer should return itself in the callback.', (done) => {
    ro = new ResizeObserver((entries, observer) => {
      expect(observer).toBe(observer);
      done();
    });
    ro.observe(el);
  })

  test('Calculations should be run after all other raf callbacks have been fired.', (done) => {
    ro = new ResizeObserver((entries) => {
      expect(entries[0].contentRect.width).toBe(2000);
      done();
    });
    ro.observe(el);
    requestAnimationFrame(() => {
      el.style.width = '2000px';
    });
  })

  test('RAF loops should not interrupt scheduler', (done) => {
    let frame = 0;
    const loop = (): number => requestAnimationFrame(() => {
      frame += 1;
      frame < 10 && loop();
    })
    loop();
    ro = new ResizeObserver(() => {
      expect(frame).toBe(1);
      done();
    });
    ro.observe(el);
  })

  test('Scheduler should start and stop itself correctly.', (done) => {
    // Stopped at start
    expect(scheduler.stopped).toBe(true);
    ro = new ResizeObserver(() => {});
    // Creating an observer should not start the scheduler
    expect(scheduler.stopped).toBe(true);
    ro.observe(el);
    // Observering will trigger a schedule, however,
    // it will not start listening for other changes untill
    // the processing is complete
    expect(scheduler.stopped).toBe(true);
    // After ~1s the observer should stop polling and move back to events
    setTimeout(() => {
      expect(scheduler.stopped).toBe(false);
      done();
    }, 1500);
  })

  test('Scheduler should handle multiple starts and stops.', () => {
    expect(scheduler.stopped).toBe(true);
    scheduler.start();
    expect(scheduler.stopped).toBe(false);
    scheduler.start();
    expect(scheduler.stopped).toBe(false);
    scheduler.stop();
    expect(scheduler.stopped).toBe(true);
    scheduler.stop();
    expect(scheduler.stopped).toBe(true);
  })

  test('Fake MutationObserver class to make sure it\'s called and used', (done) => {
    let callback: () => void;
    class MutationObserver {
      public constructor (cb: () => void) {
        callback = () => {
          cb();
        };
      }
      public observe (): void {
        callback();
      }
      public disconnect (): void {
        done();
      }
    }
    Object.defineProperty(window, 'MutationObserver', {
      value: MutationObserver
    });
    ro = new ResizeObserver((entries, observer) => {
      observer.disconnect();
    });
    ro.observe(el);
  })

})
