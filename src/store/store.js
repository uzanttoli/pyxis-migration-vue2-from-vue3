import Vue from 'vue'
import Vuex from 'vuex'
// import VuetifyTable from 'vuetify-datatable-extended'

import mutations from './mutations'
import actions from './actions'
import state from './state'
import getters from './getters'
import modules from './modules'

Vue.use(Vuex)
// Vue.use(VuetifyTable)
export default new Vuex.Store({
  mutations,
  actions,
  state,
  getters,
  modules
})
