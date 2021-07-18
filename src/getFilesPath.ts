import dependencyTree from 'dependency-tree'
import glob from 'glob'
import { getFileRootDir, getProjectPath, getTSConfigPath, getWebpackConfigPath, pathInNodeModules } from './utils'
import toolEnv from './toolEnv'

export const getFilesPath = (pattern: string): Promise<string[]> => {
  const cwd = toolEnv.get('cwd')
  return new Promise((resolve, reject) => {
    glob(
      pattern,
      {
        cwd,
        ignore: [
          'node_modules/**/*',
          '**/__tests__',
          '**/__mocks__',
          '**/__snapshots__',
          '**/*.test.*',
          '**/*.spec.*',
          '**/*.mock.*',
        ],
      },
      (error, files) => {
        if (error) {
          reject(error)
        } else {
          resolve(files)
        }
      }
    )
  })
}

export const getDependenciesPath = (filePath: string, filter?: (path: string) => boolean): string[] => {
  const directory = getProjectPath(getFileRootDir(filePath))
  const tsConfig = getTSConfigPath()
  const webpackConfig = getWebpackConfigPath()
  return dependencyTree.toList({
    filename: filePath,
    directory,
    tsConfig,
    webpackConfig,
    filter: (path) => {
      if (filter) {
        return !pathInNodeModules(path) && filter(path)
      }
      return !pathInNodeModules(path)
    },
  })
}

export default getFilesPath
