const getters = {
  menuSelecionado(state) {
    return state.menuSelecionado
  },
  notPermissionResetPassword(state) {
    return state.notPermissionResetPassword
  },
  resetPasswordOperatorsSup1(state) {
    return state.resetPasswordOperatorsSup1
  },
  updateResetSenha(state) {
    return state.updateResetSenha
  },
  loginRealizado(state) {
    return state.loginRealizado
  },
  usuarioLogado(state) {
    return state.usuarioLogado
  },
  ipMaquina(state) {
    return state.ipMaquina
  },
  senhaValidacaoVenda(state) {
    return state.senhaValidacaoVenda
  },
  accessDenied(state) {
    return state.accessDenied
  },
  loginError(state) {
    return state.loginError
  },
  produto(state) {
    return state.produto
  },
  regionais(state) {
    return state.regionais
  },
  produtos(state) {
    return state.produtos
  },
  resumoPausas(state) {
    return state.resumoPausas
  },
  usuarioPiloto(state) {
    return state.usuarioPiloto
  },
  usuario(state) {
    return JSON.parse(localStorage.getItem('usuario')) || state.usuario
  },
  usuarioConsulta(state) {
    return state.usuarioConsulta
  },
  menu(state) {
    return state.menu
  },
  token(state) {
    return localStorage.getItem('token') || state._token
  }
}
export default getters
