import ora from 'ora'
import toolEnv from './toolEnv'
import getUserConfig, { registerConfig } from './getUserConfig'
import { cleanFolder, copyFile, getFileOutputPath, getFilesPattern, writeFile } from './utils'
import getFilesPath from './getFilesPath'
import transform from './transform/transform'
import transformLess from './transform/transformLess'
import transformSass from './transform/transformSass'
import createDeclaration from './createDeclaration'

import type { Format } from './interface'

interface BuildOptions {
  cwd?: string
}

const build = async ({ cwd }: BuildOptions) => {
  if (!cwd) {
    cwd = process.cwd()
  }
  toolEnv.set({ cwd })

  registerConfig()

  const userConfig = getUserConfig()
  toolEnv.set({ userConfig })

  const { entry, pattern, outDir: outDirs, originalStyle = true } = userConfig

  // get files
  const filesPattern = getFilesPattern(entry, pattern)
  const filesProgress = ora('finding files').start()
  const filesPath = await getFilesPath(filesPattern)
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
    const lessFilesPath = await getFilesPath(lessFilesPattern)

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
      if (originalStyle) {
        lessProgress.text = `copy ${lessFilePath}`
        await copyFile(lessFilePath, outDir)
      }
    }
    lessProgress?.succeed('transform less succeed')

    // transform sass/scss
    const sassFilesPattern = getFilesPattern(entry, '**/*.*(scss|scss)')
    const sassFilesPath = await getFilesPath(sassFilesPattern)

    let sassProgress
    if (sassFilesPath.length !== 0) {
      sassProgress = ora('transform less file').start()
    }

    for (const sassFilePath of sassFilesPath) {
      sassProgress.text = `transform ${sassFilePath}`
      const result = await transformSass(sassFilePath)
      const outputPath = getFileOutputPath(sassFilePath, outDir, '.css')
      sassProgress.text = `writing ${outputPath}`
      await writeFile(outputPath, result)
      if (originalStyle) {
        sassProgress.text = `copy ${sassFilePath}`
        await copyFile(sassFilePath, outDir)
      }
    }
    sassProgress?.succeed('transform sass succeed')

    buildProgress.succeed(`${format} build completed`)
  }
  ora().succeed(`build completed`)
}

export default build
