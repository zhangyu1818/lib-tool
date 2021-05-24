import path from 'path'
import fs from 'fs-extra'
import { DEFAULT_EXTENSIONS } from './common'
import toolEnv from './toolEnv'

import type { UserConfig } from './interface'

export const getFileRootDir = (filePath: string) => {
  const { dir } = path.parse(path.join(filePath))
  return dir.split(path.sep)[0]
}

export const getFileOutputPath = (filePath: string, outDir: string, ext: string = '.js') => {
  const { root, dir, name } = path.parse(path.join(filePath))
  const basePath = dir.split(path.sep).slice(1)
  return path.join(root, outDir, ...basePath, `${name}${ext}`)
}

export const getFilesPattern = (entryPath: string, pattern: string) => {
  const { dir } = path.parse(entryPath)
  return path.join(dir, pattern)
}

export const writeFile = (filePath: string, data: any) => {
  return fs.outputFile(filePath, data)
}

export const copyFile = (filePath: string, outDir: string) => {
  const { root, dir, base } = path.parse(filePath)
  const basePath = dir.split(path.sep).slice(1)
  const resultPath = path.join(root, outDir, ...basePath, base)
  return fs.copyFile(filePath, resultPath)
}

export const cleanFolder = (path: string) => fs.emptydir(path)

export const getRelativePath = (filePath: string) => {
  const cwd = toolEnv.get<string>('cwd') ?? process.cwd()
  return path.relative(cwd, filePath)
}

export const pathInNodeModules = (path: string) => path.includes('node_modules')

export const isCodeFile = (path: string) => DEFAULT_EXTENSIONS.some((ext) => path.endsWith(ext))

export const isLessFile = (path: string) => path.endsWith('.less')

export const isSassFile = (path: string) => path.endsWith('.sass') || path.endsWith('.scss')

export const isCSSFile = (path: string) => path.endsWith('.css')

export const getTSConfigPath = () => {
  // user config
  const userConfig = toolEnv.get<UserConfig>('userConfig')
  const config = userConfig?.onlyDependencyFile
  if (typeof config === 'object') {
    const userTsConfigPath = config.tsConfigPath ?? ''
    if (fs.existsSync(userTsConfigPath)) {
      return userTsConfigPath
    }
  }
  // try to get config path
  const cwd = toolEnv.get<string>('cwd') ?? process.cwd()
  const configPath = path.join(cwd, 'tsconfig.json')
  if (fs.existsSync(configPath)) {
    return configPath
  }
}

export const getWebpackConfigPath = () => {
  const userConfig = toolEnv.get<UserConfig>('userConfig')
  const config = userConfig?.onlyDependencyFile
  if (typeof config === 'object') {
    const userWebpackConfigPath = config.webpackConfigPath ?? ''
    if (fs.existsSync(userWebpackConfigPath)) {
      return userWebpackConfigPath
    }
  }
  const cwd = toolEnv.get<string>('cwd') ?? process.cwd()
  const configPath = path.join(cwd, 'webpack.config.js')
  if (fs.existsSync(configPath)) {
    return configPath
  }
}
