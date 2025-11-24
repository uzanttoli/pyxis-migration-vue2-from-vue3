// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.snow.css'
import './assets/styles.css'
import './assets/border-glow.css'
import './assets/diamond.css'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import api from './plugins/axios'
import moment from 'moment'
// import VueTheMask from '../node_modules/vue-the-mask/dist/vue-the-mask'
import store from './store/store'
// import alasqlJs from '../node_modules/alasql/dist/alasql.min.js'
// import i18n from './i18n/index'
// import VueApexCharts from 'vue-apexcharts'
// import VueSweetalert2 from 'vue-sweetalert2'
// import JsonExcel from 'vue-json-excel'
// import Notifications from 'vue-notification'
import 'sweetalert2/dist/sweetalert2.min.css'
import VeeValidate from 'vee-validate'
// import { messages as messagesPtBR, attributes as attributesPtBR } from 'vee-validate/dist/locale/pt_BR'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

// Vue.use(VeeValidate, {
//   locale: 'pt_BR',
//   validity: true,
//   dictionary: {
//     pt_BR: { messages: messagesPtBR, attributes: attributesPtBR }
//   }
// })

// Vue.use(VueSweetalert2)
// Vue.use(Notifications)
// Vue.use(AudioVisual);

import './js/component.js'
import './js/filter.js'

// Vue.prototype.alasql = alasqlJs
Vue.prototype.moment = moment
Vue.prototype.$api = api

Vue.config.productionTip = false

// Vue.use(VueQuillEditor)
// Vue.use(VueTheMask)
// Vue.use(VueApexCharts)

// Vue.component('downloadExcel', JsonExcel)
Vue.component('apexchart', VueApexCharts)

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

Vue.mixin({
  methods: {
    replaceUrlMultiParamSeparator: str => str.replace(/;/g, '|')
  }
})

new Vue({
  router,
  // i18n,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
