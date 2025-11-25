export default {
  install(app) {
    app.config.globalProperties.$filters = {
      percentage(value) {
        if (value) {
          let val = (value / 1).toFixed(2).replace('.', ',')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '%'
        }
        return '0%'
      },

      moneyBr(value) {
        if (value) {
          let val = value.replace('.', ',')
          return val.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          })
        }
        return '0,00'
      }
    }
  }
}
