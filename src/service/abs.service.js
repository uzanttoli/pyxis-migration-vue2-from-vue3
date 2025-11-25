// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '../core/config'

export default {
  state: {
    absResumo: [],
    absConfig: [],
    absAgrupamentos: [],
    absAgrupamento: 'N1'
  },
  mutations: {
    // setAbsCampanha(state, payload) {
    //     state.absResumo = payload;
    // },
    setAbsConfig(state, payload) {
      state.absConfig = payload
    },
    setAbsAgrupamentos(state, payload) {
      state.absAgrupamentos = payload
    },
    setAbsAgrupamento(state, payload) {
      state.absAgrupamento = payload
    }
  },
  actions: {
    setAgrupamentoAbs({ commit }, payload) {
      commit('setAbsAgrupamento', payload)
    },
    async loadAgrupamentosAbs({ commit }, produto) {
      let urlData = `${config.baseUrl}api/shared/abs/agrupamentos/`
      if (produto) urlData += produto + '/'
      await api.get(urlData).then(res => {
        commit('setAbsAgrupamentos', res.data)
      })
    },
    async loadConfigAbs({ commit }, params) {
      let { produto, agrupamento } = params
      let url = `${config.baseUrl}api/shared/config/abs/`
      if (produto) {
        url += produto + '/'
        if (agrupamento) url += agrupamento + '/'
      }
      await api.get(url).then(res => {
        commit('setAbsConfig', res.data)
      })
    },
    async loadProdutosAbs({ dispatch }) {
      let urlData = `${config.baseUrl}api/shared/abs/produtos/`
      await api.get(urlData).then(res => {
        let produtos = res.data
        dispatch('setProdutos', produtos, { root: true })
      })
    }
    // async loadAbsCampanha({ commit }, produto) {
    //     let url = `${config.baseUrl}api/shared/abs/campanha/`

    //     if (produto)
    //         url += produto
    //     await api.get(url).then((res) => {
    //         commit('setAbsCampanha', res.data)
    //     });
    // }
  },
  getters: {
    // absResumo(state) {
    //     return state.absResumo;
    // },
    absConfig(state) {
      return state.absConfig
    },
    absAgrupamentos(state) {
      return state.absAgrupamentos
    },
    absAgrupamento(state) {
      return state.absAgrupamento
    }
  }
}
