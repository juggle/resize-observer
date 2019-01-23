import { ResizeObserverBoxOptions } from '../ResizeObserverBoxOptions';
import { ResizeObserverSize } from '../ResizeObserverSize';
import { DOMRectReadOnly } from '../DOMRectReadOnly';

const IE = (/msie|trident/i).test(navigator.userAgent);
const parseDimension = (pixel: string | null) => parseFloat(pixel || '0');

const isSVG = (target: Element): boolean => 'SVGGraphicsElement' in window
&& target instanceof SVGGraphicsElement && 'getBBox' in target;

const cache = new Map();

const calculateBoxSizes = (target: Element) => {

  if (cache.has(target)) {
    return cache.get(target);
  }

  const svg = isSVG(target) && (target as SVGGraphicsElement).getBBox();

  const cs = getComputedStyle(target);
  const removePadding = !IE && cs.boxSizing === 'border-box';
  const paddingTop = svg ? 0 : parseDimension(cs.paddingTop);
  const paddingRight = svg ? 0 : parseDimension(cs.paddingRight);
  const paddingBottom = svg ? 0 : parseDimension(cs.paddingBottom);
  const paddingLeft = svg ? 0 : parseDimension(cs.paddingLeft);
  const borderTop = svg ? 0 : parseDimension(cs.borderTopWidth);
  const borderRight = svg ? 0 : parseDimension(cs.borderRightWidth);
  const borderBottom = svg ? 0 : parseDimension(cs.borderBottomWidth);
  const borderLeft = svg ? 0 : parseDimension(cs.borderLeftWidth);
  const horizontalPadding = paddingLeft + paddingRight;
  const verticalPadding = paddingTop + paddingBottom;
  const horizontalBorderArea = borderLeft + borderRight;
  const verticalBorderArea = borderTop + borderBottom;
  const widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0;
  const heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0;
  const width = svg ? svg.width : parseDimension(cs.width) - widthReduction;
  const height = svg ? svg.height : parseDimension(cs.height) - heightReduction;
  const hidden = cs.display === 'none';

  const borderBoxSize: ResizeObserverSize = {
    inlineSize: width + horizontalPadding + horizontalBorderArea,
    blockSize: height + verticalPadding + verticalBorderArea
  }

  const contentBoxSize: ResizeObserverSize = {
    inlineSize: width,
    blockSize: height
  }

  const scrollBoxSize: ResizeObserverSize = {
    inlineSize: width + horizontalPadding,
    blockSize: height + verticalPadding
  }

  const devicePixelBorderBoxSize: ResizeObserverSize = {
    inlineSize: borderBoxSize.inlineSize * window.devicePixelRatio,
    blockSize: borderBoxSize.blockSize * window.devicePixelRatio
  }

  const contentRect = new DOMRectReadOnly(paddingLeft, paddingTop, width, height);

  const boxes = {
    borderBoxSize,
    contentBoxSize,
    scrollBoxSize,
    devicePixelBorderBoxSize,
    contentRect,
    hidden
  };

  cache.set(target, boxes);

  return boxes;
};

const calculateBoxSize = (target: Element, observedBox: ResizeObserverBoxOptions): ResizeObserverSize => {
  const boxes = calculateBoxSizes(target);
  switch (observedBox) {
    case ResizeObserverBoxOptions.BORDER_BOX:
      return boxes.borderBoxSize;
    case ResizeObserverBoxOptions.SCROLL_BOX:
      return boxes.scrollBoxSize;
    case ResizeObserverBoxOptions.DEVICE_PIXEL_BORDER_BOX:
      return boxes.devicePixelBorderBoxSize;
    case ResizeObserverBoxOptions.CONTENT_BOX:
    default:
     return boxes.contentBoxSize;
  }
};

export { calculateBoxSize, calculateBoxSizes, cache };
