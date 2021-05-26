import * as babel from '@babel/core'
import * as ts from 'typescript'
import path from 'path'
import toolEnv from '../toolEnv'
import { internalLogError } from '../logger'
import { getFileRootDir, getTSConfigPath, getWebpackConfigPath, hasBrowserslistConfig, isTsFile } from '../utils'

import type { TransformOptions } from '@babel/core'
import type { Format, UserConfig } from '../interface'

const getModuleResolverAlias = () => {
  const alias: Record<string, string> = {}
  const tsConfigFilePath = getTSConfigPath()
  if (tsConfigFilePath) {
    const tsParsedConfig = ts.readJsonConfigFile(tsConfigFilePath, ts.sys.readFile)
    const compilerOptions = ts.parseJsonSourceFileConfigFileContent(tsParsedConfig, ts.sys, tsConfigFilePath).options
    const configPaths = compilerOptions.paths
    if (configPaths) {
      Object.entries(configPaths).forEach(([key, paths]) => {
        if (paths[0]) {
          // only use first path alias
          alias[key] = paths[0]
        }
      })
    }
  }
  const webpackConfigFilePath = getWebpackConfigPath()
  if (webpackConfigFilePath) {
    const webpackConfig = require(webpackConfigFilePath)
    if (Array.isArray(webpackConfig)) {
      for (const config of webpackConfig) {
        const webpackAlias = config?.resolve?.alias
        if (webpackAlias) {
          Object.assign(alias, webpackAlias)
        }
      }
    } else {
      const webpackAlias = webpackConfig?.resolve?.alias
      if (webpackAlias) {
        Object.assign(alias, webpackAlias)
      }
    }
  }
  return alias
}

const getTransformOptions = (format: Format): TransformOptions => {
  const userConfig = toolEnv.get<UserConfig>('userConfig')
  internalLogError(userConfig !== undefined, 'getTransformOptions userConfig is not defined')

  const { browserslist, babelPlugins = [], entry, alias: userAlias } = userConfig!

  const configsAlias = getModuleResolverAlias()

  const rootDir = getFileRootDir(entry!)

  if (userAlias) {
    Object.assign(configsAlias, userAlias)
  }

  const isTSX = isTsFile()

  return {
    configFile: false,
    presets: [
      [
        require.resolve('@babel/preset-typescript'),
        {
          isTSX,
          allExtensions: isTSX,
        },
      ],
      require.resolve('@babel/preset-react'),
      [
        require.resolve('@babel/preset-env'),
        {
          modules: format === 'esm' ? false : 'auto',
          targets:
            browserslist ?? hasBrowserslistConfig()
              ? undefined
              : {
                  browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 11'],
                },
        },
      ],
    ],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: [path.join('.', rootDir)],
          alias: configsAlias,
        },
      ],
      ...(typeof babelPlugins === 'function' ? babelPlugins(format) : babelPlugins),
    ],
  }
}

const transform = (filePath: string, format: Format) => {
  const transformOptions = getTransformOptions(format)
  return babel.transformFileAsync(filePath, transformOptions)
}

export default transform
