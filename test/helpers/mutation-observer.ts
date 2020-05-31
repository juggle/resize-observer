// Provide a basic MutationObserver fallback
Object.defineProperty(window, 'MutationObserver', {
  value: class MutationObserver {
    private callback: (records: [], observer: MutationObserver) => void;
    public constructor (callback: () => void) {
      this.callback = callback;
    }
    public observe (el: Element): void {
      Object.defineProperty(el, 'textContent', {
        set: (): void => {
          Promise.resolve().then((): void => this.callback([], this));
        },
        configurable: true
      })
    }
    public disconnect (): void {
      this.callback = (): void => { /* do nothing */ };
    }
  }
});
