import Vue from 'vue'
import config from '@/core/config'
import Utils from '@/data/services/common/Utils'

const GestaoBloqueadosService = {
  /**
   *
   * @param {*} data
   * @returns
   * @throws {Error}
   */
  async salvarDadosTabulacao(data) {
    try {
      const urlData = `${config.baseUrl}api/shared/formularios/gestao_bloqueados/dados_tabulacao`
      const res = await Vue.prototype.$api.post(urlData, data)
      return res.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  },

  /**
   *
   * @param {*} data
   * @returns
   * @throws {Error}
   */
  async getDadosCardPainelGerencial() {
    try {
      const urlData = `${config.baseUrl}api/shared/gestao_bloqueados/gerencial/dados_card_painel_gerencial`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  },
  /**
   *
   * @param {*} data
   * @returns
   * @throws {Error}
   */
  async getDadosGraficoPainelGerencial(produto) {
    try {
      const urlData = `${config.baseUrl}api/shared/gestao_bloqueados/gerencial/dados_grafico_painel_gerencial`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          produto
        }
      })
      return res.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  },
  /**
   *
   * @param {*} data
   * @returns
   * @throws {Error}
   */
  async getDadosNominalBloqueadosPainelGerencial() {
    try {
      const urlData = `${config.baseUrl}api/shared/gestao_bloqueados/gerencial/dados_nominal_painel_gerencial`
      const res = await Vue.prototype.$api.get(urlData)

      res.data.forEach(Utils.replaceNulls)
      return res.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  }
}

export default GestaoBloqueadosService
