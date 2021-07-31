const windowEvents = [
  // Global Resize
  'resize',
  // Global Load
  'load',
]

const documentEvents = [
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
  'touchstart',
  'touchend',
  'touchmove',
  'touchcancel',
  'blur',
  'focus'
];

export { windowEvents, documentEvents };
