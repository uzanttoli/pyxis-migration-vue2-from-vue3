import config from '../core/config'
// import Vue from 'vue'
import api from '@/plugins/axios.js'

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
      api
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
