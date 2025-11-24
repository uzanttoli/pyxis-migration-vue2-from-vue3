import Vue from 'vue'
import config from '../core/config'

export default {
  state: {
    mplayPerformanceHora: [],
    mplayComparativoIntervalo: []
  },
  mutations: {
    setMplayComparativoIntervalo(state, payload) {
      state.mplayComparativoIntervalo = payload
    },
    setMplayPerformanceHora(state, payload) {
      state.mplayPerformanceHora = payload
    }
  },
  actions: {
    loadMplayComparativoIntervalo({ commit }, payload) {
      let urlData = `${config.baseUrl}${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setMplayComparativoIntervalo', res.data)
      })
    },
    loadmplayPerformanceHora({ commit }, payload) {
      let urlData = `${config.baseUrl}${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setMplayPerformanceHora', res.data)
      })
    }
  },
  getters: {
    mplayComparativoIntervalo(state) {
      return state.mplayComparativoIntervalo
    },
    mplayPerformanceHora(state) {
      return state.mplayPerformanceHora
    }
  }
}
