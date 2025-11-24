import config from '../core/config'
import Vue from 'vue'

export default {
  state: {
    resumoOperador: []
  },
  mutations: {
    setResumoOperador(state, payload) {
      state.resumoOperador = payload
    }
  },
  actions: {
    loadResumoOperador({ commit }, payload) {
      Vue.prototype.$api
        .get(
          `${config.baseUrl}api/shared/supervisor/base_resumo_operador/${payload.nome}/${payload.tipo}`
        )
        .then(res => {
          commit('setResumoOperador', res.data)
        })
    }
  },
  getters: {
    resumoOperador(state) {
      return state.resumoOperador
    }
  }
}
