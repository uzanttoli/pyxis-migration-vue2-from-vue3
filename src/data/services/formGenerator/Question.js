import Vue from 'vue'
import config from '../../../core/config.js'
import store from '../../../store/store.js'
import { mapAndConvertKeys } from '../../../utils/mapAndConvertKeys.js'

const FormGeneratorQuestionService = {
  /**
   * Insere uma nova questão de gerador de formulário.
   * @param {Object} data - Os dados a serem inseridos.
   * @returns {Promise<Object>} Os dados inseridos.
   * @throws Lança um erro se a solicitação falhar.
   */
  async insert(data) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/questions/insert`
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
   * Recupera todas as questões de gerador de formulário.
   * @param {UUID} blockId - id do bloco
   * @returns {Promise<Array>} A lista de questões de gerador de formulário.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll(blockId) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/questions/get_all/${blockId}`
      const res = await Vue.prototype.$api.get(urlData)
      const data = res.data.map(item => {
        return { ...item, REQUIRED: item.REQUIRED === 1 }
      })
      return data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },

  /**
   * Recupera uma questão de gerador de formulário pelo ID.
   * @param {number} id - O ID da questão de gerador de formulário.
   * @returns {Promise<Object>} Os dados da questão de gerador de formulário.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getById(id) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/questions/get_by_id/${id}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo ID:', error)
      throw error
    }
  },

  /**
   * Atualiza uma questão de gerador de formulário pelo ID.
   * @param {number} id - O ID da questão de gerador de formulário.
   * @param {Object} data - Os dados a serem atualizados.
   * @returns {Promise<Object>} Os dados atualizados.
   * @throws Lança um erro se a solicitação falhar.
   */
  async update(id, data) {
    try {
      const almope = store.getters.usuario.almope
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/questions/update/${id}`
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
   * Exclui uma questão de gerador de formulário pelo ID.
   * @param {number} id - O ID da questão de gerador de formulário.
   * @returns {Promise<Object>} O resultado da operação de exclusão.
   * @throws Lança um erro se a solicitação falhar.
   */
  async delete(id, deletedBy) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/questions/delete/${id}/${deletedBy}`
      const res = await Vue.prototype.$api.delete(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao excluir dados:', error)
      throw error
    }
  },
  modelMap: {
    id: 'ID',
    question: 'PERGUNTA',
    type: 'TIPO',
    required: 'REQUIRED',
    blockId: 'BLOCO',
    formId: 'FORM',
    parentField: 'PARENT',
    parentOption: 'OPTION_PARENT',
    order: 'ORDEM',
    columns: 'COLUNAS'
  },
  modelMapResponse: {
    id: 'ID',
    question: 'PERGUNTA',
    type: 'TIPO',
    placeholder: 'PLACEHOLDER',
    required: 'REQUIRED',
    blockId: 'BLOCO',
    formId: 'FORM',
    parentField: 'PARENT',
    parentOption: 'OPTION_PARENT',
    order: 'ORDEM',
    columns: 'COLUNAS',
    max: 'MAX',
    min: 'MIN',
    prependText: 'PREPEND_TEXT',
    prependIcon: 'PREPEND_ICON'
  }
}

export default FormGeneratorQuestionService
