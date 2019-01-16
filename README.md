# ResizeObserver

![](https://img.shields.io/circleci/project/github/juggle/resize-observer/master.svg?logo=circleci&style=for-the-badge)
![](https://img.shields.io/coveralls/github/juggle/resize-observer.svg?logoColor=white&style=for-the-badge)
![](https://img.shields.io/bundlephobia/minzip/@juggle/resize-observer.svg?colorB=%233399ff&style=for-the-badge)
![](https://img.shields.io/npm/l/@juggle/resize-observer.svg?colorB=%233399ff&style=for-the-badge)

A polyfill entirely based on the current **ResizeObserver** [Draft Specification](https://wicg.github.io/ResizeObserver).


## Installation
``` shell
npm i @juggle/resize-observer
```

## Usage
``` js
import ResizeObserver from '@juggle/resize-observer';

const resizeObserver = new ResizeObserver((entries, observer) => {
  console.log('Something has resized!');
});
```
This will always use the polyfilled version of **ResizeObserver**, even if the browser supports **ResizeObserver** natively.


## Switching between native and polyfilled versions

You can check to see if the native version is available and switch between this and the polyfill to improve porformance on browsers with native support.

``` js
import ResizeObserverPolyfill from '@juggle/resize-observer';

const ResizeObserver = window.ResizeObserver || ResizeObserverPolyfill;

const resizeObserver = new ResizeObserver((entries, observer) => {
  console.log('Something has resized!');
});
```

## TypeScript Support

This library is written in TypeScript, however, it's compiled into JavaScript during release. Definition files are included in the package and should be picked up automatically to re-enable support in TypeScript projects.


## Limitations

- No support for **IE10** and below. **IE11** is supported.
- Dynamic stylesheet changes may not be noticed and updates will occur on the next user interaction.
- Currently no support for observations when `display:none` is toggled (coming soon).