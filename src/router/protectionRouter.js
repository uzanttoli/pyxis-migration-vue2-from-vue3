import store from '@/store/store'
import api from '../plugins/axios'
import config from '../core/config'
import Swal from 'sweetalert2/dist/sweetalert2'

export default async function protectionRoute(to, from, next) {
  const usuario = store.getters.usuario
  try {
    if (usuario.produto != undefined && usuario.filtro != undefined && usuario.almope != null) {
      let urlData = `${config.baseUrl}api/shared/config/get_permission_rotas/${to.name}/${usuario.produto}/${usuario.filtro}/${usuario.almope}`
      const response = await api.get(urlData)
      if (response.data) {
        next()
      } else {
        next({ name: from.name ?? 'Pyxis' })
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          showConfirmButton: false,
          text: `Seu acesso a página (${to.name}) foi bloqueado, caso seja um engano contate o administrador.`,
          footer: `<a href="mailto:cco@almavivadobrasil.com.br?subject=LIBERAÇÃO DE RELATORIO PYXIS - ${to.name}">Nos envie um email.</a>`
        })
      }
    } else {
      return
    }
  } catch (error) {
    next({ name: from.name ?? 'Pyxis' })
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      showConfirmButton: false,
      text: `Seu acesso a página (${to.name}) foi bloqueado, caso seja um engano contate o administrador.`,
      footer: `<a href="mailto:cco@almavivadobrasil.com.br?subject=LIBERAÇÃO DE RELATORIO PYXIS - ${to.name}">Nos envie um email.</a>`
    })
  }
}
