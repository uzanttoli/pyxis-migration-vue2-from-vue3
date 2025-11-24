export function convertKeysToUpperCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToUpperCase)
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key.toUpperCase()] = convertKeysToUpperCase(obj[key])
      return acc
    }, {})
  }
  return obj
}
