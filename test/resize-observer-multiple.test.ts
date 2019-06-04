import { ResizeObserver } from '../src/ResizeObserver';
import './helpers/offset';

let el: HTMLElement;
let ro: ResizeObserver;

beforeEach((): void => {
  el = document.createElement('div');
  el.style.width = '100px';
  document.body.appendChild(el);
})

afterEach((): void => {
  while (document.body.firstElementChild) {
    document.body.removeChild(document.body.firstElementChild);
  }
})

describe('Multiple HTMLElement', (): void => {

  test('Should return the correct entries and observer arguments, when an observation has occured.', (done): void => {
    const el2 = el.cloneNode() as HTMLElement;
    document.body.appendChild(el2);
    ro = new ResizeObserver((entries, observer): void => {
      expect(entries).toHaveLength(2);
      expect(entries[0].target).toBe(el);
      expect(entries[1].target).toBe(el2);
      expect(observer).toBe(ro);
      done();
    });
    ro.observe(el);
    ro.observe(el2);
  })

})

describe('Multiple Observers', (): void => {

  test('Should be able to observe elements in multiple observers.', (done): void => {
    const ro1 = new ResizeObserver((entries, observer): void => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(observer).toBe(ro1);
      observer.disconnect();
    });
    ro1.observe(el);
    const ro2 = new ResizeObserver((entries, observer): void => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(observer).toBe(ro2);
      observer.disconnect();
      done();
    });
    ro2.observe(el);
  })

  test('Observers observing nothing should not be fired when others are.', (done): void => {
    const ro1 = new ResizeObserver((): void => {
      expect(false).toBe(true); // Should never be called
    });
    const ro2 = new ResizeObserver((entries, observer): void => {
      expect(entries).toHaveLength(1);
      expect(entries[0].target).toBe(el);
      expect(observer).toBe(ro2);
      observer.disconnect();
      ro1.disconnect();
      done();
    });
    ro2.observe(el);
  })
  
})