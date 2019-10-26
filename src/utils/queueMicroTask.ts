
let trigger: () => void;
const callbacks: (() => void)[] = [];
const notify = (): void => callbacks.splice(0).forEach((cb): void => cb());

const queueMicroTask = (callback: () => void): void => {
  if (!trigger) {
    const el = document.createTextNode('');
    const config = { characterData: true };
    new MutationObserver((): void => notify()).observe(el, config);
    trigger = (): void => { el.textContent = ''; };
  }
  callbacks.push(callback);
  trigger();
};

export { queueMicroTask }
