const state = {
  notPermissionResetPassword: false,
  resetPasswordOperatorsSup1: [],
  loginRealizado: false,
  senhaValidacaoVenda: null,
  updateResetSenha: false,
  ipMaquina: null,
  _token: null,
  removeToken: null,
  loginError: false,
  accessDenied: false,
  produto: 'COMBO',
  agrupamento: 'N1',
  agrupamentos: [],
  produtos: [],
  acessPortal: false,
  usuarioPiloto: [],
  resumoPausas: null,
  usuarioLogado: null,
  globalError: '',
  authenticated: false,
  menu: [],
  regionais: [],
  usuarioConsulta: {
    almope: null
  },
  usuario: {
    almope: null,
    nome: null,
    funcao: null,
    regional: null
  },
  menuSelecionado: []
}

export default state
