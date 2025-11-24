/**
 * Mapeia e converte as chaves de um objeto com base em um mapa de chaves fornecido.
 *
 * @param {Object} obj - O objeto cujas chaves precisam ser mapeadas e convertidas.
 * @param {Object} keyMap - Um objeto que define o mapeamento de chaves antigas para novas chaves.
 * @returns {Object} Um novo objeto com chaves convertidas de acordo com o mapa de chaves.
 */
export function mapAndConvertKeys(obj, keyMap) {
  return Object.keys(obj).reduce((acc, key) => {
    if (keyMap[key]) {
      const newKey = keyMap[key]
      acc[newKey] = obj[key]
    }
    return acc
  }, {})
}

/**
 * Inverte o mapeamento e converte as chaves de um objeto com base em um mapa de chaves fornecido.
 *
 * @param {Object} obj - O objeto cujas chaves precisam ser mapeadas e convertidas.
 * @param {Object} keyMap - Um objeto que define o mapeamento de novas chaves para chaves antigas.
 * @returns {Object} Um novo objeto com chaves convertidas de acordo com o mapa de chaves invertido.
 */
export function reverseMapAndConvertKeys(obj, keyMap) {
  const reversedKeyMap = Object.keys(keyMap).reduce((acc, key) => {
    acc[keyMap[key]] = key
    return acc
  }, {})

  return Object.keys(obj).reduce((acc, key) => {
    if (reversedKeyMap[key]) {
      const newKey = reversedKeyMap[key]
      acc[newKey] = obj[key]
    }
    return acc
  }, {})
}
