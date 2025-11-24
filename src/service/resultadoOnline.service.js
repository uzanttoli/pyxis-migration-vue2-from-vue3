import Vue from 'vue'
import config from '../core/config'

export default {
  state: {
    chamadasAtendidasExtratoNet: [],
    rechamada60ExtratoNet: [],
    rechamadaDiaExtratoNet: [],
    shortcall60ExtratoNet: [],
    transferenciaRetencaoExtratoNet: [],
    transferenciaRetencaoIndevidaExtratoNet: [],
    transferenciaMudaExtratoNet: [],
    transferenciaMudaIndevidaExtratoNet: [],
    transferenciaDowngradeExtratoNet: [],
    transferenciaDowngradeIndevidaExtratoNet: [],
    transferenciaMudancaDeEnderecoExtratoNet: [],
    transferenciaMudancaDeEnderecoIndevidaExtratoNet: [],
    desconexaoOperadorExtratoNet: [] /*Inserido dia 07/12/2021*/,
    // shortcall30OperadorExtratoNet: [],
    transferenciaTotalOperadorExtratoNet: [],
    transferenciaParaSupervisorPorOperadorExtratoNet: []
  },
  mutations: {
    setTransferenciaParaSupervisorPorOperadorExtratoNet(state, payload) {
      state.transferenciaParaSupervisorPorOperadorExtratoNet = payload
    },
    setTransferenciaTotalOperadorExtratoNet(state, payload) {
      state.transferenciaTotalOperadorExtratoNet = payload
    },
    // setShortcall30OperadorExtratoNet(state, payload) {
    //   state.shortcall30OperadorExtratoNet = payload;
    // },
    setDesconexaoOperadorExtratoNet(state, payload) {
      state.desconexaoOperadorExtratoNet = payload
    },
    setChamadasAtendidasExtratoNet(state, payload) {
      state.chamadasAtendidasExtratoNet = payload
    },
    setRechamada60ExtratoNet(state, payload) {
      state.rechamada60ExtratoNet = payload
    },
    setRechamadaDiaExtratoNet(state, payload) {
      state.rechamadaDiaExtratoNet = payload
    },
    setShortcall60ExtratoNet(state, payload) {
      state.shortcall60ExtratoNet = payload
    },
    setTransferenciaRetencaoExtratoNet(state, payload) {
      state.transferenciaRetencaoExtratoNet = payload
    },
    setTransferenciaRetencaoIndevidaExtratoNet(state, payload) {
      state.transferenciaRetencaoIndevidaExtratoNet = payload
    },
    setTransferenciaMudaExtratoNet(state, payload) {
      state.transferenciaMudaExtratoNet = payload
    },
    setTransferenciaMudaIndevidaExtratoNet(state, payload) {
      state.transferenciaMudaIndevidaExtratoNet = payload
    },
    setTransferenciaDowngradeExtratoNet(state, payload) {
      state.transferenciaDowngradeExtratoNet = payload
    },
    setTransferenciaDowngradeIndevidaExtratoNet(state, payload) {
      state.transferenciaDowngradeIndevidaExtratoNet = payload
    },
    setTransferenciaMudancaDeEnderecoExtratoNet(state, payload) {
      state.transferenciaMudancaDeEnderecoExtratoNet = payload
    },
    setTransferenciaMudancaDeEnderecoIndevidaExtratoNet(state, payload) {
      state.transferenciaMudancaDeEnderecoIndevidaExtratoNet = payload
    }
  },
  actions: {
    loadTransferenciaParaSupervisorPorOperadorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/transferencia_supervisor_operador/${payload}`)
        .then(res => {
          commit('setTransferenciaParaSupervisorPorOperadorExtratoNet', res.data)
        })
    },
    loadTransferenciaTotalOperadorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/transferencia_total_operador/${payload}`)
        .then(res => {
          commit('setTransferenciaTotalOperadorExtratoNet', res.data)
        })
    },
    // loadShortcall30OperadorExtratoNet({ commit }, payload) {
    //   Vue.prototype.$api
    //     .get(`${config.baseUrl}api/shared/extrato_net/shortcall30_operador/${payload}`)
    //     .then((res) => {
    //       commit("setShortcall30OperadorExtratoNet", res.data);
    //     });
    // },
    loadDesconexaoOperadorExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/desconexao_operador/${payload}`)
        .then(res => {
          commit('setDesconexaoOperadorExtratoNet', res.data)
        })
    },
    loadChamadasAtendidasExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/chamadas_atendidas/${payload}`)
        .then(res => {
          commit('setChamadasAtendidasExtratoNet', res.data)
        })
    },
    loadRechamada60ExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/rechamada/${payload}`)
        .then(res => {
          commit('setRechamada60ExtratoNet', res.data)
        })
    },
    loadRechamadaDiaExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/rechamada_dia/${payload}`)
        .then(res => {
          commit('setRechamadaDiaExtratoNet', res.data)
        })
    },
    loadShortcall60ExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/shortcall_60/${payload}`)
        .then(res => {
          commit('setShortcall60ExtratoNet', res.data)
        })
    },
    loadTransferenciaRetencaoExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/transferencia_retencao/${payload}`)
        .then(res => {
          commit('setTransferenciaRetencaoExtratoNet', res.data)
        })
    },
    loadTransferenciaRetencaoIndevidaExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/transferencia_retencao_indevida/${payload}`)
        .then(res => {
          commit('setTransferenciaRetencaoIndevidaExtratoNet', res.data)
        })
    },
    loadTransferenciaMudaExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/transferencia_muda/${payload}`)
        .then(res => {
          commit('setTransferenciaMudaExtratoNet', res.data)
        })
    },
    loadTransferenciaMudaIndevidaExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/transferencia_muda_indevida/${payload}`)
        .then(res => {
          commit('setTransferenciaMudaIndevidaExtratoNet', res.data)
        })
    },
    loadTransferenciaDowngradeExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/transferencia_downgrade/${payload}`)
        .then(res => {
          commit('setTransferenciaDowngradeExtratoNet', res.data)
        })
    },
    loadTransferenciaDowngradeIndevidaExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/transferencia_downgrade_indevida/${payload}`)
        .then(res => {
          commit('setTransferenciaDowngradeIndevidaExtratoNet', res.data)
        })
    },
    loadTransferenciaMudancaDeEnderecoExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/extrato_net/transferencia_mudanca_endereco/${payload}`)
        .then(res => {
          commit('setTransferenciaMudancaDeEnderecoExtratoNet', res.data)
        })
    },
    loadTransferenciaMudancaDeEnderecoIndevidaExtratoNet({ commit }, payload) {
      Vue.prototype.$api
        .get(
          `${config.baseUrl}api/shared/extrato_net/transferencia_mudanca_endereco_indevida/${payload}`
        )
        .then(res => {
          commit('setTransferenciaMudancaDeEnderecoIndevidaExtratoNet', res.data)
        })
    }
  },
  getters: {
    transferenciaParaSupervisorPorOperadorExtratoNet(state) {
      return state.transferenciaParaSupervisorPorOperadorExtratoNet
    },
    transferenciaTotalOperadorExtratoNet(state) {
      return state.transferenciaTotalOperadorExtratoNet
    },
    // shortcall30OperadorExtratoNet(state) {
    //   return state.shortcall30OperadorExtratoNet;
    // },
    desconexaoOperadorExtratoNet(state) {
      return state.desconexaoOperadorExtratoNet
    },
    chamadasAtendidasExtratoNet(state) {
      return state.chamadasAtendidasExtratoNet
    },
    rechamada60ExtratoNet(state) {
      return state.rechamada60ExtratoNet
    },
    rechamadaDiaExtratoNet(state) {
      return state.rechamadaDiaExtratoNet
    },
    shortcall60ExtratoNet(state) {
      return state.shortcall60ExtratoNet
    },
    transferenciaRetencaoExtratoNet(state) {
      return state.transferenciaRetencaoExtratoNet
    },
    transferenciaRetencaoIndevidaExtratoNet(state) {
      return state.transferenciaRetencaoIndevidaExtratoNet
    },
    transferenciaMudaExtratoNet(state) {
      return state.transferenciaMudaExtratoNet
    },
    transferenciaMudaIndevidaExtratoNet(state) {
      return state.transferenciaMudaIndevidaExtratoNet
    },
    transferenciaDowngradeExtratoNet(state) {
      return state.transferenciaDowngradeExtratoNet
    },
    transferenciaDowngradeIndevidaExtratoNet(state) {
      return state.transferenciaDowngradeIndevidaExtratoNet
    },
    transferenciaMudancaDeEnderecoExtratoNet(state) {
      return state.transferenciaMudancaDeEnderecoExtratoNet
    },
    transferenciaMudancaDeEnderecoIndevidaExtratoNet(state) {
      return state.transferenciaMudancaDeEnderecoIndevidaExtratoNet
    }
  }
}
