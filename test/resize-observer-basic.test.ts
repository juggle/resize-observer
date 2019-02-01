import { ResizeObserver } from '../src/ResizeObserver';
import { delay } from './helpers/delay';

describe('Basics', () => {

  let el: HTMLElement;
  let ro: ResizeObserver;

  beforeEach(() => {
    el = document.createElement('div');
    el.style.width = '100px';
    document.body.appendChild(el);
  })

  afterEach(() => {
    while (document.body.firstElementChild) {
      document.body.removeChild(document.body.firstElementChild);
    }
  })

  test('console.log(ResizeObserver) should be prettified', () => {
    expect(ResizeObserver.toString()).toBe('function ResizeObserver () { [polyfill code] }');
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

})