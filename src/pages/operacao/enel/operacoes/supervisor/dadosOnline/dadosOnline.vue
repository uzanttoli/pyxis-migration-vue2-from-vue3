<template>
  <v-sheet class="mt-3">
    <v-col cols="12">
      <cards-resumo-indicadores
        :usuarioNome="usuarioNome"
        @update:justificar-abs="justificarAbs"
        apiUrl="api/shared/supervisor/resumo_indicadores_online"
      ></cards-resumo-indicadores>
    </v-col>
    <v-row v-if="usuarioNome">
      <v-col cols="12">
        <v-sheet elevation="1">
          <tabela-tmt-intervalo-gerencial
            :actionUrl="actionUrl"
            :numSuperior="2"
            :produto="usuarioProduto"
            :meta="[usuarioProduto == 'NET' ? { meta: 480 } : { meta: 510 }]"
            :withFilter="false"
            title="Meu TMT"
          ></tabela-tmt-intervalo-gerencial>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row v-if="usuarioNome">
      <v-col cols="12">
        <v-sheet elevation="1">
          <tabela-tmt-intervalo-gerencial
            :actionUrl="actionUrlOperador"
            :numSuperior="3"
            :produto="usuarioProduto"
            :meta="[usuarioProduto == 'NET' ? { meta: 480 } : { meta: 510 }]"
            :withFilter="false"
            title="Operador"
          ></tabela-tmt-intervalo-gerencial>
        </v-sheet>
      </v-col>
    </v-row>
    <table-base-resumo-operador
      :tipo="1"
      :headers="headersResumoOperador"
    ></table-base-resumo-operador>
    <card-resultado-online
      :parametro="usuarioNome"
      apiUrl="api/shared/extrato_net/extrato_super/"
    ></card-resultado-online>
    <grafico-evolucao-indicadores-supervisor
      :parameters="usuarioNome"
      :tipo="'2'"
      :items="filtros"
    ></grafico-evolucao-indicadores-supervisor>

    <tabela-indicadores-dia-dia
      :parameters="usuarioNome"
      :headers="headers"
    ></tabela-indicadores-dia-dia>
    <justificativa-de-abs
      :abrirModalAbs="dialogAbs"
      @update:close-dialog="dialogAbs = !dialogAbs"
    ></justificativa-de-abs>
  </v-sheet>
</template>

<script>
  import tabelaTmtIntervaloGerencial from '../../../../../indicadorGerencial/tmt/table/tabelaTmtIntervaloGerencial.vue'
  import tabelaIndicadoresDiaDia from '@/pages/indicadoresDiaDia/table/tableIndicadoresDiaDia.component.vue'
  const graficoEvolucaoIndicadoresSupervisor = () =>
    import('@/shared/components/charts/evolucaoIndicadores/evolucaoIndicadores.component.vue')
  import tableBaseResumoOperador from '../../../../../operacao/net/baseResumoOperador/tableOperatorSummaryBase.vue'
  import cardResultadoOnline from '../../../../net/operacoes/operador/extratoNet/resultadoOnline.vue'
  import CardsResumoIndicadores from '../../../../cardsResumoIndicadores.vue'
  import justificativaDeAbs from '../../../../utils/justificativaAbs/justificarAbs.vue'
  import config from '@/core/config'
  export default {
    components: {
      tabelaTmtIntervaloGerencial,
      tabelaIndicadoresDiaDia,
      graficoEvolucaoIndicadoresSupervisor,
      tableBaseResumoOperador,
      CardsResumoIndicadores,
      cardResultadoOnline,
      justificativaDeAbs
    },
    data: () => ({
      dialogAbs: false,
      filtros: [
        { text: 'Atendidas', value: 'ATENDIDAS' },
        { text: 'TMT', value: 'TMT' },
        { text: '% Rechamada 24h', value: 'RECHAMADA_24H_ENEL' },
        { text: '% Rechamada 72h', value: 'RECHAMADA_72H_ENEL' },
        { text: 'Particular', value: 'PARTICULAR' },
        { text: 'Nota Qualidade', value: 'NOTA_QUALIDADE_ENEL' },
        { text: 'Optin', value: 'ATIVACAO_OPTIN_ENEL' },
        { text: 'Fatura Digital', value: 'ATIVACAO_EBILLING_ENEL' },
        { text: 'CSAT', value: 'CSAT_ENEL' },
        { text: '(%) Reclamação', value: 'PERC_RECLAMACOES_ENEL' },
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
          text: 'TMT',
          value: 'TMT',
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
          text: 'Nota Qualidade',
          value: 'NOTA_QUALIDADE_ENEL',
          align: 'center'
        },
        {
          text: 'Optin',
          value: 'ATIVACAO_OPTIN_ENEL',
          align: 'center'
        },
        {
          text: 'Fatura Digital',
          value: 'ATIVACAO_EBILLING_ENEL',
          align: 'center'
        },
        {
          text: 'CSAT',
          value: 'CSAT_ENEL',
          align: 'center'
        },
        {
          text: '(%) Reclamação',
          value: 'PERC_RECLAMACOES_ENEL',
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
          text: '(%) Rechamada 24h',
          value: 'RECHAMADA_24H_ENEL',
          align: 'center'
        },
        {
          text: '(%) Rechamadas 72h',
          value: 'RECHAMADA_72H_ENEL',
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
      ]
    }),
    computed: {
      // actionUrl() {
      //   return `api/shared/supervisor/meu_tmt/${this.usuarioNome}/`;
      // },
      actionUrl() {
        return `${config.baseUrl}api/shared/supervisor/listar_meu_tmt_intervalo/${this.usuarioNome}/`
        // return `api/shared/supervisor/meu_tmt/${this.usuarioAlmope}/`;
      },
      actionUrlOperador() {
        return `api/shared/supervisor/listar_tmt_intervalo_operadores/${this.usuarioNome}/`
        // return `api/shared/supervisor/operadores_tmt/${this.usuarioAlmope}/`;
      },
      usuarioAlmope() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.almope
      },
      usuarioNome() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.nome
      },
      usuarioProduto() {
        return this.$store.getters.usuario.produto
      }
    },
    methods: {
      justificarAbs() {
        this.dialogAbs = true
      }
    }
  }
</script>

<style></style>
