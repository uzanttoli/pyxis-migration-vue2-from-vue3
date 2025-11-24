import Vue from 'vue'
import config from '../../../core/config.js'

const ColaboradorService = {
  /**
   * Recupera os dados de um colaborador pelo Almope
   * @returns {Promise<Object>} Retorna os dados de um colaborador por Almope
   * @throws Lança um erro se a solicitação falhar.
   */
  async getByAlmope(almope) {
    try {
      const urlData = `${config.baseUrl}api/shared/meus_dados/perfil/dados_cadastrais/${almope}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },
  modelMap: {
    almope: 'ALMOPE',
    usuario: 'USUARIO',
    nome: 'NOME',
    superior1: 'SUPERIOR1',
    regional: 'REGIONAL',
    idioma: 'IDIOMA',
    localidade: 'LOCALIDADE',
    bio: 'BIO',
    email: 'EMAIL',
    lider: 'LIDER',
    status: 'STATUS',
    tipoPerfil: 'TIPO_PERFIL',
    idPerfil: 'ID_PERFIL',
    permitirInativacao: 'PERMITIR_INATIVACAO',
    regionalFixa: 'REGIONAL_FIXA'
  }
}

export default ColaboradorService
