import path from 'path'
import fs from 'fs-extra'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'

import toolEnv from '../toolEnv'
import { internalLogError } from '../logger'

const transformCSS = async (filePath: string) => {
  const cwd = toolEnv.get<string>('cwd')!
  internalLogError(cwd !== undefined, 'transformCSS cwd is not defined')

  const resolvedFilePath = path.resolve(cwd, filePath)
  const css = fs.readFileSync(resolvedFilePath, 'utf-8')

  return postcss([autoprefixer])
    .process(css, { from: undefined })
    .then((result) => result.css)
}

export default transformCSS
