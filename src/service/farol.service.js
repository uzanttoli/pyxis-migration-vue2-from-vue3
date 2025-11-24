import config from '../core/config'
import Vue from 'vue'

export default {
  state: {
    intervalosFarol: [],
    regionalFarol: [],
    dadosFarol: [],
    resultadoPainel: []
  },
  mutations: {
    setResultadoPainel(state, resultado) {
      state.resultadoPainel = resultado
    },
    setIntervalosFarol(state, produto) {
      state.intervalosFarol = produto
    },
    setRegionalFarol(state, regional) {
      state.regionalFarol = regional
    },
    setDadosFarol(state, dados) {
      state.dadosFarol = dados
    }
  },
  actions: {
    loadResultadoPainel({ commit }, resultadoPainel) {
      let urlData = `${config.baseUrl}api/shared/farol/resultado_total/${resultadoPainel.produto}/${resultadoPainel.regional}/${resultadoPainel.tipo}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setResultadoPainel', res.data)
      })
    },
    loadIntervalosFarol({ commit }, produto) {
      let urlData = `${config.baseUrl}api/shared/farol/intervalos/${produto}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setIntervalosFarol', res.data)
      })
    },
    loadRegionalFarol({ commit }, regional) {
      let urlData = `${config.baseUrl}api/shared/farol/regional/${regional}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setRegionalFarol', res.data)
      })
    },
    async loadDadosFarol({ commit }, dados) {
      let urlData = `${config.baseUrl}api/shared/farol/dados/${dados.produto}/${dados.regional}/${dados.tipo}`
      await Vue.prototype.$api.get(urlData).then(res => {
        commit('setDadosFarol', res.data)
      })
    }
  },
  getters: {
    resultadoPainel(state) {
      return state.resultadoPainel
    },
    intervalosFarol(state) {
      return state.intervalosFarol
    },
    regionalFarol(state) {
      return state.regionalFarol
    },
    dadosFarol(state) {
      return state.dadosFarol
    }
  }
}
