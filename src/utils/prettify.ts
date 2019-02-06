const POLYFILL_CONSOLE_OUTPUT = 'function ResizeObserver () { [polyfill code] }';

const prettifyConsoleOutput = <T>(fn: T): T => {
  fn.toString = function () {
    return POLYFILL_CONSOLE_OUTPUT;
  };
  return fn;
}

export { POLYFILL_CONSOLE_OUTPUT, prettifyConsoleOutput };
