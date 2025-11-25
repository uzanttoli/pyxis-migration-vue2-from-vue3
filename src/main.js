import './assets/styles.css'
import './assets/border-glow.css'
import './assets/diamond.css'
import { createApp } from 'vue'
import App from './App.vue'
// import vuetify from './plugins/vuetify'
import router from './router'
import api from './plugins/axios'
// import moment from 'moment'
import store from './store/store'
import 'sweetalert2/dist/sweetalert2.min.css'
import VueSweetalert2 from 'vue-sweetalert2'

import Components from '@/js/component.js'
import Filters from '@/js/filter'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})


// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.snow.css'
// import Vue from 'vue'
// import VueTheMask from '../node_modules/vue-the-mask/dist/vue-the-mask'
// import alasqlJs from '../node_modules/alasql/dist/alasql.min.js'
// import i18n from './i18n/index'
// import VueApexCharts from 'vue-apexcharts'
// import JsonExcel from 'vue-json-excel'
// import Notifications from 'vue-notification'
// import VeeValidate from 'vee-validate'
// import { messages as messagesPtBR, attributes as attributesPtBR } from 'vee-validate/dist/locale/pt_BR'

// Vue.use(VeeValidate, {
//   locale: 'pt_BR',
//   validity: true,
//   dictionary: {
//     pt_BR: { messages: messagesPtBR, attributes: attributesPtBR }
//   }
// })


// Vue.use(Notifications)
// Vue.use(AudioVisual);

import './js/component.js'
import './js/filter.js'

// Vue.prototype.alasql = alasqlJs
// Vue.prototype.moment = moment
// Vue.prototype.$api = api

// Vue.config.productionTip = false

// Vue.use(VueQuillEditor)
// Vue.use(VueTheMask)
// Vue.use(VueApexCharts)

// Vue.component('downloadExcel', JsonExcel)
// Vue.component('apexchart', VueApexCharts)

const app = createApp(App)

app.config.globalProperties.$api = api
app.component('ValidationObserver', ValidationObserver)
app.component('ValidationProvider', ValidationProvider)

app.mixin({
  methods: {
    replaceUrlMultiParamSeparator: str => str.replace(/;/g, '|')
  }
})

app.use(VueSweetalert2)
app.use(vuetify)
app.use(Components)
app.use(Filters)

app.use(router).use(store).mount('#app')

// new Vue({
//   router,
//   // i18n,
//   store,
//   vuetify,
//   render: h => h(App)
// }).$mount('#app')
