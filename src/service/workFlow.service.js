import config from '../core/config'
// import Vue from 'vue'
import api from '@/plugins/axios.js'

export default {
  state: {
    configWorkflow: [],
    configLinhaMudaWorkflow: [],
    configAcompanhamentoGeral: [],
    agrupamentosWorkflow: []
  },
  mutations: {
    setConfigAcompanhamentoGeral(state, payload) {
      state.configAcompanhamentoGeral = payload
    },
    setConfigLinhaMudaWorkflow(state, payload) {
      state.configLinhaMudaWorkflow = payload
    },
    setConfigWorkflow(state, payload) {
      state.configWorkflow = payload
    },
    setAgrupamentosWorkflow(state, payload) {
      state.agrupamentosWorkflow = payload
    }
  },
  actions: {
    loadConfigAcompanhamentoGeral({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/workflow/config_acompanhamento_geral/${payload}`
      api.get(urlData).then(res => {
        commit('setConfigAcompanhamentoGeral', res.data)
      })
    },
    loadConfigLinhaWorkflow({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/workflow/config_linha_muda/${payload}`
      api.get(urlData).then(res => {
        commit('setConfigLinhaMudaWorkflow', res.data)
      })
    },
    loadConfigWorkflow({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/workflow/config/${payload}`
      api.get(urlData).then(res => {
        commit('setConfigWorkflow', res.data)
      })
    },
    loadAgrupamentosWorkflow({ commit }) {
      let urlData = `${config.baseUrl}api/shared/workflow/agrupamentos_shortcall/`
      api.get(urlData).then(res => {
        commit('setAgrupamentosWorkflow', res.data)
      })
    }
  },
  getters: {
    configAcompanhamentoGeral(state) {
      return state.configAcompanhamentoGeral
    },
    configLinhaMudaWorkflow(state) {
      return state.configLinhaMudaWorkflow
    },
    agrupamentosWorkflow(state) {
      return state.agrupamentosWorkflow
    },
    configWorkflow(state) {
      return state.configWorkflow
    }
  }
}
