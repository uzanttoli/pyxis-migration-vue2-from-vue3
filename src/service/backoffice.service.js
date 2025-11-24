import Vue from 'vue'
import config from '../core/config'

export default {
  state: {
    configBackoffice: [],
    executarAcao: [],
    salvarAnalise: false,
    agendarAnalise: false
  },
  mutations: {
    setConfigBackoffice(state, payload) {
      state.configBackoffice = payload
    },
    setExecutarAcao(state, payload) {
      state.executarAcao = payload
    },
    setSalvarAnalise(state) {
      state.salvarAnalise = true
    },
    setAgendarAnalise(state) {
      state.agendarAnalise = true
    }
  },
  actions: {
    async loadConfigBackoffice({ commit }, payload) {
      let urlBase = `${config.baseUrl}api/shared/backoffice/config/fila/${payload}`
      var res = await Vue.prototype.$api.get(urlBase)
      commit('setConfigBackoffice', res.data)
    },
    loadExecutarAcao({ commit }, payload) {
      let urlBase = `${config.baseUrl}api/shared/backoffice/tratativa/exec_acao`
      Vue.prototype.$api
        .get(urlBase, {
          params: {
            filaProcedure: payload.filaProcedure,
            paramVerificacao: payload.paramVerificacao,
            numCaso: payload.numCaso,
            almope: payload.almope,
            dataAgendamento: payload.dataAgendamento,
            tipoOcorrencia: payload.tipoOcorrencia,
            filaNome: payload.filaNome
          }
        })
        .then(res => {
          commit('setExecutarAcao', res.data[0])
        })
    },
    agendarAnaliseAction({ commit }, payload) {
      let urlBase = `${config.baseUrl}api/shared/backoffice/tratativa/exec_acao`
      Vue.prototype.$api
        .get(urlBase, {
          params: {
            filaProcedure: payload.filaProcedure,
            paramVerificacao: payload.paramVerificacao,
            numCaso: payload.numCaso,
            almope: payload.almope,
            dataAgendamento: payload.dataAgendamento,
            tipoOcorrencia: payload.tipoOcorrencia,
            filaNome: payload.filaNome
          }
        })
        .then(() => {
          commit('setAgendarAnalise')
        })
    },
    salvarAnaliseAction({ commit }, payload) {
      let urlBase = `${config.baseUrl}api/shared/backoffice/tratativa/salvar_analise/${payload.consulta}/'${payload.dadosTratativa}'`
      Vue.prototype.$api.get(urlBase).then(() => {
        commit('setSalvarAnalise')
      })
    }
  },
  getters: {
    executarAcao(state) {
      return state.executarAcao
    },
    configBackoffice(state) {
      return state.configBackoffice
    }
  }
}
