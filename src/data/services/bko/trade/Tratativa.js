import config from '../../../../core/config'
import Vue from 'vue'

const Tratativa = {
  loadCasosFechados: async function (almope, periodo) {
    const url = `${config.baseUrl}api/shared/backoffice/tratativa/meus_casos_fechados`

    const removerNull = obj => {
      for (let key in obj) {
        if (obj[key] === null || obj[key] === '') {
          obj[key] = '-'
        }
      }
    }

    try {
      const response = await Vue.prototype.$api.get(url, {
        params: { almope, periodo }
      })
      response.data.forEach(removerNull)
      return response.data ?? []
    } catch (error) {
      console.error('Erro ao carregar dados do card:', error)
      throw error
    }
  }
}

export { Tratativa }
