import ora from 'ora'
import toolEnv from './toolEnv'
import getUserConfig, { registerConfig } from './getUserConfig'
import { cleanFolder, getFileOutputPath, getFilesPattern, writeFile } from './utils'
import getFilesPath from './getFilesPath'
import transform from './transform'
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

  const { entry, pattern, outDir: outDirs } = userConfig

  // get files
  const filesPattern = getFilesPattern(entry, pattern)
  const filesProgress = ora('finding files').start()
  const filesPath = await getFilesPath(filesPattern)
  filesProgress.succeed()

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
    buildProgress.succeed(`${format} build completed`)
  }
  ora().succeed(`build completed`)
}

export default build
