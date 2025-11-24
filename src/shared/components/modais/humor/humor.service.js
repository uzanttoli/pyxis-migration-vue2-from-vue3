import Vue from 'vue'
import config from '../../../../../src/core/config'

export default {
  state: {
    dialogExibirHumor: false,
    imgSelecionado: null,
    myHumor: null,
    historyHumor: [],
    lastId: false
  },
  mutations: {
    setHistoryHumor(state, payload) {
      state.historyHumor = payload
    },
    setDialogExibirHumor(state, payload) {
      state.dialogExibirHumor = payload
    },
    setEnviarFormularioHumor(state) {
      state.lastId = true
    },
    setImgSelecionado(state, payload) {
      if (state.myHumor) state.myHumor.HUMOR = payload
    },
    setMeuHumor(state, payload) {
      state.myHumor = payload
    }
  },
  actions: {
    loadHistoryHumor({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/humor/historico_humor/${payload}`)
        .then(res => {
          commit('setHistoryHumor', res.data)
        })
    },
    loadMyHumor({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/humor/myHumor/`
      Vue.prototype.$api.get(urlData + `${payload}`).then(res => {
        commit('setMeuHumor', res.data[0])
      })
    },
    loadImgSelecionado({ commit }, payload) {
      commit('setImgSelecionado', payload)
    },
    setDialogExibirHumor({ commit }, payload) {
      commit('setDialogExibirHumor', payload)
    },
    salvarDadosHumor({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/humor/create/`
      let getFormDataHumor = object =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key])
          return formData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormDataHumor(payload)).then(() => {
        commit('setEnviarFormularioHumor')
      })
    }
  },
  getters: {
    historyHumor(state) {
      return state.historyHumor
    },
    dialogExibirHumor(state) {
      return state.dialogExibirHumor
    },
    myHumor(state) {
      return state.myHumor
    }
  }
}
