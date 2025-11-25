// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '@/core/config'

export default {
  state: {
    dadosPorAlmope: [],
    motivosFormVenda: [],
    submotivosFormVenda: [],
    tipoFormVenda: [],
    produtoFormVenda: [],
    motivosClaroNaoVendeu: [],
    operadorasConcorrentes: [],
    produtosVendaClaro: [],
    inserirDadosVenda: false
  },
  mutations: {
    setSubmotivosFormVenda(state, payload) {
      state.submotivosFormVenda = payload
    },
    setDadosPorAlmope(state, payload) {
      state.dadosPorAlmope = payload
    },
    setMotivoFormVenda(state, payload) {
      state.motivosFormVenda = payload
    },
    setTipoFormVenda(state, payload) {
      state.tipoFormVenda = payload
    },
    setProdutoFormVenda(state, payload) {
      state.produtoFormVenda = payload
    },
    setMotivosClaroNaoVendeu(state, payload) {
      state.motivosClaroNaoVendeu = payload
    },
    setOperadorasConcorrentes(state, payload) {
      state.operadorasConcorrentes = payload
    },
    setProdutosVendaClaro(state, payload) {
      state.produtosVendaClaro = payload
    },
    setInserirVendasNet(state) {
      state.inserirDadosVenda = true
    }
  },
  actions: {
    loadSubmotivosFormVenda({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/televendas/submotivos_venda/${payload}`
      api.get(urlData).then(res => {
        commit('setSubmotivosFormVenda', res.data)
      })
    },
    async saveDadosVendasNet({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/televendas/create/`
      let getFormData = object =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key])
          return formData
        }, new FormData())
      await api.post(urlData, getFormData(payload)).then(() => {
        commit('setInserirVendasNet')
      })
    },
    loadDadosPorAlmope({ commit }, payload) {
      api
        .get(`${config.baseUrl}api/shared/televendas/dados_por_almope/${payload}`)
        .then(res => {
          commit('setDadosPorAlmope', res.data)
        })
    },
    loadMotivosFormVenda({ commit }, payload) {
      payload = payload == 1 ? 'CLIENTE_ELEGIVEL' : 'MOTIVO_NAO_ACEITE'
      let urlData = `${config.baseUrl}api/shared/televendas/dados_campo/${payload}`
      // let urlData = `${config.baseUrl}api/shared/televendas/motivos_venda/${payload}`;
      api.get(urlData).then(res => {
        commit('setMotivoFormVenda', res.data)
      })
    },
    loadTipoFormVenda({ commit }) {
      api.get(`${config.baseUrl}api/shared/televendas/tipo_venda/`).then(res => {
        commit('setTipoFormVenda', res.data)
      })
    },
    loadProdutoFormVenda({ commit }) {
      api.get(`${config.baseUrl}api/shared/televendas/produto_venda/`).then(res => {
        commit('setProdutoFormVenda', res.data)
      })
    },
    loadMotivosClaroNaoVendeu({ commit }) {
      api
        .get(`${config.baseUrl}api/shared/televendas/claro_nao_vendeu/`)
        .then(res => {
          commit('setMotivosClaroNaoVendeu', res.data)
        })
    },
    loadOperadorasConcorrentes({ commit }) {
      api
        .get(`${config.baseUrl}api/shared/televendas/operadoras_concorrentes/`)
        .then(res => {
          commit('setOperadorasConcorrentes', res.data)
        })
    },
    loadProdutosVendaClaro({ commit }) {
      api
        .get(`${config.baseUrl}api/shared/televendas/produtos_venda_claro/`)
        .then(res => {
          commit('setProdutosVendaClaro', res.data)
        })
    }
  },
  getters: {
    submotivosFormVenda(state) {
      return state.submotivosFormVenda
    },
    motivosFormVenda(state) {
      return state.motivosFormVenda
    },
    dadosPorAlmope(state) {
      return state.dadosPorAlmope
    },
    tipoFormVenda(state) {
      return state.tipoFormVenda
    },
    produtoFormVenda(state) {
      return state.produtoFormVenda
    },
    motivosClaroNaoVendeu(state) {
      return state.motivosClaroNaoVendeu
    },
    operadorasConcorrentes(state) {
      return state.operadorasConcorrentes
    },
    produtosVendaClaro(state) {
      return state.produtosVendaClaro
    }
  }
}
