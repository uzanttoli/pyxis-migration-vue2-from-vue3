import Vue from 'vue'
import config from '../../../core/config'

export default {
  state: {
    absDadosGraficos: [],
    historicoLogPyxis: [],
    dadosErroSistemico: [],
    falhaErroSistemico: []
  },
  mutations: {
    setDadosErroSistemico(state, payload) {
      state.dadosErroSistemico = payload
    },
    setAbsDadosGraficos(state, payload) {
      state.absDadosGraficos = payload
    },
    setHistoricoLogPyxis(state, payload) {
      state.historicoLogPyxis = payload
    },
    setFalhaErroSistemico(state, payload) {
      state.falhaErroSistemico = payload
    }
  },
  actions: {
    loadFalhaErroSistemico({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/graficos/falha_erro_sistemico/`
      let falha = (urlData += `${payload}`)
      Vue.prototype.$api.get(falha).then(res => {
        if (res != []) {
          commit('setFalhaErroSistemico', res.data)
        }
      })
    },
    loadDadosErroSistemico({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/graficos/dados_erro_sistemico/`
      let bandeira = (urlData += `${payload}`)
      Vue.prototype.$api.get(bandeira).then(res => {
        if (res != []) {
          commit('setDadosErroSistemico', res.data)
        }
      })
    },
    loadAbsDadosGraficos({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/graficos/absDadosGraficos/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setAbsDadosGraficos', res.data)
      })
    },
    loadHistoricoLogPyxis({ commit }) {
      let urlData = `${config.baseUrl}api/shared/registro_log_pyxis/historicoAcessoPyxis`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setHistoricoLogPyxis', res.data)
      })
    }
  },
  getters: {
    falhaErroSistemico(state) {
      return state.falhaErroSistemico
    },
    dadosErroSistemico(state) {
      return state.dadosErroSistemico
    },
    absDadosGraficos(state) {
      return state.absDadosGraficos
    },
    historicoLogPyxis(state) {
      return state.historicoLogPyxis
    }
  }
}
