# Resize Observer Polyfill

![](https://img.shields.io/circleci/project/github/juggle/resize-observer/master.svg?logo=circleci&style=for-the-badge)
![](https://img.shields.io/coveralls/github/juggle/resize-observer.svg?logoColor=white&style=for-the-badge)
![](https://img.shields.io/bundlephobia/minzip/@juggle/resize-observer.svg?colorB=%233399ff&style=for-the-badge)
![](https://img.shields.io/npm/l/@juggle/resize-observer.svg?colorB=%233399ff&style=for-the-badge)

A minimal library which polyfills the **ResizeObserver** API and is entirely based on the latest [Draft Specification](https://drafts.csswg.org/resize-observer-1/).

It immediately detects when an element resizes and provides accurate sizing information back to the handler. Check out the [Example Playground](//juggle.studio/resize-observer) for more information on usage and performance.

> The latest [Resize Observer specification](https://drafts.csswg.org/resize-observer-1/) is not yet finalised and is subject to change.
> Any drastic changes to the specification will bump the major version of this library, as there will likely be breaking changes.


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
    const { inlineSize, blockSize } = entry.contentBoxSize;
    console.log(`Element ${index + 1}:`, `${inlineSize}x${blockSize}`);
  });
});

const els = document.querySelectorAll('.resizes');
[...els].forEach(el => ro.observe(el)); // Watch multiple!
```

## Watching different box sizes

The latest standards allow for watching different box sizes. The box size option can be specified when observing an element. Options include `border-box` and `content-box` (default).
``` js
import ResizeObserver from '@juggle/resize-observer';

const ro = new ResizeObserver((entries, observer) => {
  console.log('Elements resized:', entries.length);
  entries.forEach((entry, index) => {
    const { inlineSize, blockSize } = entry.borderBoxSize;
    console.log(`Element ${index + 1}:`, `${inlineSize}x${blockSize}`);
  });
});

// Watch border-box
const observerOptions = {
  box: 'border-box'
};

const els = document.querySelectorAll('.resizes');
[...els].forEach(el => ro.observe(el, observerOptions));
```

## Using the legacy version (`contentRect`)

Early versions of the API return a `contentRect`. This is still made available for backwards compatibility.

``` js
import ResizeObserver from '@juggle/resize-observer';

const ro = new ResizeObserver((entries, observer) => {
  console.log('Elements resized:', entries.length);
  entries.forEach((entry, index) => {
    const { width, height } = entry.contentRect;
    console.log(`Element ${index + 1}:`, `${width}x${height}`);
  });
});

const els = document.querySelectorAll('.resizes');
[...els].forEach(el => ro.observe(el));
```

> This is a **deprecated** feature and will possibly be removed in later versions.


## Switching between native and polyfilled versions

You can check to see if the native version is available and switch between this and the polyfill to improve performance on browsers with native support.

``` js
import { ResizeObserver as Polyfill } from '@juggle/resize-observer';

const ResizeObserver = window.ResizeObserver || Polyfill;

// Uses native or polyfill, depending on browser support.
const ro = new ResizeObserver((entries, observer) => {
  console.log('Something has resized!');
});
```

To improve this even more, you could use dynamic imports to only load the file when the polyfill is required.

``` js
(async () => {
  if ('ResizeObserver' in window === false) {
    // Loads polyfill asynchronously, only if required.
    const module = await import('@juggle/resize-observer');
    window.ResizeObserver = module.ResizeObserver;
  }
  // Uses native or polyfill, depending on browser support.
  const ro = new ResizeObserver((entries, observer) => {
    console.log('Something has resized!');
  });
})();
```

> Browsers with native support may be behind on the latest specification.
> Use `entry.contentRect` when switching between native and polyfilled versions.


## Resize loop detection

Resize Observers have inbuilt protection against infinite resize loops.

If an element's observed box size changes again within the same resize loop, the observation will be skipped and an error event will be dispatched on the window. Elements with undelivered notifications will be considered for delivery in the next loop.

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
Notifications are scheduled after all other changes have occurred and all other animation callbacks have been called. This allows the observer callback to get the most accurate size of an element, as no other changes should occur in the same frame.

![resize observer notification schedule](https://user-images.githubusercontent.com/1519516/52825568-20433500-30b5-11e9-9854-4cee13a09a7d.jpg)



## How are differences detected?

To prevent constant polling, every frame. The DOM is queried whenever an event occurs which could cause an element to change its size. This could be when an element is clicked, a DOM Node is added, or, when an animation is running.

To cover these scenarios, there are two types of observation. The first is to listen to specific DOM events, including `resize`, `mousedown` and `focus` to name a few. The second is to listen for any DOM mutations that occur. This detects when a DOM node is added or removed, an attribute is modified, or, even when some text has changed.

This allows for greater idle time, when the application itself is idle.


## What's it good for?

- Building responsive applications.
- Creating self-aware, responsive Web Components.
- Making 3rd party libraries more responsive. e.g. charts and grids.
- Locking scroll position to the bottom of elements - useful for chat windows and logs.
- Resizing iframes to match their content.
- Canvas rendering.
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

- Dynamic stylesheet changes may not be noticed.*
- Transitions with initial delays cannot be detected.*
- Animations and transitions with long periods of no change, will not be detected.*
- No support for **IE10** and below. **IE11** is supported.

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

This library is written in TypeScript and contains all definition files for support in TypeScript applications.
