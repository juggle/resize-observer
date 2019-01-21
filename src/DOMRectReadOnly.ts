interface Rectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

class DOMRectReadOnly {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly top: number;
  readonly left: number;
  readonly bottom: number;
  readonly right: number;
  constructor (x: number, y: number, width: number, height: number) {
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
  static fromRect (rectangle: Rectangle): Readonly<DOMRectReadOnly> {
    return new DOMRectReadOnly(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  }
}

export { DOMRectReadOnly };
