import kleur from 'kleur'

export const internalLogError = (assert: boolean, message: string) => {
  if (!assert) {
    kleur.red(`Internal error: ${message}`)
    process.exit(0)
  }
}
