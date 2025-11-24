import config from '../../../core/config'
import Vue from 'vue'

const CampanhaOperacaoMasterService = {
  getAll: async function () {
    const url = `${config.pyxisReceptivoUrl}receptivo/campanha-operacao-master/listar`
    try {
      const response = await Vue.prototype.$api.get(url)
      return response.data ?? []
    } catch (error) {
      console.error('Erro ao carregar dados do card:', error)
      throw error
    }
  },
  getDistinct: async function () {
    const url = `${config.pyxisReceptivoUrl}receptivo/campanha-operacao-master/listar-colunas-distintas`
    try {
      const response = await Vue.prototype.$api.get(url)
      return response.data ?? {}
    } catch (error) {
      console.error('Erro ao carregar dados distintos do card:', error)
      throw error
    }
  }
}

export { CampanhaOperacaoMasterService }
