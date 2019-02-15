# Resize Observer Polyfill

![](https://img.shields.io/circleci/project/github/juggle/resize-observer/master.svg?logo=circleci&style=for-the-badge)
![](https://img.shields.io/coveralls/github/juggle/resize-observer.svg?logoColor=white&style=for-the-badge)
![](https://img.shields.io/bundlephobia/minzip/@juggle/resize-observer.svg?colorB=%233399ff&style=for-the-badge)
![](https://img.shields.io/npm/l/@juggle/resize-observer.svg?colorB=%233399ff&style=for-the-badge)

A minimal library which polyfills the **ResizeObserver** API and is entirely based on the latest [Draft Specification](https://drafts.csswg.org/resize-observer-1/). Essentially, it detects when an element's size changes, allowing you to deal with it!

Check out the [Demo Playground](https://codesandbox.io/embed/myqzvpmmy9?hidenavigation=1&module=%2Fsrc%2Findex.js&view=preview)


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
This will use the [ponyfilled](https://github.com/sindresorhus/ponyfill) version of **ResizeObserver**, even if the browser supports **ResizeObserver** natively.

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

The latest standards allow for watching different box sizes. The box size option can be specified when observing an element. Options inlcude `border-box`, `content-box`, `scroll-box`, `device-pixel-border-box`.

`device-pixel-border-box` can only be used on `canvas` elements.
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

> **Warning:** The latest Resize Observer specification is not yet finalised and is subject to change.
> Any drastic changes to the specification will bump the major version of this library, as there will likely be breaking changes.


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

> **Warning:** Browsers with native support may be behind on the latest specification.


## Resize loop detection

Resize Observers have inbuilt protection against infinite resize loops.

If an element's observed box size changes again within the same resize loop, the observation will be skipped and an error event will be dispatched on the window.

```js
import ResizeObserver from '@juggle/resize-observer';

const ro = new ResizeObserver((entries, observer) => {
  // Changing the body size inside of the observer
  // will cause a resize loop and the next observation will be skipped
  document.body.style.width = '50%';
});

// Listen for errors
window.addEventListener('error', e => console.log(e.message));

// Observe the body
ro.observe(document.body);
```

## Notification Schedule
Notifications are scheduled after all other changes have occured and all other animation callbacks have been called. This allows the observer callback to get the most accurate size of an element, as no other changes should occur in the same frame.

![resize observer notification schedule](https://user-images.githubusercontent.com/1519516/52825409-87acb500-30b4-11e9-892c-482cc2a20d1e.jpg)



## How are differences detected?

To prevent constant polling, every frame. The DOM is queried whenever an event occurs which could cause an element to change its size. This could be when an element is clicked, a DOM Node is added, or, when an animation is running.

To cover these scenarios, there are two types of observation. The first is to listen to specific DOM events, including `resize`, `mousedown` and `focus` to name a few. The second is to listen for any DOM mutations that occur. This detects when a DOM node is added or removed, an attribute is modified, or, even when some text has changed.

This allows for greater idle time, when the application itself is idle.


## What's it good for?

- Building responsive applications.
- Creating self-aware, responsive Web Components.
- Making 3rd party libraries more responsive. e.g. charts and grids.
- Locking scroll position to the bottom of elements - useful for chat windows and logs.
- Canvas rendering (including HDPI).
- Many other things!


## Features

- Inbuilt resize loop protection.
- Supports pseudo classes `:hover`, `:active` and `:focus`.
- Supports transitions and animations, including infinite and long-running.
- Detects changes which occur during animation frame.
- Includes support for latest draft spec - observing different box sizes.
- Polls only when required, then shuts down automatically, reducing CPU usage.
- No notification delay - Notifications are batched and delivered immediately, before the next paint.


## Limitations

- No support for **IE10** and below. **IE11** is supported.
- Dynamic stylesheet changes may not be noticed.*
- Transitions with initial delays cannot be detected.*
- Animations and transitions with long periods of no change, will not be detected.*

\* If other interaction occurs, changes will be detected.


## Tested Browsers
| Browser Name     | Desktop | Mobile |
| ---------------- | ------- | ------ |
| Chrome           | ✓       | ✓      |
| Safari           | ✓       | ✓      |
| Firefox          | ✓       | ✓      |
| Opera            | ✓       | ✓      |
| Opera Mini       | N/A     | ✓      |
| Samsung Internet | N/A     | ✓      |
| IE11             | ✓       | N/A    |
| Edge             | ✓       | ✓      |


## TypeScript support

This library is written in TypeScript, however, it's compiled into JavaScript during release. Definition files are included in the package and should be picked up automatically to re-enable support in TypeScript projects.
