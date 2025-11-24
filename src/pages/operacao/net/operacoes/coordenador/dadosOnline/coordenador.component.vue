<template>
  <v-sheet elevation="0" class="mb-9 ma-8 pa-8">
    <card-resumo-indicadores
      :usuarioNome="usuarioNome"
      apiUrl="api/shared/coordenador/resumo_indicadores_online"
      @update:justificar-abs="justificarAbs"
    ></card-resumo-indicadores>
    <v-row>
      <v-col cols="12">
        <TabelaMinhaRechamada :tipoPerfil="3"></TabelaMinhaRechamada>
      </v-col>
    </v-row>
    <v-sheet class="mb-5">
      <v-row>
        <v-flex v-for="(item, i) in dados" :key="i" xl4 lg4 sm6 md6 xs12>
          <v-col>
            <card-ofensores
              :colunas="headersOfensores"
              :title="item.INDICADOR"
              :itemsDados="item.ITEMS"
            ></card-ofensores>
          </v-col>
        </v-flex>
      </v-row>
    </v-sheet>
    <table-base-resumo-operador
      :tipo="2"
      :headers="headersResumoOperador"
    ></table-base-resumo-operador>
    <GraficoEvolucaoIndicadores :parameters="usuarioNome" :tipo="'3'" :items="filtros" />
    <tabela-indicadores-dia-dia
      :parameters="usuarioNome"
      :headers="headers"
    ></tabela-indicadores-dia-dia>
    <resultado-scoreboard
      title="Meu Scoreboard"
      typeTable="meu-scoreboard"
      :headers="headersScoreboardMes"
      :actionUrl="actionUrlResultadoMeuScoreboard"
    />
    <resultado-scoreboard
      title="Scoreboard - Supervisores"
      typeTable="supervisor"
      :headers="headersScoreboardSupervisor"
      :actionUrl="actionUrlResultadoScoreboardSupervisor"
    />
    <resultado-scoreboard
      title="Scoreboard - Operadores"
      typeTable="operador"
      :headers="headerScoreboardOperadoresMes"
      :actionUrl="actionUrlResultadoScoreboardOperador"
    />
    <resultado-scoreboard
      title="Scoreboard Historico"
      typeTable="historico-scoreboard"
      :headers="headersScoreboardHistorico"
      :actionUrl="actionUrlResultadoHistoricoScoreboard"
    />
    <justificativa-de-abs
      :abrirModalAbs="dialogAbs"
      @update:close-dialog="dialogAbs = !dialogAbs"
    ></justificativa-de-abs>
  </v-sheet>
</template>

<script>
  import config from '../../../../../../core/config'

  import cardResumoIndicadores from '../../../../cardsResumoIndicadores.vue'
  import resultadoScoreboard from '../../../../scoreboard/tableScoreboard.vue'
  import TabelaMinhaRechamada from '@/pages/operacao/TabelaMinhaRechamada.vue'
  import cardOfensores from '../../../../ofensores/cardOfensores.components.vue'
  import justificativaDeAbs from '../../../../utils/justificativaAbs/justificarAbs.vue'
  import tableBaseResumoOperador from '@/pages/operacao/net/baseResumoOperador/tableOperatorSummaryBase.vue'
  import tabelaIndicadoresDiaDia from '@/pages/indicadoresDiaDia/table/tableIndicadoresDiaDia.component.vue'
  const GraficoEvolucaoIndicadores = () =>
    import('@/shared/components/charts/evolucaoIndicadores/evolucaoIndicadores.component.vue')

  export default {
    name: 'Coordenador',
    components: {
      cardOfensores,
      justificativaDeAbs,
      resultadoScoreboard,
      TabelaMinhaRechamada,
      cardResumoIndicadores,
      tabelaIndicadoresDiaDia,
      tableBaseResumoOperador,
      GraficoEvolucaoIndicadores
    },
    data: () => ({
      dialogAbsJustified: false,
      dialogAbs: false,
      dados: [],
      filtros: [
        { text: 'Atendidas', value: 'ATENDIDAS' },
        { text: 'TMT', value: 'TMT' },
        { text: '% Rechamada', value: 'RECHAMADA' },
        { text: '% Rechamada 72h', value: 'RECHAMADA_72H' },
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
        { text: 'Supervisor', value: 'SUPERVISOR', align: 'center' },
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
      headersScoreboardMes: [
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
      headersScoreboardSupervisor: [
        {
          text: 'Data Referência',
          align: 'center',
          class: 'grey lighten-2',
          value: 'DATA_REFERENCIA',
          sortable: true
        },
        {
          text: 'Nome',
          align: 'center',
          value: 'NOME',
          sortable: true
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
          metaKey: 'META_TNPS',
          considerar: 'menor',
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
      performanceOsMeusOperadores() {
        let performanceOsMeusOperadores = this.$store.getters.performanceOsMeusOperadores
        return performanceOsMeusOperadores ? performanceOsMeusOperadores : []
      },
      intervaloMplay() {
        let intervaloMplay = this.$store.getters.intervaloMplay
        if (intervaloMplay) {
          return intervaloMplay
        } else {
          return []
        }
      },
      usuarioAlmope() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.almope
      },
      usuarioNome() {
        return this.$store.getters.usuario.nome
      },
      actionUrlLayoutOnline() {
        return `api/shared/layout_online/operador_layout_online/${this.usuarioNome}`
      },
      actionUrlResultadoMeuScoreboard() {
        return `api/shared/scoreboard/supervisor/${this.usuarioAlmope}`
      },
      actionUrlResultadoScoreboardOperador() {
        return `api/shared/scoreboard/scoreboard_operadores_coordenador/${this.usuarioNome}`
      },
      actionUrlResultadoScoreboardSupervisor() {
        return `api/shared/scoreboard/view_sup_operador/${this.usuarioNome}`
      },
      actionUrlResultadoHistoricoScoreboard() {
        return `api/shared/scoreboard/historico/${this.usuarioAlmope}`
      },
      actionUrlPerformanceHora() {
        return `api/shared/mplay/performance_hora_mplay_coordenador/${this.usuarioNome}`
      },
      actionUrlPerformanceMotivoHora() {
        return `api/shared/mplay/performance_motivo_hora_coordenador/${this.usuarioNome}`
      },
      actionUrlPerformanceComparativoIntervalo() {
        return `api/shared/mplay/performance_comparativo_intervalo_coordenador/${this.usuarioNome}`
      },
      actionUrlMinhaPerformanceOs() {
        return `api/shared/performance_os/performance_os_coordenador/${this.usuarioNome}`
      },
      actionUrlMeusSupervisoresPerformance() {
        return `api/shared/performance_os/meus_supervisores/${this.usuarioNome}`
      },
      actionUrlPerformanceOsMeusOperadores() {
        return `api/shared/performance_os/meus_operadores_por_coordenador/${this.usuarioNome}`
      },
      usuarioProduto() {
        return this.$store.getters.usuario.produto
      }
    },
    methods: {
      justificarAbs() {
        this.dialogAbs = true
      },
      loadDadosOfensores() {
        let urlData = `${config.baseUrl}api/shared/extrato_net/ofensores/${this.usuarioNome}`
        this.$api.get(urlData).then(res => {
          this.dados = res.data
        })
      }
      // loadIntervaloMplay() {
      //   this.$store.dispatch("loadIntervaloMplay", this.usuarioNome);
      // },
    },
    created() {
      this.loadDadosOfensores()
      // this.loadIntervaloMplay();
    }
  }
</script>

<style></style>
