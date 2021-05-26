import { existsSync } from 'fs'
import merge from 'lodash/merge'
import { CONFIG_FIES, DEFAULT_CONFIG } from './common'
import { getProjectPath } from './utils'

import type { InternalConfig, UserConfig } from './interface'

export const registerConfig = () => {
  require('@babel/register')({
    presets: ['@babel/preset-typescript', '@babel/preset-env'],
    extensions: ['.js', '.ts'],
    only: CONFIG_FIES.map((file) => getProjectPath(file)),
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
  const defaultConfig = {
    ...DEFAULT_CONFIG,
    entry: getDefaultEntry(),
  }

  for (const file of CONFIG_FIES) {
    const filePath = getProjectPath(file)
    if (existsSync(filePath)) {
      const userConfig = require(filePath).default
      return merge(defaultConfig, userConfig)
    }
  }

  return defaultConfig
}

export default getUserConfig
