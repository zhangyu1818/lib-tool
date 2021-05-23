import * as sass from 'node-sass'
import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import toolEnv from '../toolEnv'
import { UserConfig } from '../interface'

const transformSass = async (filePath: string) => {
  const userConfig = toolEnv.get<UserConfig>('userConfig')!
  const { sassOptions } = userConfig

  return new Promise<sass.Result>((resolve, reject) =>
    sass.render(
      {
        ...sassOptions,
        file: filePath,
      },
      (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      }
    )
  )
    .then((result) => {
      const css = result.css.toString()
      return postcss([autoprefixer]).process(css, { from: undefined })
    })
    .then((result) => result.css)
}

export default transformSass
