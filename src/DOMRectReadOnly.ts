interface Rectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

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
  public static fromRect (rectangle: Rectangle): Readonly<DOMRectReadOnly> {
    return new DOMRectReadOnly(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  }
}

export { DOMRectReadOnly };
