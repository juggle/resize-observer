import { global } from "./global";

let cb: (() => void) | null;
let trigger: (() => void | number);

const executeCallback = (): void => {
  if (cb) {
    try {
      cb();
    }
    finally {
      cb = null;
    }
  }
}

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