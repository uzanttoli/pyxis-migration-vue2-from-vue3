// import Vue from 'vue'
import api from '@/plugins/axios.js'
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
      api.get(`${config.baseUrl}api/shared/sobre_nos/sobreNos/`).then(res => {
        commit('setSobreNos', res.data)
      })
    },
    loadLogsPyxis({ commit }) {
      api
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
