import { DOMRectReadOnly } from '../src/DOMRectReadOnly';

  describe('DOMRectReadOnly', () => {
    it('Should return a DOMRect with the correct properties.', () => {
      let rect;
      rect = new DOMRectReadOnly(0, 0, 0, 0);
      expect(rect).toMatchObject({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0
      });
      rect = new DOMRectReadOnly(5, 10, 0, 0);
      expect(rect).toMatchObject({
        x: 5,
        y: 10,
        top: 10,
        left: 5,
        bottom: 10,
        right: 5,
        width: 0,
        height: 0
      });
      rect = new DOMRectReadOnly(0, 0, 5, 10);
      expect(rect).toMatchObject({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        bottom: 10,
        right: 5,
        width: 5,
        height: 10
      });
      rect = new DOMRectReadOnly(5, 10, 15, 20);
      expect(rect).toMatchObject({
        x: 5,
        y: 10,
        top: 10,
        left: 5,
        bottom: 30,
        right: 20,
        width: 15,
        height: 20
      });
    });
    it('Should support DOMRectReadOnly.fromRect()', () => {
      let rect = DOMRectReadOnly.fromRect({
        x: 1,
        y: 2,
        width: 3,
        height: 4
      });
      expect(rect).toMatchObject({
        x: 1,
        y: 2,
        top: 2,
        left: 1,
        bottom: 6,
        right: 4,
        width: 3,
        height: 4
      });
    });
  });