import { ResizeObserver } from '../src/ResizeObserver';
import './helpers/offset';
import { delay } from './helpers/delay';

describe('Box Options', (): void => {

  (window.devicePixelRatio as number) = 5;

  const DEFAULT_WIDTH = 100;
  const DEFAULT_HEIGHT = 200;

  const initialBox = [{
    inlineSize: DEFAULT_WIDTH,
    blockSize: DEFAULT_HEIGHT
  }];

  let el: HTMLElement;
  let ro: ResizeObserver | null;

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
    if (ro) {
      ro.disconnect();
      ro = null;
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
        box: 'content-box'
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
        box: 'border-box'
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
        expect(entries[0].borderBoxSize).toMatchObject([{
          inlineSize: 330,
          blockSize: 130
        }])
        expect(entries[0].contentBoxSize).toMatchObject([{
          inlineSize: 300,
          blockSize: 100
        }])
        expect(entries[0].devicePixelContentBoxSize).toMatchObject([{
          inlineSize: 1500,
          blockSize: 500
        }])
        done();
      })
      el.style.width = '300px';
      el.style.height = '100px';
      el.style.padding = '10px';
      el.style.border = 'solid 5px red';
      ro.observe(el, {
        box: 'border-box'
      })
    })

    test('Should switch sizes based on writing-mode:vertical', (done): void => {
      ro = new ResizeObserver((entries): void => {
        expect(entries[0].contentRect).toMatchObject({
          top: 10,
          left: 10,
          width: 300,
          height: 100
        })
        expect(entries[0].borderBoxSize).toMatchObject([{
          inlineSize: 130,
          blockSize: 330
        }])
        expect(entries[0].contentBoxSize).toMatchObject([{
          inlineSize: 100,
          blockSize: 300
        }])
        expect(entries[0].devicePixelContentBoxSize).toMatchObject([{
          inlineSize: 500,
          blockSize: 1500
        }])
        done();
      })
      el.style.width = '300px';
      el.style.height = '100px';
      el.style.padding = '10px';
      el.style.border = 'solid 5px red';
      el.style.writingMode = 'vertical';
      ro.observe(el);
    })

    test('Should switch sizes based on writing-mode:vertical-lr', (done): void => {
      ro = new ResizeObserver((entries): void => {
        expect(entries[0].contentRect).toMatchObject({
          top: 10,
          left: 10,
          width: 300,
          height: 100
        })
        expect(entries[0].borderBoxSize).toMatchObject([{
          inlineSize: 130,
          blockSize: 330
        }])
        expect(entries[0].contentBoxSize).toMatchObject([{
          inlineSize: 100,
          blockSize: 300
        }])
        expect(entries[0].devicePixelContentBoxSize).toMatchObject([{
          inlineSize: 500,
          blockSize: 1500
        }])
        done();
      })
      el.style.width = '300px';
      el.style.height = '100px';
      el.style.padding = '10px';
      el.style.border = 'solid 5px red';
      el.style.writingMode = 'vertical-lr';
      ro.observe(el);
    })

    test('Should switch sizes based on writing-mode:tb', (done): void => {
      ro = new ResizeObserver((entries): void => {
        expect(entries[0].contentRect).toMatchObject({
          top: 10,
          left: 10,
          width: 300,
          height: 100
        })
        expect(entries[0].borderBoxSize).toMatchObject([{
          inlineSize: 130,
          blockSize: 330
        }])
        expect(entries[0].contentBoxSize).toMatchObject([{
          inlineSize: 100,
          blockSize: 300
        }])
        expect(entries[0].devicePixelContentBoxSize).toMatchObject([{
          inlineSize: 500,
          blockSize: 1500
        }])
        done();
      })
      el.style.width = '300px';
      el.style.height = '100px';
      el.style.padding = '10px';
      el.style.border = 'solid 5px red';
      el.style.writingMode = 'tb';
      ro.observe(el);
    })

    test('Should switch sizes based on writing-mode:tb-rl', (done): void => {
      ro = new ResizeObserver((entries): void => {
        expect(entries[0].contentRect).toMatchObject({
          top: 10,
          left: 10,
          width: 300,
          height: 100
        })
        expect(entries[0].borderBoxSize).toMatchObject([{
          inlineSize: 130,
          blockSize: 330
        }])
        expect(entries[0].contentBoxSize).toMatchObject([{
          inlineSize: 100,
          blockSize: 300
        }])
        expect(entries[0].devicePixelContentBoxSize).toMatchObject([{
          inlineSize: 500,
          blockSize: 1500
        }])
        done();
      })
      el.style.width = '300px';
      el.style.height = '100px';
      el.style.padding = '10px';
      el.style.border = 'solid 5px red';
      el.style.writingMode = 'tb-rl';
      ro.observe(el);
    })
  })

  describe('device-pixel-content-box', (): void => {

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
        expect(entries[0].devicePixelContentBoxSize).toMatchObject([{
          inlineSize: 500,
          blockSize: 1000
        }])
        done();
      })
      ro.observe(el, {
        box: 'device-pixel-content-box'
      })
    })

    test('Should fire when pixel ratio changes (different screens)', (done): void => {
      let count = 0;
      ro = new ResizeObserver((entries): void => {
        if ((count += 1) === 2) {
          expect(entries[0].devicePixelContentBoxSize).toMatchObject([{
            inlineSize: 200,
            blockSize: 400
          }])
          done();
        }
        else {
          expect(entries[0].devicePixelContentBoxSize).toMatchObject([{
            inlineSize: 500,
            blockSize: 1000
          }])
        }
      })
      ro.observe(el, {
        box: 'device-pixel-content-box'
      });
      delay((): void => {
        (window.devicePixelRatio as number) = 2;
      });
    })
  })

})