import type { InternalConfig } from './interface'

export const DEFAULT_EXTENSIONS = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx']

export const CONFIG_FIES = ['toolrc.js', 'toolrc.ts']

export const DEFAULT_PATTERN = '**/*.*(js|ts|jsx|tsx)'

export const DEFAULT_CONFIG: InternalConfig = {
  entry: 'src/index.js',
  outDir: {
    esm: 'es',
    cjs: 'lib',
  },
  pattern: DEFAULT_PATTERN,
}
