import Vue from 'vue'
import config from '../../../core/config.js'

const PerfilAcessoService = {
  /**
   * Recupera todos os itens de rota de menu.
   * @returns {Promise<Array>} Uma lista de itens de rota de menu.
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll() {
    try {
      const urlData = `${config.pyxisReceptivoUrl}receptivo/acesso-perfil/listar`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar itens perfil de acesso:', error)
      throw error
    }
  }
}

export default PerfilAcessoService
