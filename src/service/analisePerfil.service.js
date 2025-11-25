import config from '../core/config'
// import Vue from 'vue'
import api from '@/plugins/axios.js'

export default {
  state: {
    minhaAnalise: [],
    inserirAnalise: false,
    gravarAnalise: false,
    mensagens: [],
    responderQuestionario: false,
    validacaoResposta: [],
    atualizarResponderAgora: false,
    responderHoje: [],
    atualizarResponderDepois: false,
    grupoPerfil: []
  },
  mutations: {
    setGrupoPerfil(state, payload) {
      state.grupoPerfil = payload
    },
    setMensagens(state, payload) {
      state.mensagens = payload
    },
    setGravarAnalise(state) {
      state.gravarAnalise = true
    },
    setMinhaAnalise(state, payload) {
      state.minhaAnalise = payload
    },
    setInserirAnalise(state) {
      state.inserirAnalise = true
    },
    setResponderQuestionario(state) {
      state.responderQuestionario = true
    },
    setValidacaoResposta(state, payload) {
      state.validacaoResposta = payload
    },
    setAtualizarResponderAgora(state) {
      state.atualizarResponderAgora = true
    },
    setResponderHoje(state, payload) {
      state.responderHoje = payload
    },
    setAtualizarResponderDepois(state) {
      state.atualizarResponderDepois = false
    }
  },
  actions: {
    loadGrupoPerfil({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/analise_perfil/grupo_perfil/${payload}`
      api.get(urlData).then(res => {
        commit('setGrupoPerfil', res.data[0])
      })
    },
    loadMensagens({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/analise_perfil/messages/${payload}`
      api.get(urlData).then(res => {
        commit('setMensagens', res.data[0])
      })
    },
    loadMinhaAnalise({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/analise_perfil/analise/${payload}`
      api.get(urlData).then(res => {
        commit('setMinhaAnalise', res.data)
      })
    },
    saveAnalise({ commit }, payload) {
      //EXCLUIR
      let urlData = `${config.baseUrl}api/shared/analise_perfil/analise`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setInserirAnalise')
      })
    },

    async gravarAnaliseComportamental({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/analise_perfil/analise_comportamental/`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      await api.post(urlData, getFormData(payload))
      commit('setGravarAnalise')
    },

    saveResponderAgora({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/analise_perfil/responder_questionario`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setResponderQuestionario')
      })
    },
    saveResponderDepois({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/analise_perfil/responder_questionario`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setResponderQuestionario')
      })
    },
    loadValidacaoResposta({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/analise_perfil/validacao_resposta/${payload}`
      api.get(urlData).then(res => {
        commit('setValidacaoResposta', res.data[0])
      })
    },
    saveAtualizarResponderAgora({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/analise_perfil/quest_valido`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setAtualizarResponderAgora')
      })
    },
    loadResponderHoje({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/analise_perfil/resposta_valida/${payload}`
      api.get(urlData).then(res => {
        commit('setResponderHoje', res.data[0])
      })
    },
    saveAtualizarResponderDepois({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/analise_perfil/atualizar_responder_depois`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setAtualizarResponderDepois')
      })
    }
  },
  getters: {
    responderHoje(state) {
      return state.responderHoje
    },
    mensagens(state) {
      return state.mensagens
    },
    minhaAnalise(state) {
      return state.minhaAnalise
    },
    validacaoResposta(state) {
      return state.validacaoResposta
    },
    grupoPerfil(state) {
      return state.grupoPerfil
    }
  }
}
