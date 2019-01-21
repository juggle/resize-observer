// Basic find function, to support IE
const find = function (this: any[], checkFn: any) {
  for (let i = 0; i < this.length; i += 1) {
    if (checkFn(this[i], i)) {
      return this[i];
    }
  }
};

// Basic findIndex function, to support IE
const findIndex = function (this: any[], checkFn: any) {
  for (let i = 0; i < this.length; i += 1) {
    if (checkFn(this[i], i)) {
      return i;
    }
  }
  return -1;
};

export { find, findIndex };
