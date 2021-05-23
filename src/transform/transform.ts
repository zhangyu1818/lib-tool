import * as babel from '@babel/core'
import toolEnv from '../toolEnv'
import { internalLogError } from '../logger'

import type { TransformOptions } from '@babel/core'
import type { Format, UserConfig } from '../interface'

const getTransformOptions = (format: Format): TransformOptions => {
  const userConfig = toolEnv.get<UserConfig>('userConfig')
  internalLogError(userConfig !== undefined, 'getTransformOptions userConfig is not defined')

  const { browserslist, babelPlugins } = userConfig!

  return {
    configFile: false,
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          modules: format === 'esm' ? false : 'auto',
          targets: browserslist,
        },
      ],
      require.resolve('@babel/preset-typescript'),
      ...(format === 'esm' ? [require.resolve('@babel/preset-react')] : []),
    ],
    plugins: babelPlugins,
  }
}

const transform = (filePath: string, format: Format) => {
  const transformOptions = getTransformOptions(format)
  return babel.transformFileAsync(filePath, transformOptions)
}

export default transform
