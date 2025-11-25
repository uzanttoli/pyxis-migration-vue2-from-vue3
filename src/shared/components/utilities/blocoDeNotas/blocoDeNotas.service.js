// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '../../../../core/config'

export default {
  state: {
    _textoBlocoDeNotas: '',
    saved: false,
    isNotePad: false
  },
  mutations: {
    setIsNotePad(state, payload) {
      state.isNotePad = payload
    },
    setTextoBlocoDeNotas(state, payload) {
      state._textoBlocoDeNotas = payload
    },
    setUpdateBlocoDeNotas(state) {
      state.saved = true
    }
  },
  actions: {
    async loadTextoBlocoDeNotas({ commit }, almope) {
      let urlData = `${config.baseUrl}api/shared/bloco_de_notas/texto/`
      if (almope) urlData += almope + '/'
      await api.get(urlData).then(res => {
        if (res.data != false) {
          commit('setTextoBlocoDeNotas', res.data.ANOTACOES)
          commit('setIsNotePad', true)
        }
      })
    },
    saveDataBlocoDeNotas({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/bloco_de_notas/create/`
      let getFormData = object =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key])
          return formData
        }, new FormData())
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setTextoBlocoDeNotas', payload.ANOTACOES)
      })
    },
    async updateDataBlocoDeNotas({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/bloco_de_notas/update`
      let getFormData = object =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key])
          return formData
        }, new FormData())
      await api.post(urlData, getFormData(payload)).then(() => {
        commit('setUpdateBlocoDeNotas')
      })
    }
  },
  getters: {
    isNotePad(state) {
      return state.isNotePad
    },
    textoBlocoDeNotas(state) {
      return state._textoBlocoDeNotas
    }
  }
}
