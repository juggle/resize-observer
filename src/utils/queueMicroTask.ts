import { global } from "./global";

let cb: (() => void) | null;
let trigger: (() => void | number);

const executeCallback = (): void => {
  try {
    cb && cb();
  }
  finally {
    cb = null;
  }
}

// Use MutationObserver to run MicroTask
// as it's available in all supported browsers
if ('MutationObserver' in global) {
  const el = new Text();
  new MutationObserver(executeCallback).observe(el, { characterData: true });
  trigger = (): void => {
    el.textContent = '';
  }
}
else {
  trigger = (): number => setTimeout(executeCallback);
}

const queueMicroTask = (callback: () => void): void => {
  cb = callback;
  trigger();
}

export { queueMicroTask }