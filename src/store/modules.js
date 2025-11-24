import tmtService from '../service/tmt.service'
import absService from '../service/abs.service'
import pausaService from '../service/pausa.service'
import inaderenciaService from '../service/inaderencia.service'
import layoutOnline from '../service/layoutOnline.service'
import controleDeslogue from '../service/controleDeslogue.service'
import dashboardService from '../service/dashboard.service'
import palitagemService from '../shared/components/utilities/palitagem/palitagem.service'
import adicionarDemandaService from '../shared/components/utilities/adicionarDemandas/adicionarDemandas.service'
import dadosFilaService from '../service/dadosFila'
import operadorService from '../service/operador.service'
import supervisorService from '../service/supervisor.service'
import scoreboardService from '../service/scoreboard.service'
import blocoNotasService from '../shared/components/utilities/blocoDeNotas/blocoDeNotas.service'
import meusFeedbacksService from '../service/meusFeedbacks.service'
import dadosOperadorFeedbackService from '../service/feedback.service'
import dialogExibirFormularioService from '../shared/components/modais/humor/humor.service'
import extratoChamadasNetService from '../service/resultadoOnline.service'
import extratoChamadaNetSupervisorService from '../service/cardResultadoOnlineSupervisor.service'
import ofensoresResultadoService from '../service/cardOfensores.service'
import amChartService from '../shared/components/charts/amChart4.service'
import coordenadorService from '../service/coordenador.service'
import adminService from '../service/admin.service'
import tabuladorErroPagamentoService from '../service/tabulatePaymentError.service'
import tabuladorIndevidasFinanceirasService from '../service/indevidasFinanceiras.service'
import resumoOperadorService from '../service/operatorSummaryBase.service'
import resultadoDiaDiaService from '../service/indicadoresDiaDia.service'
import performanceOsService from '../service/performanceOs.service'
import mplayPerformanceHoraService from '../service/mplay.service'
import expurgoService from '../service/expurgo.service'
import avatarService from '../shared/components/dialogs/avatar.service'
import farolService from '../service/farol.service'
import workFlowService from '../service/workFlow.service'
import feedService from '../service/feed.service'
import lojaPyxis from '../service/lojaPyxis.service'
import tratativaBkoAtivacaoService from '../service/tratativaBkoAtivacao.service'
import newLojaService from '../service/newLoja.service'
import analisePerfilService from '../service/analisePerfil.service'
import usersService from '../service/users.service'
import backofficeService from '../service/backoffice.service'
import chatService from '../service/chat.service'

import televendasService from '../service/televendas.service'

const modules = {
  televendasService,
  chatService,
  backofficeService,
  usersService,
  analisePerfilService,
  newLojaService,
  lojaPyxis,
  feedService,
  workFlowService,
  tmtService,
  avatarService,
  absService,
  resultadoDiaDiaService,
  pausaService,
  inaderenciaService,
  layoutOnline,
  controleDeslogue,
  dashboardService,
  palitagemService,
  adicionarDemandaService,
  dadosFilaService,
  operadorService,
  supervisorService,
  scoreboardService,
  blocoNotasService,
  meusFeedbacksService,
  dadosOperadorFeedbackService,
  dialogExibirFormularioService,
  extratoChamadasNetService,
  extratoChamadaNetSupervisorService,
  ofensoresResultadoService,
  amChartService,
  coordenadorService,
  adminService,
  tabuladorErroPagamentoService,
  tabuladorIndevidasFinanceirasService,
  resumoOperadorService,
  performanceOsService,
  mplayPerformanceHoraService,
  expurgoService,
  farolService,
  tratativaBkoAtivacaoService
}

export default modules
