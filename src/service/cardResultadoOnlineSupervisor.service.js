import config from '../core/config'
import Vue from 'vue'
const url = 'api/shared/extrato_net/'
export default {
  state: {
    chamadasAtendidasSupervisorExtratoNet: [],
    rechamadaSupervisorExtratoNet: [],
    rechamadaDiaSupervisorExtratoNet: [],
    shortcallSupervisorExtratoNet: [],
    transferenciaRetencaoSupervisorExtratoNet: [],
    transferenciaIndevidaSupervisorExtratoNet: [],
    transferenciaMudaSupervisorExtratoNet: [],
    transferenciaMudaIndevidaSupervisorExtratoNet: [],
    transferenciaDowngradeSupervisorExtratoNet: [],
    transferenciaDowngradeIndevidaSupervisorExtratoNet: [],
    transferenciaMudancaEnderecoSupervisorExtratoNet: [],
    transferenciaMudancaEnderecoIndevidaSupervisorExtratoNet: [],
    desconexaoSupervisorExtratoNet: [] /*Adicionado 07/12/2021*/,
    shortcall30SupervisorExtratoNet: [],
    transferenciaTotalSupervisorExtratoNet: [],
    transferenciaSupervisor: []
  },
  mutations: {
    setChamadasAtendidasSupervisorExtratoNet(state, payload) {
      state.chamadasAtendidasSupervisorExtratoNet = payload
    },
    setRechamadaSupervisorExtratoNet(state, payload) {
      state.rechamadaSupervisorExtratoNet = payload
    },
    setRechamadaDiaSupervisorExtratoNet(state, payload) {
      state.rechamadaDiaSupervisorExtratoNet = payload
    },
    setShortcallSupervisorExtratoNet(state, payload) {
      state.shortcallSupervisorExtratoNet = payload
    },
    setTransferenciaRetencaoSupervisorExtratoNet(state, payload) {
      state.transferenciaRetencaoSupervisorExtratoNet = payload
    },
    setTransferenciaIndevidaSupervisorExtratoNet(state, payload) {
      state.transferenciaIndevidaSupervisorExtratoNet = payload
    },
    setTransferenciaMudaSupervisorExtratoNet(state, payload) {
      state.transferenciaMudaSupervisorExtratoNet = payload
    },
    setTransferenciaMudaIndevidaSupervisorExtratoNet(state, payload) {
      state.transferenciaMudaIndevidaSupervisorExtratoNet = payload
    },
    setTransferenciaDowngradeSupervisorExtratoNet(state, payload) {
      state.transferenciaDowngradeSupervisorExtratoNet = payload
    },
    setTransferenciaDowngradeIndevidaSupervisorExtratoNet(state, payload) {
      state.transferenciaDowngradeIndevidaSupervisorExtratoNet = payload
    },
    setTransferenciaMudancaEnderecoSupervisorExtratoNet(state, payload) {
      state.transferenciaMudancaEnderecoSupervisorExtratoNet = payload
    },
    setTransferenciaMudancaEnderecoIndevidaSupervisorExtratoNet(state, payload) {
      state.transferenciaMudancaEnderecoIndevidaSupervisorExtratoNet = payload
    },
    setDesconexaoSupervisorExtratoNet(state, payload) {
      /*Adicionado 07/12/2021*/
      state.desconexaoSupervisorExtratoNet = payload
    },
    setShortcall30SupervisorExtratoNet(state, payload) {
      state.shortcall30SupervisorExtratoNet = payload
    },
    setTransferenciaTotalSupervisorExtratoNet(state, payload) {
      state.transferenciaTotalSupervisorExtratoNet = payload
    },
    setTransferenciaSupervisor(state, payload) {
      state.transferenciaSupervisor = payload
    }
  },
  actions: {
    loadChamadasAtendidasSupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api.get(`${config.baseUrl}${url}chamadas_supervisor/${payload}`).then(res => {
        commit('setChamadasAtendidasSupervisorExtratoNet', res.data)
      })
    },
    loadRechamadaSupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api.get(`${config.baseUrl}${url}rechamada_supervisor/${payload}`).then(res => {
        commit('setRechamadaSupervisorExtratoNet', res.data)
      })
    },
    loadRechamadaDiaSupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}rechamada_dia_supervisor/${payload}`)
        .then(res => {
          commit('setRechamadaDiaSupervisorExtratoNet', res.data)
        })
    },
    loadShortcallSupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}shortcall60_supervisor/${payload}`)
        .then(res => {
          commit('setShortcallSupervisorExtratoNet', res.data)
        })
    },
    loadTransferenciaRetencaoSupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}transferencia_retencao_supervisor/${payload}`)
        .then(res => {
          commit('setTransferenciaRetencaoSupervisorExtratoNet', res.data)
        })
    },
    loadTransferenciaIndevidaSupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}transferencia_indevida_ret_supervisor/${payload}`)
        .then(res => {
          commit('setTransferenciaIndevidaSupervisorExtratoNet', res.data)
        })
    },
    loadTransferenciaMudaSupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}transferencia_muda_supervisor/${payload}`)
        .then(res => {
          commit('setTransferenciaMudaSupervisorExtratoNet', res.data)
        })
    },
    loadTransferenciaMudaIndevidaSupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}transferencia_muda_indevida_supervisor/${payload}`)
        .then(res => {
          commit('setTransferenciaMudaIndevidaSupervisorExtratoNet', res.data)
        })
    },
    loadTransferenciaDowngradeSupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}transferencia_down_supervisor/${payload}`)
        .then(res => {
          commit('setTransferenciaDowngradeSupervisorExtratoNet', res.data)
        })
    },
    loadTransferenciaDowngradeIndevidaSupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}transferencia_down_indevida_supervisor/${payload}`)
        .then(res => {
          commit('setTransferenciaDowngradeIndevidaSupervisorExtratoNet', res.data)
        })
    },
    loadTransferenciaMudancaEnderecoSupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}transferencia_mudanca_endereco_supervisor/${payload}`)
        .then(res => {
          commit('setTransferenciaMudancaEnderecoSupervisorExtratoNet', res.data)
        })
    },
    loadTransferenciaMudancaEnderecoIndevidaSupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}transferencia_mudanca_endereco_indevida_supervisor/${payload}`)
        .then(res => {
          commit('setTransferenciaMudancaEnderecoIndevidaSupervisorExtratoNet', res.data)
        })
    },
    loadDesconexaoSupervisorExtratoNet({ commit }, payload) {
      /*Adicionado 07/12/2021*/
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}desconexao_supervisor/${payload}`)
        .then(res => {
          commit('setDesconexaoSupervisorExtratoNet', res.data)
        })
    },
    loadShortcall30SupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}shortcall30_supervisor/${payload}`)
        .then(res => {
          commit('setShortcall30SupervisorExtratoNet', res.data)
        })
    },
    loadTransferenciaTotalSupervisorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}transferencia_total_supervisor/${payload}`)
        .then(res => {
          commit('setTransferenciaTotalSupervisorExtratoNet', res.data)
        })
    },
    loadTransferenciaSupervisor({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}${url}transferencia_supervisor/${payload}`)
        .then(res => {
          commit('setTransferenciaSupervisor', res.data)
        })
    }
  },
  getters: {
    chamadasAtendidasSupervisorExtratoNet(state) {
      return state.chamadasAtendidasSupervisorExtratoNet
    },
    rechamadaSupervisorExtratoNet(state) {
      return state.rechamadaSupervisorExtratoNet
    },
    rechamadaDiaSupervisorExtratoNet(state) {
      return state.rechamadaDiaSupervisorExtratoNet
    },
    shortcallSupervisorExtratoNet(state) {
      return state.shortcallSupervisorExtratoNet
    },
    transferenciaRetencaoSupervisorExtratoNet(state) {
      return state.transferenciaRetencaoSupervisorExtratoNet
    },
    transferenciaIndevidaSupervisorExtratoNet(state) {
      return state.transferenciaIndevidaSupervisorExtratoNet
    },
    transferenciaMudaSupervisorExtratoNet(state) {
      return state.transferenciaMudaSupervisorExtratoNet
    },
    transferenciaMudaIndevidaSupervisorExtratoNet(state) {
      return state.transferenciaMudaIndevidaSupervisorExtratoNet
    },
    transferenciaDowngradeSupervisorExtratoNet(state) {
      return state.transferenciaDowngradeSupervisorExtratoNet
    },
    transferenciaDowngradeIndevidaSupervisorExtratoNet(state) {
      return state.transferenciaDowngradeIndevidaSupervisorExtratoNet
    },
    transferenciaMudancaEnderecoSupervisorExtratoNet(state) {
      return state.transferenciaMudancaEnderecoSupervisorExtratoNet
    },
    transferenciaMudancaEnderecoIndevidaSupervisorExtratoNet(state) {
      return state.transferenciaMudancaEnderecoIndevidaSupervisorExtratoNet
    },
    desconexaoSupervisorExtratoNet(state) {
      /*Adicionado 07/12/2021*/
      return state.desconexaoSupervisorExtratoNet
    },
    shortcall30SupervisorExtratoNet(state) {
      return state.shortcall30SupervisorExtratoNet
    },
    transferenciaTotalSupervisorExtratoNet(state) {
      return state.transferenciaTotalSupervisorExtratoNet
    },
    transferenciaSupervisor(state) {
      return state.transferenciaSupervisor
    }
  }
}
