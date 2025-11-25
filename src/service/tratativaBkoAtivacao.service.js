// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '../core/config.js'

export default {
  state: {
    atualizarCaso: [],
    // novoCasoAtivacao: [],
    casoAtivo: [],
    causaMacro: [],
    causaMicro: [],
    consolidadoMes: [],
    consoliadoDia: [],
    dadosGraficoMotivoMacro: [],
    dadosGraficoMotivoMicro: [],
    listarCoordenadores: [],
    minhasAtivacoes: [],
    casosAgendados: [],
    configTratativaBko: [],
    configDetalheTratativa: [],
    listarMeses: [],
    listarStatusContato: []
  },
  mutations: {
    setListarStatusContato(state, payload) {
      state.listarStatusContato = payload
    },
    setListarMeses(state, payload) {
      state.listarMeses = payload
    },
    setConfigDetalheTratativa(state, payload) {
      state.configDetalheTratativa = payload
    },
    setCasosAgendados(state, payload) {
      state.casosAgendados = payload
    },
    setMinhasAtivacoes(state, payload) {
      state.minhasAtivacoes = payload
    },
    setListarCoordenadores(state, payload) {
      state.listarCoordenadores = payload
    },
    setDadosGraficoMotivoMicro(state, payload) {
      state.dadosGraficoMotivoMicro = payload
    },
    setDadosGraficoMotivoMacro(state, payload) {
      state.dadosGraficoMotivoMacro = payload
    },
    setConfigTratativaBko(state, payload) {
      state.configTratativaBko = payload
    },
    setConsoliadoDia(state, payload) {
      state.consoliadoDia = payload
    },
    setConsolidadoMes(state, payload) {
      state.consolidadoMes = payload
    },
    setAtualizarCaso(state, payload) {
      state.atualizarCaso = payload
    },
    setCausaMicro(state, payload) {
      state.causaMicro = payload
    },
    setCausaMacro(state, payload) {
      state.causaMacro = payload
    },
    setCasoAtivo(state, payload) {
      state.casoAtivo = payload
    }
  },
  actions: {
    loadListarStatusContato({ commit }) {
      let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/tentativa_contato/`
      api.get(urlData).then(res => {
        commit('setListarStatusContato', res.data)
      })
    },
    loadListarMeses({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/meses/${payload.mes}/${payload.ano}`
      api.get(urlData).then(res => {
        commit('setListarMeses', res.data)
      })
    },
    loadConfigDetalheTratativa({ commit }) {
      let urlData = `${config.baseUrl}api/shared/config/detalhe_produtividade_bko/`
      api.get(urlData).then(res => {
        commit('setConfigDetalheTratativa', res.data)
      })
    },
    loadCasosAgendados({ commit }) {
      let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/casos_agendados/`
      api.get(urlData).then(res => {
        commit('setCasosAgendados', res.data)
      })
    },
    loadMinhasAtivacoes({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/minha_ativacao_mes/${payload}`
      api.get(urlData).then(res => {
        commit('setMinhasAtivacoes', res.data[0])
      })
    },
    loadListarCoordenadores({ commit }) {
      let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/coordenadores`
      api.get(urlData).then(res => {
        commit('setListarCoordenadores', res.data)
      })
    },
    loadDadosGraficoMotivoMicro({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/dados_grafico_micro`
      payload.condition ? (urlData += `/${payload.condition}`) : ''
      payload.motivoMacro ? (urlData += `/${payload.motivoMacro}`) : ''
      payload.mes ? (urlData += `/${payload.mes}`) : ''
      payload.ano ? (urlData += `/${payload.ano}`) : ''
      payload.coordenador ? (urlData += `/${payload.coordenador}`) : ''

      api.get(urlData).then(res => {
        commit('setDadosGraficoMotivoMicro', res.data)
      })
    },
    loadDadosGraficoMotivoMacro({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/dados_grafico_macro`
      payload.condition ? (urlData += `/${payload.condition}`) : ''
      payload.ano ? (urlData += `/${payload.ano}`) : ''
      payload.mes ? (urlData += `/${payload.mes}`) : ''
      payload.coordenador ? (urlData += `/${payload.coordenador}`) : ''

      api.get(urlData).then(res => {
        commit('setDadosGraficoMotivoMacro', res.data)
      })
    },
    loadConfigTratativaBko({ commit }) {
      let urlData = `${config.baseUrl}api/shared/config/produtividade_bko/`
      api.get(urlData).then(res => {
        commit('setConfigTratativaBko', res.data)
      })
    },
    loadConsoliadoDia({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/meu_consolidado_dia/${payload}`
      api.get(urlData).then(res => {
        commit('setConsoliadoDia', res.data[0])
      })
    },
    loadConsolidadoMes({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/meu_consolidado_mes/${payload}`
      api.get(urlData).then(res => {
        commit('setConsolidadoMes', res.data[0])
      })
    },
    async atualizarCasoActions({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/operacao_ativacao/` /**modificar api */
      // let urlCompleta = observacao;
      var res = await api.post(urlData, payload)
      commit('setAtualizarCaso', res.data)
    },

    loadCausaMicro({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/causa_micro/${payload}`
      api.get(urlData).then(res => {
        commit('setCausaMicro', res.data)
      })
    },

    loadCausaMacro({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/causa_macro/${payload}`
      api.get(urlData).then(res => {
        commit('setCausaMacro', res.data)
      })
    },

    loadCasoAtivo({ commit }) {
      let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/caso_ativo/`
      api.get(urlData).then(res => {
        commit('setCasoAtivo', res.data)
      })
    }

    // async loadNovoCasoAtivacao({ commit }, payload) {
    //   let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/novo_caso/${payload.almope}/${payload.tipo}`;
    //   let res = await api.get(urlData);
    //   commit("setNovoCasoAtivacao", res.data[0]);
    // },
  },
  getters: {
    listarStatusContato(state) {
      return state.listarStatusContato
    },
    listarMeses(state) {
      return state.listarMeses
    },
    configDetalheTratativa(state) {
      return state.configDetalheTratativa
    },
    casosAgendados(state) {
      return state.casosAgendados
    },
    minhasAtivacoes(state) {
      return state.minhasAtivacoes
    },
    listarCoordenadores(state) {
      return state.listarCoordenadores
    },
    dadosGraficoMotivoMicro(state) {
      return state.dadosGraficoMotivoMicro
    },
    dadosGraficoMotivoMacro(state) {
      return state.dadosGraficoMotivoMacro
    },
    configTratativaBko(state) {
      return state.configTratativaBko
    },
    consoliadoDia(state) {
      return state.consoliadoDia
    },
    consolidadoMes(state) {
      return state.consolidadoMes
    },
    causaMicro(state) {
      return state.causaMicro
    },
    causaMacro(state) {
      return state.causaMacro
    },
    casoAtivo(state) {
      return state.casoAtivo
    }
  }
}
