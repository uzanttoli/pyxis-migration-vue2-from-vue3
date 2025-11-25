// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '../core/config'

export default {
  state: {
    scoreboard: [],
    atingimentoScoreboard: [],
    scoreboardSupervisor: [],
    scoreboardOperadorPorCoordenador: [],
    scoreboardOperadoresPorSupervisor: [],
    historicoScoreboard: []
  },
  mutations: {
    setHistoricoScoreboard(state, payload) {
      state.historicoScoreboard = payload
    },
    setScoreboardOperadorPorCoordenador(state, payload) {
      state.scoreboardOperadorPorCoordenador = payload
    },
    setScoreboardOperadoresPorSupervisor(state, payload) {
      state.scoreboardOperadoresPorSupervisor = payload
    },
    setScoreboard(state, payload) {
      state.scoreboard = payload
    },
    setAtingimentoScoreboard(state, payload) {
      state.atingimentoScoreboard = payload
    },
    setScoreboardSupervisor(state, payload) {
      state.scoreboardSupervisor = payload
    }
  },
  actions: {
    loadHistoricoScoreboard({ commit }, payload) {
      api.get(`${config.baseUrl}api/shared/scoreboard/historico/${payload}`).then(res => {
        commit('setHistoricoScoreboard', res.data)
      })
    },
    loadScoreboardOperadoresPorSupervisor({ commit }, payload) {
      api.get(`${config.baseUrl}api/shared/scoreboard/view_sup_operador/${payload}`).then(res => {
        commit('setScoreboardOperadoresPorSupervisor', res.data)
      })
    },
    loadScoreboardOperadorPorCoordenador({ commit }, payload) {
      api
        .get(`${config.baseUrl}api/shared/scoreboard/scoreboard_operadores_coordenador/${payload}`)
        .then(res => {
          commit('setScoreboardOperadorPorCoordenador', res.data)
        })
    },
    loadScoreboard({ commit }, payload) {
      api.get(`${config.baseUrl}api/shared/scoreboard/resultado/${payload}`).then(res => {
        commit('setScoreboard', res.data)
      })
    },
    loadAtingimentoScoreboard({ commit }, payload) {
      api.get(`${config.baseUrl}api/shared/scoreboard/atingimento/${payload}`).then(res => {
        commit('setAtingimentoScoreboard', res.data)
      })
    },
    loadScoreboardSupervisor({ commit }, payload) {
      api.get(`${config.baseUrl}api/shared/scoreboard/supervisor/${payload}`).then(res => {
        commit('setScoreboardSupervisor', res.data)
      })
    }
  },
  getters: {
    historicoScoreboard(state) {
      return state.historicoScoreboard
    },
    scoreboardOperadoresPorSupervisor(state) {
      return state.scoreboardOperadoresPorSupervisor
    },
    scoreboardOperadorPorCoordenador(state) {
      return state.scoreboardOperadorPorCoordenador
    },
    scoreboard(state) {
      return state.scoreboard
    },
    atingimentoScoreboard(state) {
      return state.atingimentoScoreboard
    },
    scoreboardSupervisor(state) {
      return state.scoreboardSupervisor
    }
  }
}
