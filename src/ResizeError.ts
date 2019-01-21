class ResizeError {
  public static Event(message: string): ErrorEvent {
    /* istanbul ignore else  */
    if (typeof ErrorEvent === 'function') {
      return new ErrorEvent('error', {
        message: message
      });
    }
    else { // Fallback to old style of event creation
      const event = document.createEvent('Event') as any;
      event.initEvent('error', false, false);
      event.message = message;
      return event as ErrorEvent;
    }
  }
}

export { ResizeError };
