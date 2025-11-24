function replaceNulls(obj) {
  if (!obj) return
  const newObj = {}
  for (let key in obj) {
    if (obj[key] == null) {
      newObj[key] = '-'
    } else {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

export default replaceNulls
