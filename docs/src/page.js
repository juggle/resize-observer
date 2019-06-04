import '@babel/polyfill';
import ResizeObserver from '../../src/ResizeObserver.ts';

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
    const { inlineSize, blockSize } = entry.contentBoxSize;
    entry.target.setAttribute('dimensions', `${Math.round(inlineSize)} x ${Math.round(blockSize)}`);
  });
});

[...document.querySelectorAll('pre, code')].forEach(el => {
  el.innerHTML = el.innerHTML.trim();
});

for (let i = 0; i < 200; i += 1) {
  const el = document.createElement('div');
  el.setAttribute('resize', '');
  perfFragment.appendChild(el);
}

perfArea.appendChild(perfFragment);

if (!('toggleAttribute' in HTMLElement.prototype)) {
  HTMLElement.prototype.toggleAttribute = function (attr) {
    if (this.hasAttribute(attr)) {
      this.removeAttribute(attr);
    }
    else {
      this.setAttribute(attr, '');
    }
  }
}

perfArea.addEventListener('click', function () {
  this.toggleAttribute('animate');
});

document.getElementById('transition-example').addEventListener('click', function () {
  this.toggleAttribute('fill');
});

document.getElementById('animation-example').addEventListener('click', function () {
  this.toggleAttribute('animate');
});

[...document.querySelectorAll('[resize]')].forEach(el => ro.observe(el));
