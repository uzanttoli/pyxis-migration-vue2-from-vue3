import config from '../../../core/config'
import Vue from 'vue'

const ControlePerfilService = {
  getAll: async function () {
    const url = `${config.pyxisReceptivoUrl}receptivo/controle-perfil/listar`
    try {
      const response = await Vue.prototype.$api.get(url)
      return response.data ?? []
    } catch (error) {
      console.error('Erro ao carregar dados do card:', error)
      throw error
    }
  }
}

export { ControlePerfilService }
