import Vue from 'vue'

Vue.filter('percentage', function (value) {
  if (value) {
    let val = (value / 1).toFixed(2).replace('.', ',')
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '%'
  }
  return '0%'
})

Vue.filter('moneyBr', function (value) {
  if (value) {
    let val = value.replace('.', ',')
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }
  return '0,00'
})
