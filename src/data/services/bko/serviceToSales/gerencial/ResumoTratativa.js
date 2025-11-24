import Vue from 'vue'
import config from '@/core/config'
import Utils from '@/data/services/common/Utils'

const ResumoTratativaService = {
  /**
   *
   * @param {*} produto
   * @param {*} tipo
   * @param {*} data
   * @returns
   */
  async getDadosIntra(produto, tipo, data) {
    try {
      const urlData = `${config.baseUrl}api/shared/service_to_sales/backoffice/resumo_tratativa/produtividade/intra`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          produto,
          tipo,
          data
        }
      })
      res.data.map(Utils.replaceNulls.bind(this))

      const result = res.data.map(item => {
        const valores = this.calcTotal(item)
        const total = valores.reduce((acc, val) => acc + val, 0)
        return { ...item, Total: total }
      })

      return result
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  /**
   *
   * @param {*} produto
   * @param {*} data
   * @returns
   */
  async getDadosProdutividadeCard(produto, data) {
    try {
      const urlData = `${config.baseUrl}api/shared/service_to_sales/backoffice/resumo_tratativa/produtividade/dados_card`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          produto,
          data
        }
      })
      return res.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  calcTotal(obj) {
    let array = []
    for (let key in obj) {
      if (!isNaN(key * 1)) {
        if (obj[key] !== '-') {
          array.push(obj[key])
        }
      }
    }
    return array
  }
}

export default ResumoTratativaService
