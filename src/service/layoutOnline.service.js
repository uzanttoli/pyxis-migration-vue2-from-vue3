import Vue from 'vue'
import config from '../core/config'

export default {
  state: {
    layoutOnlineResumo: [],
    layoutOnlineConfig: [],
    layoutOnlineAgrupamento: 'N1',
    layoutOnlineAgrupamentos: []
  },
  mutations: {
    setLayoutOnlineResumo(state, payload) {
      state.layoutOnlineResumo = payload
    },
    setLayoutOnlineConfig(state, payload) {
      state.layoutOnlineConfig = payload
    },
    setLayoutOnlineAgrupamentos(state, payload) {
      state.layoutOnlineAgrupamentos = payload
    },
    setLayoutOnlineAgrupamento(state, payload) {
      state.layoutOnlineAgrupamento = payload
    }
  },
  actions: {
    setAgrupamentoLayoutOnline({ commit }, payload) {
      commit('setLayoutOnlineAgrupamento', payload)
    },
    async loadAgrupamentosLayoutOnline({ commit }, produto) {
      let urlData = `${config.baseUrl}api/shared/layout_online/agrupamentos/`
      if (produto) urlData += produto + '/'
      await Vue.prototype.$api.get(urlData).then(res => {
        commit('setLayoutOnlineAgrupamentos', res.data)
      })
    },
    loadConfigLayoutOnline({ commit }, params) {
      let { produto, agrupamento } = params
      let url = `${config.baseUrl}api/shared/config/layout_online/`
      if (produto) {
        url += produto + '/'
        if (agrupamento) url += agrupamento + '/'
      }
      Vue.prototype.$api.get(url).then(res => {
        commit('setLayoutOnlineConfig', res.data)
      })
    },
    async loadProdutosLayoutOnline({ dispatch }) {
      let urlData = `${config.baseUrl}api/shared/layout_online/produtos/`
      await Vue.prototype.$api.get(urlData).then(res => {
        let produtos = res.data
        dispatch('setProdutos', produtos, { root: true })
      })
    }
  },
  getters: {
    layoutOnlineResumo(state) {
      return state.layoutOnlineResumo
    },
    layoutOnlineConfig(state) {
      return state.layoutOnlineConfig
    },
    layoutOnlineAgrupamento(state) {
      return state.layoutOnlineAgrupamento
    },
    layoutOnlineAgrupamentos(state) {
      return state.layoutOnlineAgrupamentos
    }
  }
}
