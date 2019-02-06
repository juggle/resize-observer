import '../src/ResizeObserver';

describe('Request Animation Frame', () => {

  // As we're overriding the default requestAnimationFrame
  // we need to check it's working correctly.

  test('requestAnimationFrame retrun correct handles', () => {
    const a = requestAnimationFrame(() => {})
    const b = requestAnimationFrame(() => {})
    const c = requestAnimationFrame(() => {})
    expect(typeof a).toBe('number');
    expect(typeof b).toBe('number');
    expect(typeof c).toBe('number');
    expect(b).toBe(a + 1);
    expect(c).toBe(b + 1);
  })

  test('requestAnimationFrame should execute in the correct order', (done) => {
    let result = '';
    requestAnimationFrame(() => {
      result += 'A';
    })
    requestAnimationFrame(() => {
      result += 'B';
      expect(result).toBe('AB');
      done();
    })
  })

  test('cancelAnimationFrame shoud work as expected', (done) => {
    let result = '';
    requestAnimationFrame(() => {
      result += 'A';
    })
    const x = requestAnimationFrame(() => {
      result += 'X';
    })
    requestAnimationFrame(() => {
      result += 'B';
      expect(result).toBe('AB');
      done();
    })
    cancelAnimationFrame(x);
  })

  test('Should be able to create animation loop', (done) => {
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

  test('Throw error if no callback is passed to requestAnimationFrame', () => {
    expect(requestAnimationFrame).toThrowError('requestAnimationFrame expects 1 callback argument of type function.');
  })

  test('console.log(requestAnimationFrame) should be prettified', () => {
    expect(requestAnimationFrame.toString()).toBe('function ResizeObserver () { [polyfill code] }');
  })

  test('console.log(cancelAnimationFrame) should be prettified', () => {
    expect(cancelAnimationFrame.toString()).toBe('function ResizeObserver () { [polyfill code] }');
  })

});