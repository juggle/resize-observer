import { ResizeObserverBoxOptions } from '../ResizeObserverBoxOptions';
import { ResizeObserverSize } from '../ResizeObserverSize';
import { DOMRectReadOnly } from '../DOMRectReadOnly';
import { isSVG, isHidden } from '../utils/element';
import { global } from '../utils/global';

interface ResizeObserverSizeCollection {
  devicePixelContentBoxSize: ResizeObserverSize;
  borderBoxSize: ResizeObserverSize;
  contentBoxSize: ResizeObserverSize;
  contentRect: DOMRectReadOnly;
}

const cache = new WeakMap<Element, ResizeObserverSizeCollection>();
const scrollRegexp = /auto|scroll/;
const verticalRegexp = /^tb|vertical/;
const IE = (/msie|trident/i).test(global.navigator && global.navigator.userAgent);
const parseDimension = (pixel: string | null): number => parseFloat(pixel || '0');

// Helper to generate and freeze a ResizeObserverSize
const size = (inlineSize = 0, blockSize = 0, switchSizes = false): ResizeObserverSize => {
  return Object.freeze({
    inlineSize: (switchSizes ? blockSize : inlineSize) || 0, // never return NaN
    blockSize: (switchSizes ? inlineSize : blockSize) || 0   // never return NaN
  });
}

// Return this when targets are hidden
const zeroBoxes = Object.freeze({
  devicePixelContentBoxSize: size(),
  borderBoxSize: size(),
  contentBoxSize: size(),
  contentRect: new DOMRectReadOnly(0, 0, 0, 0)
})

/**
 * Gets all box sizes of an element.
 */
const calculateBoxSizes = (target: Element, forceRecalculation = false): ResizeObserverSizeCollection => {

  // Check cache to prevent recalculating styles.
  if (cache.has(target) && !forceRecalculation) {
    return cache.get(target) as ResizeObserverSizeCollection;
  }

  // If the target is hidden, send zero
  if (isHidden(target)) {
    cache.set(target, zeroBoxes);
    return zeroBoxes;
  }

  const cs = getComputedStyle(target);

  // If element has an SVG box, handle things differently, using its bounding box.
  const svg = isSVG(target) && (target as SVGElement).ownerSVGElement && (target as SVGGraphicsElement).getBBox();

  // IE does not remove padding from width/height, when box-sizing is border-box.
  const removePadding = !IE && cs.boxSizing === 'border-box';

  // Switch sizes if writing mode is vertical.
  const switchSizes = verticalRegexp.test(cs.writingMode || '');

  // Could the element have any scrollbars?
  const canScrollVertically = !svg && scrollRegexp.test(cs.overflowY || '');
  const canScrollHorizontally = !svg && scrollRegexp.test(cs.overflowX || '');

  // Calculate properties for creating boxes.
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
  const horizontalScrollbarThickness = !canScrollHorizontally ? 0 : (target as HTMLElement).offsetHeight - verticalBorderArea - target.clientHeight;
  const verticalScrollbarThickness = !canScrollVertically ? 0 : (target as HTMLElement).offsetWidth - horizontalBorderArea - target.clientWidth;
  const widthReduction = removePadding ? horizontalPadding + horizontalBorderArea : 0;
  const heightReduction = removePadding ? verticalPadding + verticalBorderArea : 0;
  const contentWidth = svg ? svg.width : parseDimension(cs.width) - widthReduction - verticalScrollbarThickness;
  const contentHeight = svg ? svg.height : parseDimension(cs.height) - heightReduction - horizontalScrollbarThickness;
  const borderBoxWidth = contentWidth + horizontalPadding + verticalScrollbarThickness + horizontalBorderArea;
  const borderBoxHeight = contentHeight + verticalPadding + horizontalScrollbarThickness + verticalBorderArea;

  const boxes = Object.freeze({
    devicePixelContentBoxSize: size(
      Math.round(contentWidth * devicePixelRatio),
      Math.round(contentHeight * devicePixelRatio),
      switchSizes
    ),
    borderBoxSize: size(borderBoxWidth, borderBoxHeight, switchSizes),
    contentBoxSize: size(contentWidth, contentHeight, switchSizes),
    contentRect: new DOMRectReadOnly(paddingLeft, paddingTop, contentWidth, contentHeight)
  });

  cache.set(target, boxes);

  return boxes;
};

/**
 * Calculates the observe box size of an element.
 * 
 * https://drafts.csswg.org/resize-observer-1/#calculate-box-size
 */
const calculateBoxSize = (target: Element, observedBox: ResizeObserverBoxOptions, forceRecalculation?: boolean): ResizeObserverSize => {
  const { borderBoxSize, contentBoxSize, devicePixelContentBoxSize } = calculateBoxSizes(target, forceRecalculation);
  switch (observedBox) {
    case ResizeObserverBoxOptions.DEVICE_PIXEL_CONTENT_BOX:
      return devicePixelContentBoxSize;
    case ResizeObserverBoxOptions.BORDER_BOX:
      return borderBoxSize;
    default:
      return contentBoxSize;
  }
};

export { calculateBoxSize, calculateBoxSizes };
