import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import { DEFAULT_EXTENSIONS } from '@babel/core';

const onwarn = (warning) => {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    console.error(`(!) ${warning.message}`);
  }
};

export default [{
  input: 'src/ResizeObserver.ts',
  output: {
    file: './lib/ResizeObserver.js',
    format: 'esm'
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
      clean: true
    })
  ],
  onwarn
},
{
  input: 'src/ResizeObserver.ts',
  output: {
    file: './umd/ResizeObserver.js',
    exports: 'named',
    name: 'ResizeObserver',
    format: 'umd'
  },
  plugins: [
    typescript({
      typescript: require('typescript'),
      clean: true
    }),
    babel({
      'presets': [
        ['@babel/env', { 'modules' : false }]
      ],
      extensions: [
        ...DEFAULT_EXTENSIONS,
        'ts',
        'tsx'
      ]
    })
  ],
  onwarn
}]
