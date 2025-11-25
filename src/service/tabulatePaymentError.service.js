// import Vue from 'vue'
import api from '@/plugins/axios.js'
import config from '../core/config'

let timeAlert = '4500'
export default {
  state: {
    peridoErroPagamentoInvalido: false,
    salarioNaoCadastrado: false,
    usuarioInvalido: false,
    dadosNaoEnviado: false,
    tipoDesconto: [],
    causaRaiz: [],
    consultarNomePorRH: [],
    periodoDoErroPagamento: [],
    valorSalario: [],
    prazoCadastro: [],
    valorInvalido: false,
    inserirDadosFormularioErroPagamento: false,
    casosJaCadastrados: [],
    historicoDeCadastro: [],
    meusCadastrosDeErro: [],
    // listarDownload: [],
    deleteCadastro: false
  },
  mutations: {
    // setListarDownload(state, payload) {
    //   state.listarDownload = payload;
    // },
    setDeleteCadastro(state) {
      state.deleteCadastro = true
    },
    setMeusCadastrosDeErro(state, payload) {
      state.meusCadastrosDeErro = payload
    },
    setHistoricoDeCadastro(state, payload) {
      state.historicoDeCadastro = payload
    },
    setCasosJaCadastrados(state, payload) {
      state.casosJaCadastrados = payload
    },
    setSalarioNaoCadastrado(state) {
      state.salarioNaoCadastrado = true
      state.tipoDesconto = []
      state.causaRaiz = []
      setTimeout(() => {
        state.tipoDesconto = []
        state.causaRaiz = []
        state.salarioNaoCadastrado = false
      }, timeAlert)
    },
    setPeridoErroPagamentoInvalido(state) {
      state.peridoErroPagamentoInvalido = true
      state.periodoDoErroPagamento = []
      setTimeout(() => {
        state.periodoDoErroPagamento = []
        state.peridoErroPagamentoInvalido = false
      }, timeAlert)
    },
    setDadosNaoEnviado(state) {
      state.dadosNaoEnviado = true
    },
    setUsuarioInvalido(state) {
      state.usuarioInvalido = true
      state.tipoDesconto = []
      state.causaRaiz = []
      state.consultarNomePorRH = []
      setTimeout(() => {
        state.tipoDesconto = []
        state.causaRaiz = []
        state.consultarNomePorRH = []
        state.usuarioInvalido = false
      }, timeAlert)
    },
    setPrazoCadastro(state, payload) {
      state.prazoCadastro = payload
    },
    setInserirDadosFormularioErroPagamento(state) {
      state.inserirDadosFormularioErroPagamento = true
      setTimeout(() => {
        state.inserirDadosFormularioErroPagamento = false
      }, timeAlert)
    },
    setValorInvalido(state) {
      state.valorInvalido = true
    },
    setPeriodoDoErroPagamento(state, payload) {
      state.periodoDoErroPagamento = payload
    },
    setTipoDesconto(state, payload) {
      state.tipoDesconto = payload
    },
    setCausaRaiz(state, payload) {
      state.causaRaiz = payload
    },
    setConsultarNomePorRH(state, payload) {
      state.consultarNomePorRH = payload
    },
    setValorSalario(state, payload) {
      state.valorSalario = payload
    }
  },
  actions: {
    // loadListarDownload({ commit }, payload) {
    //   let urlData = `${config.baseUrl}api/shared/formularios/tabulador_erro_pagamento/listar_download_deacordo/${payload}`;
    //   api.get(urlData).then((res) => {
    //     commit("setListarDownload", res.data);
    //   });
    // },
    deleteCadastroErroPagamento({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_erro_pagamento/delete_cadastro/${payload}`
      api.put(urlData).then(() => {
        commit('setDeleteCadastro')
      })
    },

    loadMeusCadastrosDeErro({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_erro_pagamento/meus_cadastros/${payload}`
      api.get(urlData).then(res => commit('setMeusCadastrosDeErro', res.data))
    },
    loadHistoricoDeCadastro({ commit }) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_erro_pagamento/historico_erro_pagamento/`
      api.get(urlData).then(res => commit('setHistoricoDeCadastro', res.data))
    },
    loadCasosJaCadastrados({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_erro_pagamento/casos_cadastrados/${payload.matricula}/${payload.data}`
      api.get(urlData).then(res => {
        commit('setCasosJaCadastrados', res.data)
      })
    },
    loadPrazoCadastro({ commit }) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_erro_pagamento/prazo_de_cadastro/`
      api.get(urlData).then(res => {
        commit('setPrazoCadastro', res.data)
      })
    },
    async salvarDadosFormularioErroPagamento({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_erro_pagamento/inserir_dados/`
      let getFormData = object =>
        Object.keys(object).reduce((FormData, key) => {
          FormData.append(key, object[key])
          return FormData
        }, new FormData())
      await api.post(urlData, getFormData(payload)).then(() => {
        commit('setInserirDadosFormularioErroPagamento')
      })
    },
    loadValorSalario({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_erro_pagamento/valor_atraso_ausencia/${payload}`
      api.get(urlData).then(res => {
        if (res.data != '') {
          commit('setValorSalario', res.data)
        } else {
          commit('setSalarioNaoCadastrado')
        }
      })
    },
    loadPeriodoDoErroPagamento({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_erro_pagamento/periodo_da_folha/`
      let urlComDataFormatada = (urlData += `${payload}`)
      api.get(urlComDataFormatada).then(res => {
        if (res.data != '') {
          commit('setPeriodoDoErroPagamento', res.data)
        } else {
          commit('setPeridoErroPagamentoInvalido')
        }
      })
    },
    loadTipoDesconto({ commit }) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_erro_pagamento/tipo_de_desconto`
      api.get(urlData).then(res => {
        commit('setTipoDesconto', res.data)
      })
    },
    loadCausaRaiz({ commit }) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_erro_pagamento/causa_raiz`
      api.get(urlData).then(res => {
        commit('setCausaRaiz', res.data)
      })
    },
    loadConsultarNomePorRH({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/formularios/tabulador_erro_pagamento/consulta_de_nome_por_rh/${payload}`
      api.get(urlData).then(res => {
        if (res.data != '') {
          commit('setConsultarNomePorRH', res.data)
        } else {
          commit('setUsuarioInvalido')
        }
      })
    }
  },
  getters: {
    // listarDownload(state) {
    //   return state.listarDownload;
    // },
    meusCadastrosDeErro(state) {
      return state.meusCadastrosDeErro
    },
    historicoDeCadastro(state) {
      return state.historicoDeCadastro
    },
    casosJaCadastrados(state) {
      return state.casosJaCadastrados
    },
    salarioNaoCadastrado(state) {
      return state.salarioNaoCadastrado
    },
    peridoErroPagamentoInvalido(state) {
      return state.peridoErroPagamentoInvalido
    },
    dadosNaoEnviado(state) {
      return state.dadosNaoEnviado
    },
    inserirDadosFormularioErroPagamento(state) {
      return state.inserirDadosFormularioErroPagamento
    },
    usuarioInvalido(state) {
      return state.usuarioInvalido
    },
    prazoCadastro(state) {
      return state.prazoCadastro
    },
    valorInvalido(state) {
      return state.valorInvalido
    },
    valorSalario(state) {
      return state.valorSalario
    },
    periodoDoErroPagamento(state) {
      return state.periodoDoErroPagamento
    },
    consultarNomePorRH(state) {
      return state.consultarNomePorRH
    },
    tipoDesconto(state) {
      return state.tipoDesconto
    },
    causaRaiz(state) {
      return state.causaRaiz
    }
  }
}
