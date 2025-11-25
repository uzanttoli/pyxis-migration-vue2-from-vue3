const rotas = [
  {
    path: '/pyxis/enel/operacoes/operador/dados-online',
    name: 'DadosOnlineOperador',
    component: () => import('../pages/operacao/enel/operacoes/operador/Operador.vue'),
    meta: {
      title: 'CCO | Dados Online'
    }
  },
  {
    path: '/pyxis/enel/operacoes/supervisor/dados-online',
    name: 'DadosOnlineSupervisor',
    component: () => import('../pages/operacao/enel/operacoes/supervisor/Supervisor.vue'),
    meta: {
      title: 'CCO | Dados Online'
    }
  },
  {
    path: '/pyxis/enel/operacoes/coordenador/dados-online',
    name: 'DadosOnlineCoordenador',
    component: () => import('../pages/operacao/enel/operacoes/coordenador/Coordenador.vue'),
    meta: {
      title: 'CCO | Dados Online'
    }
  },
  {
    path: '/pyxis/relatorios-online/e-billing',
    name: 'Ebilling',
    component: () => import('../pages/relatoriosOnline/eBilling/painelEbilling.vue'),

    meta: {
      title: 'CCO | E-Billing'
    }
  },
  {
    path: '/pyxis/utilitarios/solicitacao-acessos/tratamento',
    name: 'SolicitacaoAcesso',
    component: () =>
      import('../pages/formularios/tabuladores/solicitacaoAcessos/tratamentoSolicitacoes.vue'),
    meta: {
      title: 'CCO | Tratamento Acessos'
    }
  }
]

export default rotas
