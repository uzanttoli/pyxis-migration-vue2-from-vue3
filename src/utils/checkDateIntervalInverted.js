const checkDateIntervalInverted = dates => {
  if (dates && dates.length === 2) {
    if (dates[0] > dates[1]) {
      return [dates[1], dates[0]]
    }
    return dates
  }
  return null
}

const formatedDate = arrayData => {
  let dataJoin = arrayData.join(' ~ ')
  let arrayInicio = []
  let arrayFim = []

  if (dataJoin.length == 23) {
    arrayInicio.push(dataJoin.toString().substring(0, 10).replaceAll('-', '/'))
    arrayFim.push(dataJoin.toString().substring(13, 23).replaceAll('-', '/'))
  }
  return [
    arrayInicio.toString().split('/').reverse().join('/'),
    arrayFim.toString().split('/').reverse().join('/')
  ]
}

export { checkDateIntervalInverted, formatedDate }
