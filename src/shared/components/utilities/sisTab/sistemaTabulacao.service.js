import Vue from 'vue'
import config from '../../../../core/config'

export default {
  state: {
    unidadeNegocio: [],
    tipoSolicitacao: [],
    detalheSolicitacao: []
  },
  mutations: {
    setUnidadeNegocio(state, unidadeNegocio) {
      state.unidadeNegocio = unidadeNegocio
    },
    setTipoSolicitacao(state, tipoSolicitacao) {
      state.tipoSolicitacao = tipoSolicitacao
    },
    setDetalheSolicitacao(state, detalheSolicitacao) {
      state.detalheSolicitacao = detalheSolicitacao
    }
  },
  actions: {
    async loadUnidadeNegocio({ commit }) {
      let urlData = `${config.baseUrl}api/shared/demandas_supervisor/unidade_negocio/`
      await Vue.prototype.$api.get(urlData).then(res => {
        commit('setUnidadeNegocio', res.data)
      })
    },

    async loadTipoSolicitacao({ commit }, produto) {
      let urlData = `${config.baseUrl}api/shared/demandas_supervisor/tipo_solicitacao/`
      if (produto) urlData += produto
      await Vue.prototype.$api.get(urlData).then(res => {
        commit('setTipoSolicitacao', res.data)
      })
    },

    async loadDetalheSolicitacao({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/demandas_supervisor/detalhe_solicitacao/`
      if (payload) urlData += payload.solicitacao + '/' + payload.produto
      await Vue.prototype.$api.get(urlData).then(res => {
        commit('setDetalheSolicitacao', res.data)
      })
    }
  },
  getters: {
    unidadeNegocio(state) {
      return state.unidadeNegocio
    },
    tipoSolicitacao(state) {
      return state.tipoSolicitacao
    },
    detalheSolicitacao(state) {
      return state.detalheSolicitacao
    }
  }
}
