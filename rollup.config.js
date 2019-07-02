import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'lib/ResizeObserver',
  output: {
    file: './umd/ResizeObserver.js',
    exports: 'named',
    name: 'ResizeObserver',
    format: 'umd'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      'presets': [
        ['@babel/env', { 'modules' : false }]
      ]
    })
  ]
}
