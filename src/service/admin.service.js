import Vue from 'vue'
import config from '../core/config'

export default {
  state: {
    logsPyxis: [],
    sobreNos: []
  },
  mutations: {
    setLogsPyxis(state, payload) {
      state.logsPyxis = payload
    },
    setSobreNos(state, payload) {
      state.sobreNos = payload
    }
  },
  actions: {
    loadSobreNos({ commit }) {
      Vue.prototype.$api.get(`${config.baseUrl}api/shared/sobre_nos/sobreNos/`).then(res => {
        commit('setSobreNos', res.data)
      })
    },
    loadLogsPyxis({ commit }) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/registro_log_pyxis/logsPyxis`)
        .then(res => {
          commit('setLogsPyxis', res.data)
        })
    }
  },
  getters: {
    sobreNos(state) {
      return state.sobreNos
    },
    logsPyxis(state) {
      return state.logsPyxis
    }
  }
}
