import Vue from 'vue'
import config from '../core/config'

export default {
  state: {
    resultadoDiaDia: []
  },
  mutations: {
    setResultadoDiaDia(state, payload) {
      state.resultadoDiaDia = payload
    }
  },
  actions: {
    loadResultadoDiaDia({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/supervisor/indicador_dia_supervisor/${payload}`)
        .then(res => {
          commit('setResultadoDiaDia', res.data)
        })
    }
  },
  getters: {
    resultadoDiaDia(state) {
      return state.resultadoDiaDia
    }
  }
}
