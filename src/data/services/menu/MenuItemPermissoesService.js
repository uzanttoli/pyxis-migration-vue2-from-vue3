// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '../../../core/config.js'

const MenuItemPermissoesService = {
  /**
   * Recupera todas as permissões de uma rota pelo ID.
   * @param {number} id - O ID da rota.
   * @returns {Promise<Array>} A lista de permissões.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getById(id) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/permissao/listar/${id}`
      const res = await api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar item de agrupamento de menu pelo ID:', error)
      throw error
    }
  },
  /**
   * Cria um novo item de permissão de menu.
   * @param {Object} data - Os dados da permissão a ser criada.
   * @returns {Promise<Object>} A permissão criada.
   * @throws Lança um erro se a solicitação falhar.
   */
  async create(data) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/permissao/nova`
      const res = await api.post(urlData, data)
      return res.data
    } catch (error) {
      console.error('Erro ao criar item de permissão de rota:', error)
      throw error
    }
  },
  /**
   * Exclui um item de permissão de menu pelo ID.
   * @param {number} id - O ID da permissão.
   * @returns {Promise<Object>} O resultado da exclusão.
   * @throws Lança um erro se a solicitação falhar.
   */
  async delete(id) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/permissao/delete/${id}`
      const res = await api.delete(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao excluir item de agrupamento de menu:', error)
      throw error
    }
  }
}

export default MenuItemPermissoesService
