import Chat from '@/pages/chat/chat.vue'
import GerencialGame from '@/pages/gamification/gerencial/Gerencial.vue'
import HistoriaGamification from '@/pages/gamification/historia/Historia.vue'
import Home from '@/pages/home/Home.vue'
import Login from '@/core/components/login.vue'
import Notification from '@/shared/components/notification/NotificationComponent.vue'
import PainelGestaoDePlayers from '@/pages/gamification/gestaoPlayers/PainelGestaoDePlayers.vue'
import ReloadPage from '@/pages/chat/reloadPage.vue'
import SpotPlayer from '@/pages/gamification/PainelGamificado.vue'
import Workflow from '@/pages/relatoriosOnline/workFlow/workFlow.vue'
import notPermission from '@/pages/notPermission.vue'
import ocupacao from '@/pages/relatoriosOnline/ocupacao/ocupacao.vue'
import painelAdministrativo from '@/pages/admin/painel/painel.vue'
import DadosNice from '@/pages/relatoriosOnline/executivo/Painel.vue'
import PopupLab from '@/pages/acoes/popupLab/Painel.vue'

const routes = [
  {
    path: '/pyxis/pesquisa-satisfacao/',
    name: 'Pesquisa Satisfação',
    component: () => import('../pages/pesquisa/satisfacaoOperacional/modalSatisfacao.vue')
  },
  {
    path: '/pyxis/humor/ranking',
    name: 'Ranking Avaliações',
    component: () => import('../pages/pesquisa/humor/index.vue')
  },
  {
    path: '/pyxis/acoes/popuplab',
    name: 'Popup Lab',
    component: PopupLab
  },
  {
    path: '/pyxis/relatorios-online/nice',
    name: 'Dados Nice',
    component: DadosNice
  },
  {
    path: '/pyxis/downloads/arquivos',
    name: 'Gerenciar arquivos',
    component: () => import('../pages/download/components/ListaAnexos.vue')
  },
  {
    path: '/pyxis/resolve-n2/backoffice/',
    name: 'Resolve N2',
    component: () => import('../pages/resolveN2/backoffice/Tabulador.vue')
  },
  {
    path: '/pyxis/relatorios-online/gestao-bloqueados',
    name: 'Gestão Bloqueados',
    component: () =>
      import('../pages/relatoriosOnline/gestaoBloqueados/Gerencial.gestaoBloqueados.vue')
  },
  {
    path: '/pyxis/tabuladores',
    name: 'Tabuladores',
    component: () => import('../pages/tabuladores/tabuladores.vue')
  },
  {
    path: '/pyxis/pyxforms',
    name: 'Pyxis Forms',
    component: () => import('../pages/tabuladores/pyxforms.vue')
  },
  {
    path: '/pyxis/tabuladores/tabulador',
    name: 'View Tabuladores',
    component: () => import('../pages/tabuladores/viewTabuladores.vue')
  },
  {
    path: '/pyxis/feedback/formulario',
    name: 'Feedback Operacional',
    component: () => import('@/shared/components/feedback/formFeedback.vue')
  },
  {
    path: '/pyxis/pesquisa/gestao',
    name: 'Gestão de Pesquisas',
    component: () => import('../pages/pesquisa/gestaoPesquisa/pesquisaConfig.vue')
  },
  {
    path: '/pyxis/pesquisa/gestao/elaborar-pesquisa',
    name: 'Elaborar Pesquisas',
    component: () => import('../pages/pesquisa/gestaoPesquisa/elaborarPesquisa.vue')
  },
  {
    path: '/pyxis/utilitarios/celula-ativa/tratar',
    name: 'Tratativa Celula Ativa',
    component: () => import('../pages/formularios/tabuladores/celulaAtiva/tratativaCelulaAtiva.vue')
  },
  {
    path: '/pyxis/utilitarios/celula-ativa/upload-base',
    name: 'Upload Base Celula Ativa',
    component: () =>
      import('../pages/formularios/tabuladores/celulaAtiva/acompanhamentoCelulaAtiva.vue')
  },
  {
    path: '/pyxis/retencao/performance-online',
    name: 'Performance Online',
    component: () => import('../pages/operacao/net/retencao/performance/painel.vue')
  },
  {
    path: '/pyxis/retencao/gerencial/desconexao-chamadas',
    name: 'Gerencial Desc Chamadas',
    component: () => import('../pages/operacao/net/retencao/desconexao/Gerencial.vue')
  },
  {
    path: '/pyxis/retencao/desconexao-chamadas',
    name: 'Desconexão Chamadas',
    component: () => import('../pages/operacao/net/retencao/desconexao/painel.vue')
  },
  {
    path: '/pyxis/service-to-sales/backoffice/indicacao-combo-multi',
    name: 'Tabulador Indicacao Combo multi',
    component: () =>
      import('../pages/operacao/net/serviceToSales/backoffice/fluxos/NovoIndicacaoComboMulti.vue')
  },
  {
    path: '/pyxis/speech-zone/dashboard/',
    name: 'Speech Zone',
    component: () => import('../pages/speechZone/dashboardSpeechZone.vue')
  },
  {
    path: '/pyxis/project-manager/area-do-solicitante/',
    name: 'AreaSolicitante',
    component: () => import('../pages/projectManager/areaSolicitante/solicitante.vue')
  },
  {
    path: '/pyxis/project-manager/nova-solicitacao/',
    name: 'NovaSolicitacaoProject',
    component: () => import('../pages/projectManager/areaSolicitante/novaSolicitacao.vue')
  },
  {
    path: '/pyxis/project-manager/solicitacao/id/:id',
    name: 'SolicitacaoProjectId',
    component: () => import('../pages/projectManager/areaSolicitante/solicitacaoId.vue')
  },
  {
    path: '/pyxis/project-manager/gestao-solicitacoes',
    name: 'GestãoSolicitacoesProjetManager',
    component: () => import('../pages/projectManager/gestaoSolicitacoes/gestaoSolicitacoes.vue')
  },
  {
    path: '/pyxis/project-manager/tratar-solicitacao/id/:id',
    name: 'TratativaProjectManager',
    component: () => import('../pages/projectManager/areaTratativa/tratarSolicitacao.vue')
  },
  {
    path: '/pyxis/gamification/historia',
    name: 'HistoriaGamification',
    component: HistoriaGamification
  },
  {
    path: '/pyxis/bloco-notas',
    name: 'BlocoNotas',
    component: () =>
      import('../shared/components/utilities/blocoDeNotas/blocoDeNotasLink.component.vue')
  },
  {
    path: '/pyxix/reload',
    component: ReloadPage,
    name: 'ReloadPage'
  },
  {
    path: '/pyxis/gamification/gestao-player/validacao-de-bencao/id/:id',
    name: 'ValidacaoBencaoID',
    component: () =>
      import('../pages/gamification/gestaoPlayers/gerenciarBencao/ValidacaoBencao.vue')
  },
  {
    path: '/pyxis/gamification/gestao-player/validar-bencao',
    name: 'ValidacaoBencao',
    component: PainelGestaoDePlayers
  },
  {
    path: '/pyxis/solicitacoes',
    name: 'Solicitacao',
    component: () => import('../pages/solicitacoes/formularioAsana.vue')
  },
  {
    path: '/pyxis/gamification/gestao-player/solicitar-bencao',
    name: 'SolicitarBencao',
    component: PainelGestaoDePlayers
  },
  {
    path: '/pyxis/gamification/gestao-player/lista-players/',
    name: 'listarPlayers',
    component: PainelGestaoDePlayers
  },
  {
    path: '/pyxis/gamification/spot_player',
    name: 'SpotPlayer',
    component: SpotPlayer
  },
  {
    path: '/pyxis/gamification/spot_player/ganhadores',
    name: 'SpotPlayerResultado',
    component: () => import('../pages/gamification/spotPlayer/ganhadores.vue')
  },
  {
    path: '/pyxis/gamification/gerencial',
    name: 'GerencialGame',
    component: GerencialGame
  },
  {
    path: '/pyxis/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'CCO | Login'
    }
  },
  {
    path: '/pyxis/chat/',
    name: 'Chat',
    component: Chat,
    meta: {
      title: 'CCO | Chat'
    }
  },
  {
    path: '/pyxis/chat/:id',
    name: 'ChatId',
    component: Chat,
    meta: {
      title: 'CCO | Chat'
    }
  },
  {
    path: '/pyxis/relatorios-online/workflow',
    name: 'Workflow',
    component: Workflow,
    meta: {
      title: 'CCO | Workflow'
    }
  },
  {
    path: '/pyxis/notification',
    name: 'Notification',
    component: Notification
  },
  {
    path: '/home',
    name: 'Pyxis',
    component: Home,
    meta: {
      title: 'CCO | Home'
    }
  },

  {
    path: '/pyxis/conquistas/minhas-conquistas',
    name: 'Conquistas',
    component: () => import('../pages/conquistas/conquistas.vue'),
    meta: {
      title: 'CCO | Conquistas'
    }
  },

  {
    path: '/pyxis/meu-perfil/',
    name: 'Perfil',
    component: () => import('../pages/meuPerfil/meuPerfil.vue'),
    meta: {
      title: 'CCO | Meu Perfil'
    }
  },
  {
    path: '/pyxis/loja/',
    name: 'NewStore',
    component: () => import('../pages/loja/newStore.vue'),
    meta: {
      title: 'CCO | Loja Pyxis'
    }
  },

  {
    path: '/pyxis/gerenciamento-estoque/',
    name: 'GerenciamentoEstoque',
    component: () => import('../pages/loja/viewLoja.vue'),
    children: [
      {
        path: ':id',
        name: 'Gerenciamento',
        component: () => import('../shared/components/loja/ProdutosBannerCadastrados.vue')
      },
      {
        path: ':id',
        name: 'NovoProduto',
        component: () => import('../shared/components/loja/CadastrarProduto.vue')
      },
      {
        path: ':id',
        name: 'ControleDeEntregas',
        component: () => import('../shared/components/loja/TableControleDeEntregas.vue')
      }
    ],
    meta: {
      title: 'CCO | Gerenciamento Estoque'
    }
  },

  {
    path: '/pyxis/store/produto/:id',
    name: 'Produto',
    component: () => import('../shared/components/loja/ProdutoCheckout.vue'),
    meta: {
      title: 'CCO | Produto'
    }
  },

  // PAINEL
  {
    path: '/pyxis/painel-administrativo/',
    name: 'Painel Administrativo',
    component: painelAdministrativo,

    meta: {
      title: 'CCO | Painel Administrativo'
    }
  },
  {
    path: '/pyxis/painel-administrativo/controle-log',
    name: 'Controle Log',
    component: () =>
      import('../pages/admin/painel/controleAcesso/tableControleAcesso.component.vue'),
    meta: {
      title: 'CCO | Controle de Log'
    }
  },

  {
    path: '/pyxis/service-to-sales/gerencial',
    name: 'GerencialS2S',
    component: () =>
      import('../pages/operacao/net/serviceToSales/gerencial/gerencialS2S.component.vue'),
    meta: {
      title: 'CCO | Gerencial S2S'
    }
  },
  {
    path: '/pyxis/service-to-sales/backoffice/',
    name: 'BackofficeS2S',
    component: () => import('../pages/operacao/net/serviceToSales/backoffice/painelBackoffice.vue'),
    meta: {
      title: 'CCO | Painel'
    }
  },
  {
    path: '/pyxis/service-to-sales/backoffice/ativacao-s2s',
    name: 'BackofficeS2SAtivacao',
    component: () =>
      import('../pages/operacao/net/serviceToSales/backoffice/backofficeAtivacao.vue'),
    meta: {
      title: 'CCO | Backoffice Ativação'
    }
  },
  {
    path: '/pyxis/service-to-sales/gerencial-backoffice/fila',
    name: 'Gerencial Backoffice S2S',
    component: () => import('../pages/serviceToSales/backoffice/gerencial/Fila.vue')
  },
  {
    path: '/pyxis/service-to-sales/backoffice/ativacao/',
    name: 'Tratativa Bko Ativacao',
    component: () => import('../pages/serviceToSales/backoffice/index.vue'),
    children: [
      {
        path: '/pyxis/service-to-sales/backoffice/ativacao/produto/:produto',
        name: 'Tratativa Por Produto',
        component: () => import('../pages/serviceToSales/backoffice/fila.vue')
      },
      {
        path: '/pyxis/service-to-sales/backoffice/ativacao/produto/:produto/fila/:fila',
        name: 'Tratativa Por Fila',
        component: () => import('../pages/serviceToSales/backoffice/tabuladores/index.vue')
      }
    ],
    meta: {
      title: 'CCO | Backoffice Ativação'
    }
  },
  {
    path: '/pyxis/service-to-sales/backoffice/silente',
    name: 'BackofficeS2SSilente',
    component: () =>
      import('../pages/operacao/net/serviceToSales/backoffice/silente/checkoutSilente.vue'),
    meta: {
      title: 'CCO | Backoffice Silente'
    }
  },
  {
    path: '/pyxis/service-to-sales/backoffice/cliente-silente',
    name: 'Tabulacao Silente',
    component: () =>
      import('../pages/operacao/net/serviceToSales/backoffice/silente/clienteSilente.vue'),
    meta: {
      title: 'CCO | Backoffice Cliente Silente'
    }
  },
  {
    path: '/pyxis/service-to-sales/checkout-tratativas/backoffice',
    name: 'BackofficeS2SCheckout',
    component: () => import('../pages/operacao/net/serviceToSales/checkout/Checkout.vue'),
    meta: {
      title: 'CCO | Checkout Tratativas'
    }
  },
  {
    path: '/pyxis/downloads/relatorios',
    name: 'Downloads Relatorios',
    component: () => import('../pages/download/relatorios/relatorios.vue')
  },
  {
    path: '/pyxis/downloads/relatorios/gerenciar',
    name: 'Gerenciar Relatorios Downloads',
    component: () => import('../pages/download/relatorios/gerenciarRelatorios.vue')
  },
  {
    path: '/pyxis/retencao/piloto-reversao',
    name: 'Retencao',
    component: () => import('../pages/operacao/net/retencao/pilotoReversao/pilotoReversao.vue')
  },
  {
    path: '/pyxis/raspadinha',
    name: 'Raspadinha',
    component: () => import('../pages/raspadinha/LAYOUT.vue'),
    children: [
      {
        path: 'campanha',
        name: 'Campanha',
        component: () => import('../pages/raspadinha/campanha.vue')
      },
      {
        path: 'campanha/nova',
        name: 'NovaCampanha',
        component: () => import('../pages/raspadinha/campaign/nova/nova.vue')
      },
      {
        path: 'campanha/:campaignId/cartelas/nova',
        name: 'NovaCartela',
        component: () => import('../pages/raspadinha/campaign/cartela/nova/nova.vue')
      },
      {
        path: 'campanha/:campaignId/Cartelas',
        name: 'Cartelas',
        component: () => import('../pages/raspadinha/campaign/cartelas.vue')
      },
      {
        path: 'campanha/:campaignId/Cartelas/:id',
        name: 'Cartela',
        component: () => import('../pages/raspadinha/campaign/cartela/cartela.vue')
      }
    ]
  },
  {
    path: '/pyxis/loteria/',
    name: 'loteriaPyxis',
    component: () => import('../pages/loteria/viewLoteria.vue'),
    children: [
      {
        path: ':id',
        name: 'Bilhetes',
        component: () => import('../pages/loteria/painelConcurso.vue')
      },
      {
        path: ':id',
        name: 'EditarPainelLoteria',
        component: () => import('../pages/loteria/painel/configuracoes.vue')
      },
      {
        path: ':id',
        name: 'ResultadoLoteria',
        component: () => import('../pages/loteria/resultadoConcursos.vue')
      },
      {
        path: ':id',
        name: 'AderenciaLoteria',
        component: () => import('../pages/loteria/aderenciaLoteria.vue')
      },
      {
        path: ':id',
        name: 'SorteioNumeroLoteria',
        component: () => import('../pages/loteria/painel/sorteio/painel.vue')
      }
    ]
  },

  {
    path: '/pyxis/service-to-sales/smart-sales',
    name: 'smartSales',
    component: () => import('../pages/smartSales/index.vue'),
    meta: {
      title: 'CCO | Smart Sales'
    }
  },
  {
    path: '/pyxis/service-to-sales/smart-sales/configuracao',
    name: 'configuracaoSmartSales',
    component: () => import('../pages/smartSales/editar/smartSales.vue')
  },

  {
    path: '/pyxis/service-to-sales/checkout-vendas-pend-atv',
    name: 'CheckoutVendasPendAtv',
    component: () =>
      import('../pages/operacao/net/serviceToSales/checkoutVendasPendAtv/formView.vue')
  },
  {
    path: '/pyxis/service-to-sales/checkout-vendas-pend-atv/download-evidencias',
    name: 'CheckoutVendasPendAtvDownload',
    component: () =>
      import(
        '../pages/operacao/net/serviceToSales/checkoutVendasPendAtv/downloadEvidenciasCheckout.vue'
      )
  },
  {
    path: '/pyxis/service-to-sales/ranking-vendas',
    name: 'RankingVendas',
    component: () => import('../pages/smartSales/ranking/ranking.vue'),
    meta: {
      title: 'CCO | Ranking Vendas'
    }
  },
  {
    path: '/pyxis/service-to-sales/coordenador/',
    name: 'CoordenadorS2S',
    component: () =>
      import('../pages/operacao/net/serviceToSales/coordenador/coordenadorS2S.component.vue'),
    meta: {
      title: 'CCO | Coordenador S2S'
    }
  },
  {
    path: '/pyxis/service-to-sales/supervisor/',
    name: 'SupervisorS2S',
    component: () =>
      import('../pages/operacao/net/serviceToSales/supervisor/supervisorS2S.component.vue'),
    meta: {
      title: 'CCO | Supervisor S2S'
    }
  },
  {
    path: '/pyxis/service-to-sales/operador/',
    name: 'OperadorS2S',
    component: () =>
      import('../pages/operacao/net/serviceToSales/operador/operadorS2S.component.vue'),
    meta: {
      title: 'CCO | Operador S2S'
    }
  },

  /**
   *
   * Brownfield
   */
  {
    path: '/pyxis/brownfield/gerencial/',
    name: 'BrownfieldGerencial',
    component: () => import('../pages/brownfield/gerencial/gerencial.vue'),
    meta: {
      title: 'CCO | BF - Gerencial'
    }
  },
  {
    path: '/pyxis/brownfield/coordenador/',
    name: 'BrownfieldCoordenador',
    component: () => import('../pages/brownfield/coordenador/coordenador.vue'),
    meta: {
      title: 'CCO | BF - Coordenador'
    }
  },
  {
    path: '/pyxis/brownfield/supervisor/',
    name: 'BrownfieldSupervisor',
    component: () => import('../pages/brownfield/supervisor/supervisor.vue'),
    meta: {
      title: 'CCO | BF - Supervisor'
    }
  },
  {
    path: '/pyxis/brownfield/operador/',
    name: 'BrownfieldOperador',
    component: () => import('../pages/brownfield/operador/operador.vue'),
    meta: {
      title: 'CCO | BF - Operador'
    }
  },
  {
    path: '/pyxis/relatorios-online/ocupacao',
    name: 'Ocupacao',
    component: ocupacao,

    meta: {
      title: 'CCO | Ocupação'
    }
  },
  {
    path: '/:pathMach(.*)*',
    name: 'Permissao',
    component: notPermission
  },
  // Painel Gerencial

  {
    path: '/pyxis/relatorios-online/gerencial',
    name: 'Gerencial',
    component: () => import('../pages/relatoriosOnline/gerencial/gerencial.component.vue'),

    meta: {
      title: 'CCO | Gerencial'
    }
  },

  {
    path: '/pyxis/service-to-sales/resumo-tratativa/',
    name: 'ResumoTratativa',
    component: () =>
      import('../pages/operacao/net/serviceToSales/resumoTratativa/painelResumoTratativa.vue'),
    meta: {
      title: 'CCO | Resumo Tratativa'
    }
  },

  {
    path: '/pyxis/gerencial/televendas',
    name: 'Gerencial Televendas',
    component: () => import('../pages/indicadorGerencial/televendas/televendas.component.vue'),
    meta: {
      title: 'CCO | Gerencial Televendas'
    }
  },
  {
    path: '/pyxis/gerencial/dashboard',
    name: 'gerencialResumo',
    component: () => import('../pages/dashboard/net/dashboard.vue'),
    meta: {
      title: 'CCO | Gerencial Resumo'
    }
  },

  //
  {
    path: '/pyxis/bases-download/',
    name: 'Bases',
    component: () => import('../pages/base/download/downloadBases.vue'),

    meta: {
      title: 'CCO | Download de bases'
    }
  },
  {
    path: '/pyxis/download/planilha',
    name: 'DownloadPlanilha',
    component: () => import('../pages/download/planilhas.vue')
  },

  //BKO
  {
    path: '/pyxis/backoffice/gerencial',
    name: 'Backoffice',
    component: () => import('../pages/backoffice/BackofficeGerencial.vue')
  },
  {
    path: '/pyxis/backoffice/operador',
    name: 'BackofficeOperador',
    component: () => import('../pages/backoffice/BackofficeOperador.vue')
  },
  {
    path: '/pyxis/backoffice/relatorio',
    name: 'BackofficeRelatorio',
    component: () => import('@/pages/backoffice/reports/BackofficeRelatorio.vue')
  },
  {
    path: '/pyxis/backoffice/operador/fila/:id',
    name: 'BackofficeOperadorTratativa',
    component: () => import('../pages/backoffice/operador/TratativaCaso.component.vue')
  },
  {
    path: '/pyxis/backoffice/gestao/',
    name: 'BackofficeGestao',
    component: () => import('../pages/backoffice/BackofficeGestao.vue')
  },
  {
    path: '/pyxis/backoffice/bases-pendentes',
    name: 'BackofficeBasesPendentes',
    component: () => import('../pages/backoffice/BasesPendentes.vue')
  },

  // Operador
  {
    path: '/pyxis/operacoes/operador/gamification',
    name: 'Operador2',
    component: () => import('../pages/operacao/net/operacoes/operador/gamification.component.vue'),

    meta: {
      title: 'CCO | Gamification'
    }
  },
  {
    path: '/pyxis/feed/publicacao/:id',
    name: 'FeedNoticias',
    component: () => import('../pages/home/feed/post/PostFeedback.component.vue')
  },
  {
    path: '/pyxis/feed/publicar',
    name: 'PostarFeed',
    component: () => import('../pages/home/feed/criarPost/CriarPostFeed.component.vue')
  },
  {
    path: '/pyxis/operacoes/operador/dados-online',
    name: 'Operador',
    // component: () =>
    //   import("../pages/net/operacoes/operador/operador.component.vue"),
    component: () => import('../pages/operacao/net/operacoes/operador/Operador.vue'),

    meta: {
      title: 'CCO | Dados Online'
    }
  },
  {
    // path: "/pyxis/operacoes/operador/meus-feedbacks/:id",
    path: '/pyxis/operacoes/meus-feedbacks/acompanhar',
    name: 'FeedbackId',
    component: () =>
      import(
        '../pages/operacao/net/operacoes/operador/meusFeedbacks/feedbackPorId/feedbackId.component.vue'
      )
  },
  {
    path: '/pyxis/operacoes/operador/meus-feedbacks',
    name: 'Meus Feedbacks',
    component: () => import('../pages/operacao/net/operacoes/operador/Operador.vue'),
    meta: {
      title: 'CCO | Meus Feedbacks'
    }
  },
  {
    path: '/pyxis/operacoes/supervisor/tratar-demandas',
    name: 'Tratar Demandas',
    component: () => import('../pages/operacao/net/operacoes/supervisor/Supervisor.vue'),

    meta: {
      title: 'CCO | Tratar Demandas'
    }
  },
  {
    path: '/pyxis/operacoes/supervisor/dados-online',
    name: 'Supervisor',
    component: () => import('../pages/operacao/net/operacoes/supervisor/Supervisor.vue'),

    meta: {
      title: 'CCO | Dados Online'
    }
  },
  {
    path: '/pyxis/operacoes/feedback',
    name: 'Feedback',
    component: () => import('@/shared/components/feedback/PageFeedback.vue'),
    meta: {
      title: 'CCO | Feedback'
    }
  },
  {
    path: '/pyxis/form-supervisor',
    name: 'FormularioSupervisor',
    component: () =>
      import(
        '../pages/operacao/net/operacoes/supervisor/formularioSupervisor/melhoriaOperacional.component.vue'
      ),
    meta: {
      title: 'CCO | Formulario Supervisor'
    }
  },

  {
    path: '/pyxis/operacoes/coordenador/dados-online',
    name: 'Dados Online',
    component: () => import('../pages/operacao/net/operacoes/coordenador/Coordenador.vue'),

    meta: {
      title: 'CCO | Dados Online'
    }
  },
  {
    path: '/pyxis/utilitarios/',
    name: 'Utilitarios',
    component: () => import('../pages/formularios/painel.vue'),
    meta: {
      title: 'CCO | Utilitarios'
    }
  },

  {
    path: '/pyxis',
    name: 'ApresentacaoInicial',
    component: () => import('../pages/landingPage/landingPage.vue'),
    meta: {
      title: 'CCO | Utilitarios'
    }
  },
  // tela dados online
  {
    path: '/pyxis/operacoes/dados-online/',
    name: 'Operação Dados Online',
    component: () => import('../pages/operacao/dadosOnline/dadosOnline.component.vue')
  }

  // {
  //   path: '/:pathMach(.*)*',
  //   name: 'NotFound',
  //   redirect: '/'
  // }
]

export default routes
