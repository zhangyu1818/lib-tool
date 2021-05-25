import kleur from 'kleur'

export const logError = (message: string) => {
  kleur.red(message)
}

export const internalLogError = (assert: boolean, message: string) => {
  if (!assert) {
    logError(`Internal error: ${message}`)
    process.exit(0)
  }
}
