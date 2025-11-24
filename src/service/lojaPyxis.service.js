import Vue from 'vue'
import config from '../core/config.js'

export default {
  state: {
    inserirProdutos: false,
    atualizarProduto: false,
    comprarProduto: false,
    atualizarVisibilidadeDoProduto: false,
    listProducts: [],
    myCash: 0.0,
    resgateIsValid: []
  },
  mutations: {
    setResgateIsValid(state, payload) {
      state.resgateIsValid = payload
    },
    setMyCash(state, payload) {
      state.myCash = payload
    },
    setAtualizarVisibilidadeDoProduto(state) {
      state.atualizarVisibilidadeDoProduto = true
    },
    setAtualizarProduto(state) {
      state.atualizarProduto = true
    },
    setListProducts(state, payload) {
      state.listProducts = payload
    },
    setInserirProdutos(state) {
      state.inserirProdutos = true
    },
    setComprarProduto(state) {
      state.comprarProduto = true
    }
  },
  actions: {
    async loadResgateIsValid({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/brindes/find_by_id/${payload}`
      var result = await Vue.prototype.$api.get(urlData)
      commit('setResgateIsValid', result.data[0].PERMITIR_RESGATE)
    },
    async loadMyCash({ commit }, paylaod) {
      let urlData = `${config.baseUrl}api/shared/brindes/my_coins/${paylaod}`
      var res = await Vue.prototype.$api.get(urlData)
      commit('setMyCash', res.data)
    },
    async loadListProducts({ commit }) {
      let urlData = `${config.baseUrl}api/shared/brindes/get_list_products`
      let res = await Vue.prototype.$api.get(urlData)
      await commit('setListProducts', res.data)
    },
    async inserirProdutosActions({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/brindes/insert`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      await commit('setInserirProdutos')
    },
    async atualizarProdutoActions({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/brindes/edit`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      await Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setAtualizarProduto')
      })
    },
    async atualizarVisibilidadeDoProdutoActions({ commit }, paylaod) {
      let urlData = `${config.baseUrl}api/shared/brindes/delete`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      await Vue.prototype.$api.post(urlData, getFormData(paylaod))
      await commit('setAtualizarVisibilidadeDoProduto')
    },

    async comprarProdutoActions({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/brindes/compra`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      await commit('setComprarProduto')
    }
  },
  getters: {
    resgateIsValid(state) {
      return state.resgateIsValid
    },
    myCash(state) {
      return state.myCash
    },
    listProducts(state) {
      return state.listProducts
    }
  }
}
