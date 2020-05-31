interface Rectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

type DOMRectJSON = {
  x: number,
  y: number,
  top: number,
  right: number,
  bottom: number,
  left: number,
  width: number,
  height: number,
}

/**
 * Implementation of DOMRectReadOnly.
 * Native DOMRectReadOnly is not available in all browsers.
 */
class DOMRectReadOnly {
  public readonly x: number;
  public readonly y: number;
  public readonly width: number;
  public readonly height: number;
  public readonly top: number;
  public readonly left: number;
  public readonly bottom: number;
  public readonly right: number;
  public constructor (x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.top = this.y;
    this.left = this.x;
    this.bottom = this.top + this.height;
    this.right = this.left + this.width;
    return Object.freeze(this);
  }
  public toJSON (): DOMRectJSON {
    const { x, y, top, right, bottom, left, width, height } = this;
    return { x, y, top, right, bottom, left, width, height };
  }
  public static fromRect (rectangle: Rectangle): Readonly<DOMRectReadOnly> {
    return new DOMRectReadOnly(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  }
}

export { DOMRectReadOnly };
