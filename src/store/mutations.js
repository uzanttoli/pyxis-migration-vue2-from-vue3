import router from '../router/index'

const mutations = {
  setMenuAtual(state, payload) {
    state.menuSelecionado = payload
  },
  setNotPermissionResetPassword(state) {
    state.notPermissionResetPassword = true
    setTimeout(() => {
      state.notPermissionResetPassword = false
    }, 4000)
  },
  setResetPasswordOperatorsSup1(state, payload) {
    state.resetPasswordOperatorsSup1 = payload
  },
  setUpdateResetSenha(state) {
    state.updateResetSenha = true
    setTimeout(() => {
      state.updateResetSenha = false
    }, 4000)
  },
  setLoginRealizado(state) {
    state.loginRealizado = true
    setTimeout(() => {
      state.loginRealizado = false
    }, 4000)
  },
  setSenhaValidacaoVenda(state, payload) {
    state.senhaValidacaoVenda = payload
  },
  setRegionais(state, payload) {
    state.regionais = payload
  },
  setAuthenticated(state) {
    state.authenticated = true
  },
  setGlobalError(state, error) {
    state.globalError = error
  },
  setUsuarioLogado(state, payload) {
    state.usuarioLogado = payload
  },
  setIpMaquina(state, payload) {
    // state.ipMaquina = payload;
    // let tokenValidacao = {
    //   iss: "almavivadobrasil.net",
    //   iat: new Date().toLocaleString(),
    //   exp: new Date().setMinutes(60).toLocaleString(),
    // };

    // tokenValidacao = JSON.stringify(tokenValidacao);
    // tokenValidacao = Buffer.from(tokenValidacao).toString("base64");

    localStorage.setItem('ip', payload)
    // localStorage.setItem("ip", payload);
    // localStorage.setItem(
    //   "registro_acesso",
    //   JSON.stringify({
    //     ip_acesso: payload,
    //     token_validacao: tokenValidacao,
    //   })
    // );
  },
  setLoginError(state) {
    state.loginError = true
    setTimeout(() => {
      state.loginError = false
    }, 3000)
  },
  setAccessDenied(state) {
    state.accessDenied = true
    setTimeout(() => {
      state.accessDenied = false
    }, 3000)
  },
  setAcessPortal(state) {
    state.acessPortal = true
  },
  setUsuarioPiloto(state, payload) {
    /*Validacao Usuario piloto*/
    state.usuarioPiloto = payload
  },
  setUsuario(state, payload) {
    state.usuario = payload
  },
  setProduto(state, payload) {
    state.produto = payload
  },
  setToken(state, payload) {
    state._token = payload
  },
  setProdutos(state, payload) {
    state.produtos = payload
  },
  setUserLogged(state, payload) {
    state.isUserLogged = payload
  },
  setResumoPausas(state, payload) {
    state.resumoPausas = payload
  },
  setMenu(state, payload) {
    state.menu = payload
  },
  deslogar(state) {
    // state.usuario = {
    //   almope: null,
    //   nome: null,
    //   funcao: null,
    //   filtro: null,
    //   regional: null,
    //   produto: null,
    // };
    // state._token = null;
    // localStorage.removeItem("registro_acesso");
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    localStorage.removeItem('ip')
    localStorage.removeItem('menuItens')
    Object.assign({}, state.usuario)
    router.push({ path: '/pyxis/login' })
    router.go()
  },
  SET_PROCESSED_MENU_ITEMS(state, items) {
    state.processedMenuItems = items
  }
}

export default mutations
