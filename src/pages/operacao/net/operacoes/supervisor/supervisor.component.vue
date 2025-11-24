<template>
  <v-sheet elevation="0" class="ma-8 pa-8">
    <!-- <table-retencao-mplay></table-retencao-mplay> -->
    <v-row>
      <v-col cols="12">
        <cards-resumo-indicadores
          :usuarioNome="usuarioNome"
          @update:justificar-abs="justificarAbs"
          apiUrl="api/shared/supervisor/resumo_indicadores_online"
        ></cards-resumo-indicadores>
      </v-col>
      <v-col cols="12" class="mt-2">
        <v-row v-if="usuarioNome">
          <v-col cols="12">
            <tabela-tmt-intervalo-gerencial
              :actionUrl="actionUrl"
              :numSuperior="2"
              :produto="usuarioProduto"
              :meta="[usuarioProduto == 'NET' ? { meta: 480 } : { meta: 510 }]"
              :withFilter="false"
              title="Meu TMT"
            ></tabela-tmt-intervalo-gerencial>
          </v-col>
        </v-row>
        <v-row v-if="usuarioNome">
          <v-col cols="12">
            <tabela-tmt-intervalo-gerencial
              :actionUrl="actionUrlOperador"
              :numSuperior="3"
              :produto="usuarioProduto"
              :meta="[usuarioProduto == 'NET' ? { meta: 480 } : { meta: 510 }]"
              :withFilter="false"
              title="Operador"
            ></tabela-tmt-intervalo-gerencial>
          </v-col>
        </v-row>
        <v-row class="mb-3">
          <v-col cols="12">
            <TabelaMinhaRechamada :tipoPerfil="2"></TabelaMinhaRechamada>
          </v-col>
        </v-row>
        <v-sheet>
          <v-row>
            <v-flex v-for="(item, i) in dados" :key="i" xl4 lg4 sm6 md6 xs12>
              <v-col>
                <card-ofensor-resultado
                  :title="item.INDICADOR"
                  :colunas="headersOfensores"
                  :itemsDados="item.ITEMS"
                ></card-ofensor-resultado>
              </v-col>
            </v-flex>
          </v-row>
        </v-sheet>
        <table-base-resumo-operador
          :tipo="1"
          :headers="headersResumoOperador"
        ></table-base-resumo-operador>
        <grafico-evolucao-indicadores-supervisor
          :parameters="usuarioNome"
          :tipo="'2'"
          :items="filtros"
        ></grafico-evolucao-indicadores-supervisor>
        <tabela-indicadores-dia-dia
          :parameters="usuarioNome"
          :headers="headers"
        ></tabela-indicadores-dia-dia>
        <resultado-scoreboard
          title="Meu Scoreboard"
          typeTable="meu-scoreboard"
          :actionUrl="actionUrlResultadoMeuScoreboard"
          :headers="headerScoreboardMes"
        />
        <!-- Scoreboard Operador -->
        <resultado-scoreboard
          title="Scoreboard - Operadores"
          typeTable="supervisor"
          :headers="headerScoreboardOperadoresMes"
          :actionUrl="actionUrlResultadoScoreboardOperador"
        />
        <!-- Historico -->
        <resultado-scoreboard
          title="Scoreboard Historico"
          typeTable="historico-scoreboard"
          :headers="headersScoreboardHistorico"
          :actionUrl="actionUrlResultadoHistoricoScoreboard"
        />
      </v-col>
    </v-row>
    <justificativa-de-abs
      :abrirModalAbs="dialogAbs"
      @update:close-dialog="dialogAbs = !dialogAbs"
    ></justificativa-de-abs>
  </v-sheet>
</template>

