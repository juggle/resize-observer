import { ResizeObserver } from '../src/ResizeObserver';
import { DOMRectReadOnly } from '../src/DOMRectReadOnly';
import './helpers/offset';

describe('SVGGraphicsElement', (): void => {

  let root: SVGGraphicsElement;
  let el: SVGGraphicsElement;
  let ro: ResizeObserver | null;

  beforeEach((): void => {
    root = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(root);
    root.appendChild(el);
    el.style.width = '100px';
    el.style.height = '100px';
  })

  afterEach((): void => {
    while (document.body.firstElementChild) {
      document.body.removeChild(document.body.firstElementChild);
    }
    if (ro) {
      ro.disconnect();
      ro = null;
    }
  })

  test('Observer should fire initially when size is 0,0', (done): void => {
    ro = new ResizeObserver((entries): void => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(entries[0].contentRect).toMatchObject({
        top: 0,
        left: 0,
        width: 0,
        height: 0
      });
      done();
    })
    el.getBBox = function (): DOMRect {
      return new DOMRectReadOnly(0, 0, 0, 0) as DOMRect;
    }
    ro.observe(el);
  })

  test('Should fire observer when element is observed for the first time.', (done): void => {
    ro = new ResizeObserver((entries, observer): void => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(observer).toBe(ro);
      expect(entries[0].contentRect).toMatchObject({
        top: 0,
        left: 0,
        width: 100,
        height: 100
      });
      done();
    });
    el.getBBox = function (): DOMRect {
      return new DOMRectReadOnly(0, 0, 100, 100) as DOMRect;
    }
    ro.observe(el);
  })

})