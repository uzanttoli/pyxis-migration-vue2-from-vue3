// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '../core/config'

export default {
  state: {
    dadosFila: [],
    dacDescricao: [{ DAC_DESCRICAO: 'NET COMBO', PRODUTO: 'COMBO' }]
  },
  mutations: {
    setDadosFila(state, payload) {
      state.dadosFila = payload
    },
    setDacDescricao(state, payload) {
      state.dacDescricao = payload
    }
  },
  actions: {
    loadDadosFila({ commit }, payload) {
      api.get(`${config.baseUrl}api/shared/fila/skill/${payload}`).then(res => {
        commit('setDadosFila', res.data)
      })
    },
    loadDacDescricao({ commit }) {
      api.get(`${config.baseUrl}api/shared/tmt/dac_descricao`).then(res => {
        commit('setDacDescricao', res.data)
      })
    }
  },
  getters: {
    dadosFila(state) {
      return state.dadosFila
    },
    dacDescricao(state) {
      return state.dacDescricao
    }
  }
}
