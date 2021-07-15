import type { Env } from './interface'

const toolEnv = {} as Env

function set<K extends keyof Env>(key: K, value: Env[K])
function set(values: Partial<Env>)
function set(...rest) {
  if (rest.length === 1) {
    const values = rest[0]
    Object.entries(values).forEach(([key, value]) => {
      toolEnv[key] = value
    })
  } else {
    toolEnv[rest[0]] = rest[1]
  }
}

function get<K extends keyof Env>(key: K): Env[K] {
  return toolEnv[key]
}

export default { set, get }
