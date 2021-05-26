import type { PluginItem } from '@babel/core'
import type { Options as SassOptions } from 'sass'
export type Format = 'cjs' | 'esm'

export type OutDir = {
  [T in Format]?: string
}

export interface UserConfig {
  /**
   * entry path
   */
  entry?: string
  /**
   * output folder name
   */
  outDir?: OutDir
  /**
   * pattern used to match files, only on 'onlyDependencyFile = false'
   */
  pattern?: string
  browserslist?: string | string[] | { [key: string]: string }
  babelPlugins?: PluginItem[] | ((format: Format) => PluginItem[])
  /**
   * copy original style file to outDir,default true
   */
  copyOriginalStyle?: boolean
  /**
   * lib-tool default matches files using the pattern,
   * this option will only matches dependent files.
   */
  onlyDependencyFile?: boolean
  tsConfigPath?: string
  webpackConfigPath?: string
  /**
   * file resolve alias
   */
  alias?: Record<string, string>
  /**
   * filter files
   */
  fileFilter?: (path: string) => boolean
  lessOptions?: Less.Options
  sassOptions?: Omit<SassOptions, 'file'>
}

export interface InternalConfig extends Required<Pick<UserConfig, 'entry' | 'pattern'>> {
  outDir: Required<OutDir>
}
