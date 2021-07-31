import typescript from '@rollup/plugin-typescript';

module.exports = [{
  input: 'src/exports/resize-observer.ts',
  output: {
    file: 'lib/resize-observer.mjs',
    format: 'esm'
  },
  plugins: [typescript()]
}, {
  input: 'src/exports/resize-observer.ts',
  output: {
    file: 'lib/resize-observer.js',
    format: 'umd',
    name: 'window',
    extend: true,
  },
  plugins: [typescript()]
}];
