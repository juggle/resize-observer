// This file patches offsetWidth and offsetHeight
// as it's not suppported in jsdom.

const getOffsetValue = function (el: Element): number {
  const style = getComputedStyle(el);
  const width = parseFloat(style.width || '');
  const height = parseFloat(style.height || '');
  if(style.display === 'none' || (!width && !height)) {
    return 0;
  }
  return 1; // We only need to return a non-zero for tests
}

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  get: function () {
    return getOffsetValue(this);
  }
})

Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  get: function () {
    return getOffsetValue(this);
  }
})
