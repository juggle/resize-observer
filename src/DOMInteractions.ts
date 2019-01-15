type StandardCallback = () => any;
const watchers: StandardCallback[] = [];

let frameId: number;
let extraFrames = 0;
const notify = () => {
  cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(() => {
    if (dispatch()) {
      extraFrames = 0;
      notify();
    }
    else if (extraFrames < 60) {
      extraFrames += 1;
      notify();
    }
  });
}

const dispatch: StandardCallback = () => {
  watchers.forEach((watcher: StandardCallback) => watcher());
}

export default class DOMInteractions {
  public static watch (callback: StandardCallback) {
    watchers.push(callback);
  }
  public static notify () {
    notify();
  }
}

// Listen to interaction
document.addEventListener('keyup', notify, true);
document.addEventListener('keydown', notify, true);
document.addEventListener('mouseup', notify, true);
document.addEventListener('mousedown', notify, true);
document.addEventListener('mouseover', notify, true);
document.addEventListener('blur', notify, true);
document.addEventListener('focus', notify, true);

// Listen to transitions and animations
document.addEventListener('transitionend', notify, true);
document.addEventListener('animationend', notify, true);
document.addEventListener('animationstart', notify, true);
document.addEventListener('animationiteration', notify, true);

// Listen for window resize
window.addEventListener('resize', notify);

// Listen for any other DOM changes which could affect sizes
if ('MutationObserver' in window) {
  const observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };
  new MutationObserver(notify).observe(document.body, observerConfig);
}