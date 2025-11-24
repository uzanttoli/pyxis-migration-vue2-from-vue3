import Vue from 'vue'
import config from '@/core/config'

const DadosOnlineOperadorJustificativaAbsService = {
  /**
   *
   * @param {string} nome - nome do usuario;
   */
  async getAbsenteistas(nome) {
    try {
      let urlData = `${config.baseUrl}api/shared/abs/abs_dia_justificar`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          nome
        }
      })
      return res.data
    } catch (error) {
      console.error('Erro ao buscar todos os dados:', error)
      throw error
    }
  },

  /**
   *
   * Listar os items options para justificar absenteismo
   *
   */
  async getItemsOptionsJustificar() {
    try {
      let urlData = `${config.baseUrl}api/shared/abs/justificativa_abs`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao buscar todos os dados:', error)
      throw error
    }
  },

  /**
   *
   * Listar historico de justificativas de absenteismo
   * @param {string} nome - nome do usuario;
   */
  async getHistoricoJustificativas(nome) {
    try {
      let urlData = `${config.baseUrl}api/shared/abs/historico_justificativa_abs`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          nome
        }
      })
      return res.data
    } catch (error) {
      console.error('Erro ao buscar todos os dados:', error)
      throw error
    }
  },

  modelMap: {
    id: 'ID',
    formName: 'TITULO',
    formDescription: 'DESCRICAO',
    published: 'PUBLISHED'
  }
}

export default DadosOnlineOperadorJustificativaAbsService
