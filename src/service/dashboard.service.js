import Vue from 'vue'
import config from '../core/config'

export default {
  state: {
    dashboardCampanhas: ['NET E2E'],
    absResumo: [],
    absCombo: [],
    absMtf: [],
    absRetencao: []
  },
  mutations: {
    setAbsCampanha(state, payload) {
      switch (payload.campanha) {
        case 'MTF N1 TOTAL':
          state.absMtf = payload.data
          break
        case 'COMBO N1 TOTAL':
          state.absCombo = payload.data
          break
        case 'RETENCOES':
          state.absRetencao = payload.data
          break
      }
    },
    setDashboardCampanhas(state, payload) {
      state.dashboardCampanhas = payload
    }
  },
  actions: {
    setDashboardCampanhas({ commit }, campanhas) {
      commit('setDashboardCampanhas', campanhas)
    },
    async loadAbsCampanha({ commit }, produto) {
      let url = `${config.baseUrl}api/shared/abs/campanha/`

      if (produto) url += produto
      await Vue.prototype.$api.get(url).then(res => {
        commit('setAbsCampanha', { campanha: produto, data: res.data })
      })
    }
  },
  getters: {
    absResumo(state) {
      return state.absResumo
    },
    dashboardCampanhas(state) {
      return state.dashboardCampanhas
    },
    absCombo(state) {
      return state.absCombo
    },
    absMtf(state) {
      return state.absMtf
    },
    absRetencao(state) {
      return state.absRetencao
    }
  }
}
