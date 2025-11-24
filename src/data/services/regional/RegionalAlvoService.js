import Vue from 'vue'
import config from '../../../core/config.js'

const RegionalAlvoService = {
  /**
   * Recupera todos os itens de regionais disponíveis.
   * @returns {Promise<Array>} Uma lista de regionais.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll() {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/regional-alvo/listar`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar as regionais:', error)
      throw error
    }
  }
}

export default RegionalAlvoService
