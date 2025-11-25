import config from '../../../core/config'
// import Vue from 'vue'
import api from '@/plugins/axios.js'

const getFormData = object =>
  Object.keys(object).reduce((FormData, key) => {
    FormData.append(key, object[key])
    return FormData
  }, new FormData())

export default {
  state: {
    nameAvatar: [],
    myAvatar: null,
    avatarSelecionado: null,
    saveAvatarData: false,
    updateAvatar: false,
    fotoPerfil: false,
    inserirFotoPerfil: false
  },
  mutations: {
    setInserirFotoPerfil(state) {
      state.inserirFotoPerfil = true
    },
    setFotoPerfil(state) {
      state.fotoPerfil = true
    },
    setSaveAvatarData(state) {
      state.saveAvatarData = true
      setTimeout(() => {
        state.saveAvatarData = false
      }, 2000)
    },
    setUpdateAvatar(state) {
      state.updateAvatar = true
    },
    setMyAvatar(state, payload) {
      state.myAvatar = payload
    },
    setNameAvatar(state, payload) {
      state.nameAvatar = payload
    }
  },
  actions: {
    inserirFotoPerfil({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/avatar/inserir_foto_perfil`
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setInserirFotoPerfil')
      })
    },
    updateFotoPerfil({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/avatar/foto_perfil`
      // let getFormData = (object) =>
      //   Object.keys(object).reduce((FormData, key) => {
      //     FormData.append(key, object[key]);
      //     return FormData;
      //   }, new FormData());
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setFotoPerfil')
      })
    },
    updateAvatarDataAction({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/avatar/update`
      // let getFormData = (object) =>
      //   Object.keys(object).reduce((FormData, key) => {
      //     FormData.append(key, object[key]);
      //     return FormData;
      //   }, new FormData());
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setUpdateAvatar')
      })
    },
    saveAvatarDataAction({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/avatar/insert`
      // let getFormData = (object) =>
      //   Object.keys(object).reduce((FormData, key) => {
      //     FormData.append(key, object[key]);
      //     return FormData;
      //   }, new FormData());
      api.post(urlData, getFormData(payload)).then(() => {
        commit('setSaveAvatarData')
      })
    },
    loadMyAvatar({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/avatar/avatar_selected/`
      api.get(urlData + `${payload}`).then(res => {
        if (res.data != false) {
          commit('setMyAvatar', res.data[0].NOME_AVATAR)
        }
      })
    },
    loadNameAvatar({ commit }) {
      api.get(`${config.baseUrl}api/shared/avatar/avatar`).then(res => {
        commit('setNameAvatar', res.data)
      })
    }
  },
  getters: {
    saveAvatarData(state) {
      return state.saveAvatarData
    },
    nameAvatar(state) {
      return state.nameAvatar
    },
    myAvatar(state) {
      return state.myAvatar
    }
  }
}
