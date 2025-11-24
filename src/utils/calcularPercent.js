const calcularPercentual = (value1, value2, decimals = 2, concat = true) => {
  if (typeof value1 !== 'number' || typeof value2 !== 'number') {
    throw new Error('Os valores de entrada devem ser números.')
  }
  if (value2 === 0) {
    throw new Error('O divisor (value2) não pode ser zero.')
  }

  let result = (value1 / value2) * 100

  result = parseFloat(result.toFixed(decimals))

  return concat ? `${result}%` : result
}

export { calcularPercentual }
