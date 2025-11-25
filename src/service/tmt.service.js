import config from '../core/config'
// import Vue from 'vue'
import api from '@/plugins/axios.js'

export default {
  state: {
    dac: 3,
    skill: 'NET COMBO',
    tipoSkill: 'NORMAL',
    intervalos: [],
    tmtConfig: [],
    tmtCoord: [],
    tmtSupervisor: [],
    tmtOper: [],
    tmtCampanha: [],
    tmtSkill: [],
    tmtAux: [],
    tmtAgrupamento: 'N1',
    tmtAgrupamentos: []
  },
  mutations: {
    setConfigTmt(state, config) {
      state.tmtConfig = []
      state.tmtConfig = config
    },
    setProdutoAtual(state, produto) {
      state.produto = []
      state.produto = produto
    },
    setDac(state, dac) {
      state.dac = 3
      state.dac = dac
    },
    setIntervalos(state, intervalos) {
      state.intervalos = intervalos
    },
    setTmtAgrupamento(state, payload) {
      state.tmtAgrupamento = payload
    },
    setTmtAgrupamentos(state, payload) {
      state.tmtAgrupamentos = payload
    }
  },
  actions: {
    setAgrupamentoTmt({ commit }, payload) {
      commit('setTmtAgrupamento', payload)
    },
    async loadAgrupamentosPorProdutos({ commit }, produto) {
      let urlData = `${config.baseUrl}api/shared/tmt/agrupamentos/`
      if (produto) urlData += produto + '/'

      await api.get(urlData).then(res => {
        commit('setTmtAgrupamentos', res.data)
      })
    },
    async loadConfigTmt({ commit }, param) {
      let urlData = `${config.baseUrl}api/shared/tmt/config/`
      if (param.produto) {
        urlData += param.produto + '/'
        if (param.agrupamento) urlData += param.agrupamento + '/'
      }
      await api.get(urlData).then(res => commit('setConfigTmt', res.data))
    },
    // async loadProdutos({commit}, params){
    //   let urlData = `${config.baseUrl}api/shared/tmt/produtos/${params.perfil}/${params.operacao}`
    //   api.get(urlData).then((res)=>{
    //     commit("setProdutos", res.data)
    //   })
    // },
    async loadProdutos({ dispatch }, params) {
      let urlData = `${config.baseUrl}api/shared/tmt/produtos/${params.filtro}/${params.operacao}`
      await api.get(urlData).then(res => {
        let produtos = res.data
        dispatch('setProdutos', produtos, { root: true })
      })
    },
    setProdutoAtual({ commit }, produto) {
      commit('setProdutoAtual', produto)
    },
    setDac({ commit }, dac) {
      commit('setDac', dac)
    },
    setAgrupamento({ dispatch }, agrupamento) {
      dispatch('setAgrupamentoRoot', agrupamento, { root: true })
    },
    loadIntervalos({ commit }, intervalos) {
      let urlData = `${config.baseUrl}api/shared/tmt/intervalos/`
      if (intervalos) urlData += intervalos.qtd + '/'
      if (intervalos) urlData += intervalos.skill + '/'
      if (intervalos && intervalos.skillType) urlData += intervalos.skillType + '/'

      api.get(urlData).then(res => commit('setIntervalos', res.data))
    }
  },
  getters: {
    dac(state) {
      return state.dac
    },
    tipoSkill(state) {
      return state.tipoSkill
    },
    tmtConfig(state) {
      return state.tmtConfig
    },
    intervalos(state) {
      return state.intervalos
    },
    tmtAgrupamento(state) {
      return state.tmtAgrupamento
    },
    tmtAgrupamentos(state) {
      return state.tmtAgrupamentos
    }
  }
}
