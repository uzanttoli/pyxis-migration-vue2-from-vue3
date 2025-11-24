import Vue from 'vue'
import config from '@/core/config'

const DadosTratativaService = {
  /**
   *
   * @param {*} fila
   * @returns
   */
  async getDadosTratativaCard(fila, data) {
    try {
      let urlData = `${config.baseUrl}api/shared/service_to_sales/backoffice/gerencial/dados/cards_fila`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          fila,
          de: data[0],
          ate: data[1]
        }
      })

      return res.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  /**
   *
   * @param {*} fila
   * @returns
   */
  async getDadosTratativasBko(fila, data) {
    try {
      const urlData = `${config.baseUrl}api/shared/service_to_sales/backoffice/gerencial/dados/tratativas_fila`
      const res = await Vue.prototype.$api.get(urlData, {
        params: { fila, de: data[0], ate: data[1] }
      })
      return res.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  /**
   *
   * @param {*} perfil
   * @param {*} almope
   * @returns
   */

  //
  async getDadosFila(perfil, almope) {
    try {
      const urlData = `${config.baseUrl}api/shared/service_to_sales/backoffice/gerencial/config/listar`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          perfil,
          almope
        }
      })
      return res.data
    } catch (error) {
      console.error(error)
      throw error
    }
  },

  /**
   *
   * @param {*} fila
   * @returns
   */
  async getDadosMotivoTratativa(fila) {
    try {
      const urlData = `${config.baseUrl}api/shared/service_to_sales/backoffice/gerencial/dados/motivos_nao_venda`
      const result = await Vue.prototype.$api.get(urlData, {
        params: {
          fila
        }
      })

      return result.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  }
}

export default DadosTratativaService
