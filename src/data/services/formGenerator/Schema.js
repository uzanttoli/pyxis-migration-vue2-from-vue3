import Vue from 'vue'
import config from '../../../core/config.js'
import store from '../../../store/store.js'
import { mapAndConvertKeys } from '../../../utils/mapAndConvertKeys.js'

const FormGeneratorSchemaService = {
  /**
   * Recupera todos os esquemas de gerador de formulário.
   * @returns {Promise<Array>} A lista de esquemas de gerador de formulário.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll(includeDeleted = false) {
    // TODO - Ordenar no back por data de criação desc e deleted_at
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/schema/get_all?include_deleted=${includeDeleted}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },

  async getAllByRole(almope, regional, includeDeleted = false) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/schema/get_all_by_role?include_deleted=${includeDeleted}&almope=${almope}&regional=${regional}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },

  /**
   * Recupera um esquema de gerador de formulário pelo ID.
   * @param {number} id - O ID do esquema de gerador de formulário.
   * @returns {Promise<Object>} Os dados do esquema de gerador de formulário.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getById(id) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/schema/get_by_id/${id}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados pelo ID:', error)
      throw error
    }
  },

  /**
   * Insere um novo esquema de gerador de formulário.
   * @param {Object} data - Os dados a serem inseridos.
   * @returns {Promise<Object>} Os dados inseridos.
   * @throws Lança um erro se a solicitação falhar.
   */
  async insert(data) {
    try {
      // faz o parse dos dados do formulário para o formato do Banco de Dados, é necessário por não utilizamos Typescript para fazer a inferência.
      const almope = store.getters.usuario.almope
      const payload = {
        ...mapAndConvertKeys(data, this.modelMap),
        CREATED_BY: almope
      }

      // Segue para a criação do formulário
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/schema/insert`
      const res = await Vue.prototype.$api.post(urlData, payload)
      return res
    } catch (error) {
      console.error('Erro ao inserir dados:', error)
      throw error
    }
  },

  /**
   * Exclui um esquema de gerador de formulário pelo ID.
   * @param {number} id - O ID do esquema de gerador de formulário.
   * @param {string} deletedBy - O usuário que excluiu o esquema.
   * @returns {Promise<Object>} O resultado da operação de exclusão.
   * @throws Lança um erro se a solicitação falhar.
   */
  async delete(id, deletedBy) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/schema/delete/${id}/${deletedBy}`
      const res = await Vue.prototype.$api.delete(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao excluir dados:', error)
      throw error
    }
  },

  /**
   * Restaura um esquema de gerador de formulário pelo ID.
   * @param {number} id - O ID do esquema de gerador de formulário.
   * @returns {Promise<Object>} O resultado da operação de restauração.
   * @throws Lança um erro se a solicitação falhar.
   */
  async restore(id) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/schema/restore/${id}`
      const res = await Vue.prototype.$api.put(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao restaurar o formulário:', error)
      throw error
    }
  },

  /**
   * Atualiza um esquema de gerador de formulário pelo ID.
   * @param {number} id - O ID do esquema de gerador de formulário.
   * @param {Object} data - Os dados a serem atualizados.
   * @returns {Promise<Object>} Os dados atualizados.
   * @throws Lança um erro se a solicitação falhar.
   */
  async update(id, data) {
    try {
      const almope = store.getters.usuario.almope
      const urlData = `${config.baseUrl}api/shared/pyform/form_generator/schema/update/${id}`
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
  modelMap: {
    id: 'ID',
    formName: 'TITULO',
    formDescription: 'DESCRICAO',
    published: 'PUBLISHED'
  }
}

export default FormGeneratorSchemaService
