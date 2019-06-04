import '../src/ResizeObserver';

describe('Request Animation Frame', (): void => {

  // As we're overriding the default requestAnimationFrame
  // we need to check it's working correctly.

  test('requestAnimationFrame retrun correct handles', (): void => {
    const a = requestAnimationFrame((): void => {})
    const b = requestAnimationFrame((): void => {})
    const c = requestAnimationFrame((): void => {})
    expect(typeof a).toBe('number');
    expect(typeof b).toBe('number');
    expect(typeof c).toBe('number');
    expect(b).toBe(a + 1);
    expect(c).toBe(b + 1);
  })

  test('requestAnimationFrame should execute in the correct order', (done): void => {
    let result = '';
    requestAnimationFrame((): void => {
      result += 'A';
    })
    requestAnimationFrame((): void => {
      result += 'B';
      expect(result).toBe('AB');
      done();
    })
  })

  test('cancelAnimationFrame shoud work as expected', (done): void => {
    let result = '';
    requestAnimationFrame((): void => {
      result += 'A';
    })
    const x = requestAnimationFrame((): void => {
      result += 'X';
    })
    requestAnimationFrame((): void => {
      result += 'B';
      expect(result).toBe('AB');
      done();
    })
    cancelAnimationFrame(x);
  })

  test('Should be able to create animation loop', (done): void => {
    let result = '';
    const letters = ['A', 'B', 'C', 'D'];
    const loop = (): void => {
      if (letters.length) {
        result += letters.shift();
        requestAnimationFrame(loop);
      }
      else {
        expect(result).toBe('ABCD');
        done();
      }
    }
    loop();
  })

  test('Throw error if no callback is passed to requestAnimationFrame', (): void => {
    expect(requestAnimationFrame).toThrowError('requestAnimationFrame expects 1 callback argument of type function.');
  })

  test('console.log(requestAnimationFrame) should be prettified', (): void => {
    expect(requestAnimationFrame.toString()).toBe('function ResizeObserver () { [polyfill code] }');
  })

  test('console.log(cancelAnimationFrame) should be prettified', (): void => {
    expect(cancelAnimationFrame.toString()).toBe('function ResizeObserver () { [polyfill code] }');
  })

});