<script>
  import config from '../../../../../core/config'

  import numbersFormat from '@/shared/mixins/numbersFormat'

  import TabelaMinhaRechamada from '../../../TabelaMinhaRechamada.vue'
  import CardsResumoIndicadores from '../../../cardsResumoIndicadores.vue'
  import resultadoScoreboard from '../../../scoreboard/tableScoreboard.vue'
  import justificativaDeAbs from '../../../utils/justificativaAbs/justificarAbs.vue'
  import cardOfensorResultado from '../../../ofensores/cardOfensores.components.vue'
  import tableBaseResumoOperador from '../../../net/baseResumoOperador/tableOperatorSummaryBase.vue'
  import tabelaIndicadoresDiaDia from '@/pages/indicadoresDiaDia/table/tableIndicadoresDiaDia.component.vue'
  import tabelaTmtIntervaloGerencial from '@/pages/indicadorGerencial/tmt/table/tabelaTmtIntervaloGerencial.vue'

  const graficoEvolucaoIndicadoresSupervisor = () =>
    import('@/shared/components/charts/evolucaoIndicadores/evolucaoIndicadores.component.vue')
  export default {
    name: 'supervisor-component',
    props: {
      label: {
        type: String,
        default: 'Clique para justificar seu ABS!'
      },
      meta2: {
        type: [Number, String],
        default: 480
      }
    },
    components: {
      resultadoScoreboard,
      graficoEvolucaoIndicadoresSupervisor,
      tabelaIndicadoresDiaDia,
      cardOfensorResultado,
      justificativaDeAbs,
      tableBaseResumoOperador,
      tabelaTmtIntervaloGerencial,
      CardsResumoIndicadores,
      TabelaMinhaRechamada
    },
    mixins: {
      numbersFormat
    },
    data: () => ({
      isActiveMotivoHora: false,
      isActiveRetencaoMplay: false,
      isActivePerformanceHora: false,
      ofensores: false,
      dialogAbs: false,
      dados: [],
      filtros: [
        { text: 'Atendidas', value: 'ATENDIDAS' },
        { text: 'TMT', value: 'TMT' },
        { text: '% Rechamada', value: 'RECHAMADA' },
        { text: '% Rechamada 72h', value: 'RECHAMADA_72H' },
        { text: 'Particular', value: 'PARTICULAR' },
        { text: '% Desconexão', value: 'DESCONEXOES' },
        { text: '% Shortcall', value: 'SHORTCALL' },
        { text: 'Tempo Logado', value: 'LOGADO_CTI' },
        { text: 'Jackin', value: 'JACKIN_SHE' }
      ],
      headers: [
        {
          text: 'Data Trabalho',
          value: 'data',
          align: 'center'
        },
        {
          text: 'Atendidas',
          value: 'ATENDIDAS',
          align: 'center'
        },
        {
          text: 'Identificadas',
          value: 'IDENTIFICADAS',
          align: 'center'
        },
        {
          text: 'TMT',
          value: 'TMT',
          align: 'center'
        },
        {
          text: 'Rechamadas %',
          value: 'RECHAMADA',
          align: 'center'
        },
        {
          text: 'Logado',
          value: 'LOGADO_CTI',
          align: 'center'
        },
        {
          text: 'Jackin com HE',
          value: 'JACKIN_CHE',
          align: 'center'
        },
        {
          text: 'Logado sem HE',
          value: 'LOGADO_SHE',
          align: 'center'
        },
        {
          text: 'Jackin sem HE',
          value: 'JACKIN_SHE',
          align: 'center'
        },
        {
          text: 'NR 17',
          value: 'NR17',
          align: 'center'
        },
        {
          text: 'Ocupação',
          value: 'TX_OCUPACAO',
          align: 'center'
        },
        {
          text: 'Short Call',
          value: 'SHORTCALL',
          align: 'center'
        },
        {
          text: 'Rechamadas 24h',
          value: 'RECHAMADA_24H',
          align: 'center'
        },
        {
          text: 'Rechamadas 48h',
          value: 'RECHAMADA_48H',
          align: 'center'
        },
        {
          text: 'Rechamadas 72h',
          value: 'RECHAMADA_72H',
          align: 'center'
        },
        {
          text: 'Desconexão',
          value: 'DESCONEXOES',
          align: 'center'
        },
        {
          text: 'Pausas',
          value: 'PAUSAS',
          align: 'center'
        },
        {
          text: 'Padrão',
          value: 'PADRAO',
          align: 'center'
        },
        {
          text: 'Lanche',
          value: 'LANCHE',
          align: 'center'
        },
        {
          text: 'Particular',
          value: 'PARTICULAR',
          align: 'center'
        },
        {
          text: 'Descanso',
          value: 'DESCANSO',
          align: 'center'
        },
        {
          text: 'Sistema',
          value: 'SISTEMA',
          align: 'center'
        },
        {
          text: 'Treinamento',
          value: 'TREINAMENTO',
          align: 'center'
        },
        {
          text: 'Saude',
          value: 'SAUDE',
          align: 'center'
        },
        {
          text: 'Feedback',
          value: 'FEEDBACK',
          align: 'center'
        },
        {
          text: 'Suporte',
          value: 'SUPORTE',
          align: 'center'
        },
        {
          text: 'Laboral',
          value: 'LABORAL',
          align: 'center'
        },
        {
          text: 'Demais Pausas',
          value: 'DEMAIS_PAUSAS',
          align: 'center'
        }
      ],
      headersResumoOperador: [
        { text: 'Atualizado até', value: 'ATUALIZADO_ATE', align: 'center' },
        { text: 'Almope', value: 'ALMOPE', align: 'center' },
        { text: 'Humor', value: 'HUMOR' },
        { text: 'Nome', value: 'NOME', align: 'center' },
        { text: 'Estação Trabalho', value: 'ESTACAO_TRABALHO', align: 'center' },
        { text: 'Inicio Turno', value: 'INICIO_TURNO', align: 'center' },
        { text: 'Fim Turno', value: 'FIM_TURNO', align: 'center' },
        { text: 'Escala', value: 'ESCALA', align: 'center' },
        { text: 'Status', value: 'STATUS', align: 'center' },
        { text: 'Maquina', value: 'NOME_MAQUINA', align: 'center' },
        { text: 'Ramal', value: 'RAMAL', align: 'center' },
        { text: 'Estado', value: 'ESTADO', align: 'center' },
        { text: 'Motivo Pausa', value: 'MOTIVO_PAUSA', align: 'center' },
        { text: 'Login', value: 'LOGIN', align: 'center' },
        { text: 'Tempo Logado', value: 'TEMPO_LOGADO', align: 'center' },
        { text: 'Inaderência', value: 'INADERENCIA', align: 'center' },
        { text: 'Disponivel', value: 'DISPONIVEL', align: 'center' },
        { text: 'Jackin', value: 'JACKIN', align: 'center' },
        { text: 'Total Pausas', value: 'TOTAL', align: 'center' },
        { text: 'Treinamento', value: 'TREINAMENTO', align: 'center' },
        { text: 'Particular', value: 'PARTICULAR', align: 'center' },
        { text: 'Alimentação', value: 'ALIMENTACAO', align: 'center' },
        { text: 'Descanso', value: 'DESCANSO', align: 'center' },
        { text: 'Padrão', value: 'PADRAO', align: 'center' },
        { text: 'Sistema', value: 'SISTEMA', align: 'center' },
        { text: 'Feedback', value: 'FEEDBACK', align: 'center' },
        { text: 'Saude', value: 'SAUDE', align: 'center' },
        { text: 'Laboral', value: 'LABORAL', align: 'center' },
        { text: 'Suporte', value: 'SUPORTE', align: 'center' }
      ],
      headersOfensores: [
        {
          text: 'Nome',
          value: 'NOME',
          align: 'center',
          sortable: false
        },
        {
          text: 'Resultado',
          value: 'PERC_INDICADOR',
          align: 'center',
          sortable: false
        }
      ],
      headerScoreboardMes: [
        {
          text: 'Data de Atualização',
          value: 'DATA_REFERENCIA',
          align: 'center',
          sortable: false,
          class: 'grey lighten-2'
        },
        {
          text: 'Range',
          value: 'RANGE',
          align: 'center',
          sortable: false
        },
        {
          text: '% ABS',
          value: 'PERC_ABS',
          align: 'center',
          sortable: false
        },
        {
          text: 'Tempo Logado',
          value: 'TEMPO_LOGADO',
          align: 'center',
          sortable: false
        },

        {
          text: 'Jackin',
          value: 'JACKIN_SHE',
          align: 'center',
          sortable: false
        },

        {
          text: 'Particular',
          value: 'PARTICULAR',
          align: 'center',
          sortable: false
        },

        {
          text: 'TMT',
          value: 'TMT',
          align: 'center',
          sortable: false
        },
        {
          text: '% Rechamada',
          value: 'PERC_RECHAMADA',
          align: 'center',
          sortable: false
        },

        {
          text: '% Transf. Retenção',
          value: 'PERC_TRANSF_RET',
          align: 'center',
          sortable: false
        },

        {
          text: 'Rechamada 72h',
          value: 'RECHAMADA_72HR',
          align: 'center',
          sortable: false
        },

        {
          text: 'Performance OS',
          value: 'PERFORMANCE_OS',
          align: 'center',
          sortable: false
        },

        {
          text: 'TNPS',
          value: 'TNPS',
          align: 'center',
          sortable: false
        },
        {
          text: 'OCs Financeiras',
          value: 'OCS_FINANCEIRAS',
          align: 'center',
          sortable: false
        }
      ],
      headerScoreboardOperadoresMes: [
        {
          text: 'Data Referência',
          align: 'center',
          value: 'DATA_REFERENCIA',
          class: 'grey lighten-2',
          sortable: true
        },
        {
          text: 'Nome',
          align: 'center',
          value: 'NOME',
          sortable: true
        },
        {
          text: 'Supervisor',
          value: 'SUPERIOR1',
          align: 'center',
          sortable: false
        },
        {
          text: 'Range',
          align: 'center',
          value: 'RANGE',
          sortable: true
        },
        {
          text: '% Abs',
          value: 'PERC_ABS',
          align: 'center',
          sortable: true
        },
        {
          text: 'Tempo Logado',
          value: 'TEMPO_LOGADO',
          align: 'center',
          sortable: true
        },
        {
          text: 'Jackin',
          value: 'JACKIN_SHE',
          align: 'center',
          sortable: true
        },
        {
          text: 'Particular',
          value: 'PARTICULAR',
          align: 'center',
          sortable: true
        },
        {
          text: 'TMT',
          value: 'TMT',
          align: 'center',
          sortable: true
        },
        {
          text: '% Rechamada',
          value: 'PERC_RECHAMADA',
          align: 'center',
          sortable: true
        },
        {
          text: '% Transf Retenção',
          value: 'PERC_TRANSF_RET',
          align: 'center',
          sortable: true
        },
        {
          text: 'Rechamada 72h',
          value: 'RECHAMADA_72HR',
          align: 'center',
          sortable: true
        },
        {
          text: 'Performance OS',
          value: 'PERFORMANCE_OS',
          align: 'center',
          sortable: true
        },
        {
          text: 'TNPS',
          value: 'TNPS',
          align: 'center',
          sortable: true
        },
        {
          text: "OC's Financeiras",
          value: 'OCS_FINANCEIRAS',
          align: 'center',
          sortable: true
        }
      ],
      headersScoreboardHistorico: [
        {
          text: 'Mês Referência',
          value: 'MES_REFERENCIA',
          align: 'center',
          class: 'grey lighten-2'
        },
        {
          text: 'Range',
          value: 'RANGE',
          align: 'center'
        },
        {
          text: '% Abs',
          value: 'PERC_ABS',
          align: 'center'
        },
        {
          text: 'Tempo Logado',
          value: 'TEMPO_LOGADO',
          align: 'center'
        },
        {
          text: 'Jackin',
          value: 'JACKIN_SHE',
          align: 'center'
        },
        {
          text: 'Particular',
          value: 'PARTICULAR',
          align: 'center'
        },
        {
          text: 'TMT',
          value: 'TMT',
          align: 'center'
        },
        {
          text: '% Rechamada',
          value: 'PERC_RECHAMADA',
          align: 'center'
        },
        {
          text: '% Transf Retenção',
          value: 'PERC_TRANSF_RET',
          align: 'center'
        },
        {
          text: 'Rechamada 72h',
          value: 'RECHAMADA_72HR',
          align: 'center'
        },
        {
          text: 'Performance OS',
          value: 'PERFORMANCE_OS',
          align: 'center'
        },
        {
          text: 'TNPS',
          value: 'TNPS',
          align: 'center'
        },
        {
          text: "OC's Financeiras",
          value: 'OCS_FINANCEIRAS',
          align: 'center'
        }
      ]
    }),
    computed: {
      actionUrl() {
        return `${config.baseUrl}api/shared/supervisor/listar_meu_tmt_intervalo/${this.usuarioNome}/`
        // return `api/shared/supervisor/meu_tmt/${this.usuarioAlmope}/`;
      },
      actionUrlOperador() {
        return `api/shared/supervisor/listar_tmt_intervalo_operadores/${this.usuarioNome}/`
        // return `api/shared/supervisor/operadores_tmt/${this.usuarioAlmope}/`;
      },
      quantidadeOperadoresLogados() {
        let quantidadeOperadoresLogados = this.$store.getters.quantidadeOperadoresLogados[0]
        if (quantidadeOperadoresLogados) {
          return quantidadeOperadoresLogados
        } else {
          return (quantidadeOperadoresLogados = 0)
        }
      },
      actionUrlLayoutOnline() {
        return `api/shared/layout_online/operador_layout_online/${this.usuarioNome}`
      },
      actionUrlResultadoMeuScoreboard() {
        return `api/shared/scoreboard/supervisor/${this.usuarioAlmope}`
      },
      actionUrlResultadoScoreboardOperador() {
        return `api/shared/scoreboard/view_sup_operador/${this.usuarioNome}`
      },
      actionUrlResultadoHistoricoScoreboard() {
        return `api/shared/scoreboard/historico/${this.usuarioAlmope}`
      },

      urlPerformanceHora() {
        return `api/shared/mplay/performance_hora_mplay_supervisor/${this.usuarioNome}`
      },
      actionUrlPerformanceMotivoHora() {
        return `api/shared/mplay/performance_motivo_hora_supervisor/${this.usuarioNome}`
      },
      actionUrlPerformanceComparativoIntervalo() {
        return `api/shared/mplay/performance_comparativo_intervalo_supervisor/${this.usuarioNome}`
      },
      actionUrlMinhaPerformanceOs() {
        return `api/shared/performance_os/performance_os_supervisor/${this.usuarioNome}`
      },
      actionUrlPerformanceMyOperador() {
        return `api/shared/performance_os/meus_operadores_por_supervisor/${this.usuarioNome}`
      },
      usuarioAlmope() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.almope
      },
      usuarioNome() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.nome
      },
      usuarioProduto() {
        return this.$store.getters.usuario.produto
      },
      tempoLogadoSupervisor() {
        let tempoLogadoSupervisor = this.$store.getters.tempoLogadoSupervisor[0]
        if (tempoLogadoSupervisor) {
          return tempoLogadoSupervisor
        } else {
          return (tempoLogadoSupervisor = 0)
        }
      },
      intervaloMplay() {
        let intervaloMplay = this.$store.getters.intervaloMplay
        if (intervaloMplay) {
          return intervaloMplay
        } else {
          return []
        }
      }
    },
    methods: {
      loadDadosOfensores() {
        let urlData = `${config.baseUrl}api/shared/extrato_net/ofensores/${this.usuarioNome}`
        this.$api.get(urlData).then(res => {
          this.dados = res.data
        })
      },
      justificarAbs() {
        this.dialogAbs = true
      },
      loadQuantidadeOperadoresLogados() {
        return this.$store.dispatch('loadQuantidadeOperadoresLogados', this.usuarioNome)
      },
      loadTempoLogadoSupervisor() {
        return this.$store.dispatch('loadTempoLogadoSupervisor', this.usuarioNome)
      }

      // loadIntervaloMplay() {
      //   this.$store.dispatch("loadIntervaloMplay", this.usuarioNome);
      // },
    },
    created() {
      // this.loadIntervaloMplay();
      this.loadQuantidadeOperadoresLogados()
      this.loadTempoLogadoSupervisor()
      this.loadDadosOfensores()
    }
  }
</script>

<style scoped></style>
