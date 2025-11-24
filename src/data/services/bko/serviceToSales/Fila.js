import Vue from 'vue'
import config from '@/core/config'

const FilaService = {
  /**
   * Lista dados da fila de acordo com o produto;
   * @param {UUID} idProduto - id do formulário.
   * @param {String} perfil - tipo de perfil.
   * @returns {Promise<Array>} A lista de respostas do gerador de formulário.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getFila(idProduto, perfil) {
    try {
      const urlData = `${config.baseUrl}api/shared/service_to_sales/backoffice/fila/listar`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          idProduto,
          perfil
        }
      })

      return res
    } catch (error) {
      console.error('Erro ao recuperar dados: ', error)
      throw error
    }
  },

  /**
   *
   * @param {UUID} configId - id da fila.
   * @returns {Promise<Array>}
   * @throws Lança um erro se a solicitação falhar.
   */
  async getConfigById(configId) {
    try {
      const urlData = `${config.baseUrl}api/shared/service_to_sales/backoffice/config/filas`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          configId
        }
      })

      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados: ', error)
      throw error
    }
  }
}

export default FilaService
