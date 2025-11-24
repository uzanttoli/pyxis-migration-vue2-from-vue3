import Vue from 'vue'
import VueI18n from 'vue-i18n'
// import config from "../core/config";
// import store from "../store/store";
// import axios from "../plugins/axios";

Vue.use(VueI18n)

// dataLang()
const defaultLanguages = 'Português'

const Português = require('./languages/pt_br.json')
const Inglês = require('./languages/en.json')
const Italiano = require('./languages/italian.json')

const messages = { Português, Inglês, Italiano }

export default new VueI18n({
  locale: defaultLanguages,
  fallbackLocale: defaultLanguages,
  messages: messages,
  dataLang: '132'
})
