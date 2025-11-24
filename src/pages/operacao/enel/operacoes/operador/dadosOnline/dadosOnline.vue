<template>
  <v-sheet>
    <template v-if="meusIndicadores.length > 0">
      <title-background class="mt-5">
        <template v-slot:title>
          <v-icon color="white" class="mr-2">mdi-checkbox-multiple-marked-circle</v-icon>
          Meus Indicadores
        </template>
        <template v-slot:subtitle>Dados atualizados a cada 30 minutos.</template>
      </title-background>
      <v-row class="mt-n16 mb-6" style="display: flex; justify-content: center">
        <div
          style="z-index: 0; display: flex; flex-wrap: wrap"
          v-for="(indicador, i) in meusIndicadores"
          :key="i"
        >
          <minimal-cards :title="indicador.COLUNA" :results="indicador.VALOR"></minimal-cards>
        </div>
      </v-row>
    </template>

    <div style="display: flex; flex-wrap: nowrap">
      <v-col v-for="item in cards" :key="item.TITLE">
        <card-expansivel
          :title="item.TITLE"
          :subTitle="item.SUBTITLE"
          :label="item.LABEL"
          :icon="item.ICON"
        >
          <component :usuarioAlmope="usuarioAlmope" :is="item.COMPONENT"></component>
        </card-expansivel>
      </v-col>
    </div>
    <v-sheet elevation="1" class="mb-7">
      <tmt-intervalo-gerencial
        :actionUrl="actionUrl"
        :numSuperior="3"
        :produto="usuarioProduto"
        :meta="[usuarioProduto == 'NET' ? { meta: 480 } : { meta: 510 }]"
        :withFilter="false"
        title="Operador"
        :skill="meuSkill"
      ></tmt-intervalo-gerencial>
    </v-sheet>
    <card-resultado-online
      :parametro="usuarioAlmope"
      apiUrl="receptivo/dados-online/extrato-ligacoes/operador"
    ></card-resultado-online>
    <grafico-evolucao-indicadores
      :parameters="usuarioAlmope"
      :tipo="'1'"
      :items="filtros"
    ></grafico-evolucao-indicadores>
    <tabela-indicadores-dia-dia
      :parameters="usuarioAlmope"
      :headers="headers"
    ></tabela-indicadores-dia-dia>
  </v-sheet>
</template>

<script>
  import tmtIntervaloGerencial from '../../../../../indicadorGerencial/tmt/table/tabelaTmtIntervaloGerencial.vue'
  import cardExpansivel from '@/shared/components/cards/cardExpansivel.vue'
  import titleBackground from '@/shared/components/cards/cardTituloPaginaComFundo'
  import MinimalCards from '@/shared/components/cards/minimalCards.vue'
  import tableMeusDados from '../../../../net/operacoes/operador/table/meusDados'
  import EscalaTrabalho from '../../../../net/operacoes/operador/cards/escalaTrabalho.vue'
  import graficoEvolucaoIndicadores from '@/shared/components/charts/evolucaoIndicadores/evolucaoIndicadores.component.vue'
  import tabelaIndicadoresDiaDia from '@/pages/indicadoresDiaDia/table/tableIndicadoresDiaDia.component.vue'
  import cardResultadoOnline from '../../../../net/operacoes/operador/extratoNet/resultadoOnline.vue'

  import config from '@/core/config'
  export default {
    components: {
      tmtIntervaloGerencial,
      titleBackground,
      MinimalCards,
      cardExpansivel,
      tableMeusDados,
      tableEscalaTrabalho: EscalaTrabalho,
      graficoEvolucaoIndicadores,
      tabelaIndicadoresDiaDia,
      cardResultadoOnline
    },
    props: {
      usuarioConsulta: {
        type: [String, Number],
        default: null
      }
    },
    data: () => ({
      meuSkill: '',
      cards: [],
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
          value: 'DATA',
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
      ]
    }),
    computed: {
      usuarioAlmope() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.almope
      },
      usuarioNome() {
        return this.isUserNameConsulta ? this.isUserNameConsulta : this.$store.getters.usuario.nome
      },
      usuarioProduto() {
        return this.$store.getters.usuario.produto
      },
      actionUrl() {
        return `${config.baseUrl}api/shared/operador/listar_meu_intervalo_tmt/${this.usuarioNome}/`
      },
      meusIndicadores() {
        let indicadores = this.$store.getters.meusIndicadores
        if (indicadores)
          indicadores = indicadores.filter(
            element => element.VALOR != '0' && element.VALOR != 'N/A'
          )
        return indicadores
      }
    },
    methods: {
      loadConfigCards() {
        let urlData = `${config.baseUrl}api/shared/utils/cards/config_cards_expan/${this.usuarioProduto}`
        this.$api.get(urlData).then(res => {
          this.cards = res.data
        })
      },
      // loadMeuSkill() { //retirar
      //   let urlData = `${config.baseUrl}api/shared/tmt/meu_skill/${this.usuarioAlmope}`;
      //   this.$api.get(urlData).then((res) => {
      //     this.meuSkill = res.data[0].SKILL || "";
      //   });
      // },
      loadMeusIndicadores($almope) {
        return this.$store.dispatch('loadMeusIndicadores', $almope)
      }
    },
    watch: {
      usuarioConsulta() {
        this.loadMeusIndicadores(this.usuarioConsulta)
      }
    },
    created() {
      this.loadConfigCards()
      // this.loadMeuSkill();  //retirar

      if (this.usuarioConsulta) this.loadMeusIndicadores(this.usuarioConsulta)
      else this.loadMeusIndicadores(this.usuarioAlmope)

      this.interval = setInterval(() => {
        this.loadMeusIndicadores(this.usuarioAlmope)
      }, 15 * 60 * 1000)
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style></style>
