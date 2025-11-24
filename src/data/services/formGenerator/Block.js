import Vue from 'vue'
import config from '../../../core/config.js'
import store from '../../../store/store.js'
import { mapAndConvertKeys } from '../../../utils/mapAndConvertKeys.js'

const FormGeneratorBlocksService = {
  /**
   * Insere um novo bloco de gerador de formulário.
   * @param {Object} data - Os dados a serem inseridos.
   * @returns {Promise<Object>} Os dados inseridos.
   * @throws Lança um erro se a solicitação falhar.
   */
  async insert(data) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/blocks/insert`
      const almope = store.getters.usuario.almope
      const payload = {
        ...mapAndConvertKeys(data, this.modelMap),
        CREATED_BY: almope
      }

      const res = await Vue.prototype.$api.post(urlData, payload)
      return res
    } catch (error) {
      console.error('Erro ao inserir dados:', error)
      throw error
    }
  },

  /**
   * Recupera todos os blocos de gerador de formulário.
   * @param {UUID} formId - id do formulário.
   * @returns {Promise<Array>} A lista de blocos de gerador de formulário.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll(formId) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/blocks/get_all/${formId}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },

  /**
   * Recupera um bloco de gerador de formulário pelo ID.
   * @param {number} id - O ID do bloco de gerador de formulário.
   * @returns {Promise<Object>} Os dados do bloco de gerador de formulário.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getById(id) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/blocks/get_by_id/${id}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo ID:', error)
      throw error
    }
  },

  /**
   * Atualiza um bloco de gerador de formulário pelo ID.
   * @param {number} id - O ID do bloco de gerador de formulário.
   * @param {Object} data - Os dados a serem atualizados.
   * @returns {Promise<Object>} Os dados atualizados.
   * @throws Lança um erro se a solicitação falhar.
   */
  async update(id, data) {
    try {
      const almope = store.getters.usuario.almope
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/blocks/update/${id}`
      const payload = {
        ...mapAndConvertKeys(data, this.modelMap),
        UPDATED_BY: almope,
        UPDATED_AT: new Date()
      }
      const res = await Vue.prototype.$api.put(urlData, payload)
      return res.data
    } catch (error) {
      console.error('Erro ao atualizar dados:', error)
      throw error
    }
  },

  /**
   * Exclui um bloco de gerador de formulário pelo ID.
   * @param {number} id - O ID do bloco de gerador de formulário.
   * @returns {Promise<Object>} O resultado da operação de exclusão.
   * @throws Lança um erro se a solicitação falhar.
   */
  async delete(id, deletedBy) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/blocks/delete/${id}/${deletedBy}`
      const res = await Vue.prototype.$api.delete(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao excluir dados:', error)
      throw error
    }
  },
  modelMap: {
    id: 'ID',
    title: 'TITLE',
    formId: 'FORM',
    order: 'SHOW_ORDER'
  }
}

export default FormGeneratorBlocksService
