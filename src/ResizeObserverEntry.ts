import DOMRectReadOnly from './DOMRectReadOnly';

const IE = (/msie|trident/i).test(navigator.userAgent);
const parseDimension = (pixel: string | null) => parseFloat(pixel || '0');

const getRect = (target: Element) => {
  if ('SVGGraphicsElement' in window && target instanceof SVGGraphicsElement && 'getBBox' in target) {
    const box = target.getBBox();
    return new DOMRectReadOnly(0, 0, box.width, box.height);
  }
  const cs = window.getComputedStyle(target);
  const removePadding = !IE && cs.boxSizing === 'border-box';
  const paddingTop = parseDimension(cs.paddingTop);
  const paddingRight = parseDimension(cs.paddingRight);
  const paddingBottom = parseDimension(cs.paddingBottom);
  const paddingLeft = parseDimension(cs.paddingLeft);
  const borderTop = parseDimension(cs.borderTopWidth);
  const borderRight = parseDimension(cs.borderRightWidth);
  const borderBottom = parseDimension(cs.borderBottomWidth);
  const borderLeft = parseDimension(cs.borderLeftWidth);
  const horizontalPadding = paddingLeft + paddingRight + borderLeft + borderRight;
  const verticalPadding = paddingTop + paddingBottom + borderTop + borderBottom;
  const width = parseDimension(cs.width) - (removePadding ? horizontalPadding : 0);
  const height = parseDimension(cs.height) - (removePadding ? verticalPadding : 0);
  return new DOMRectReadOnly(paddingLeft, paddingTop, width, height);
};

export default class ResizeObserverEntry {
  public target: Element;
  public contentRect: DOMRectReadOnly;
  constructor (target: Element) {
    this.target = target;
    this.contentRect = getRect(this.target);
  }
}
