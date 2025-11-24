import Vue from 'vue'
import config from '../../../core/config.js'

const FormOptionsService = {
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
  async getByField(form, field) {
    try {
      const urlData = `${config.baseUrl}api/shared/formularios/Form_options/get_by_field`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          form: form,
          field: field
        }
      })
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo Campo:', error)
      throw error
    }
  },

  async getByParent(form, field, parent, parentValue) {
    try {
      const urlData = `${config.baseUrl}api/shared/formularios/Form_options/get_by_parent`
      const res = await Vue.prototype.$api.get(urlData, {
        params: {
          form: form,
          field: field,
          parent: parent,
          parentValue: parentValue
        }
      })
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo Campo:', error)
      throw error
    }
  }
}

export default FormOptionsService
