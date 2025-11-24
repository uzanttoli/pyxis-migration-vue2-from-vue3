import Vue from 'vue'
import config from '../core/config'

export default {
  state: {
    minhaPerformanceOs: [],
    performanceOsMeusSupervisores: [],
    performanceOsMeusOperadores: []
  },
  mutations: {
    setPerformanceOsMeusOperadores(state, payload) {
      state.performanceOsMeusOperadores = payload
    },
    setMinhaPerformanceOs(state, payload) {
      state.minhaPerformanceOs = payload
    },
    setPerformanceOsMeusSupervisores(state, payload) {
      state.performanceOsMeusSupervisores = payload
    }
  },
  actions: {
    loadPerformanceOsMeusOperadores({ commit }, payload) {
      let urlData = `${config.baseUrl}${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setPerformanceOsMeusOperadores', res.data)
      })
    },
    loadPerformanceOsMeusSupervisores({ commit }, payload) {
      let urlData = `${config.baseUrl}${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setPerformanceOsMeusSupervisores', res.data)
      })
    },
    loadMinhaPerformanceOs({ commit }, payload) {
      let urlData = `${config.baseUrl}${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setMinhaPerformanceOs', res.data)
      })
    }
  },
  getters: {
    performanceOsMeusOperadores(state) {
      return state.performanceOsMeusOperadores
    },
    performanceOsMeusSupervisores(state) {
      return state.performanceOsMeusSupervisores
    },
    minhaPerformanceOs(state) {
      return state.minhaPerformanceOs
    }
  }
}
