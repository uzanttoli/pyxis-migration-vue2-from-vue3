import config from '../core/config'
import Vue from 'vue'

export default {
  state: {
    operadoresLogadosPorCoordenador: [],
    chamadasCoordenador: [],
    rechamada60minCoordenador: [],
    rechamadaDiaCoordenador: [],
    desconexaoPorCoordenador: [],
    shortcall60PorCoordenador: [],
    shortcall30PorCoordenador: [],
    transferenciasTotaisCoordenador: [],
    transferenciaParaSupervisorPorCoordenador: [],
    transferenciaRetencaoPorCoordenador: [],
    transferenciaRetencaoIndevidaPorCoordenador: [],
    transferenciaLinhaMudaPorCoordenador: [],
    transferenciaLinhaMudaIndevidaPorCoordenador: [],
    transferenciaMudancaDeEnderecoPorCoordenador: [],
    transferenciaMudancaDeEnderecoIndevidaPorCoordenador: [],
    transferenciaDowngradePorCoordenador: [],
    transferenciaDowngradeIndevidasPorCoordenador: [],
    resumoIndicadoresOnlineCoordenador: [],
    tempoLogadoPorCoordenador: [],
    quantidadeOperadoresLogadosCoordenador: [],
    pausasPorCoordenador: [],
    intervaloMplay: []
  },
  mutations: {
    setIntervaloMplay(state, payload) {
      state.intervaloMplay = payload
    },
    setPausasPorCoordenador(state, payload) {
      state.pausasPorCoordenador = payload
    },
    setQuantidadeOperadoresLogadosCoordenador(state, payload) {
      state.quantidadeOperadoresLogadosCoordenador = payload
    },
    setTempoLogadoPorCoordenador(state, payload) {
      state.tempoLogadoPorCoordenador = payload
    },
    setResumoIndicadoresOnlineCoordenador(state, payload) {
      state.resumoIndicadoresOnlineCoordenador = payload
    },
    setTransferenciaDowngradeIndevidasPorCoordenador(state, payload) {
      state.transferenciaDowngradeIndevidasPorCoordenador = payload
    },
    setTransferenciaDowngradePorCoordenador(state, payload) {
      state.transferenciaDowngradePorCoordenador = payload
    },
    setTransferenciaMudancaDeEnderecoIndevidaPorCoordenador(state, payload) {
      state.transferenciaMudancaDeEnderecoIndevidaPorCoordenador = payload
    },
    setTransferenciaMudancaDeEnderecoPorCoordenador(state, payload) {
      state.transferenciaMudancaDeEnderecoPorCoordenador = payload
    },
    setTransferenciaLinhaMudaIndevidaPorCoordenador(state, payload) {
      state.transferenciaLinhaMudaIndevidaPorCoordenador = payload
    },
    setTransferenciaLinhaMudaPorCoordenador(state, payload) {
      state.transferenciaLinhaMudaPorCoordenador = payload
    },
    setTransferenciaRetencaoIndevidaPorCoordenador(state, payload) {
      state.transferenciaRetencaoIndevidaPorCoordenador = payload
    },
    setTransferenciaRetencaoPorCoordenador(state, payload) {
      state.transferenciaRetencaoPorCoordenador = payload
    },
    setTransferenciaParaSupervisorPorCoordenador(state, payload) {
      state.transferenciaParaSupervisorPorCoordenador = payload
    },
    setTransferenciasTotaisCoordenador(state, payload) {
      state.transferenciasTotaisCoordenador = payload
    },
    setShortcall60PorCoordenador(state, payload) {
      state.shortcall60PorCoordenador = payload
    },
    setShortcall30PorCoordenador(state, payload) {
      state.shortcall30PorCoordenador = payload
    },
    setDesconexaoPorCoordenador(state, payload) {
      state.desconexaoPorCoordenador = payload
    },
    setRechamadaDiaCoordenador(state, payload) {
      state.rechamadaDiaCoordenador = payload
    },
    setRechamada60minCoordenador(state, payload) {
      state.rechamada60minCoordenador = payload
    },
    setChamadasCoordenador(state, payload) {
      state.chamadasCoordenador = payload
    },
    setOperadoresLogadosPorCoordenador(state, payload) {
      state.operadoresLogadosPorCoordenador = payload
    }
  },
  actions: {
    loadIntervaloMplay({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/mplay/intervalos_mplay/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setIntervaloMplay', res.data)
      })
    },
    loadPausasPorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/pausas/pausas_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setPausasPorCoordenador', res.data)
      })
    },
    loadQuantidadeOperadoresLogadosCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/coordenador/qtd_operadores_logados/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setQuantidadeOperadoresLogadosCoordenador', res.data)
      })
    },
    loadTempoLogadoPorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/coordenador/tempo_logado_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setTempoLogadoPorCoordenador', res.data)
      })
    },
    loadResumoIndicadoresOnlineCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/coordenador/resumo_indicadores_online_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setResumoIndicadoresOnlineCoordenador', res.data)
      })
    },
    loadTransferenciaDowngradeIndevidasPorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/transferencia_downgrade_indevida_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setTransferenciaDowngradeIndevidasPorCoordenador', res.data)
      })
    },
    loadTransferenciaDowngradePorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/transferencia_downgrade_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setTransferenciaDowngradePorCoordenador', res.data)
      })
    },
    loadTransferenciaMudancaDeEnderecoIndevidaPorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/transferencia_mudanca_endereco_indevida_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setTransferenciaMudancaDeEnderecoIndevidaPorCoordenador', res.data)
      })
    },
    loadTransferenciaMudancaDeEnderecoPorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/transferencia_mudanca_endereco_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setTransferenciaMudancaDeEnderecoPorCoordenador', res.data)
      })
    },
    loadTransferenciaLinhaMudaIndevidaPorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/transferencia_linha_muda_indevida_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setTransferenciaLinhaMudaIndevidaPorCoordenador', res.data)
      })
    },
    loadTransferenciaLinhaMudaPorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/transferencia_linha_muda_por_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setTransferenciaLinhaMudaPorCoordenador', res.data)
      })
    },
    loadTransferenciaRetencaoIndevidaPorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/transferencia_retencao_indevida_por_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setTransferenciaRetencaoIndevidaPorCoordenador', res.data)
      })
    },
    loadTransferenciaRetencaoPorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/transferencia_retencao_por_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setTransferenciaRetencaoPorCoordenador', res.data)
      })
    },
    loadTransferenciaParaSupervisorPorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/transferencias_para_supervisor_por_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setTransferenciaParaSupervisorPorCoordenador', res.data)
      })
    },
    loadTransferenciasTotaisCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/transferencias_totais_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setTransferenciasTotaisCoordenador', res.data)
      })
    },
    loadShortcall30PorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/shortcall30_por_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setShortcall30PorCoordenador', res.data)
      })
    },
    loadShortcall60PorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/shortcall60_por_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setShortcall60PorCoordenador', res.data)
      })
    },
    loadDesconexaoPorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/desconexao_por_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setDesconexaoPorCoordenador', res.data)
      })
    },
    loadRechamadaDiaCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/extrato_rechamada_dia_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setRechamadaDiaCoordenador', res.data)
      })
    },
    loadRechamada60minCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/rechamada_60min_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setRechamada60minCoordenador', res.data)
      })
    },
    loadChamadasCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/extrato_net/chamadas_coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setChamadasCoordenador', res.data)
      })
    },
    loadOperadoresLogadosPorCoordenador({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/registro_log_pyxis/coordenador/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setOperadoresLogadosPorCoordenador', res.data)
      })
    }
  },
  getters: {
    intervaloMplay(state) {
      return state.intervaloMplay
    },
    pausasPorCoordenador(state) {
      return state.pausasPorCoordenador
    },
    quantidadeOperadoresLogadosCoordenador(state) {
      return state.quantidadeOperadoresLogadosCoordenador
    },
    tempoLogadoPorCoordenador(state) {
      return state.tempoLogadoPorCoordenador
    },
    resumoIndicadoresOnlineCoordenador(state) {
      return state.resumoIndicadoresOnlineCoordenador
    },
    transferenciaDowngradeIndevidasPorCoordenador(state) {
      return state.transferenciaDowngradeIndevidasPorCoordenador
    },
    transferenciaDowngradePorCoordenador(state) {
      return state.transferenciaDowngradePorCoordenador
    },
    transferenciaMudancaDeEnderecoIndevidaPorCoordenador(state) {
      return state.transferenciaMudancaDeEnderecoIndevidaPorCoordenador
    },
    transferenciaMudancaDeEnderecoPorCoordenador(state) {
      return state.transferenciaMudancaDeEnderecoPorCoordenador
    },
    transferenciaLinhaMudaIndevidaPorCoordenador(state) {
      return state.transferenciaLinhaMudaIndevidaPorCoordenador
    },
    transferenciaLinhaMudaPorCoordenador(state) {
      return state.transferenciaLinhaMudaPorCoordenador
    },
    transferenciaRetencaoIndevidaPorCoordenador(state) {
      return state.transferenciaRetencaoIndevidaPorCoordenador
    },
    transferenciaRetencaoPorCoordenador(state) {
      return state.transferenciaRetencaoPorCoordenador
    },
    transferenciaParaSupervisorPorCoordenador(state) {
      return state.transferenciaParaSupervisorPorCoordenador
    },
    transferenciasTotaisCoordenador(state) {
      return state.transferenciasTotaisCoordenador
    },
    shortcall30PorCoordenador(state) {
      return state.shortcall30PorCoordenador
    },
    shortcall60PorCoordenador(state) {
      return state.shortcall60PorCoordenador
    },
    desconexaoPorCoordenador(state) {
      return state.desconexaoPorCoordenador
    },
    rechamadaDiaCoordenador(state) {
      return state.rechamadaDiaCoordenador
    },
    rechamada60minCoordenador(state) {
      return state.rechamada60minCoordenador
    },
    chamadasCoordenador(state) {
      return state.chamadasCoordenador
    },
    operadoresLogadosPorCoordenador(state) {
      return state.operadoresLogadosPorCoordenador
    }
  }
}
