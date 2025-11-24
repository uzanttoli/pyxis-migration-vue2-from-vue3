import config from '../core/config'
import router from '../router/index'
import Vue from 'vue'

const actions = {
  loadRegionais({ commit }) {
    let urlData = `${config.baseUrl}api/shared/regional/portal`
    Vue.prototype.$api.get(urlData).then(res => {
      commit('setRegionais', res.data)
    })
  },
  updateMenuAtual({ commit }, payload) {
    commit('setMenuAtual', payload)
  },
  loadMenu({ commit }, payload) {
    let urlData = `${config.baseUrl}api/shared/pyxis/menu`
    Vue.prototype.$api
      .get(urlData, {
        params: {
          produto: payload
        }
      })
      .then(res => {
        commit('setMenu', res.data)
      })
  },
  loadResetPasswordOperatorsSup1({ commit }, payload) {
    let urlData = `${config.baseUrl}api/shared/user/reset_password_operators_sup1/${payload.almope}/`
    if (payload.almope) urlData += `${payload.nome}`
    Vue.prototype.$api.get(urlData).then(res => {
      if (res.data != []) {
        commit('setResetPasswordOperatorsSup1', res.data)
      } else {
        commit('notPermissionResetPassword')
      }
    })
  },
  updateResetSenha({ commit }, payload) {
    let urlData = `${config.baseUrl}api/Jwt/alterar_senha/`
    let getFormData = object =>
      Object.keys(object).reduce((formData, key) => {
        formData.append(key, object[key])
        return formData
      }, new FormData())
    Vue.prototype.$api.post(urlData, getFormData(payload)).then(() => {
      commit('setUpdateResetSenha')
    })
  },
  setUsuario({ commit }, payload) {
    commit('setUsuario', payload)
  },
  clienteIP({ commit }) {
    let urlData = `${config.baseUrl}api/shared/cliente_ip/ip_maquina`
    Vue.prototype.$api.get(urlData).then(res => {
      commit('setIpMaquina', res.data)
    })
  },
  loadUsuarioLogado({ commit }) {
    let urlData = `${config.baseUrl}api/shared/cliente_ip/usuario_maquina`
    Vue.prototype.$api.get(urlData).then(res => {
      commit('setUsuarioLogado', res.data)
    })
  },
  async init({ dispatch }, payload) {
    await dispatch('logar', payload)
    await dispatch('getUserData', payload.username)
  },
  async logar({ commit }, payload) {
    try {
      const urlLogin = `${config.pyxisReceptivoUrl}login`
      const urlGerarSenha = `${config.baseUrl}api/shared/service_to_sales/check/venda/gerar_senha`
      const urlIpMaquina = `${config.baseUrl}api/shared/cliente_ip/ip_maquina`

      // Login
      const resLogin = await Vue.prototype.$api.post(urlLogin, payload)
      const token = resLogin.data?.token

      if (!token) {
        throw new Error('Token não retornado pela API.')
      }

      // Salva token
      commit('setToken', token)
      localStorage.setItem('token', token)
      commit('setLoginRealizado')

      // Gerar senha de validação
      const hash = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000
      const resSenha = await Vue.prototype.$api.post(urlGerarSenha, {
        username: payload.username,
        senha: hash
      })
      commit('setSenhaValidacaoVenda', resSenha.data)

      // Buscar IP da máquina
      const resIp = await Vue.prototype.$api.get(urlIpMaquina)
      commit('setIpMaquina', resIp.data)
    } catch (error) {
      console.error('Erro no processo de login:', error.response.data.message)
      throw error
    }
  },
  async getUserData({ commit }, payload) {
    try {
      let urlData = `${config.baseUrl}api/shared/user/user_data/${payload}`
      await Vue.prototype.$api.get(urlData).then(res => {
        commit('setUsuario', res.data)
        localStorage.setItem('usuario', JSON.stringify(res.data))
        router.push({ path: '/home' })
      })
    } catch (error) {
      if (error.response) {
        console.error(error.response)
      }
    }
  },
  loadUsuarioPiloto({ commit }, payload) {
    let urlData = `${config.baseUrl}api/shared/piloto_pyxis/usuarios_piloto/${payload}`
    Vue.prototype.$api.get(urlData).then(res => {
      commit('setUsuarioPiloto', res.data)
    })
  },
  setUsuarioPiloto({ commit }, payload) {
    commit('setUsuarioPiloto', payload)
  },
  setProduto({ commit }, payload) {
    commit('setProduto', payload)
  },
  setProdutos({ commit }, payload) {
    commit('setProdutos', payload)
  },
  setUserLogged({ commit }, payload) {
    commit('setUserLogged', payload)
  },
  setResumoPausas({ commit }, payload) {
    commit('setResumoPausas', payload)
  },
  async deslogar({ commit }) {
    await commit('deslogar')
  }
}

export default actions
