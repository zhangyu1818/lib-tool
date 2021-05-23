import type { PluginItem } from '@babel/core'

export type Format = 'cjs' | 'esm'

export type OutDir = {
  [T in Format]?: string
}

export interface UserConfig {
  entry?: string
  outDir?: OutDir
  pattern?: string
  browserslist?: string | string[] | { [key: string]: string }
  plugins?: PluginItem[]
}

export interface InternalConfig extends Required<Pick<UserConfig, 'entry' | 'pattern'>> {
  outDir: Required<OutDir>
}
