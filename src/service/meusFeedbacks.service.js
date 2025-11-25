// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '../core/config'

export default {
  state: {
    meusFeedbacks: [],
    lastId: false
  },
  mutations: {
    setMeusFeedbacks(state, payload) {
      state.meusFeedbacks = payload
    },
    setUpdateStatusFeedback(state) {
      state.lastId = true
    }
  },
  actions: {
    loadMeusFeedbacks({ commit }, payload) {
      api.get(`${config.baseUrl}api/shared/indicadores/feedback/pendentes/${payload}`).then(res => {
        commit('setMeusFeedbacks', res.data)
      })
    },
    updateDataFormFeedback({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/indicadores/feedback/update/`
      let getFormData = object =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key])
          return formData
        }, new FormData())
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setUpdateStatusFeedback')
      })
    }
  },
  getters: {
    meusFeedbacks(state) {
      return state.meusFeedbacks
    }
  }
}
