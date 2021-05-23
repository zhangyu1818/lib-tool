import * as ts from 'typescript'

type CreatedFiles = { [key: string]: string }

const createDeclaration = (filesPath: string[], outDir: string) => {
  const tsFilesPath = filesPath.filter((path) => path.endsWith('.ts') || path.endsWith('.tsx'))

  const createdFiles: CreatedFiles = {}
  const options = {
    declaration: true,
    emitDeclarationOnly: true,
    outDir,
  }
  const host = ts.createCompilerHost(options)
  host.writeFile = (fileName, data) => {
    createdFiles[fileName] = data
  }
  const program = ts.createProgram(
    tsFilesPath,
    {
      declaration: true,
      emitDeclarationOnly: true,
      outDir,
    },
    host
  )
  program.emit()
  return createdFiles
}

export default createDeclaration
