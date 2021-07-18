import glob from 'glob'
import { readFileSync, existsSync } from 'fs-extra'
import { sep, join } from 'path'

describe('build result test', () => {
  const dirs = glob.sync('fixtures/*', { absolute: true, ignore: 'fixtures/build.ts' })
  dirs.forEach((dirPath) => {
    const dirSplit = dirPath.split(sep)
    it(`${dirSplit[dirSplit.length - 1]} should equal`, () => {
      const expectFilesPath = join(dirPath, 'expected')
      const actualFilesPath = join(dirPath, 'dist')

      const expectFiles = glob.sync('**/*', { cwd: expectFilesPath, nodir: true })
      const actualFiles = glob.sync('**/*', { cwd: actualFilesPath, nodir: true })

      expect(expectFiles.length).toBe(actualFiles.length)

      expectFiles.forEach((file) => {
        expect(existsSync(join(actualFilesPath, file))).toBeTruthy()
        const expectFileContent = readFileSync(join(expectFilesPath, file), 'utf-8')
        const actualFileContent = readFileSync(join(actualFilesPath, file), 'utf-8')
        expect(expectFileContent).toEqual(actualFileContent)
      })
    })
  })
})
