import config from '../../../core/config'
import Vue from 'vue'

const DesconexaoChamadas = {
  loadCardData: async function (periodo, usuario, perfil) {
    const url = `${config.baseUrl}api/shared/retencao/desc_x_chamadas/dados_card`

    try {
      const response = await Vue.prototype.$api.get(url, {
        params: {
          almope: usuario,
          periodo: periodo,
          perfil: perfil
        }
      })

      return response.data ?? []
    } catch (error) {
      console.error('Erro ao carregar dados do card:', error)
      throw error
    }
  },
  loadDataTable: async function (api, objectParams) {
    try {
      const url = `${config.baseUrl}${api}`
      const response = await Vue.prototype.$api.get(url, {
        params: { ...objectParams }
      })
      return response.data
    } catch (error) {
      console.error('Erro ao carregar dados do card:', error)
      throw error
    }
  }
}

export { DesconexaoChamadas }
