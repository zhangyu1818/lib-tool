import path from 'path'
import fs from 'fs-extra'

export const getFileOutputPath = (filePath: string, outDir: string, ext: string = '.js') => {
  const { root, dir, name } = path.parse(filePath)
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
