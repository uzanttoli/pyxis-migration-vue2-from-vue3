import config from '@/core/config'
// import Vue from 'vue'
import api from '@/plugins/axios.js'

const ExecutivoService = {
  /**
   *
   * Listar dados farol
   * @returns {Array}
   *
   */
  async getDadosFarol(regionalSumario, data) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/relatorio-online/executivo/farol/`
      const result = await api.get(urlData, {
        params: {
          regionalSumario: regionalSumario,
          dataFiltro: data
        }
      })

      return result.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  async getListarRegionalSumario() {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/relatorio-online/executivo/regional-sumario/`
      const result = await api.get(urlData)
      return result.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export default ExecutivoService
