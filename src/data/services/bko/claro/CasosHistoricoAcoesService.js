import Vue from 'vue'
import config from '../../../../core/config.js'

const CasosHistoricoAcoesService = {
  /**
   * Recupera todas as ações realizadas nas ocorrência no dia atual
   * @returns {Promise<Array>} A lista de ações realizadas nas ocorrências
   * @throws Lança um erro se a solicitação falhar.
   */
  async getAll(page = 1, limit = 1) {
    try {
      const urlData = `${config.baseUrl}api/shared/backoffice/casos/historico_acoes/get_all?page=${page}&limit=${limit}`
      const res = await Vue.prototype.$api.get(urlData)
      return res.data
    } catch (error) {
      console.error('Erro ao recuperar dados:', error)
      throw error
    }
  },
  modelMap: {
    numCaso: 'NUM_CASO',
    worklist: 'WORKLIST',
    status: 'STATUS',
    dataAcao: 'DATA_ACAO',
    almope: 'ALMOPE',
    nome: 'NOME',
    supervisor: 'SUPERVISOR',
    coordenador: 'COORDENADOR',
    regional: 'REGIONAL'
  }
}

export default CasosHistoricoAcoesService
