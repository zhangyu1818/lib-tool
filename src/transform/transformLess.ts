import path from 'path'
import fs from 'fs-extra'
import less from 'less'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'

import toolEnv from '../toolEnv'

const transformLess = async (filePath: string) => {
  const cwd = toolEnv.get('cwd')!

  const userConfig = toolEnv.get('userConfig')!
  const { lessOptions: userLessOptions = {} } = userConfig

  const resolvedFilePath = path.resolve(cwd, filePath)
  const data = fs.readFileSync(resolvedFilePath, 'utf-8')

  const lessOptions: Less.Options = {
    javascriptEnabled: true,
    ...userLessOptions,
    paths: [path.dirname(resolvedFilePath), ...(userLessOptions.paths ?? [])],
    filename: resolvedFilePath,
  }

  return less
    .render(data, lessOptions)
    .then(({ css }) => postcss([autoprefixer]).process(css, { from: undefined }))
    .then((result) => result.css)
}

export default transformLess
