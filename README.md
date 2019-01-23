# ResizeObserver

![](https://img.shields.io/circleci/project/github/juggle/resize-observer/master.svg?logo=circleci&style=for-the-badge)
![](https://img.shields.io/coveralls/github/juggle/resize-observer.svg?logoColor=white&style=for-the-badge)
![](https://img.shields.io/bundlephobia/minzip/@juggle/resize-observer.svg?colorB=%233399ff&style=for-the-badge)
![](https://img.shields.io/npm/l/@juggle/resize-observer.svg?colorB=%233399ff&style=for-the-badge)

A minimal library which polyfills the **ResizeObserver** API and is entirely based on the latest [Draft Specification](https://drafts.csswg.org/resize-observer-1/).

This library observes elements and dispatches notifications when their dimensions change. Differences are only calculated during animation, or, after DOM mutation or user interaction has occurred, keeping CPU and power consumption minimal.

[Demo Playground](https://codesandbox.io/embed/myqzvpmmy9?hidenavigation=1&module=%2Fsrc%2Findex.js&view=preview)


## Installation
``` shell
npm i @juggle/resize-observer
```

## Basic usage
``` js
import ResizeObserver from '@juggle/resize-observer';

const ro = new ResizeObserver((entries, observer) => {
  console.log('Body has resized!');
  observer.disconnect(); // Stop observing
});

ro.observe(document.body); // Watch dimension changes on body
```
This will use the ponyfilled version of **ResizeObserver**, even if the browser supports **ResizeObserver** natively.

## Watching multiple elements
``` js
import ResizeObserver from '@juggle/resize-observer';

const ro = new ResizeObserver((entries, observer) => {
  console.log('Elements resized:', entries.length);
  entries.forEach((entry, index) => {
    const { width, height } = entry.contentRect;
    console.log(`Element ${index + 1}:`, `${width}x${height}`);
  });
});

const els = docuent.querySelectorAll('.resizes');
[...els].forEach(el => ro.observe(el)); // Watch multiple!
```

## Watching different box sizes

The latest standards allow for watching different box sizes. The box size option can be specified when observing an element. Options inlcude `border-box` `content-box` `scroll-box` `device-pixel-border-box`. `device-pixel-border-box` can only be used on a `canvas` element.
``` js
import ResizeObserver from '@juggle/resize-observer';

const ro = new ResizeObserver((entries, observer) => {
  console.log('Elements resized:', entries.length);
  entries.forEach((entry, index) => {
    const { inlineSize, blockSize } = entry.borderBoxSize;
    console.log(`Element ${index + 1}:`, `${inlineSize}x${blockSize}`);
  });
});

const observerOptions = {
  box: 'border-box'
};

const els = docuent.querySelectorAll('.resizes');
[...els].forEach(el => ro.observe(el, observerOptions)); // Watch multiple!
```


## Switching between native and polyfilled versions

You can check to see if the native version is available and switch between this and the polyfill to improve porformance on browsers with native support.

``` js
import ResizeObserverPolyfill from '@juggle/resize-observer';

const ResizeObserver = window.ResizeObserver || ResizeObserverPolyfill;

// Uses native or polyfill, depending on browser support
const ro = new ResizeObserver((entries, observer) => {
  console.log('Something has resized!');
});
```

## What's it good for?
- Building responsive websites.
- Creating 'self-aware' Web Components.
- Making 3rd party libraries more responsive. e.g. charts and grids.
- Many other things!


## Limitations

- No support for **IE10** and below. **IE11** is supported.
- Dynamic stylesheet changes may not be noticed and updates will occur on the next user interaction.
- Currently no support for observations when `display:none` is toggled (coming soon).


## TypeScript support

This library is written in TypeScript, however, it's compiled into JavaScript during release. Definition files are included in the package and should be picked up automatically to re-enable support in TypeScript projects.
