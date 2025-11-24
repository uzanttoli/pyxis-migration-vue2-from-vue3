import config from '@/core/config'
import Vue from 'vue'

const OcupacaoService = {
  /**
   *
   * Listar agrupamentos
   * @returns {Array}
   */
  async getGroupingProduct(produto, indicador) {
    try {
      const urlData = `${config.baseUrl}api/shared/ocupacao/agrupamentos`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          produto,
          indicador
        }
      })
      const resultMap = res.data.map(item => {
        return {
          text: item.AGRUPAMENTO,
          value: item.AGRUPAMENTO
        }
      })

      return resultMap
    } catch (Error) {
      console.erro(Error)
      throw Error
    }
  },

  /**
   * Listar configuracao do relatorio
   *
   */
  async getConfigReportOccupation(agrupamento, indicador, produto) {
    try {
      const urlData = `${config.baseUrl}api/shared/ocupacao/config_ocupacao`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          agrupamento,
          indicador,
          produto
        }
      })
      return res.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  },

  async getGroupProduct(produto) {
    try {
      const urlData = `${config.baseUrl}api/shared/ocupacao/grupo`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          produto
        }
      })

      return res.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}

export default OcupacaoService
