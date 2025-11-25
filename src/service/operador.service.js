// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '../core/config'

export default {
  state: {
    meusIndicadores: [],
    meuResultado: [],
    escalaTrabalho: [],
    meusDados: [],
    meusIndevidos: [],
    meusTempos: [],
    minhaEvolucao: [],
    lastId: false
  },
  mutations: {
    setMinhaEvolucao(state, payload) {
      state.minhaEvolucao = payload
    },
    setMeusIndicadores(state, payload) {
      state.meusIndicadores = payload
    },
    setMeuResultado(state, payload) {
      state.meuResultado = payload
    },
    setEscalaTrabalho(state, payload) {
      state.escalaTrabalho = payload
    },
    setMeusDados(state, payload) {
      state.meusDados = payload
    },
    setMeusIndevidos(state, payload) {
      state.meusIndevidos = payload
    },
    setMeusTempos(state, payload) {
      state.meusTempos = payload
    },
    setUpdateJustificativaIndevidas(state) {
      state.lastId = true
    }
  },
  actions: {
    loadMinhaEvolucao({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/operador/minhaEvolucao/${payload}`
      api.get(urlData).then(res => {
        commit('setMinhaEvolucao', res.data)
      })
    },
    loadMeusIndicadores({ commit }, payload) {
      api
        .get(
          `${config.pyxisReceptivoUrl}receptivo/dados-online/meus-indicadores/operador?almope=${payload}`
        )
        .then(res => {
          commit('setMeusIndicadores', res.data)
        })
      // .get(`${config.baseUrl}api/shared/operador/meus_indicadores/${payload}`)
      // .then((res) => {
      //   commit("setMeusIndicadores", res.data);
      // });
    },
    loadMeuResultado({ commit }, payload) {
      api
        .get(`${config.baseUrl}api/shared/operador/meus_resultados/${payload}`)
        .then(res => {
          commit('setMeuResultado', res.data)
        })
    },
    loadEscalaTrabalho({ commit }, payload) {
      api
        .get(`${config.baseUrl}api/shared/operador/organico/${payload}`)
        .then(res => {
          commit('setEscalaTrabalho', res.data)
        })
    },
    loadMeusDados({ commit }, payload) {
      api
        .get(`${config.baseUrl}api/shared/operador/organico_portal/${payload}`)
        .then(res => {
          commit('setMeusDados', res.data)
        })
    },
    loadMeusIndevidos({ commit }, payload) {
      api
        .get(`${config.baseUrl}api/shared/operador/retroalimentacao_indevidas/${payload.usuario}`)
        .then(res => {
          commit('setMeusIndevidos', res.data)
        })
    },
    loadloadMeusTempos({ commit }, payload) {
      api.get(`${config.baseUrl}api/shared/operador/pausas/${payload}`).then(res => {
        commit('setMeusTempos', res.data)
      })
    },
    updateDataFormJustificativaIndevidas({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/operador/update`
      let getFormData = object =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key])
          return formData
        }, new FormData())
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setUpdateJustificativaIndevidas')
      })
    }
  },
  getters: {
    minhaEvolucao(state) {
      return state.minhaEvolucao
    },
    meusIndicadores(state) {
      return state.meusIndicadores
    },
    meuResultado(state) {
      return state.meuResultado
    },
    escalaTrabalho(state) {
      return state.escalaTrabalho
    },
    meusDados(state) {
      return state.meusDados
    },
    meusIndevidos(state) {
      return state.meusIndevidos
    },
    meusTempos(state) {
      return state.meusTempos
    }
  }
}
