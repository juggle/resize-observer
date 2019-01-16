import ResizeObserver from '../src/ResizeObserver';
import DOMRectReadOnly from '../src/DOMRectReadOnly';

const setDimensions = (target: HTMLElement, w: number, h: number) => {
  target.style.width = `${w}px`;
  target.style.height = `${h}px`;
};

describe('ResizeObserver', () => {

  let ro: ResizeObserver | null;
  let el1: HTMLElement;
  let el2: HTMLElement;
  let svg1: SVGGraphicsElement;

  beforeEach(() => {
    el1 = document.createElement('div');
    document.body.appendChild(el1);
    el2 = document.createElement('div');
    document.body.appendChild(el2);
    svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svg1);
  });

  beforeEach(() => {
    if (ro instanceof ResizeObserver) {
      ro.disconnect();
      ro = null;
    }
  });

  describe('Single HTMLElement', () => {
    it('Should fire observer when element is observed for the first time.', (done) => {
      ro = new ResizeObserver((entries, observer) => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el1);
        expect(observer).toBe(ro);
        expect(entries[0].contentRect).toMatchObject({
          top: 0,
          left: 0,
          width: 0,
          height: 0
        });
        done();
      });
      ro.observe(el1);
    });
    it('Should not observe the same element more than once', (done) => {
      ro = new ResizeObserver((entries, observer) => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el1);
        expect(observer).toBe(ro);
        expect(entries[0].contentRect).toMatchObject({
          top: 0,
          left: 0,
          width: 0,
          height: 0
        });
        done();
      });
      ro.observe(el1);
      ro.observe(el1);
    });
    it('Should fire observer when width changes.', (done) => {
      let count = 0;
      ro = new ResizeObserver((entries, observer) =>  {
        count += 1;
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el1);
        expect(observer).toBe(ro);
        expect(entries[0].contentRect).toMatchObject({
          top: 0,
          left: 0,
          width: count === 2 ? 300 : 0,
          height: 0
        });
        count === 2 && done();
      });
      ro.observe(el1);
      setTimeout(() => setDimensions(el1, 300, 0), 500);
    });
    it('Should fire observer when height changes.', (done) => {
      let count = 0;
      ro = new ResizeObserver((entries, observer) =>  {
        count += 1;
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el1);
        expect(observer).toBe(ro);
        expect(entries[0].contentRect).toMatchObject({
          top: 0,
          left: 0,
          width: 0,
          height: count === 2 ? 300 : 0
        });
        count === 2 && done();
      });
      ro.observe(el1);
      setTimeout(() => setDimensions(el1, 0, 300), 500);
    });
    it('Should handle padding on an element.', (done) => {
      ro = new ResizeObserver((entries, observer) => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el1);
        expect(observer).toBe(ro);
        expect(entries[0].contentRect).toMatchObject({
          top: 1,
          left: 4,
          width: 100,
          height: 200
        });
        done();
      });
      ro.observe(el1);
      setDimensions(el1, 100, 200);
      el1.style.padding = '1px 2px 3px 4px';
    });
    it('Should handle box-sizing and padding correctly.', (done) => {
      ro = new ResizeObserver((entries, observer) => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el1);
        expect(observer).toBe(ro);
        expect(entries[0].contentRect).toMatchObject({
          top: 1,
          left: 4,
          width: 94,
          height: 196
        });
        done();
      });
      ro.observe(el1);
      setDimensions(el1, 100, 200);
      el1.style.padding = '1px 2px 3px 4px';
      el1.style.boxSizing = 'border-box';
    });
    it('Should unobserve elements correctly.', (done) => {
      ro = new ResizeObserver((entries, observer) => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el1);
        expect(observer).toBe(ro);
        done();
      });
      ro.observe(el1);
      ro.observe(el2);
      ro.unobserve(el2);
    });
    it('Should handle multiple unobserve calls.', (done) => {
      ro = new ResizeObserver((entries, observer) => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el1);
        expect(observer).toBe(ro);
        done();
      });
      ro.observe(el1);
      ro.observe(el2);
      ro.unobserve(el2);
      ro.unobserve(el2);
    });
    it('Should disconnect correctly.', (done) => {
      ro = new ResizeObserver((entries, observer) => {
        expect(false).toBe(true);
        done(); // Should never be called
      });
      ro.observe(el1);
      ro.observe(el2);
      ro.disconnect();
      ro = new ResizeObserver((entries, observer) => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el1);
        expect(observer).toBe(ro);
        done();
      });
      setTimeout(done, 500);
    });
    it('Should handle multiple disconnects.', (done) => {
      ro = new ResizeObserver((entries, observer) => {
        expect(false).toBe(true);
        done(); // Should never be called
      });
      ro.observe(el1);
      ro.disconnect();
      ro.disconnect();
      setTimeout(done, 500);
    });
    it('Should not allow new observations after a discontect.', (done) => {
      ro = new ResizeObserver((entries, observer) => {
        expect(false).toBe(true);
        done(); // Should never be called
      });
      ro.observe(el1);
      ro.disconnect();
      ro.observe(el1);
      setTimeout(done, 500);
    });
    it('Should not fail to unobserve after disconnection.', (done) => {
      ro = new ResizeObserver((entries, observer) => {
        expect(false).toBe(true);
        done(); // Should never be called
      });
      ro.observe(el1);
      ro.disconnect();
      ro.unobserve(el1);
      setTimeout(done, 500);
    });
  });

  describe('Multiple HTMLElement', () => {
    it('Should return the correct entries and observer arguments, when an observation has occured.', (done) => {
      ro = new ResizeObserver((entries, observer) => {
        expect(entries).toHaveLength(2);
        expect(entries[0].target).toBe(el1);
        expect(entries[1].target).toBe(el2);
        expect(observer).toBe(ro);
        done();
      });
      ro.observe(el1);
      ro.observe(el2);
    });
  });

  describe('Multiple Observers', () => {
    it('Should support mulitple observers.', (done) => {
      const ro1 = new ResizeObserver((entries, observer) => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el1);
        expect(observer).toBe(ro1);
        observer.disconnect();
      });
      ro1.observe(el1);
      const ro2 = new ResizeObserver((entries, observer) => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el2);
        expect(observer).toBe(ro2);
        observer.disconnect();
        done();
      });
      ro2.observe(el2);
    });
  });

  describe('SVGGraphicsElement', () => {
    it('Should fire observer when element is observed for the first time.', (done) => {
      ro = new ResizeObserver((entries, observer) => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(svg1);
        expect(observer).toBe(ro);
        expect(entries[0].contentRect).toMatchObject({
          top: 0,
          left: 0,
          width: 0,
          height: 0
        });
        done();
      });
      svg1.getBBox = function (): any {
        return new DOMRectReadOnly(0, 0, 0, 0);
      }
      ro.observe(svg1);
    });
  });

});