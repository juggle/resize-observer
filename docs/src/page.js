import 'core-js/features/symbol';
import 'core-js/features/array/from';
import 'core-js/features/dom-collections/iterator';
import { ResizeObserver } from '../../lib/ResizeObserver';

window.ResizeObserver = ResizeObserver; // Override global so that people can play :)

const perfArea = document.getElementById('performance-example');
const perfFragment = document.createDocumentFragment();
const perfCount = document.getElementById('performance-count');
let ticks = 0;

const ro = new ResizeObserver(entries => {
  entries.forEach(entry => {
    if (entry.target.parentElement === perfArea) {
      ticks += 1;
      perfCount.innerText = ticks;
      return;
    }
    const { inlineSize, blockSize } = entry.contentBoxSize[0];
    entry.target.setAttribute('dimensions', `${Math.round(inlineSize)} x ${Math.round(blockSize)}`);
  });
}, {
  clock: true
});

[...document.querySelectorAll('pre, code')].forEach(el => {
  el.innerHTML = el.innerHTML.trim();
});

const perfEls = [];

for (let i = 0; i < 200; i += 1) {
  const el = document.createElement('div');
  perfEls.push(el);
  perfFragment.appendChild(el);
}

perfArea.appendChild(perfFragment);

if (!('toggleAttribute' in HTMLElement.prototype)) {
  HTMLElement.prototype.toggleAttribute = function (attr) {
    if (this.hasAttribute(attr)) {
      this.removeAttribute(attr);
      return false;
    }
    this.setAttribute(attr, '');
    return true;
  }
}

perfArea.addEventListener('click', function () {
  const animating = this.toggleAttribute('animate');
  perfEls.forEach(el => animating ? ro.observe(el) : ro.unobserve(el));
});

document.getElementById('transition-example').addEventListener('click', function () {
  this.toggleAttribute('fill');
});

document.getElementById('animation-example').addEventListener('click', function () {
  this.toggleAttribute('animate');
});

[...document.querySelectorAll('[resize]')].forEach(el => ro.observe(el));
