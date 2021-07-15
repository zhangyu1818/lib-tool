import type { Options as SassOptions } from 'sass'
import type { TransformOptions } from '@babel/core'

export type Format = 'cjs' | 'esm'

export type OutDir = {
  [T in Format]?: string
}

type Mode = 'match' | 'dependence'

export interface UserConfig {
  entry?: string
  outDir?: OutDir
  mode?: Mode
  pattern?: string
  copyStyles?: boolean
  babelConfig?: (format: Format) => TransformOptions
  tsConfigPath?: string
  webpackConfigPath?: string
  filter?: (path: string) => boolean
  lessOptions?: Less.Options
  sassOptions?: Omit<SassOptions, 'file'>
}

export interface InternalConfig extends Required<Pick<UserConfig, 'entry' | 'pattern'>> {
  outDir: Required<OutDir>
}

export type Env = {
  cwd: string
  userConfig: UserConfig & InternalConfig
  mode?: Mode
  entry?: string
  outDir?: string
  format?: Format
}

export type BuildOptions = Partial<Omit<Env, 'userConfig'>>
