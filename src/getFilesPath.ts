import glob from 'glob'

const getFilesPath = (pattern: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    glob(pattern, (error, files) => {
      if (error) {
        reject(error)
      } else {
        resolve(files)
      }
    })
  })
}

export default getFilesPath
