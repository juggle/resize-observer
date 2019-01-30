import { ResizeObserver } from '../src/ResizeObserver';
import { ResizeObserverBoxOptions } from '../src/ResizeObserverBoxOptions';

describe('Box Options', () => {

  (window.devicePixelRatio as number) = 5;

  const DEFAULT_WIDTH = 100;
  const DEFAULT_HEIGHT = 200;

  const initialBox = {
    inlineSize: DEFAULT_WIDTH,
    blockSize: DEFAULT_HEIGHT
  };

  let el: HTMLElement;
  let ro: ResizeObserver;

  beforeEach(() => {
    el = document.createElement('div');
    el.style.width = DEFAULT_WIDTH + 'px';
    el.style.height = DEFAULT_HEIGHT + 'px';
    document.body.appendChild(el);
  })

  afterEach(() => {
    while (document.body.firstElementChild) {
      document.body.removeChild(document.body.firstElementChild);
    }
  })

  describe('content-box', () => {

    test('Should fire initial resize', (done) => {
      ro = new ResizeObserver((entries, observer) => {
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
        expect(entries[0].contentSize).toMatchObject(initialBox);
        expect(entries[0].scrollSize).toMatchObject(initialBox);
        expect(entries[0].devicePixelBorderBoxSize).toMatchObject({
          inlineSize: initialBox.inlineSize * 5,
          blockSize: initialBox.blockSize * 5
        })
        done();
      })
      ro.observe(el, {
        box: 'content-box' as ResizeObserverBoxOptions
      })
    })
  })

  describe('border-box', () => {

    test('Should fire initial resize', (done) => {
      ro = new ResizeObserver((entries, observer) => {
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
        expect(entries[0].contentSize).toMatchObject(initialBox);
        expect(entries[0].scrollSize).toMatchObject(initialBox);
        expect(entries[0].devicePixelBorderBoxSize).toMatchObject({
          inlineSize: initialBox.inlineSize * 5,
          blockSize: initialBox.blockSize * 5
        })
        done();
      })
      ro.observe(el, {
        box: 'border-box' as ResizeObserverBoxOptions
      })
    })

    test('Should have correct box sizes', (done) => {
      ro = new ResizeObserver((entries, observer) => {
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
        expect(entries[0].contentSize).toMatchObject({
          inlineSize: 300,
          blockSize: 100
        })
        expect(entries[0].scrollSize).toMatchObject({
          inlineSize: 320,
          blockSize: 120
        })
        expect(entries[0].devicePixelBorderBoxSize).toMatchObject({
          inlineSize: 330 * 5,
          blockSize: 130 * 5
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

  describe('scroll-box', () => {
    test('Should fire initial resize', (done) => {
      ro = new ResizeObserver((entries, observer) => {
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
        expect(entries[0].contentSize).toMatchObject(initialBox);
        expect(entries[0].scrollSize).toMatchObject(initialBox);
        expect(entries[0].devicePixelBorderBoxSize).toMatchObject({
          inlineSize: initialBox.inlineSize * 5,
          blockSize: initialBox.blockSize * 5
        })
        done();
      })
      ro.observe(el, {
        box: 'scroll-box' as ResizeObserverBoxOptions
      })
    })
  })

  describe('device-pixel-border-box', () => {
    test('Should fire initial resize', (done) => {
      const canvas = document.createElement('CANVAS');
      ro = new ResizeObserver((entries, observer) => {
        expect(entries).toHaveLength(1);
        expect(entries[0].target).toBe(canvas);
        expect(observer).toBe(ro);
        expect(entries[0].contentRect).toMatchObject({
          top: 0,
          left: 0,
          width: DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT
        })
        expect(entries[0].borderBoxSize).toMatchObject(initialBox);
        expect(entries[0].contentSize).toMatchObject(initialBox);
        expect(entries[0].scrollSize).toMatchObject(initialBox);
        expect(entries[0].devicePixelBorderBoxSize).toMatchObject({
          inlineSize: initialBox.inlineSize * 5,
          blockSize: initialBox.blockSize * 5
        })
        done();
      })
      canvas.style.width = DEFAULT_WIDTH + 'px';
      canvas.style.height = DEFAULT_HEIGHT + 'px';
      document.body.appendChild(canvas);
      ro.observe(canvas, {
        box: 'device-pixel-border-box' as ResizeObserverBoxOptions
      })
    })
    it('Should throw error when element is not of type canvas', () => {
      expect(() => {
        ro = new ResizeObserver(() => {})
        ro.observe(el, {
          box: 'device-pixel-border-box' as ResizeObserverBoxOptions
        })
      }).toThrow('Can only watch device-pixel-border-box on canvas elements.');
    })
  })

})