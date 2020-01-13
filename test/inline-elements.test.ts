import './helpers/mutation-observer';
import { ResizeObserver } from '../src/ResizeObserver';
import { delay } from './helpers/delay';
import './helpers/offset';

describe('Inline elements', (): void => {

  let el: HTMLElement;
  let ro: ResizeObserver | null;

  const createElement = (name: string): void => {
    el = document.createElement(name);
    el.style.width = '100px';
    el.style.height = '20px';
    el.style.display = 'inline';
    document.body.appendChild(el);
  }

  describe('Non-replaced elements', (): void => {
  
    afterEach((): void => {
      while (document.body.firstElementChild) {
        document.body.removeChild(document.body.firstElementChild);
      }
      if (ro) {
        ro.disconnect();
        ro = null;
      }
    })

    test('HTMLSpanElement: Should not fire notification', (done): void => {
      createElement('SPAN');
      ro = new ResizeObserver((): void => {
        expect(true).toEqual(false); // should not fire
      })
      ro.observe(el);
      delay(done);
    })

    test('HTMLSpanElement: Should fire notification when display is not inline', (done): void => {
      createElement('SPAN');
      el.style.display = 'block';
      ro = new ResizeObserver((): void => {
        done();
      })
      ro.observe(el);
    })

    test('HTMLInpupElement[type!=image]: Should not fire notification', (done): void => {
      createElement('INPUT');
      (el as HTMLInputElement).type = 'input';
      ro = new ResizeObserver((): void => {
        expect(true).toEqual(false); // should not fire
      })
      ro.observe(el);
      delay(done);
    })
  })

  describe('Replaced elements', (): void => {
  
    afterEach((): void => {
      while (document.body.firstElementChild) {
        document.body.removeChild(document.body.firstElementChild);
      }
      if (ro) {
        ro.disconnect();
      }
    })

    test('HTMLAudioElement: Should fire notification, even when display is inline', (done): void => {
      createElement('AUDIO');
      ro = new ResizeObserver((): void => {
        done();
      })
      ro.observe(el);
    })

    test('HTMLVideoElement: Should fire notification, even when display is inline', (done): void => {
      createElement('VIDEO');
      ro = new ResizeObserver((): void => {
        done();
      })
      ro.observe(el);
    })

    test('HTMLCanvasElement: Should fire notification, even when display is inline', (done): void => {
      createElement('CANVAS');
      ro = new ResizeObserver((): void => {
        done();
      })
      ro.observe(el);
    })

    test('HTMLObjectElement: Should fire notification, even when display is inline', (done): void => {
      createElement('Object');
      ro = new ResizeObserver((): void => {
        done();
      })
      ro.observe(el);
    })

    test('HTMLEmbedElement: Should fire notification, even when display is inline', (done): void => {
      createElement('EMBED');
      ro = new ResizeObserver((): void => {
        done();
      })
      ro.observe(el);
    })

    test('HTMLIFrameElement: Should fire notification, even when display is inline', (done): void => {
      createElement('IFRAME');
      ro = new ResizeObserver((): void => {
        done();
      })
      ro.observe(el);
    })

    test('HTMLImageElement: Should fire notification, even when display is inline', (done): void => {
      createElement('IMG');
      ro = new ResizeObserver((): void => {
        done();
      })
      ro.observe(el);
    })

    test('HTMLInpupElement[type=image]: Should fire notification, even when display is inline', (done): void => {
      createElement('INPUT');
      (el as HTMLInputElement).type = 'image';
      ro = new ResizeObserver((): void => {
        done();
      })
      ro.observe(el);
    })

  })

})