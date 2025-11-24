import Vue from 'vue'
import config from '../../../core/config.js'
import { mapAndConvertKeys } from '../../../utils/mapAndConvertKeys.js'

const FormGeneratorSelectOptionsService = {
  /**
   * Insere uma nova opção de seleção de gerador de formulário.
   * @param {Object} data - Os dados a serem inseridos.
   * @returns {Promise<Object>} Os dados inseridos.
   * @throws Lança um erro se a solicitação falhar.
   */
  async insert(data) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/select_options/insert`
      const payload = {
        ...data.value.map(item => mapAndConvertKeys(item, this.modelMap))
      }
      const res = await Vue.prototype.$api.post(urlData, payload)
      return res
    } catch (error) {
      console.error('Erro ao inserir dados:', error)
      throw error
    }
  },

  async insertArray(data) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/select_options/insert_array`
      const payload = {
        ...data.value.map(item => mapAndConvertKeys(item, this.modelMap))
      }
      const res = await Vue.prototype.$api.post(urlData, payload)
      return res
    } catch (error) {
      console.error('Erro ao inserir dados:', error)
      throw error
    }
  },

  /**
   * Recupera todas as opções de seleção de gerador de formulário.
   * @param {UUID} questionId id da questão.
   * @returns {Promise<Array>} A lista de opções de seleção de gerador de formulário.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll(questionId) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/select_options/get_all/${questionId}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },

  /**
   * Recupera uma opção de seleção de gerador de formulário pelo ID.
   * @param {number} id - O ID da opção de seleção de gerador de formulário.
   * @returns {Promise<Object>} Os dados da opção de seleção de gerador de formulário.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getById(id) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/select_options/get_by_id/${id}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo ID:', error)
      throw error
    }
  },

  /**
   * Atualiza uma opção de seleção de gerador de formulário pelo ID.
   * @param {number} id - O ID da opção de seleção de gerador de formulário.
   * @param {Object} data - Os dados a serem atualizados.
   * @returns {Promise<Object>} Os dados atualizados.
   * @throws Lança um erro se a solicitação falhar.
   */
  async update(id, data) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/select_options/update/${id}`
      const payload = data.map(item => mapAndConvertKeys(item, this.modelMap))
      const res = await Vue.prototype.$api.put(urlData, payload)
      return res.data
    } catch (error) {
      console.error('Erro ao atualizar dados:', error)
      throw error
    }
  },

  /**
   * Exclui uma opção de seleção de gerador de formulário pelo ID.
   * @param {number} id - O ID da opção de seleção de gerador de formulário.
   * @returns {Promise<Object>} O resultado da operação de exclusão.
   * @throws Lança um erro se a solicitação falhar.
   */
  async delete(id) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator_select_options/delete/${id}`
      const res = await Vue.prototype.$api.delete(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao excluir dados:', error)
      throw error
    }
  },
  modelMap: {
    value: 'ID',
    label: 'DESCRICAO',
    parentFieldId: 'ID_PERGUNTA',
    parentId: 'ID_PARENT'
  }
}

export default FormGeneratorSelectOptionsService
