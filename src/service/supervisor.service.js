import Vue from 'vue'
import config from '../core/config'

export default {
  state: {
    // justificativaAbs: [],
    // absJustificadoSupervisor: [],
    // historicoJustificativaAbs: [],
    absMes: [],
    resumoIndicadores: [],
    pausasPorSupervisor: [],
    acessPortal: false,
    quantidadeOperadoresLogados: [],
    tempoLogadoSupervisor: [],
    lastId: false,
    operadoresLogadosPorSupervisor: [],
    minhaEvolucaoSupervisor: [],
    retornoDemandasSupervisor: [],
    houveContatoCliente: [],
    operadorReorientado: [],
    dadosTratativaDemanda: [],
    atualizarDados: false,
    casosDemandasPendentes: [],
    filtroDemandas: []
  },
  mutations: {
    setFiltroDemandas(state, payload) {
      state.filtroDemandas = payload
    },
    setCasosDemandasPendentes(state, payload) {
      state.casosDemandasPendentes = payload
    },
    setAtualizarDadosTratados(state) {
      state.atualizarDados = true
    },
    setDadosTratativaDemanda(state, payload) {
      state.dadosTratativaDemanda = payload
    },
    setOperadorReorientado(state, payload) {
      state.operadorReorientado = payload
    },
    setHouveContatoCliente(state, payload) {
      state.houveContatoCliente = payload
    },
    setRetornoDemandasSupervisor(state, payload) {
      state.retornoDemandasSupervisor = payload
    },
    setMinhaEvolucaoSupervisor(state, payload) {
      state.minhaEvolucaoSupervisor = payload
    },
    setOperadoresLogadosPorSupervisor(state, payload) {
      state.operadoresLogadosPorSupervisor = payload
    },
    setAcessPortal(state) {
      state.acessPortal = true
    },
    setAbsMes(state, payload) {
      state.absMes = payload
    },
    setResumoIndicadores(state, payload) {
      state.resumoIndicadores = payload
    },
    setPausasPorSupervisor(state, payload) {
      state.pausasPorSupervisor = payload
    },
    // setJustificativaAbs(state, payload) {
    //   state.justificativaAbs = payload;
    // },
    // setAbsJustificadoSupervisor(state, payload) {
    //   state.absJustificadoSupervisor = payload;
    // },
    // setHistoricoJustificativaAbs(state, payload) {
    //   state.historicoJustificativaAbs = payload;
    // },
    setSaveStatusJustificativaAbs(state) {
      state.lastId = true
    },
    setQuantidadeOperadoresLogados(state, payload) {
      state.quantidadeOperadoresLogados = payload
    },
    setTempoLogadoSupervisor(state, payload) {
      state.tempoLogadoSupervisor = payload
    }
  },
  actions: {
    loadFiltroDemandas({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/demandas_supervisor/filtro_tratativa/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setFiltroDemandas', res.data)
      })
    },
    loadCasosDemandasPendentes({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/demandas_supervisor/quantidade_casos_pendentes/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setCasosDemandasPendentes', res.data)
      })
    },
    updateDadosTratadosDemandas({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/demandas_supervisor/update`
      let getFormData = object =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key])
          return formData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setAtualizarDadosTratados')
      })
    },
    loadDadosTratativaDemanda({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/demandas_supervisor/dados_tratativa_demandas/${payload.nome}/${payload.tipo}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setDadosTratativaDemanda', res.data)
      })
    },
    loadOperadorReorientado({ commit }) {
      let urlData = `${config.baseUrl}api/shared/demandas_supervisor/operador_reorientado/`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setOperadorReorientado', res.data)
      })
    },
    loadHouveContatoCliente({ commit }) {
      let urlData = `${config.baseUrl}api/shared/demandas_supervisor/houve_contato_cliente/`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setHouveContatoCliente', res.data)
      })
    },
    loadRetornoDemandasSupervisor({ commit }) {
      let urlData = `${config.baseUrl}api/shared/demandas_supervisor/retorno_supervisor/`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setRetornoDemandasSupervisor', res.data)
      })
    },
    loadMinhaEvolucaoSupervisor({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/supervisor/minhaEvolucaoSupervisor/${payload}`)
        .then(res => {
          commit('setMinhaEvolucaoSupervisor', res.data)
        })
    },
    loadOperadoresLogadosPorSupervisor({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/registro_log_pyxis/supervisor/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setOperadoresLogadosPorSupervisor', res.data)
      })
    },
    saveRegistrodeLog({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/user/create`
      let getFormData = object =>
        Object.keys(object).reduce((formData, key) => {
          formData.append(key, object[key])
          return formData
        }, new FormData())

      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setAcessPortal')
      })
    },
    loadAbsMes({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/supervisor/abs_mes/${payload}`)
        .then(res => {
          commit('setAbsMes', res.data)
        })
    },
    loadResumoIndicadores({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/supervisor/resumo_indicadores_online/${payload}`)
        .then(res => {
          commit('setResumoIndicadores', res.data)
        })
    },
    loadPausasPorSupervisor({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/pausas/pausas_supervisor/${payload}`)
        .then(res => {
          commit('setPausasPorSupervisor', res.data)
        })
    },
    // loadJustificativaAbs({ commit }, payload) {
    //   Vue.prototype.$api
    //     .get(`${config.baseUrl}api/shared/abs/abs_por_supervisor/${payload}`)
    //     .then((res) => {
    //       commit("setJustificativaAbs", res.data);
    //     });
    // },
    // loadHistoricoJustificativaAbs({ commit }, payload) {
    //   Vue.prototype.$api
    //     .get(
    //       `${config.baseUrl}api/shared/abs/historico_justificativa_abs/${payload}`
    //     )
    //     .then((res) => {
    //       commit("setHistoricoJustificativaAbs", res.data);
    //     });
    // },
    // loadAbsJustificadoSupervisor({ commit }) {
    //   Vue.prototype.$api
    //     .get(`${config.baseUrl}api/shared/abs/justificativa_abs/`)
    //     .then((res) => {
    //       commit("setAbsJustificadoSupervisor", res.data);
    //     });
    // },
    loadQuantidadeOperadoresLogados({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/supervisor/qtd_operadores_logados/${payload}`)
        .then(res => {
          commit('setQuantidadeOperadoresLogados', res.data)
        })
    },
    // saveDataFormJustificativaAbs({ commit }, payload) {
    //   let urlData = `${config.baseUrl}api/shared/abs/create/`;
    //   let getFormData = (object) =>
    //     Object.keys(object).reduce((formData, key) => {
    //       formData.append(key, object[key]);
    //       return formData;
    //     }, new FormData());
    //   Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
    //     commit("setSaveStatusJustificativaAbs");
    //   });
    // },
    loadTempoLogadoSupervisor({ commit }, payload) {
      Vue.prototype.$api
        .get(`${config.baseUrl}api/shared/supervisor/tempo_logado/${payload}`)
        .then(res => {
          commit('setTempoLogadoSupervisor', res.data)
        })
    }
  },
  getters: {
    filtroDemandas(state) {
      return state.filtroDemandas
    },
    casosDemandasPendentes(state) {
      return state.casosDemandasPendentes
    },
    dadosTratativaDemanda(state) {
      return state.dadosTratativaDemanda
    },
    operadorReorientado(state) {
      return state.operadorReorientado
    },
    houveContatoCliente(state) {
      return state.houveContatoCliente
    },
    retornoDemandasSupervisor(state) {
      return state.retornoDemandasSupervisor
    },
    minhaEvolucaoSupervisor(state) {
      return state.minhaEvolucaoSupervisor
    },
    operadoresLogadosPorSupervisor(state) {
      return state.operadoresLogadosPorSupervisor
    },
    quantidadeOperadoresLogados(state) {
      return state.quantidadeOperadoresLogados
    },
    absMes(state) {
      return state.absMes
    },
    resumoIndicadores(state) {
      return state.resumoIndicadores
    },
    pausasPorSupervisor(state) {
      return state.pausasPorSupervisor
    },
    // justificativaAbs(state) {
    //   return state.justificativaAbs;
    // },
    // absJustificadoSupervisor(state) {
    //   return state.absJustificadoSupervisor;
    // },
    // historicoJustificativaAbs(state) {
    //   return state.historicoJustificativaAbs;
    // },
    tempoLogadoSupervisor(state) {
      return state.tempoLogadoSupervisor
    }
  }
}
