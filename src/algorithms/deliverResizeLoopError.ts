const msg = 'ResizeObserver loop completed with undelivered notifications.';

interface LegacyEvent extends Event {
  message: string;
}

const deliverResizeLoopError = (): void => {
  let event;
  /* istanbul ignore else  */
  if (typeof ErrorEvent === 'function') {
    event = new ErrorEvent('error', {
      message: msg
    });
  }
  else { // Fallback to old style of event creation
    event = document.createEvent('Event') as LegacyEvent;
    event.initEvent('error', false, false);
    event.message = msg;
  }
  window.dispatchEvent(event);
}

export { deliverResizeLoopError };
