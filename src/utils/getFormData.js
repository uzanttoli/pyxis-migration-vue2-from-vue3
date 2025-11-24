export function getFormData(data) {
  return Object.keys(data).reduce((FormData, key) => {
    FormData.append(key, data[key])
    return FormData
  }, new FormData())
}
