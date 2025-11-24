import Vue from 'vue'
import VueRouter from 'vue-router'

import config from '../core/config'
import store from '../store/store'

import routersNet from './net'
import routersEnel from './enel'

import protectionRoute from './protectionRouter'
//
Vue.use(VueRouter)

const routes = [...routersNet, ...routersEnel]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  ignoreDuplicateNavigation: true
})

router.beforeEach(async (to, from, next) => {
  if (to.name != 'Permissao' && to.name != 'Pyxis') {
    await protectionRoute(to, from, next)
  }
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.title)

  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags)

  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find(r => r.meta && r.meta.metaTags)

  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title
  } else if (previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title
  }

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el =>
    el.parentNode.removeChild(el)
  )

  if (!nearestWithMeta) return next()

  nearestWithMeta.meta.metaTags
    .map(tagDef => {
      const tag = document.createElement('meta')

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key])
      })

      tag.setAttribute('data-vue-router-controlled', '')

      return tag
    })
    .forEach(tag => document.head.appendChild(tag))

  next()
})

router.beforeResolve((to, from, next) => {
  if (to.name !== 'Login') {
    let urlData = `${config.baseUrl}api/shared/user/create/`
    let setFormData = object =>
      Object.keys(object).reduce((formData, key) => {
        formData.append(key, object[key])
        return formData
      }, new FormData())
    if (store.getters.usuario.almope) {
      Vue.prototype.$api.post(
        urlData,
        setFormData({
          ALMOPE: JSON.parse(localStorage.getItem('usuario')).almope,
          ROTA: to.name,
          IP_MAQUINA_ACESSO: localStorage.getItem('ip'),
          NOME_ROTA: to.path
        })
      )
    }

    next()
  } else next({ name: 'Login' })
})

export default router
