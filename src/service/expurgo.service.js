import Vue from 'vue'
import config from '../core/config'

export default {
  state: {
    /**expurgo scoreboard */
    errExpurgo: false,
    indicadoresExpurgo: [],
    enviarDados: false,
    deleteData: false,
    dadosParaValidar: [],
    atualizarValidacao: [],
    historicoExpurgo: [],
    /**cadastro improdutivo */
    // saveDataFormCadastroImprodutivo: false,
    motivosImprodutivos: [],
    listaDeValidacaoImprodutivos: [],
    updateDataFormCadastroImprodutivo: false,
    listaDeValidacao: []
  },
  mutations: {
    /**cadastro improdutivo */
    setDeleteData(state) {
      state.deleteData = true
    },
    setListaDeValidacao(state, payload) {
      state.listaDeValidacao = payload
    },
    setListaDeValidacaoImprodutivos(state, payload) {
      state.listaDeValidacaoImprodutivos = payload
    },
    setMotivosImprodutivos(state, payload) {
      state.motivosImprodutivos = payload
    },
    // setSaveDataFormCadastroImprodutivo(state) {
    //   state.saveDataFormCadastroImprodutivo = true;
    // },
    setUpdateDataFormCadastroImprodutivo(state) {
      state.updateDataFormCadastroImprodutivo = true
    },
    /**expurgo scoreboard */
    setHistoricoExpurgo(state, payload) {
      state.historicoExpurgo = payload
    },
    setAtualizarValidacao(state) {
      state.atualizarValidacao = true
    },
    setDadosParaValidar(state, payload) {
      state.dadosParaValidar = payload
    },
    setErrExpurgo(state) {
      state.errExpurgo = true
      setTimeout(() => {
        state.errExpurgo = false
      }, 5000)
    },
    setEnviarDados(state) {
      state.enviarDados = true
      setTimeout(() => {
        state.enviarDados = true
      }, 5000)
    },
    setIndicadoresExpurgo(state, payload) {
      state.indicadoresExpurgo = payload
    }
  },
  actions: {
    /**cadastro improdutivo */
    deleteDataAction({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/cadastro_improdutivo/delete/${payload}`
      Vue.prototype.$api.put(urlData).then(() => {
        commit('setDeleteData')
      })
    },
    loadListaDeValidacao({ commit }) {
      let urlData = `${config.baseUrl}api/shared/formularios/cadastro_improdutivo/lista_validacao/`
      Vue.prototype.$api.get(urlData).then(res => commit('setListaDeValidacao', res.data))
    },
    updateDataFormCadastroImprodutivoAction({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/cadastro_improdutivo/update/`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
        commit('setUpdateDataFormCadastroImprodutivo')
      })
    },
    loadListaDeValidacaoImprodutivos({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/cadastro_improdutivo/validacao_improdutivos/${payload}`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setListaDeValidacaoImprodutivos', res.data)
      })
    },
    loadMotivosImprodutivos({ commit }) {
      let urlData = `${config.baseUrl}api/shared/formularios/cadastro_improdutivo/motivos_improdutivos/`
      Vue.prototype.$api.get(urlData).then(res => commit('setMotivosImprodutivos', res.data))
    },
    // async saveDataFormCadastroImprodutivoAction({ commit }, payload) {
    //   let urlData = `${config.baseUrl}api/shared/formularios/cadastro_improdutivo/insert`;
    //   let getFormData = (object) =>
    //     Object.keys(object).reduce((FormData, key) => {
    //       FormData.append(key, object[key]);
    //       return FormData;
    //     }, new FormData());
    //   await Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
    //     commit("setSaveDataFormCadastroImprodutivo");
    //   });
    // },

    /**expurgo scoreboard */
    loadHistoricoExpurgo({ commit }) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_expurgo/historico_expurgo/`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setHistoricoExpurgo', res.data)
      })
    },
    loadDadosParaValidar({ commit }) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_expurgo/validar_dados/`
      Vue.prototype.$api.get(urlData).then(res => {
        commit('setDadosParaValidar', res.data)
      })
    },
    loadIndicadoresExpurgo({ commit }) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_expurgo/indicadores_expurgo/`
      Vue.prototype.$api.get(urlData).then(res => commit('setIndicadoresExpurgo', res.data))
    }
  },
  getters: {
    historicoExpurgo(state) {
      return state.historicoExpurgo
    },
    dadosParaValidar(state) {
      return state.dadosParaValidar
    },
    errExpurgo(state) {
      return state.errExpurgo
    },
    updateDataFormCadastroImprodutivo(state) {
      return state.updateDataFormCadastroImprodutivo
    },
    listaDeValidacao(state) {
      return state.listaDeValidacao
    },
    listaDeValidacaoImprodutivos(state) {
      return state.listaDeValidacaoImprodutivos
    },
    motivosImprodutivos(state) {
      return state.motivosImprodutivos
    },
    enviarDados(state) {
      return state.enviarDados
    },
    indicadoresExpurgo(state) {
      return state.indicadoresExpurgo
    }
  }
}
