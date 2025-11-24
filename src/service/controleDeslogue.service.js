import Vue from 'vue'
import config from '../core/config'

export default {
  state: {
    controleDeslogueResumo: [],
    controleDeslogueConfig: [],
    controleDeslogueAgrupamentos: [],
    controleDeslogueAgrupamento: 'N1'
  },
  mutations: {
    setControleDeslogueResumo(state, payload) {
      state.controleDeslogueResumo = payload
    },
    setControleDeslogueConfig(state, payload) {
      state.controleDeslogueConfig = payload
    },
    setControleDeslogueAgrupamentos(state, payload) {
      state.controleDeslogueAgrupamentos = payload
    },
    setControleDeslogueAgrupamento(state, payload) {
      state.controleDeslogueAgrupamento = payload
    }
  },
  actions: {
    setAgrupamentoControleDeslogue({ commit }, payload) {
      commit('setControleDeslogueAgrupamento', payload)
    },
    async loadAgrupamentosControleDeslogue({ commit }, produto) {
      let urlData = `${config.baseUrl}api/shared/controle_deslogue/agrupamentos/`
      if (produto) urlData += produto + '/'
      await Vue.prototype.$api.get(urlData).then(res => {
        commit('setControleDeslogueAgrupamentos', res.data)
      })
    },

    loadConfigControleDeslogue({ commit }, params) {
      let { produto, agrupamento } = params
      let url = `${config.baseUrl}api/shared/config/controle_deslogue/`
      if (produto) {
        url += produto + '/'
        if (agrupamento) url += agrupamento + '/'
      }
      Vue.prototype.$api.get(url).then(res => {
        commit('setControleDeslogueConfig', res.data)
      })
    },
    async loadProdutosControleDeslogue({ dispatch }) {
      let urlData = `${config.baseUrl}api/shared/controle_deslogue/produtos/`
      await Vue.prototype.$api.get(urlData).then(res => {
        let produtos = res.data
        dispatch('setProdutos', produtos, { root: true })
      })
    }
  },
  getters: {
    controleDeslogueResumo(state) {
      return state.controleDeslogueResumo
    },
    controleDeslogueConfig(state) {
      return state.controleDeslogueConfig
    },
    controleDeslogueAgrupamentos(state) {
      return state.controleDeslogueAgrupamentos
    },
    controleDeslogueAgrupamento(state) {
      return state.controleDeslogueAgrupamento
    }
  }
}
