import Vue from 'vue'
import config from '../core/config'

const getFormData = object =>
  Object.keys(object).reduce((FormData, key) => {
    FormData.append(key, object[key])
    return FormData
  }, new FormData())

export default {
  state: {
    listarCategories: [],
    agrupamentoLoja: [],
    inserirProduto: false,
    listarProdutos: [],
    inserirBanner: false,
    listarBanner: [],
    listarBannerCadastrados: [],
    listarProdutosExibicao: [],
    produtoCheckout: [],
    fixarProduto: false,
    fixarBanner: false,
    statusBanner: false,
    statusProduto: false,
    editarProduto: false,
    cadastrarVenda: false,
    cardGerencialEstoque: [],
    controleDeEntregas: [],
    produtoEntregue: false,
    inserirComentario: false,
    listarComentarios: [],
    responderComentario: false,
    avaliarProduto: false,
    inserirDadosCarrinho: false,
    minhasCompras: []
  },
  mutations: {
    setMinhasCompras(state, payload) {
      state.minhasCompras = payload
    },
    setInserirDadosCarrinho(state) {
      state.inserirDadosCarrinho = true
    },
    setAvaliarProduto(state) {
      state.avaliarProduto = true
    },
    setResponderComentario(state) {
      state.responderComentario = true
    },
    setListarComentarios(state, payload) {
      state.listarComentarios = payload
    },
    setInserirComentario(state) {
      state.inserirComentario = true
    },
    setProdutoEntregue(state) {
      state.produtoEntregue = true
    },
    setControleDeEntregas(state, payload) {
      state.controleDeEntregas = payload
    },
    setCardGerencialEstoque(state, payload) {
      state.cardGerencialEstoque = payload
    },
    setCadastrarVenda(state) {
      state.cadastrarVenda = true
    },
    setEditarProduto(state) {
      state.editarProduto = true
    },
    setStatusProduto(state) {
      state.statusProduto = true
    },
    setStatusBanner(state) {
      state.statusBanner = true
    },
    setListarBannerCadastrados(state, payload) {
      state.listarBannerCadastrados = payload
    },
    setFixarBanner(state) {
      state.fixarBanner = true
    },
    setFixarProduto(state) {
      state.fixarProduto = true
    },
    setProdutoCheckout(state, payload) {
      state.produtoCheckout = payload
    },
    setListarProdutosExibicao(state, payload) {
      state.listarProdutosExibicao = payload
    },
    setListarBanner(state, payload) {
      state.listarBanner = payload
    },
    setInserirBanner(state) {
      state.inserirBanner = true
    },
    setListarProdutos(state, payload) {
      state.listarProdutos = payload
    },
    setInserirProduto(state) {
      state.inserirProduto = true
    },
    setAgrupamentoLoja(state, payload) {
      state.agrupamentoLoja = payload
    },
    setListarCategories(state, payload) {
      state.listarCategories = payload
    }
  },
  actions: {
    async loadMinhasCompras({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/carrinho/${payload}`
      var res = await Vue.prototype.$api.get(urlData)
      commit('setMinhasCompras', res.data)
    },
    async saveInserirDadosCarrinho({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/carrinho`
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      commit('setInserirDadosCarrinho')
    },
    async saveAvaliarProduto({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/avaliacao`
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      commit('setAvaliarProduto')
    },
    async saveResponderComentario({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/responder_comentario`
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      commit('setResponderComentario')
    },
    loadListarComentarios({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/comentarios/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setListarComentarios', res.data)
      })
    },
    async saveInserirComentario({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/comentario`
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      commit('setInserirComentario')
    },
    async saveProdutoEntregue({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/produto_entregue`
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      commit('setProdutoEntregue')
    },
    loadControleDeEntregas({ commit }) {
      let urlData = `${config.baseUrl}api/shared/loja/controle_estoque/`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setControleDeEntregas', res.data)
      })
    },
    loadCardGerencialEstoque({ commit }) {
      let urlData = `${config.baseUrl}api/shared/loja/cards_estoque/`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setCardGerencialEstoque', res.data)
      })
    },
    async cadastrarVendaBanco({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/venda`
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      commit('setCadastrarVenda')
    },
    async editarProdutoCadastro({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/editar`
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      commit('setEditarProduto')
    },
    async atualizarStatusProduto({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/status_produto/`
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      commit('setStatusProduto')
    },
    async atualizarStatusBanner({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/status_banner/`
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      commit('setStatusBanner')
    },
    loadListarBannerCadastrados({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/banner_cadastrados/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setListarBannerCadastrados', res.data)
      })
    },
    async atualizarFixarBanner({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/fixar_banner/`
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      commit('setFixarBanner')
    },
    async atualizarFixarProduto({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/fixar_produto/`
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      commit('setFixarProduto')
    },
    loadProdutoCheckout({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/produto_checkout/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setProdutoCheckout', res.data[0])
      })
    },
    loadListarProdutosExibicao({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/produtos_loja/${payload.almope}/${payload.categoria}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setListarProdutosExibicao', res.data)
      })
    },
    loadListarBanner({ commit }) {
      let urlData = `${config.baseUrl}api/shared/loja/banner/`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setListarBanner', res.data)
      })
    },
    async saveInserirBanner({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/banner/`
      await Vue.prototype.$api.post(urlData, getFormData(payload))
      commit('setInserirBanner')
    },
    loadListarProdutos({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/produto/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setListarProdutos', res.data)
      })
    },
    saveInserirProduto({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/loja/produto/`
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setInserirProduto')
      })
    },
    async loadAgrupamentoLoja({ commit }) {
      let urlData = `${config.baseUrl}api/shared/loja/agrupamentos/`
      let res = await Vue.prototype.$api.get(urlData)
      commit('setAgrupamentoLoja', res.data)
    },
    loadListarCategories({ commit }) {
      let urlData = `${config.baseUrl}api/shared/loja/categories`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setListarCategories', res.data)
      })
    }
  },
  getters: {
    minhasCompras(state) {
      return state.minhasCompras
    },
    listarComentarios(state) {
      return state.listarComentarios
    },
    controleDeEntregas(state) {
      return state.controleDeEntregas
    },
    cardGerencialEstoque(state) {
      return state.cardGerencialEstoque
    },
    listarBannerCadastrados(state) {
      return state.listarBannerCadastrados
    },
    produtoCheckout(state) {
      return state.produtoCheckout
    },
    listarProdutosExibicao(state) {
      return state.listarProdutosExibicao
    },
    listarBanner(state) {
      return state.listarBanner
    },
    listarProdutos(state) {
      return state.listarProdutos
    },
    agrupamentoLoja(state) {
      return state.agrupamentoLoja
    },
    listarCategories(state) {
      return state.listarCategories
    }
  }
}
