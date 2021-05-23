const toolEnv = new Map<string, any>()

function set(key, value)
function set(values)
function set(...rest) {
  if (rest.length === 1) {
    const values = rest[0]
    Object.entries(values).forEach(([key, value]) => {
      toolEnv.set(key, value)
    })
  } else {
    toolEnv.set(rest[0], rest[1])
  }
}

function get<T>(key): T | undefined {
  return toolEnv.get(key)
}

export default { set, get }
