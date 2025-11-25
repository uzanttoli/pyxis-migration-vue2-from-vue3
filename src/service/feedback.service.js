// import Vue from 'vue'
import config from '../core/config'
import api from '@/plugins/axios.js'

export default {
  state: {
    dadosOperador: [],
    segmentoCliente: [],
    motivoContato: [],
    subMotivoContatoFeedback: [],
    segundoSubMotivoContatoFeedback: [],
    campanhasFeedback: [],
    areaTransferenciaFeedback: [],
    motivoInfratorRechamadaFeedback: [],
    subMotivoInfratorRechamadaFeedback: [],
    microMotivoInfratorRechamadaFeedback: [],
    paperQualitativoFeedback: [],
    qualidadeChamadaFeedback: [],
    canaisAutoatendimentoFeedback: [],
    informaCanaisAutoatendimentoFeedback: [],
    comportamentoNegativoFeedback: [],
    inicioLigacaoSatisfacaoClienteFeedback: [],
    finalLigacaoSatisfacaoClienteFeedback: [],
    sancoesFeedback: [],
    saveDataFormFeedback: false
  },
  mutations: {
    setSaveDataFormFeedback(state) {
      state.saveDataFormFeedback = true
    },
    setDadosOperador(state, payload) {
      state.dadosOperador = payload
    },
    setSegmentoCliente(state, payload) {
      state.segmentoCliente = payload
    },
    setMotivoContato(state, payload) {
      state.motivoContato = payload
    },
    setSubMotivoContatoFeedback(state, payload) {
      state.subMotivoContatoFeedback = payload
    },
    setSegundoSubMotivoContatoFeedback(state, payload) {
      state.segundoSubMotivoContatoFeedback = payload
    },
    setCampanhasFeedback(state, payload) {
      state.campanhasFeedback = payload
    },
    setAreaTransferenciaFeedback(state, payload) {
      state.areaTransferenciaFeedback = payload
    },
    setMotivoInfratorRechamadaFeedback(state, payload) {
      state.motivoInfratorRechamadaFeedback = payload
    },
    setSubMotivoInfratorRechamadaFeedback(state, payload) {
      state.subMotivoInfratorRechamadaFeedback = payload
    },
    setMicroMotivoInfratorRechamadaFeedback(state, payload) {
      state.microMotivoInfratorRechamadaFeedback = payload
    },
    setPaperQualitativoFeedback(state, payload) {
      state.paperQualitativoFeedback = payload
    },
    setQualidadeChamadaFeedback(state, payload) {
      state.qualidadeChamadaFeedback = payload
    },
    setCanaisAutoatendimento(state, payload) {
      state.canaisAutoatendimentoFeedback = payload
    },
    setInformaCanaisAutoatendimento(state, payload) {
      state.informaCanaisAutoatendimentoFeedback = payload
    },
    setComportamentoNegativoFeedback(state, payload) {
      state.comportamentoNegativoFeedback = payload
    },
    setInicioLigacaoSatisfacaoClienteFeedback(state, payload) {
      state.inicioLigacaoSatisfacaoClienteFeedback = payload
    },
    setFinalLigacaoSatisfacaoClienteFeedback(state, payload) {
      state.finalLigacaoSatisfacaoClienteFeedback = payload
    },
    setSancoesFeedback(state, payload) {
      state.sancoesFeedback = payload
    }
  },
  actions: {
    async saveDataFormFeedbackAction({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/indicadores/feedback/insert`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      await api.post(urlData, getFormData(payload)).then(() => {
        commit('setSaveDataFormFeedback')
      })
    },
    loadDadosOperador({ commit }, payload) {
      api
        .get(`${config.baseUrl}api/shared/indicadores/feedback/dados_operador/${payload}`)
        .then(res => {
          if (res != []) {
            commit('setDadosOperador', res.data)
          }
        })
    },
    loadSegmentoCliente({ commit }, payload) {
      api
        .get(`${config.baseUrl}api/shared/indicadores/feedback/segmento_cliente/${payload}`)
        .then(res => {
          commit('setSegmentoCliente', res.data)
        })
    },
    loadAreaTransferenciaFeedback({ commit }, payload) {
      api
        .get(`${config.baseUrl}api/shared/indicadores/feedback/area_transferencia/${payload}`)
        .then(res => {
          if (res.data.length > 0) commit('setAreaTransferenciaFeedback', res.data)
          else
            commit('setAreaTransferenciaFeedback', [
              {
                ID_CAMPANHA: '0',
                DESCRICAO: 'Não há Subitens'
              }
            ])
        })
    },
    loadMotivoContato({ commit }) {
      api.get(`${config.baseUrl}api/shared/indicadores/feedback/motivo_contato/`).then(res => {
        commit('setMotivoContato', res.data)
      })
    },
    loadInicioLigacaoSatisfacaoClienteFeedback({ commit }) {
      api.get(`${config.baseUrl}api/shared/indicadores/feedback/satisfacao_cliente/`).then(res => {
        commit('setInicioLigacaoSatisfacaoClienteFeedback', res.data)
      })
    },
    loadSancoesFeedback({ commit }) {
      api.get(`${config.baseUrl}api/shared/indicadores/feedback/sancoes/`).then(res => {
        commit('setSancoesFeedback', res.data)
      })
    },
    loadFinalLigacaoSatisfacaoClienteFeedback({ commit }) {
      api.get(`${config.baseUrl}api/shared/indicadores/feedback/satisfacao_cliente/`).then(res => {
        commit('setFinalLigacaoSatisfacaoClienteFeedback', res.data)
      })
    },
    loadSubMotivoContatoFeedback({ commit }, payload) {
      api
        .get(`${config.baseUrl}api/shared/indicadores/feedback/sub_motivo_contato/${payload}`)
        .then(res => {
          commit('setSubMotivoContatoFeedback', res.data)
        })
    },
    loadSegundoSubMotivoContatoFeedback({ commit }, payload) {
      api
        .get(`${config.baseUrl}api/shared/indicadores/feedback/sub_motivo_contato/${payload}`)
        .then(res => {
          commit('setSegundoSubMotivoContatoFeedback', res.data)
        })
    },
    loadPaperQualitativoFeedback({ commit }, payload) {
      api
        .get(`${config.baseUrl}api/shared/indicadores/feedback/paper_qualitativo/${payload}`)
        .then(res => {
          commit('setPaperQualitativoFeedback', res.data)
        })
    },
    loadQualidadeChamadaFeedback({ commit }) {
      api.get(`${config.baseUrl}api/shared/indicadores/feedback/qualidade_chamada/`).then(res => {
        commit('setQualidadeChamadaFeedback', res.data)
      })
    },
    loadComportamentoNegativoFeedback({ commit }) {
      api
        .get(`${config.baseUrl}api/shared/indicadores/feedback/comportamento_negativo/`)
        .then(res => {
          commit('setComportamentoNegativoFeedback', res.data)
        })
    },
    loadCanaisAutoatendimentoFeedback({ commit }) {
      api
        .get(`${config.baseUrl}api/shared/indicadores/feedback/canais_autoatendimento/`)
        .then(res => {
          commit('setCanaisAutoatendimento', res.data)
        })
    },
    loadInformaCanaisAutoatendimentoFeedback({ commit }) {
      api
        .get(`${config.baseUrl}api/shared/indicadores/feedback/informa_canais_autoatendimento/`)
        .then(res => {
          commit('setInformaCanaisAutoatendimento', res.data)
        })
    },
    loadCampanhasFeedback({ commit }) {
      api.get(`${config.baseUrl}api/shared/indicadores/feedback/campanhas/`).then(res => {
        commit('setCampanhasFeedback', res.data)
      })
    },
    loadMotivoInfratorRechamadaFeedback({ commit }) {
      api
        .get(`${config.baseUrl}api/shared/indicadores/feedback/motivo_infrator_rechamada/`)
        .then(res => {
          commit('setMotivoInfratorRechamadaFeedback', res.data)
        })
    },
    loadSubMotivoInfratorRechamadaFeedback({ commit }, payload) {
      api
        .get(
          `${config.baseUrl}api/shared/indicadores/feedback/subMotivo_infrator_rechamada/${payload}`
        )
        .then(res => {
          commit('setSubMotivoInfratorRechamadaFeedback', res.data)
        })
    },
    loadMicroMotivoInfratorRechamadaFeedback({ commit }, payload) {
      api
        .get(
          `${config.baseUrl}api/shared/indicadores/feedback/microMotivo_infrator_rechamada/${payload}`
        )
        .then(res => {
          commit('setMicroMotivoInfratorRechamadaFeedback', res.data)
        })
    }
  },
  getters: {
    dadosOperador(state) {
      return state.dadosOperador
    },
    segmentoCliente(state) {
      return state.segmentoCliente
    },
    motivoContato(state) {
      return state.motivoContato
    },
    subMotivoContatoFeedback(state) {
      return state.subMotivoContatoFeedback
    },
    segundoSubMotivoContatoFeedback(state) {
      return state.segundoSubMotivoContatoFeedback
    },
    campanhasFeedback(state) {
      return state.campanhasFeedback
    },
    areaTransferenciaFeedback(state) {
      return state.areaTransferenciaFeedback
    },
    motivoInfratorRechamadaFeedback(state) {
      return state.motivoInfratorRechamadaFeedback
    },
    subMotivoInfratorRechamadaFeedback(state) {
      return state.subMotivoInfratorRechamadaFeedback
    },
    microMotivoInfratorRechamadaFeedback(state) {
      return state.microMotivoInfratorRechamadaFeedback
    },
    paperQualitativoFeedback(state) {
      return state.paperQualitativoFeedback
    },
    qualidadeChamadaFeedback(state) {
      return state.qualidadeChamadaFeedback
    },
    canaisAutoatendimentoFeedback(state) {
      return state.canaisAutoatendimentoFeedback
    },
    informaCanaisAutoatendimentoFeedback(state) {
      return state.informaCanaisAutoatendimentoFeedback
    },
    comportamentoNegativoFeedback(state) {
      return state.comportamentoNegativoFeedback
    },
    inicioLigacaoSatisfacaoClienteFeedback(state) {
      return state.inicioLigacaoSatisfacaoClienteFeedback
    },
    finalLigacaoSatisfacaoClienteFeedback(state) {
      return state.finalLigacaoSatisfacaoClienteFeedback
    },
    sancoesFeedback(state) {
      return state.sancoesFeedback
    }
  }
}
