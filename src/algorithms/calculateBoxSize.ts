import { ResizeObserverBoxOptions } from '../ResizeObserverBoxOptions';
import { ResizeObserverSize } from '../ResizeObserverSize';
import { DOMRectReadOnly } from '../DOMRectReadOnly';
import { isSVG, isHidden } from '../utils/element';

interface ResizeObserverSizeCollection {
  borderBoxSize: ResizeObserverSize;
  contentBoxSize: ResizeObserverSize;
  contentRect: DOMRectReadOnly;
}

const cache = new Map();
const scrollRegexp = /auto|scroll/;
const verticalRegexp = /^tb|vertical/;
const IE = (/msie|trident/i).test(navigator.userAgent);
const parseDimension = (pixel: string | null): number => parseFloat(pixel || '0');

// Helper to generate and freeze a ResizeObserverSize
const size = (inlineSize: number = 0, blockSize: number = 0, switchSizes: boolean = false): ResizeObserverSize => {
  return Object.freeze({
    inlineSize: (switchSizes ? blockSize : inlineSize) || 0, // never return NaN
    blockSize: (switchSizes ? inlineSize : blockSize) || 0   // never return NaN
  });
}

// Return this when targets are hidden
const zeroBoxes = Object.freeze({
  borderBoxSize: size(),
  contentBoxSize: size(),
  contentRect: new DOMRectReadOnly(0, 0, 0, 0)
})

/**
 * Gets all box sizes of an element.
 */
const calculateBoxSizes = (target: Element): ResizeObserverSizeCollection => {

  // Check cache to prevent recalculating styles.
  if (cache.has(target)) {
    return cache.get(target);
  }

  // If the target is hidden, send zero
  if (isHidden(target)) {
    cache.set(target, zeroBoxes);
    return zeroBoxes;
  }

  const cs = getComputedStyle(target);

  // If element is an SVG, handle things differently, using its bounding box.
  const svg = isSVG(target) && (target as SVGGraphicsElement).getBBox();

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
const calculateBoxSize = (target: Element, observedBox: ResizeObserverBoxOptions): ResizeObserverSize => {
  const { borderBoxSize, contentBoxSize } = calculateBoxSizes(target);
  return observedBox === ResizeObserverBoxOptions.BORDER_BOX ? borderBoxSize : contentBoxSize;
};

export { calculateBoxSize, calculateBoxSizes, cache };
