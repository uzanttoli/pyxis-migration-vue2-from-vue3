import Vue from 'vue'
import config from '../../../core/config.js'

const MenuItemExclusoesService = {
  /**
   * Recupera todas as exclusões de uma rota pelo ID.
   * @param {number} id - O ID da rota.
   * @returns {Promise<Array>} A lista de exclusões.
   */
  async getByRotaId(id) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/exclusoes/listar/${id}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar exclusões pelo ID da rota:', error)
      throw error
    }
  },

  /**
   * Cria uma nova exclusão de menu.
   * @param {Object} data - Os dados da exclusão a ser criada.
   * @returns {Promise<Object>} A exclusão criada.
   */
  async create(data) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/exclusoes/nova`
      const res = await Vue.prototype.$api.post(urlData, data)
      return res.data
    } catch (error) {
      console.error('Erro ao criar exclusão de menu:', error)
      throw error
    }
  },

  /**
   * Exclui uma exclusão de menu pelo ID da rota.
   * @param {number} idRota - O ID da rota.
   * @returns {Promise<void>}
   */
  async delete(idRota) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/exclusoes/delete/${idRota}`
      // O controller espera POST para delete
      await Vue.prototype.$api.delete(urlData)
    } catch (error) {
      console.error('Erro ao excluir exclusão de menu:', error)
      throw error
    }
  }
}

export default MenuItemExclusoesService
