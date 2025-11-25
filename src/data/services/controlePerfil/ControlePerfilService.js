import config from '../../../core/config'
// import Vue from 'vue'
import api from '@/plugins/axios.js'

const ControlePerfilService = {
  getAll: async function () {
    const url = `${config.pyxisReceptivoUrl}receptivo/controle-perfil/listar`
    try {
      const response = await api.get(url)
      return response.data ?? []
    } catch (error) {
      console.error('Erro ao carregar dados do card:', error)
      throw error
    }
  }
}

export { ControlePerfilService }
