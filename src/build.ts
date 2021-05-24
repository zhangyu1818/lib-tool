import ora from 'ora'
import toolEnv from './toolEnv'
import getUserConfig, { registerConfig } from './getUserConfig'
import {
  cleanFolder,
  copyFile,
  getFileOutputPath,
  getFilesPattern,
  isCodeFile,
  isCSSFile,
  isLessFile,
  isSassFile,
  writeFile,
} from './utils'
import getFilesPath, { getDependenciesPath } from './getFilesPath'
import transform from './transform/transform'
import transformLess from './transform/transformLess'
import transformSass from './transform/transformSass'
import transformCSS from './transform/transformCSS'
import createDeclaration from './createDeclaration'

import type { Format } from './interface'

interface BuildOptions {
  cwd?: string
}

type FilesPath = string[]

const build = async ({ cwd }: BuildOptions) => {
  if (!cwd) {
    cwd = process.cwd()
  }
  toolEnv.set({ cwd })

  registerConfig()

  const userConfig = getUserConfig()
  toolEnv.set({ userConfig })

  const {
    entry,
    pattern,
    outDir: outDirs,
    copyOriginalStyle = true,
    onlyDependencyFile,
    fileFilter: userFileFilter,
  } = userConfig

  // get files
  const filesPattern = getFilesPattern(entry, pattern)
  const filesProgress = ora('finding files').start()

  let dependenciesList: FilesPath = []

  if (onlyDependencyFile) {
    dependenciesList = getDependenciesPath(entry, userFileFilter)
  }

  let filesPath: FilesPath = []
  if (onlyDependencyFile) {
    filesPath = dependenciesList.filter(isCodeFile)
  } else {
    filesPath = await getFilesPath(filesPattern)
  }
  if (userFileFilter) {
    filesPath = filesPath.filter(userFileFilter)
  }
  filesProgress.succeed()

  // build cjs,esm
  for (const [format, outDir] of Object.entries(outDirs)) {
    const clearProgress = ora(`cleaning ${outDir} folder`).start()
    await cleanFolder(outDir)
    clearProgress.succeed()

    const buildProgress = ora(`${format} building start`).start()

    for (const filePath of filesPath) {
      buildProgress.text = `transform ${filePath}`
      const result = await transform(filePath, format as Format)

      if (result) {
        const { code } = result
        const outputPath = getFileOutputPath(filePath, outDir)
        buildProgress.text = `writing ${outputPath}`
        await writeFile(outputPath, code)
      }
    }

    buildProgress.text = `writing declaration files`
    const declarationFiles = createDeclaration(filesPath, outDir)
    for (const [declarationFilePath, declarationFileContent] of Object.entries(declarationFiles)) {
      buildProgress.text = `writing ${declarationFilePath}`
      await writeFile(declarationFilePath, declarationFileContent)
    }

    // transform less
    const lessFilesPattern = getFilesPattern(entry, '**/*.less')
    let lessFilesPath: FilesPath = []
    if (onlyDependencyFile) {
      lessFilesPath = dependenciesList.filter(isLessFile)
    } else {
      lessFilesPath = await getFilesPath(lessFilesPattern)
    }

    if (userFileFilter) {
      lessFilesPath = lessFilesPath.filter(userFileFilter)
    }

    let lessProgress
    if (lessFilesPath.length !== 0) {
      lessProgress = ora('transform less file').start()
    }
    for (const lessFilePath of lessFilesPath) {
      lessProgress.text = `transform ${lessFilePath}`
      const result = await transformLess(lessFilePath)
      const outputPath = getFileOutputPath(lessFilePath, outDir, '.css')
      lessProgress.text = `writing ${outputPath}`
      await writeFile(outputPath, result)
      if (copyOriginalStyle) {
        lessProgress.text = `copy ${lessFilePath}`
        await copyFile(lessFilePath, outDir)
      }
    }
    lessProgress?.succeed('transform less succeed')

    // transform sass/scss
    const sassFilesPattern = getFilesPattern(entry, '**/*.*(sass|scss)')
    let sassFilesPath: FilesPath = []

    if (onlyDependencyFile) {
      sassFilesPath = dependenciesList.filter(isSassFile)
    } else {
      sassFilesPath = await getFilesPath(sassFilesPattern)
    }

    if (userFileFilter) {
      sassFilesPath = sassFilesPath.filter(userFileFilter)
    }

    let sassProgress
    if (sassFilesPath.length !== 0) {
      sassProgress = ora('transform sass file').start()
    }

    for (const sassFilePath of sassFilesPath) {
      sassProgress.text = `transform ${sassFilePath}`
      const result = await transformSass(sassFilePath)
      const outputPath = getFileOutputPath(sassFilePath, outDir, '.css')
      sassProgress.text = `writing ${outputPath}`
      await writeFile(outputPath, result)
      if (copyOriginalStyle) {
        sassProgress.text = `copy ${sassFilePath}`
        await copyFile(sassFilePath, outDir)
      }
    }
    sassProgress?.succeed('transform sass succeed')

    // transform css
    const cssFilesPattern = getFilesPattern(entry, '**/*.css')
    let cssFilesPath: FilesPath = []

    if (onlyDependencyFile) {
      cssFilesPath = dependenciesList.filter(isCSSFile)
    } else {
      cssFilesPath = await getFilesPath(cssFilesPattern)
    }

    if (userFileFilter) {
      cssFilesPath = cssFilesPath.filter(userFileFilter)
    }

    let cssProgress
    if (cssFilesPath.length !== 0) {
      cssProgress = ora('transform css file').start()
    }

    for (const cssFilePath of cssFilesPath) {
      cssProgress.text = `transform ${cssFilePath}`
      const result = await transformCSS(cssFilePath)
      const outputPath = getFileOutputPath(cssFilePath, outDir, '.css')
      cssProgress.text = `writing ${outputPath}`
      await writeFile(outputPath, result)
    }
    cssProgress?.succeed('transform css succeed')

    buildProgress.succeed(`${format} build completed`)
  }
  ora().succeed(`build completed`)
}

export default build
