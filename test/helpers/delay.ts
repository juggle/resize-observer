const delay = ((callback: () => void): void => {
  setTimeout(callback, 100);
})

export { delay }
