import * as babel from '@babel/core'
import toolEnv from '../toolEnv'

import type { TransformOptions } from '@babel/core'
import type { Format } from '../interface'

const getTransformOptions = (format: Format): TransformOptions => {
  const userConfig = toolEnv.get('userConfig')

  const { babelConfig } = userConfig!

  return {
    configFile: false,
    ...babelConfig?.(format),
  }
}

const transform = (filePath: string, format: Format) => {
  const transformOptions = getTransformOptions(format)
  return babel.transformFileAsync(filePath, transformOptions)
}

export default transform
