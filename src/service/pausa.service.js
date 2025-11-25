// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '../core/config'

export default {
  state: {
    pausasConfig: [],
    pausasAgrupamento: 'N1',
    pausasAgrupamentos: []
  },
  mutations: {
    setPausasResumo(state, payload) {
      state.pausasResumo = payload
    },
    setPausasConfig(state, payload) {
      state.pausasConfig = payload
    },
    setPausasAgrupamentos(state, payload) {
      state.pausasAgrupamentos = payload
    },
    setPausasAgrupamento(state, payload) {
      state.pausasAgrupamento = payload
    }
  },
  actions: {
    setPausasAgrupamento({ commit }, payload) {
      commit('setPausasAgrupamento', payload)
    },
    async loadAgrupamentosPausas({ commit }, produto) {
      let urlData = `${config.baseUrl}api/shared/pausas/agrupamentos/`
      if (produto) urlData += produto + '/'
      await api.get(urlData).then(res => {
        commit('setPausasAgrupamentos', res.data)
      })
    },
    loadConfigPausas({ commit }, params) {
      let { produto, agrupamento } = params
      let url = `${config.baseUrl}api/shared/config/pausas/`
      if (produto) {
        url += produto + '/'
        if (agrupamento) url += agrupamento + '/'
      }
      api.get(url).then(res => {
        commit('setPausasConfig', res.data)
      })
    },
    async loadProdutosPausas({ dispatch }, payload) {
      let urlData = `${config.baseUrl}api/shared/pausas/produtos/${payload.perfil}/${payload.produto}`
      await api.get(urlData).then(res => {
        let produtos = res.data
        dispatch('setProdutos', produtos, { root: true })
      })
    },
    async loadResumoPausasDac({ dispatch }, dac) {
      let url = `${config.baseUrl}api/shared/pausas/resumo_dac/`
      if (dac) {
        url += dac + '/'
      }
      await api.get(url).then(res => {
        let resumoPausas = res.data[0]
        dispatch('setResumoPausas', resumoPausas, { root: true })
      })
    }
  },
  getters: {
    pausasConfig(state) {
      return state.pausasConfig
    },
    pausasAgrupamento(state) {
      return state.pausasAgrupamento
    },
    pausasAgrupamentos(state) {
      return state.pausasAgrupamentos
    }
  }
}
