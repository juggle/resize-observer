const delay = ((callback: () => any): void => {
  setTimeout(callback, 100);
})

export { delay }
