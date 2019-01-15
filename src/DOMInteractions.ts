type StandardCallback = () => any;
const watchers: StandardCallback[] = [];

const dispatch: StandardCallback = () => {
  watchers.forEach((watcher: StandardCallback) => watcher());
}

export default class DOMInteractions {
  public static watch (callback: StandardCallback) {
    watchers.push(callback);
  }
}

// Listen to interaction
document.addEventListener('keyup', dispatch, true);
document.addEventListener('keydown', dispatch, true);
document.addEventListener('mouseup', dispatch, true);
document.addEventListener('mousedown', dispatch, true);
document.addEventListener('mouseover', dispatch, true);
document.addEventListener('blur', dispatch, true);
document.addEventListener('focus', dispatch, true);

// Listen to transitions and animations
document.addEventListener('transitionend', dispatch, true);
document.addEventListener('animationend', dispatch, true);
document.addEventListener('animationstart', dispatch, true);
document.addEventListener('animationiteration', dispatch, true);

// Listen for window resize
window.addEventListener('resize', dispatch);

// Listen for any other DOM changes which could affect sizes
if ('MutationObserver' in window) {
  const observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };
  new MutationObserver(dispatch).observe(document.body, observerConfig);
}