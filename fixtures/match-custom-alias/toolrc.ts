import { babelConfig } from '../../src'

export default {
  babelConfig: (format) => ({
    ...babelConfig(format),
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: '.',
          alias: {
            '@util': './src/util',
          },
        },
      ],
    ],
  }),
  outDir: {
    cjs: './dist/lib',
    esm: './dist/es',
  },
}
