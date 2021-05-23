import path from 'path'
import fs from 'fs-extra'

export const getFileOutputPath = (filePath: string, outDir: string) => {
  const { root, dir, name } = path.parse(filePath)
  const basePath = dir.split(path.sep).slice(1)
  return path.join(root, outDir, ...basePath, `${name}.js`)
}

export const getFilesPattern = (entryPath: string, pattern: string) => {
  const { dir } = path.parse(entryPath)
  return path.join(dir, pattern)
}

export const writeFile = (filePath: string, data: any) => {
  return fs.outputFile(filePath, data)
}

export const cleanFolder = (path: string) => fs.emptydir(path)
