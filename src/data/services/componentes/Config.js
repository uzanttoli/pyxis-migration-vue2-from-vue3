import config from '../../../core/config'
import Vue from 'vue'

const ComponentesConfig = {
  listarComponents: async function (produto, relatorio) {
    try {
      let url = `${config.baseUrl}api/shared/config/config_components/${produto}/${relatorio}`
      const response = await Vue.prototype.$api.get(url)
      return response.data ?? []
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      throw error
    }
  }
}

export { ComponentesConfig }
