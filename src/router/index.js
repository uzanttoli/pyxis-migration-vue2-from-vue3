import Vue from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import config from '../core/config'
import store from '../store/store'

import routersNet from './net'
import routersEnel from './enel'

import MenuService from '@/data/services/menu/MenuService'
import Swal from 'sweetalert2/dist/sweetalert2'

import { PopupLabService } from '@/data/services/Acoes'
import { mostrarPopup } from '@/pages/acoes/popupLab/popupService'
//
// Vue.use(VueRouter)

const routes = [...routersNet, ...routersEnel]

const router = createRouter({
  history: createWebHistory(),
  base: process.env.BASE_URL,
  routes,
  ignoreDuplicateNavigation: true
})

router.beforeEach(async (to, from, next) => {
  // Permite acesso direto à tela de login
  if (to.path === '/') {
    return next()
  }

  let menuItens = store.getters.menuItens

  if (!menuItens || menuItens.length === 0) {
    try {
      if (store.getters.usuario.filtro != 'INATIVO') {
        menuItens = await MenuService.getAll()
      } else {
        menuItens = []
      }
    } catch (e) {
      return next('/home')
    }
  }

  const isAllowed = menuItens.some(item => matchRoute(to.path, item.route))

  // if (to.path === '/home') {
  //   return next()
  // }

  if (!isAllowed) {
    await Swal.fire({
      icon: 'error',
      timer: 5000,
      timerProgressBar: true,
      title: 'Oops...',
      showConfirmButton: false,
      text: `Seu acesso à página (${to.name}) foi bloqueado, caso seja um engano contate o administrador.`,
      footer: `<a href="mailto:cco@almavivadobrasil.com.br?subject=LIBERAÇÃO DE RELATÓRIO PYXIS - ${to.name}">Nos envie um email.</a>`
    })
    return next('/home')
  }
  next()

  // Configuração do popupdinamico
  const usuario = store.getters.usuario
  const res = await PopupLabService.getListarPopupDisponiveis(
    usuario.almope,
    usuario.regional,
    usuario.produto,
    to.path
  )

  if (res != '') {
    for (let result of res) {
      mostrarPopup({
        titulo: res && result.TITULO,
        arquivo: res && result.ARQUIVO_POPUP
      })
    }
  }
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
  } else {
    next()
  }
})

function matchRoute(path, routePattern) {
  // Remove query params, espaços e barras extras, força minúsculas
  const clean = str =>
    str.split('?')[0].trim().replace(/\/+$/, '').replace(/^\/+/, '').toLowerCase()

  const pathParts = clean(path).split('/').filter(Boolean)
  const patternParts = clean(routePattern).split('/').filter(Boolean)

  if (pathParts.length !== patternParts.length) return false

  for (let i = 0; i < pathParts.length; i++) {
    if (patternParts[i].startsWith(':')) continue
    if (pathParts[i] !== patternParts[i]) return false
  }

  return true
}

export default router
