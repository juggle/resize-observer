import { ResizeObserver } from '../src/ResizeObserver';
import { ResizeObserverBoxOptions } from '../src/ResizeObserverBoxOptions';
import './helpers/offset';

describe('Box Options', (): void => {

  (window.devicePixelRatio as number) = 5;

  const DEFAULT_WIDTH = 100;
  const DEFAULT_HEIGHT = 200;

  const initialBox = {
    inlineSize: DEFAULT_WIDTH,
    blockSize: DEFAULT_HEIGHT
  };

  let el: HTMLElement;
  let ro: ResizeObserver;

  beforeEach((): void => {
    el = document.createElement('div');
    el.style.width = DEFAULT_WIDTH + 'px';
    el.style.height = DEFAULT_HEIGHT + 'px';
    document.body.appendChild(el);
  })

  afterEach((): void => {
    while (document.body.firstElementChild) {
      document.body.removeChild(document.body.firstElementChild);
    }
  })

  describe('content-box', (): void => {

    test('Should fire initial resize', (done): void => {
      ro = new ResizeObserver((entries, observer): void => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el);
        expect(observer).toBe(ro);
        expect(entries[0].contentRect).toMatchObject({
          top: 0,
          left: 0,
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT
        })
        expect(entries[0].borderBoxSize).toMatchObject(initialBox);
        expect(entries[0].contentBoxSize).toMatchObject(initialBox);
        done();
      })
      ro.observe(el, {
        box: 'content-box' as ResizeObserverBoxOptions
      })
    })
  })

  describe('border-box', (): void => {

    test('Should fire initial resize', (done): void => {
      ro = new ResizeObserver((entries, observer): void => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el);
        expect(observer).toBe(ro);
        expect(entries[0].contentRect).toMatchObject({
          top: 0,
          left: 0,
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT
        })
        expect(entries[0].borderBoxSize).toMatchObject(initialBox);
        expect(entries[0].contentBoxSize).toMatchObject(initialBox);
        done();
      })
      ro.observe(el, {
        box: 'border-box' as ResizeObserverBoxOptions
      })
    })

    test('Should have correct box sizes', (done): void => {
      ro = new ResizeObserver((entries, observer): void => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(el);
        expect(observer).toBe(ro);
        expect(entries[0].contentRect).toMatchObject({
          top: 10,
          left: 10,
          width: 300,
          height: 100
        })
        expect(entries[0].borderBoxSize).toMatchObject({
          inlineSize: 330,
          blockSize: 130
        })
        expect(entries[0].contentBoxSize).toMatchObject({
          inlineSize: 300,
          blockSize: 100
        })
        done();
      })
      el.style.width = '300px';
      el.style.height = '100px';
      el.style.padding = '10px';
      el.style.border = 'solid 5px red';
      ro.observe(el, {
        box: 'border-box' as ResizeObserverBoxOptions
      })
    })
  })

})