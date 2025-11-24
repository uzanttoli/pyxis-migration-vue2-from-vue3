import Vue from 'vue'
import config from '../../../core/config.js'
import store from '../../../store/store.js'

function transformInputModel(input) {
  return input.map(item => ({
    value: item.ID,
    label: item.DESCRICAO
  }))
}

const FormGeneratorControlsService = {
  /**
   * Insere um novo controle de gerador de formulário.
   * @param {Object} data - Os dados a serem inseridos.
   * @returns {Promise<Object>} Os dados inseridos.
   * @throws Lança um erro se a solicitação falhar.
   */
  async insert(data) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/controls/insert`
      const res = await Vue.prototype.$api.post(urlData, data)
      return res.data
    } catch (error) {
      console.error('Erro ao inserir dados:', error)
      throw error
    }
  },

  /**
   * Recupera uma ou mais colunas de controles de gerador de formulário.
   * @param {string} columns - Os nomes das colunas a serem recuperadas, separados por vírgula.
   * @returns {Promise<Array>} Os dados das colunas especificadas.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getColumns(columns) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/controls/get_columns?columns=${columns}`
      const res = await Vue.prototype.$api.get(urlData)
      return transformInputModel(res.data)
    } catch (error) {
      console.error('Erro ao recuperar colunas:', error)
      throw error
    }
  },

  /**
   * Recupera todos os controles de gerador de formulário.
   * @returns {Promise<Array>} A lista de controles de gerador de formulário.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll() {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/controls/get_all`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },

  /**
   * Recupera um controle de gerador de formulário pelo ID.
   * @param {number} id - O ID do controle de gerador de formulário.
   * @returns {Promise<Object>} Os dados do controle de gerador de formulário.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getById(id) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/controls/get_by_id/${id}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo ID:', error)
      throw error
    }
  },

  /**
   * Atualiza um controle de gerador de formulário pelo ID.
   * @param {number} id - O ID do controle de gerador de formulário.
   * @param {Object} data - Os dados a serem atualizados.
   * @returns {Promise<Object>} Os dados atualizados.
   * @throws Lança um erro se a solicitação falhar.
   */
  async update(id, data) {
    try {
      const almope = store.getters.usuario.almope
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/controls/update/${id}`
      const res = await Vue.prototype.$api.put(urlData, { ...data, almope })
      return res.data
    } catch (error) {
      console.error('Erro ao atualizar dados:', error)
      throw error
    }
  },

  /**
   * Exclui um controle de gerador de formulário pelo ID.
   * @param {number} id - O ID do controle de gerador de formulário.
   * @returns {Promise<Object>} O resultado da operação de exclusão.
   * @throws Lança um erro se a solicitação falhar.
   */
  async delete(id) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/controls/delete/${id}`
      const res = await Vue.prototype.$api.delete(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao excluir dados:', error)
      throw error
    }
  }
}

export default FormGeneratorControlsService
