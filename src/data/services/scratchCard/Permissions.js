import Vue from 'vue'
import config from '../../../core/config.js'
import store from '../../../store/store.js'
import { mapAndConvertKeys } from '../../../utils/mapAndConvertKeys.js'

const ScratchCardPermissionsService = {
  /**
   * Recupera todas as regras de acesso ao formulário pelo ID do formulário
   * @returns {Promise<Array>} A lista de regras de acesso ao formulário.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll(id) {
    try {
      const urlData = `${config.baseUrl}api/shared/pyform/scratch_card/permissions/get_all/${id}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },

  /**
   * Cadastrar as regras de acesso ao formulário
   * @param {Object} data - Os dados a serem inseridos.
   * @returns {Promise<Object>} Os dados inseridos.
   * @throws Lança um erro se a solicitação falhar.
   */
  async insert(data) {
    try {
      // faz o parse dos dados do formulário para o formato do Banco de Dados, é necessário por não utilizamos Typescript para fazer a inferência.
      const payload = mapAndConvertKeys(data, this.modelMap)

      // Segue para a criação do formulário
      const urlData = `${config.baseUrl}api/shared/scratch_card/permissions/insert`
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
      const urlData = `${config.baseUrl}api/shared/scratch_card/permissions/delete/${id}/${deletedBy}`
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
      const urlData = `${config.baseUrl}api/shared/scratch_card/permissions/restore/${id}`
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
      const urlData = `${config.baseUrl}api/shared/scratch_card/permissions/update/${id}`
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
    id: 'CAMPAIGN_ID',
    roleId: 'ROLE_ID',
    roleType: 'ROLE_TYPE'
  }
}

export default ScratchCardPermissionsService
