import { resolve } from 'path'
import glob from 'glob'
import { build } from '../src'

export default async () => {
  const dirsPath = resolve(__dirname)
  const dirs = glob.sync('*', { cwd: dirsPath, absolute: true, ignore: 'build.ts' })
  for (const dir of dirs) {
    await build({ cwd: dir })
  }
}
