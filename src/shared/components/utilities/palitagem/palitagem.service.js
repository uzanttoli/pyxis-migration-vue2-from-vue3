import Vue from 'vue'
import config from '../../../../core/config'

export default {
  state: {
    motivosContato: [],
    subMotivosContato: [],
    canaisDeAutoatendimento: []
    // lastId: false
  },
  mutations: {
    setMotivosContato(state, motivosContato) {
      state.motivosContato = motivosContato
    },
    setSubMotivosContato(state, subMotivosContato) {
      state.subMotivosContato = subMotivosContato
    },
    setCanaisDeAutoatendimento(state, canaisDeAutoatendimento) {
      state.canaisDeAutoatendimento = canaisDeAutoatendimento
    }
    // setSaveStatusPalitagem(state){
    //   state.lastId = true;
    // }
  },
  actions: {
    async loadMotivosContato({ commit }, produto) {
      let urlData = `${config.baseUrl}api/shared/palitagem/motivo_contato/`
      if (produto) urlData += produto + '/'
      await Vue.prototype.$api.get(urlData).then(res => {
        commit('setMotivosContato', res.data)
      })
    },

    async loadSubMotivosContato({ commit }, payload) {
      let urlData = `${config.baseUrl}api/shared/palitagem/sub_motivo_contato/`
      if (payload) urlData += payload.produto + '/' + payload.motivo
      await Vue.prototype.$api.get(urlData).then(res => {
        commit('setSubMotivosContato', res.data)
      })
    },
    async loadCanaisDeAutoatendimento({ commit }, produto) {
      let urlData = `${config.baseUrl}api/shared/palitagem/canais_auto_atendimento/`
      if (produto) urlData += produto
      await Vue.prototype.$api.get(urlData).then(res => {
        commit('setCanaisDeAutoatendimento', res.data)
      })
    }
    // saveDataFormPalitagem({ commit },payload){
    //   let urlData = `${config.baseUrl}api/shared/palitagem/create/`;
    //   let getFormData = object => Object.keys(object).reduce((formData, key) => {
    //     formData.append(key, object[key]);
    //     return formData;
    //   }, new FormData());

    //   Vue.prototype.$api.post(urlData,getFormData(payload)).then(() => {
    //     commit('setSaveStatusPalitagem');
    //   });
    // }
  },
  getters: {
    motivosContato(state) {
      return state.motivosContato
    },
    subMotivoContato(state) {
      return state.subMotivosContato
    },
    canaisDeAutoatendimento(state) {
      return state.canaisDeAutoatendimento
    }
  }
}
