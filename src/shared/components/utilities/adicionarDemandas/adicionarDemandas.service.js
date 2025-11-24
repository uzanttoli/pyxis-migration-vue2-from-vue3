import Vue from 'vue'
import config from '../../../../core/config'

export default {
  state: {
    unidadeNegocio: [],
    tipoSolicitacao: [],
    detalheSolicitacao: [],
    lastId: false
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
    },
    setSaveStatusAdicionarDemandas(state) {
      state.lastId = true
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
    },
    saveDataFormAdicionarDemandas({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/demandas_supervisor/create/`
      let getFormData = object =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key])
          return formData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setSaveStatusAdicionarDemandas')
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
