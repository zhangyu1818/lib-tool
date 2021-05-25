import { join } from 'path'
import { existsSync } from 'fs'
import merge from 'lodash/merge'
import { CONFIG_FIES, DEFAULT_CONFIG } from './common'
import toolEnv from './toolEnv'
import { internalLogError } from './logger'

import type { InternalConfig, UserConfig } from './interface'

export const registerConfig = () => {
  const cwd = toolEnv.get<string>('cwd')

  internalLogError(cwd !== undefined, 'registerConfig cwd is not defined')

  require('@babel/register')({
    presets: ['@babel/preset-typescript', '@babel/preset-env'],
    extensions: ['.js', '.ts'],
    only: CONFIG_FIES.map((file) => join(cwd!, file)),
    babelrc: false,
    cache: false,
  })
}

const getDefaultEntry = () => {
  const defaultEntry = ['src/index.js', 'src/index.ts', 'src/index.jsx', 'src/index.tsx']
  for (const entry of defaultEntry) {
    if (existsSync(entry)) {
      return entry
    }
  }
  return defaultEntry[0]
}

const getUserConfig = (): UserConfig & InternalConfig => {
  const cwd = toolEnv.get<string>('cwd')

  internalLogError(cwd !== undefined, 'getUserConfig cwd is not defined')

  const defaultConfig = {
    ...DEFAULT_CONFIG,
    entry: getDefaultEntry(),
  }

  for (const file of CONFIG_FIES) {
    const filePath = join(cwd!, file)
    if (existsSync(filePath)) {
      const userConfig = require(filePath).default
      return merge(defaultConfig, userConfig)
    }
  }

  return defaultConfig
}

export default getUserConfig
