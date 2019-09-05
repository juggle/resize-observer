// Provide a basic MutationObserver fallback
// for queueMicroTask util

class MutationObserverX {
  private callback: () => void;
  public constructor (callback: () => void) {
    this.callback = callback;
  }
  public observe (el: Element): void {
    Object.defineProperty(el, 'textContent', {
      set: (): void => {
        this.callback();
      }
    })
  }
}

Object.defineProperty(window, 'MutationObserver', {
  value: MutationObserverX
});
