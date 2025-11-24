import Vue from 'vue'
import config from '@/core/config'

const MailingResolveN2Service = {
  async getMailing(payload) {
    try {
      const urlBase = `${config.baseUrl}api/shared/backoffice/tratativa/exec_acao`
      const res = await Vue.prototype.$api.get(urlBase, {
        params: {
          filaProcedure: payload.filaProcedure,
          paramVerificacao: payload.paramVerificacao,
          numCaso: payload.numCaso,
          almope: payload.almope,
          dataAgendamento: payload.dataAgendamento,
          tipoOcorrencia: payload.tipoOcorrencia,
          filaNome: payload.filaNome
          // idForm: idForm
        }
      })
      return res.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  },
  async processarOperacoesTratativas({ ...params }) {
    try {
      const urlData = `${config.baseUrl}api/shared/backoffice/resolveN2/casos/processar`
      const response = await Vue.prototype.$api.post(urlData, {
        params: {
          ...params
        }
      })
      return response.data
    } catch (Error) {
      console.error(Error)
      throw Error
    }
  },
  modelMap: {
    assunto: 'ASSUNTO',
    data_atualizacao: 'DATA_ATUALIZACAO',
    data_criacao: 'DATA_CRIACAO',
    data_ult_modificacao: 'DATA_ULTIMA_MODIFICACAO',
    hash_mailing: 'HASH_MAILING',
    id_atividade: 'ID_ATIVIDADE',
    inicio_tratamento: 'INICIO_TRATAMENTO',
    num_caso: 'NUM_CASO',
    ordem_prioridade: 'ORDEM_PRIORIDADE',
    prioridade: 'PRIORIDADE',
    relativo: 'RELATIVO',
    status_caso: 'STATUS_CASO',
    tipo_tarefa: 'TIPO_TAREFA'
  }
}

export default MailingResolveN2Service
