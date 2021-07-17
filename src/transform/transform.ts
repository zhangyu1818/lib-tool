import * as babel from '@babel/core'
import { isTsFile } from '../utils'
import toolEnv from '../toolEnv'

import type { TransformOptions } from '@babel/core'
import type { Format } from '../interface'

export const defaultBabelConfig = (format: Format) => {
  const isTSX = isTsFile()
  return {
    presets: [
      [
        require.resolve('@babel/preset-typescript'),
        {
          isTSX,
          allExtensions: isTSX,
        },
      ],
      require.resolve('@babel/preset-react'),
      [
        require.resolve('@babel/preset-env'),
        {
          modules: format === 'esm' ? false : 'auto',
          targets: {
            browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 11'],
          },
        },
      ],
    ],
  }
}

const getTransformOptions = (format: Format): TransformOptions => {
  const userConfig = toolEnv.get('userConfig')

  const { babelConfig = defaultBabelConfig } = userConfig!

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
