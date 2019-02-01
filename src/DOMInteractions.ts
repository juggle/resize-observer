type StandardCallback = () => void;
const watchers: StandardCallback[] = [];

const events = [
  // Global Resize
  'resize',
  // Transitions & Animations
  'transitionend',
  'animationend',
  'animationstart',
  'animationiteration',
  // Interactions
  'keyup',
  'keydown',
  'mouseup',
  'mousedown',
  'mouseover',
  'blur',
  'focus'
];

// Dispatcher for interactions
const dispatch: StandardCallback = (): void => {
  watchers.forEach((watcher: StandardCallback) => watcher());
}

// Listen to events
events.forEach(name => window.addEventListener(name, dispatch, true));


// Listen for any other DOM changes which could affect sizes
const createObserver = (): void => {
  if ('MutationObserver' in window) {
    const observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };
    new MutationObserver(dispatch).observe(document.body, observerConfig);
  }
}
document.body ? createObserver() : document.addEventListener('DOMContentLoaded', createObserver);

class DOMInteractions {
  public static watch (callback: StandardCallback): void {
    watchers.push(callback);
  }
}

export { DOMInteractions }