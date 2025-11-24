import Vue from 'vue'
import config from '../../../core/config.js'

const ConfiguracaoCampanhaService = {
  /**
   * Recupera todos os itens de configuração de campanha.
   * @returns {Promise<Array>} Uma lista de itens de configuração de campanha.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll() {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/configuracao-campanha/listar`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar itens de configuração de campanha:', error)
      throw error
    }
  },

  /**
   * Recupera um item de configuração de campanha pelo ID.
   * @param {number} id - O ID do item.
   * @returns {Promise<Object>} O item de configuração de campanha.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getById(id) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/configuracao-campanha/${id}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar item de configuração de campanha pelo ID:', error)
      throw error
    }
  },

  /**
   * Cria um novo item de configuração de campanha.
   * @param {Object} data - Os dados do item a ser criado.
   * @returns {Promise<Object>} O item criado.
   * @throws Lança um erro se a solicitação falhar.
   */
  async create(data) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/configuracao-campanha/novo`
      const res = await Vue.prototype.$api.post(urlData, data)
      return res.data
    } catch (error) {
      console.error('Erro ao criar item de configuração de campanha:', error)
      throw error
    }
  },

  /**
   * Atualiza um item de configuração de campanha pelo ID.
   * @param {number} id - O ID do item.
   * @param {Object} data - Os dados atualizados do item.
   * @returns {Promise<Object>} O item atualizado.
   * @throws Lança um erro se a solicitação falhar.
   */
  async update(id, data) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/configuracao-campanha/editar/${id}`
      const res = await Vue.prototype.$api.put(urlData, data)
      return res.data
    } catch (error) {
      console.error('Erro ao atualizar item de configuração de campanha:', error)
      throw error
    }
  },

  /**
   * Exclui um item de configuração de campanha pelo ID.
   * @param {number} id - O ID do item.
   * @returns {Promise<Object>} O resultado da exclusão.
   * @throws Lança um erro se a solicitação falhar.
   */
  async delete(id) {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/configuracao-campanha/delete/${id}`
      const res = await Vue.prototype.$api.delete(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao excluir item de configuração de campanha:', error)
      throw error
    }
  }
}

export default ConfiguracaoCampanhaService
