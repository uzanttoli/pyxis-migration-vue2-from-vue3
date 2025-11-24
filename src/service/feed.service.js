import config from '../core/config'
import Vue from 'vue'
export default {
  state: {
    insertFeed: false,
    insertComentarios: false,
    updateStatusComentarios: false,
    insertReacoes: false,
    updateReacoes: false,
    insertClassificacao: false,
    updateClassificacao: false,
    insertVisualizacao: false,
    inativarPost: false,
    fixarPost: false,
    desfixarPost: false
  },
  mutations: {
    setFixarPost(state) {
      state.fixarPost = true
    },
    setDesfixarPost(state) {
      state.desfixarPost = true
    },
    setInativarPost(state) {
      state.inativarPost = true
    },
    setUpdateStatusComentarios(state) {
      state.updateStatusComentarios = true
    },
    setInsertVisualizacao(state) {
      state.insertVisualizacao = true
    },
    setUpdateClassificacao(state) {
      state.updateClassificacao = true
    },
    setInsertClassificacao(state) {
      state.insertClassificacao = true
    },
    setUpdateReacoes(state) {
      state.updateReacoes = true
    },
    setInsertReacoes(state) {
      state.insertReacoes = true
    },
    setInsertFeed(state) {
      state.insertFeed = true
    },
    setInsertComentarios(state) {
      state.insertComentarios = true
    }
  },
  actions: {
    saveFixarPost({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/fixar`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setFixarPost')
      })
    },
    saveDesfixarPost({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/fixar`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setDesfixarPost')
      })
    },
    setInativoPOST({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/inativar`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setInativarPost')
      })
    },
    saveInsertVisualizacao({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/insert_visualizacao`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setInsertVisualizacao')
      })
    },
    saveUpdateClassificacao({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/update_classificacao`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setUpdateClassificacao')
      })
    },
    saveInsertClassificacao({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/insert_classificacao`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setInsertClassificacao')
      })
    },
    saveUpdateReacoes({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/update_reacoes`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setUpdateReacoes')
      })
    },
    saveInsertReacoes({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/insert_reacoes`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setInsertReacoes')
      })
    },
    saveInsertComentarios({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/insert_comentarios`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setInsertComentarios')
      })
    },
    saveUpdateStatusComentarios({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/update_status_comentario`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setUpdateStatusComentarios')
      })
    },
    saveInsertFeed({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/insert`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setInsertFeed')
      })
    }
  },
  getters: {}
}
