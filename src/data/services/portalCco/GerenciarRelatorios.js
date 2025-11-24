import Vue from 'vue'
import config from '@/core/config'
import Utils from '../common/Utils'

const GerenciarRelatoriosService = {
  /**
   *
   * Listar relatorios
   * @returns {Array}
   */
  async getRelatorios(produto) {
    try {
      const url = `${config.baseUrl}api/shared/portal_cco/relatorios/listar`
      const response = await Vue.prototype.$api.get(url, {
        params: {
          produto
        }
      })

      response.data.forEach(Utils.replaceNulls)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar relatorios:', error)
      throw error
    }
  },
  /**
   * Atualizar relatorio
   * @param {string} id
   * @param {Object} data
   * @returns {Object}
   */
  async atualizarRelatorio(id, data) {
    try {
      const url = `${config.baseUrl}api/shared/portal_cco/relatorios/atualizar`
      const response = await Vue.prototype.$api.post(url, { id, data })
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar relatorio:', error)
      throw error
    }
  },
  /**
   * Listar relatorios de permissões
   * @param {string | number} idRelatorio
   * @returns {Array}
   */
  async getRelatoriosPermissoes(idRelatorio) {
    try {
      const url = `${config.baseUrl}api/shared/portal_cco/relatorios/lista_permissoes_atualizar`
      const response = await Vue.prototype.$api.get(url, {
        params: {
          idRelatorio
        }
      })
      return response.data
    } catch (error) {
      console.error('Erro ao buscar relatorios:', error)
      throw error
    }
  },

  /**
   * Atualizar permissões de relatorios
   * @param {string | number} idRelatorio
   * @param {Object} data
   * @returns {Object}
   */
  async inserirPermissoesRelatorios(idRelatorio, data) {
    try {
      const url = `${config.baseUrl}api/shared/portal_cco/permissao/inserir`
      const response = await Vue.prototype.$api.post(url, { idRelatorio, data })
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar permissões de relatorios:', error)
      throw error
    }
  },
  /**
   * Deletar permissões de relatorios
   * @param {string | number} idRelatorio
   * @param {Object} data
   * @returns {Object}
   */
  async deletarPermissoesRelatorios(idRelatorio, almope) {
    try {
      const url = `${config.baseUrl}api/shared/portal_cco/permissao/remover`
      const response = await Vue.prototype.$api.post(url, { idRelatorio, almope })
      return response.data
    } catch (error) {
      console.error('Erro ao deletar permissões de relatorios:', error)
      throw error
    }
  },
  /**
   * Atualizar permissões de relatorios
   * @param {string | number} idRelatorio
   * @param {Object} data
   * @returns {Object}
   */
  async atualizarPermissoesRelatorios(idRelatorio, data) {
    try {
      const url = `${config.baseUrl}api/shared/portal_cco/permissao/atualizar`
      const response = await Vue.prototype.$api.post(url, { idRelatorio, data })
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar permissões de relatorios:', error)
      throw error
    }
  }
}

export default GerenciarRelatoriosService
