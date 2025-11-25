// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '../core/config'

export default {
  state: {
    listMyGroup: [],
    listNotificationMessages: [],
    countNotification: 0
  },
  mutations: {
    setListNotificationMessages(state, payload) {
      state.listNotificationMessages = payload
    },
    setListMyGroup(state, payload) {
      state.listMyGroup = payload
    },
    setCountNotification(state, payload) {
      state.countNotification = payload
    }
  },
  actions: {
    loadListNotificationMessages({ commit }, payload) {
      let urlData = `${config.baseUrl}api/mysql/chat/contact/list_notification_msg/${payload}`
      api.get(urlData).then(result => {
        commit('setListNotificationMessages', result.data)
      })
    },
    loadListMyGroup({ commit }, payload) {
      let urlData = `${config.baseUrl}api/mysql/chat/contact/list_groups_users_participate/${payload}`
      api.get(urlData).then(result => {
        commit('setListMyGroup', result.data)
      })
    },
    insertCountNotification({ commit }, payload) {
      commit('setCountNotification', payload)
    }
  },
  getters: {
    countNotification(state) {
      return state.countNotification
    },
    listNotificationMessages(state) {
      return state.listNotificationMessages
    },
    listMyGroup(state) {
      return state.listMyGroup
    }
  }
}
