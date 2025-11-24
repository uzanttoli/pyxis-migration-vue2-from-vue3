import Vue from 'vue'
import config from '../core/config.js'

const link = 'api/shared/user/turno/'

export default {
  state: {
    turno: []
  },
  mutations: {
    setTurno(state, payload) {
      state.turno = payload
    }
  },
  actions: {
    loadTurno({ commit }, almope) {
      let urlData = `${config.baseUrl}${link}${almope}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setTurno', res.data[0])
      })
    }
  },
  getters: {
    turno(state) {
      return state.turno
    }
  }
}
