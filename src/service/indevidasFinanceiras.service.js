import config from '../core/config'
// import Vue from 'vue'
import api from '@/plugins/axios.js'

const linkApi = 'api/shared/formularios/tabulador_indevidas_financeiras/'
export default {
  state: {
    indevidasParaAuditar: [],
    cenarioReclamadoCliente: [],
    classificacaoN1: [],
    enviarDados: false,
    auditoresLiberados: [],
    causaMacroN1: [],
    causaMicroN1: [],
    fechamentoClassificacaoBKO: [],
    fechamentoCausaMacroBKO: [],
    updateDadosAposTratativa: false,
    validacaoDeCasosExistentesNaoTratados: [],
    quantidadeCasosPendentes: [],
    casosConcluidos: [],
    minhasTratativasMes: [],
    minhasTratativasDia: [],
    treatmentHistory: [],
    logBookList: [],
    saveDataLogBook: false,
    consultaDeAlmope: [],
    recordReport: []
  },
  mutations: {
    setRecordReport(state, payload) {
      state.recordReport = payload
    },
    setConsultaDeAlmope(state, payload) {
      state.consultaDeAlmope = payload
    },
    setSaveDataLogBook(state) {
      state.saveDataLogBook = true
    },
    setLogBookList(state, payload) {
      state.logBookList = payload
    },
    setTreatmentHistory(state, payload) {
      state.treatmentHistory = payload
    },
    setMinhasTratativasMes(state, payload) {
      state.minhasTratativasMes = payload
    },
    setMinhasTratativasDia(state, payload) {
      state.minhasTratativasDia = payload
    },
    setCasosConcluidos(state, payload) {
      state.casosConcluidos = payload
    },
    setQuantidadeCasosPendentes(state, payload) {
      state.quantidadeCasosPendentes = payload
    },
    setValidacaoDeCasosExistentesNaoTratados(state, payload) {
      state.indevidasParaAuditar = payload
    },
    setFechamentoCausaMacroBKO(state, payload) {
      state.fechamentoCausaMacroBKO = payload
    },
    setFechamentoClassificacaoBKO(state, payload) {
      state.fechamentoClassificacaoBKO = payload
    },
    setCausaMacroN1(state, payload) {
      state.causaMacroN1 = payload
    },
    setCausaMicroN1(state, payload) {
      state.causaMicroN1 = payload
    },
    setAuditoresLiberados(state, payload) {
      state.auditoresLiberados = payload
    },
    setClassificacaoN1(state, payload) {
      state.classificacaoN1 = payload
    },
    setCenarioReclamadoCliente(state, payload) {
      state.cenarioReclamadoCliente = payload
    },
    setIndevidasParaAuditar(state, payload) {
      state.indevidasParaAuditar = payload
    },
    setEnviarDados(state) {
      state.enviarDados = true
    },
    setUpdateDadosAposTratativa(state) {
      state.updateDadosAposTratativa = true
      setTimeout(() => {
        state.updateDadosAposTratativa = false
      }, 3500)
    }
  },
  actions: {
    loadRecordReport({ commit }) {
      let urlData = `${config.baseUrl}${linkApi}list_reports`
      api.get(urlData).then(res => commit('setRecordReport', res.data))
    },
    loadConsultaDeAlmope({ commit }, payload) {
      let urlData = `${config.baseUrl}${linkApi}consulta_almope/${payload}`
      api.get(urlData).then(res => commit('setConsultaDeAlmope', res.data))
    },
    loadLogBookList({ commit }) {
      let urlData = `${config.baseUrl}${linkApi}log_book_list`
      api.get(urlData).then(res => commit('setLogBookList', res.data))
    },
    loadTreatmentHistory({ commit }) {
      let urlData = `${config.baseUrl}${linkApi}treatment_history`
      api.get(urlData).then(res => commit('setTreatmentHistory', res.data))
    },
    loadMinhasTratativasMes({ commit }, payload) {
      let urlData = `${config.baseUrl}${linkApi}minhas_tratativas_mes/${payload}`
      api.get(urlData).then(res => commit('setMinhasTratativasMes', res.data))
    },
    loadMinhasTratativasDia({ commit }, payload) {
      let urlData = `${config.baseUrl}${linkApi}minhas_tratativas_dia/${payload}`
      api.get(urlData).then(res => commit('setMinhasTratativasDia', res.data))
    },
    loadCasosConcluidos({ commit }) {
      let urlData = `${config.baseUrl}${linkApi}casos_concluidos/`
      api.get(urlData).then(res => {
        commit('setCasosConcluidos', res.data)
      })
    },
    loadQuantidadeCasosPendentes({ commit }) {
      let urlData = `${config.baseUrl}${linkApi}casos_pendentes/`
      api.get(urlData).then(res => {
        commit('setQuantidadeCasosPendentes', res.data)
      })
    },
    loadValidacaoDeCasosExistentesNaoTratados({ commit }, payload) {
      let urlData = `${config.baseUrl}${linkApi}existi_caso/${payload}`
      api.get(urlData).then(res => {
        commit('setValidacaoDeCasosExistentesNaoTratados', res.data)
      })
    },
    loadIndevidasParaAuditar({ commit }) {
      let urlData = `${config.baseUrl}${linkApi}ocorrencias_para_tratamento/`
      api.get(urlData).then(res => {
        commit('setIndevidasParaAuditar', res.data)
      })
    },
    loadFechamentoCausaMacroBKO({ commit }) {
      let urlData = `${config.baseUrl}${linkApi}fechamento_causa_macro_bko`
      api.get(urlData).then(res => {
        commit('setFechamentoCausaMacroBKO', res.data)
      })
    },
    loadFechamentoClassificacaoBKO({ commit }) {
      let urlData = `${config.baseUrl}${linkApi}fechamento_classificacao_bko`
      api.get(urlData).then(res => {
        commit('setFechamentoClassificacaoBKO', res.data)
      })
    },
    loadCausaMacroN1({ commit }, payload) {
      let urlData = `${config.baseUrl}${linkApi}causa_macro_n1/${payload}`
      api.get(urlData).then(res => {
        commit('setCausaMacroN1', res.data)
      })
    },
    loadCausaMicroN1({ commit }, payload) {
      let urlData = `${config.baseUrl}${linkApi}causa_micro_n1/${payload}`
      api.get(urlData).then(res => {
        commit('setCausaMicroN1', res.data)
      })
    },
    loadAuditoresLiberados({ commit }) {
      let urlData = `${config.baseUrl}${linkApi}auditores_liberados`
      api.get(urlData).then(res => {
        commit('setAuditoresLiberados', res.data)
      })
    },
    loadClassificacaoN1({ commit }) {
      let urlData = `${config.baseUrl}${linkApi}classificacao_n1/`
      api.get(urlData).then(res => {
        commit('setClassificacaoN1', res.data)
      })
    },
    loadCenarioReclamadoCliente({ commit }, payload) {
      let urlData = `${config.baseUrl}${linkApi}cenario_reclamado_cliente/${payload}`
      api.get(urlData).then(res => {
        commit('setCenarioReclamadoCliente', res.data)
      })
    },
    saveDataLogBook({ commit }, payload) {
      let urlData = `${config.baseUrl}${linkApi}insert/`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      api
        .post(urlData, getFormData(payload))
        .then(() => commit('setSaveDataLogBook'))
    },
    updateDataFormTabuladorIndevidas({ commit }, payload) {
      let urlData = `${config.baseUrl}${linkApi}update/`
      let getFormData = object =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key])
          return formData
        }, new FormData())
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setEnviarDados')
      })
    },
    updateDadosAposTratativaIndevidas({ commit }, payload) {
      let urlData = `${config.baseUrl}${linkApi}update_apos_tratativa`
      let getFormData = object =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key])
          return formData
        }, new FormData())
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setUpdateDadosAposTratativa')
      })
    }
  },
  getters: {
    recordReport(state) {
      return state.recordReport
    },
    consultaDeAlmope(state) {
      return state.consultaDeAlmope
    },
    logBookList(state) {
      return state.logBookList
    },
    treatmentHistory(state) {
      return state.treatmentHistory
    },
    minhasTratativasMes(state) {
      return state.minhasTratativasMes
    },
    minhasTratativasDia(state) {
      return state.minhasTratativasDia
    },
    casosConcluidos(state) {
      return state.casosConcluidos
    },
    quantidadeCasosPendentes(state) {
      return state.quantidadeCasosPendentes
    },
    validacaoDeCasosExistentesNaoTratados(state) {
      return state.validacaoDeCasosExistentesNaoTratados
    },
    updateDadosAposTratativa(state) {
      return state.updateDadosAposTratativa
    },
    fechamentoCausaMacroBKO(state) {
      return state.fechamentoCausaMacroBKO
    },
    fechamentoClassificacaoBKO(state) {
      return state.fechamentoClassificacaoBKO
    },
    causaMacroN1(state) {
      return state.causaMacroN1
    },
    causaMicroN1(state) {
      return state.causaMicroN1
    },
    auditoresLiberados(state) {
      return state.auditoresLiberados
    },
    classificacaoN1(state) {
      return state.classificacaoN1
    },
    cenarioReclamadoCliente(state) {
      return state.cenarioReclamadoCliente
    },
    indevidasParaAuditar(state) {
      return state.indevidasParaAuditar
    }
  }
}
