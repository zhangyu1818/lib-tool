import type { PluginItem } from '@babel/core'
import type { Options as SassOptions } from 'node-sass'
export type Format = 'cjs' | 'esm'

export type OutDir = {
  [T in Format]?: string
}

export interface UserConfig {
  entry?: string
  outDir?: OutDir
  pattern?: string
  browserslist?: string | string[] | { [key: string]: string }
  babelPlugins?: PluginItem[]
  copyOriginalStyle?: boolean
  onlyDependencyFile?:
    | boolean
    | {
        tsConfigPath?: string
        webpackConfigPath?: string
      }
  fileFilter?: (path: string) => boolean
  lessOptions?: Less.Options
  sassOptions?: Omit<SassOptions, 'file'>
}

export interface InternalConfig extends Required<Pick<UserConfig, 'entry' | 'pattern'>> {
  outDir: Required<OutDir>
}
