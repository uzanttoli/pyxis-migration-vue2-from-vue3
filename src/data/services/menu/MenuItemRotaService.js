// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '../../../core/config.js'

const MenuItemRotaService = {
  /**
   * Recupera todos os itens de rota de menu.
   * @returns {Promise<Array>} Uma lista de itens de rota de menu.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll() {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/rota/listar`
      const res = await api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar itens de rota de menu:', error)
      throw error
    }
  },

  /**
   * Recupera um item de rota de menu pelo ID.
   * @param {number} id - O ID do item.
   * @returns {Promise<Object>} O item de rota de menu.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getById(id) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/rota/${id}`
      const res = await api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar item de rota de menu pelo ID:', error)
      throw error
    }
  },

  /**
   * Cria um novo item de rota de menu.
   * @param {Object} data - Os dados do item a ser criado.
   * @returns {Promise<Object>} O item criado.
   * @throws Lança um erro se a solicitação falhar.
   */
  async create(data) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/rota/novo`
      const res = await api.post(urlData, data)
      return res.data
    } catch (error) {
      console.error('Erro ao criar item de rota de menu:', error)
      throw error
    }
  },

  /**
   * Atualiza um item de rota de menu pelo ID.
   * @param {number} id - O ID do item.
   * @param {Object} data - Os dados atualizados do item.
   * @returns {Promise<Object>} O item atualizado.
   * @throws Lança um erro se a solicitação falhar.
   */
  async update(id, data) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/rota/editar/${id}`
      const res = await api.put(urlData, data)
      return res.data
    } catch (error) {
      console.error('Erro ao atualizar item de rota de menu:', error)
      throw error
    }
  },

  /**
   * Exclui um item de rota de menu pelo ID.
   * @param {number} id - O ID do item.
   * @returns {Promise<Object>} O resultado da exclusão.
   * @throws Lança um erro se a solicitação falhar.
   */
  async delete(id) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/rota/delete/${id}`
      const res = await api.delete(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao excluir item de rota de menu:', error)
      throw error
    }
  },
  async ToggleStatus(id, data) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/menu/rota/toggle-status/${id}`
      const res = await api.patch(urlData, data)
      return res.data
    } catch (error) {
      console.error('Erro ao atualizar o status:', error)
      throw error
    }
  }
}

export default MenuItemRotaService
