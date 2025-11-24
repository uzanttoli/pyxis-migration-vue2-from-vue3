import Vue from 'vue'
import config from '../../../core/config.js'
import store from '../../../store/store.js'
import { mapAndConvertKeys } from '../../../utils/mapAndConvertKeys.js'

const FormGeneratorAnswerService = {
  /**
   * Insere uma resposta do gerador de formulário.
   * @param {Object} data - Os dados a serem inseridos.
   * @returns {Promise<Object>} Os dados inseridos.
   * @throws Lança um erro se a solicitação falhar.
   */
  async insert(data) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/answer/insert`
      const almope = store.getters.usuario.almope
      const payload = {
        ...data.answers.map(item => {
          return {
            ...mapAndConvertKeys(item, this.modelMap),
            CREATED_BY: almope
          }
        })
      }

      const res = await Vue.prototype.$api.post(urlData, payload)
      return res
    } catch (error) {
      console.error('Erro ao inserir dados:', error)
      throw error
    }
  },

  /**
   * Recupera todos as respostas do gerador de formulário.
   * @param {UUID} formId - id do formulário.
   * @returns {Promise<Array>} A lista de respostas do gerador de formulário.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll(id) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/answer/get_all/${id}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },

  /**
   * Recupera uma resposta do gerador de formulário pelo ID da questão.
   * @param {number} questionId - O ID da questão.
   * @returns {Promise<Object>} Os dados da resposta.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getById(questionId) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/answer/get_by_id/${questionId}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo ID:', error)
      throw error
    }
  },

  /**
   * Atualiza uma resposta no gerador de formulário pelo ID da questão.
   * @param {number} id - O ID da questão.
   * @param {Object} data - Os dados a serem atualizados.
   * @returns {Promise<Object>} Os dados atualizados.
   * @throws Lança um erro se a solicitação falhar.
   */
  async update(questionId, data) {
    try {
      const almope = store.getters.usuario.almope
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/answer/update/${questionId}`
      const res = await Vue.prototype.$api.put(urlData, { ...data, almope })
      return res.data
    } catch (error) {
      console.error('Erro ao atualizar dados:', error)
      throw error
    }
  },

  // /**
  //  * Exclui uma resposta de gerador de formulário pelo ID.
  //  * @param {number} id - O ID da questão.
  //  * @returns {Promise<Object>} O resultado da operação de exclusão.
  //  * @throws Lança um erro se a solicitação falhar.
  //  */
  // async delete(id) {
  //   try {
  //     const urlData = `${config.baseUrl}api/shared/pyform/form_generator/answer/delete/${id}`;
  //     const res = await Vue.prototype.$api.delete(urlData);
  //     return res.data;
  //   } catch (error) {
  //     console.error("Erro ao excluir dados:", error);
  //     throw error;
  //   }
  // },
  modelMap: {
    id: 'ID',
    formId: 'FORM_ID',
    questionId: 'QUESTION_ID',
    value: 'VALUE'
  }
}

export default FormGeneratorAnswerService
