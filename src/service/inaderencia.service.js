import Vue from 'vue'
import config from '../core/config'

export default {
  state: {
    inaderenciaResumo: [],
    inaderenciaConfig: [],
    inaderenciaAgrupamentos: [],
    inaderenciaAgrupamento: 'N1'
  },
  mutations: {
    setInaderenciaResumo(state, payload) {
      state.inaderenciaResumo = payload
    },
    setInaderenciaConfig(state, payload) {
      state.inaderenciaConfig = payload
    },
    setInaderenciaAgrupamentos(state, payload) {
      state.inaderenciaAgrupamentos = payload
    },
    setInaderenciaAgrupamento(state, payload) {
      state.inaderenciaAgrupamento = payload
    }
  },
  actions: {
    setAgrupamentoInaderencia({ commit }, payload) {
      commit('setInaderenciaAgrupamento', payload)
    },
    async loadAgrupamentosInaderencia({ commit }, produto) {
      let urlData = `${config.baseUrl}api/shared/inaderencia/agrupamentos/`
      if (produto) urlData += produto + '/'
      await Vue.prototype.$api.get(urlData).then(res => {
        commit('setInaderenciaAgrupamentos', res.data)
      })
    },

    loadConfigInaderencia({ commit }, params) {
      let { produto, agrupamento } = params
      let url = `${config.baseUrl}api/shared/config/inaderencia/`
      if (produto) {
        url += produto + '/'
        if (agrupamento) url += agrupamento + '/'
      }
      Vue.prototype.$api.get(url).then(res => {
        commit('setInaderenciaConfig', res.data)
      })
    },
    async loadProdutosInaderencia({ dispatch }, payload) {
      let urlData = `${config.baseUrl}api/shared/inaderencia/produtos/${payload.perfil}/${payload.produto}`
      await Vue.prototype.$api.get(urlData).then(res => {
        let produtos = res.data
        dispatch('setProdutos', produtos, { root: true })
      })
    }
  },
  getters: {
    inaderenciaResumo(state) {
      return state.inaderenciaResumo
    },
    inaderenciaConfig(state) {
      return state.inaderenciaConfig
    },
    inaderenciaAgrupamentos(state) {
      return state.inaderenciaAgrupamentos
    },
    inaderenciaAgrupamento(state) {
      return state.inaderenciaAgrupamento
    }
  }
}
