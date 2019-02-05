import { ResizeObserverBoxOptions } from '../ResizeObserverBoxOptions';
import { ResizeObserverSize } from '../ResizeObserverSize';
import { DOMRectReadOnly } from '../DOMRectReadOnly';

interface ResizeObserverSizeCollection {
  borderBoxSize: ResizeObserverSize;
  contentBoxSize: ResizeObserverSize;
  scrollBoxSize: ResizeObserverSize;
  devicePixelBorderBoxSize: ResizeObserverSize;
  contentRect: DOMRectReadOnly;
}

const cache = new Map();
const IE = (/msie|trident/i).test(navigator.userAgent);
const parseDimension = (pixel: string | null): number => parseFloat(pixel || '0');
const isSVG = (target: Element): boolean => 'SVGGraphicsElement' in window
&& target instanceof SVGGraphicsElement && 'getBBox' in target;

/**
 * Gets all box sizes of an element.
 */
const calculateBoxSizes = (target: Element): ResizeObserverSizeCollection => {

  // Check cache to prevent recalculating styles.
  if (cache.has(target)) {
    return cache.get(target);
  }

  // If element is an SVG, handle things differently, using its bounding box.
  const svg = isSVG(target) && (target as SVGGraphicsElement).getBBox();

  const cs = getComputedStyle(target);

  // IE does not remove padding from width/height, when box-sizing is border-box.
  const removePadding = !IE && cs.boxSizing === 'border-box';

  // Calculate properties for creating boxes.
  const width = parseDimension(cs.width);
  const height = parseDimension(cs.height);
  const hidden = isNaN(width) || isNaN(height) || cs.display === 'none';
  const paddingTop = svg || hidden ? 0 : parseDimension(cs.paddingTop);
  const paddingRight = svg || hidden ? 0 : parseDimension(cs.paddingRight);
  const paddingBottom = svg || hidden ? 0 : parseDimension(cs.paddingBottom);
  const paddingLeft = svg || hidden ? 0 : parseDimension(cs.paddingLeft);
  const borderTop = svg || hidden ? 0 : parseDimension(cs.borderTopWidth);
  const borderRight = svg || hidden ? 0 : parseDimension(cs.borderRightWidth);
  const borderBottom = svg || hidden ? 0 : parseDimension(cs.borderBottomWidth);
  const borderLeft = svg || hidden ? 0 : parseDimension(cs.borderLeftWidth);
  const horizontalPadding = paddingLeft + paddingRight;
  const verticalPadding = paddingTop + paddingBottom;
  const horizontalBorderArea = borderLeft + borderRight;
  const verticalBorderArea = borderTop + borderBottom;
  const widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0;
  const heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0;
  const contentWidth = hidden ? 0 : svg ? svg.width : parseDimension(cs.width) - widthReduction;
  const contentHeight = hidden ? 0 : svg ? svg.height : parseDimension(cs.height) - heightReduction;

  // Create borderBoxSize
  const borderBoxSize: ResizeObserverSize = {
    inlineSize: contentWidth + horizontalPadding + horizontalBorderArea,
    blockSize: contentHeight + verticalPadding + verticalBorderArea
  }

  // Create contentSize
  const contentBoxSize: ResizeObserverSize = {
    inlineSize: contentWidth,
    blockSize: contentHeight
  }

  // Create scrollSize
  const scrollBoxSize: ResizeObserverSize = {
    inlineSize: contentWidth + horizontalPadding,
    blockSize: contentHeight + verticalPadding
  }

  // Create devicePixelBorderBoxSize
  const devicePixelBorderBoxSize: ResizeObserverSize = {
    inlineSize: borderBoxSize.inlineSize * window.devicePixelRatio,
    blockSize: borderBoxSize.blockSize * window.devicePixelRatio
  }

  // Create legacy contentRect
  const contentRect = new DOMRectReadOnly(paddingLeft, paddingTop, contentWidth, contentHeight);

  const boxes = {
    borderBoxSize,
    contentBoxSize,
    scrollBoxSize,
    devicePixelBorderBoxSize,
    contentRect
  };

  // Cache the boxes as there will
  // be multiple requests for information.
  cache.set(target, boxes);

  return boxes;
};

/**
 * Calculates the observe box size of an element.
 * 
 * https://drafts.csswg.org/resize-observer-1/#calculate-box-size
 */
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
