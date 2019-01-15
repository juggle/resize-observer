import ResizeObserver from '../src/ResizeObserver';

let ro: ResizeObserver;
let element: HTMLElement;

beforeEach(() => {
  element = document.createElement('div');
  element.style.width = '300px';
  element.style.height = '300px';
  document.body.appendChild(element);
});

it('Should return the correct entries and observer arguments', (done) => {
  ro = new ResizeObserver((entries, observer) => {
    expect(entries).toHaveLength(1);
    expect(entries[0].target).toBe(element);
    done();
  });
  ro.observe(element);
});