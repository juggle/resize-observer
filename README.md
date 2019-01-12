# ResizeObserver

A polyfill entirely based on the current **ResizeObserver** [Draft Specification](https://wicg.github.io/ResizeObserver).

> This is currently a work in progress and should be used for **testing only** at this stage.

## Installation
```shell
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



## Limitations

- No support for IE 10 and below (sorry all). IE 11 is supported.
- Dynamic stylesheet changes may not be noticed and updates will occur on the next user interaction.
- Currently no support for observations when `display:none` is toggled (coming soon).

## Similar Libraries

https://github.com/que-etc/resize-observer-polyfill

https://github.com/pelotoncycle/resize-observer