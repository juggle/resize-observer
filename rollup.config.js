import path from 'path'
import typescript from 'rollup-plugin-typescript2'

export default async () => {
  return {
    input: './src/ResizeObserver.ts',
    output: [
      {
        format: 'cjs',
        file: path.resolve(__dirname, 'lib', `ResizeObserver.js`),
      },
      {
        format: 'es',
        file: path.resolve(__dirname, 'lib', `ResizeObserver.esm.js`),
      },
    ],
    plugins: [typescript()],
  }
}
