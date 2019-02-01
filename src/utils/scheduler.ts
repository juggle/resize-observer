import { process } from '../ResizeObserverController';

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
  'mouseout',
  'blur',
  'focus'
];

/**
 * Debounces events and processes
 * on the next animation frame.
 */
let frameId: number;
const run = (frames: number): void => {
  cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(() => {
    // Have any changes happened?
    if (process()) {
      run(60);
    }
    // Continue checking any additional frames
    else if (frames) {
      run(frames - 1);
    }
  });
}

// Default sheduler
// Runs checks on current and next frame
const schedule = (): void => run(1);

// Listen to events
events.forEach(name => window.addEventListener(name, schedule, true));


// Listen for any other DOM changes which could affect sizes
const createObserver = (): void => {
  /* istanbul ignore if  */
  if ('MutationObserver' in window) {
    const observerConfig = { attributes: true, characterData: true, childList: true, subtree: true };
    new MutationObserver(schedule).observe(document.body, observerConfig);
  }
}
/* istanbul ignore next  */
document.body ? createObserver() : document.addEventListener('DOMContentLoaded', createObserver);

export { schedule };
