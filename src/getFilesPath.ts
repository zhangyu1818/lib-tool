import glob from 'glob'

const getFilesPath = (pattern: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    glob(
      pattern,
      { ignore: ['**/__tests__', '**/__mocks__', '**/__snapshots__', '**/*.test.*', '**/*.spec.*', '**/*.mock.*'] },
      (error, files) => {
        if (error) {
          reject(error)
        } else {
          resolve(files)
        }
      }
    )
  })
}

export default getFilesPath
