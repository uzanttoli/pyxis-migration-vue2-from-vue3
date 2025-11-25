import api from '@/plugins/axios.js'
import config from '../../../core/config.js'

const MenuItemAgrupamentoService = {
  /**
   * Recupera todos os itens de agrupamento de menu.
   * @returns {Promise<Array>} Uma lista de itens de agrupamento de menu.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll() {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/agrupamento/listar`
      const res = await api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar itens de agrupamento de menu:', error)
      throw error
    }
  },

  /**
   * Recupera um item de agrupamento de menu pelo ID.
   * @param {number} id - O ID do item.
   * @returns {Promise<Object>} O item de agrupamento de menu.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getById(id) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/agrupamento/${id}`
      const res = await api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar item de agrupamento de menu pelo ID:', error)
      throw error
    }
  },

  /**
   * Cria um novo item de agrupamento de menu.
   * @param {Object} data - Os dados do item a ser criado.
   * @returns {Promise<Object>} O item criado.
   * @throws Lança um erro se a solicitação falhar.
   */
  async create(data) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/agrupamento/novo`
      const res = await api.post(urlData, data)
      return res.data
    } catch (error) {
      console.error('Erro ao criar item de agrupamento de menu:', error)
      throw error
    }
  },

  /**
   * Atualiza um item de agrupamento de menu pelo ID.
   * @param {number} id - O ID do item.
   * @param {Object} data - Os dados atualizados do item.
   * @returns {Promise<Object>} O item atualizado.
   * @throws Lança um erro se a solicitação falhar.
   */
  async update(id, data) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/agrupamento/editar/${id}`
      const res = await api.put(urlData, data)
      return res.data
    } catch (error) {
      console.error('Erro ao atualizar item de agrupamento de menu:', error)
      throw error
    }
  },

  /**
   * Exclui um item de agrupamento de menu pelo ID.
   * @param {number} id - O ID do item.
   * @returns {Promise<Object>} O resultado da exclusão.
   * @throws Lança um erro se a solicitação falhar.
   */
  async delete(id) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/agrupamento/delete/${id}`
      const res = await api.delete(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao excluir item de agrupamento de menu:', error)
      throw error
    }
  },
  async ToggleStatus(id, data) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/agrupamento/toggle-status/${id}`
      const res = await api.patch(urlData, data)
      return res.data
    } catch (error) {
      console.error('Erro ao atualizar o status:', error)
      throw error
    }
  }
}

export default MenuItemAgrupamentoService
