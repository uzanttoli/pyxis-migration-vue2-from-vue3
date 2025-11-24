<template>
  <v-sheet id="create" elevation="0" :class="classProps" :color="colorProps">
    <v-row>
      <v-col cols="12">
        <v-card elevation="0">
          <title-background>
            <template v-slot:title>
              <v-icon color="white" class="mr-2">mdi-checkbox-multiple-marked-circle</v-icon>
              Meus Indicadores
            </template>
            <template v-slot:subtitle>Dados atualizados a cada 15 minutos.</template>
          </title-background>
          <v-col>
            <v-row
              class="mt-n16"
              style="display: flex; justify-content: center"
              v-if="meusIndicadores != ''"
            >
              <div
                style="z-index: 0; display: flex; flex-wrap: wrap"
                v-for="(indicador, i) in meusIndicadores"
                :key="i"
              >
                <minimal-cards :title="indicador.COLUNA" :results="indicador.VALOR"></minimal-cards>
              </div>
            </v-row>
            <v-row v-else>
              <v-card
                width="100%"
                min-height="150"
                class="d-flex align-center justify-center rounded-xl mt-n5"
              >
                <img src="@/assets/img/geral/notFound.png" alt="" height="175" />
                <p class="text-h6 grey--text">
                  Intervalo de meus indicadores ainda não disponível!
                </p>
              </v-card>
            </v-row>
          </v-col>
        </v-card>

        <v-row class="mt-3">
          <v-col v-for="item in cards" :key="item.TITLE">
            <v-flex>
              <card-expansivel
                :title="item.TITLE"
                :subTitle="item.SUBTITLE"
                :label="item.LABEL"
                :icon="item.ICON"
              >
                <component :usuarioAlmope="usuarioAlmope" :is="item.COMPONENT"></component>
              </card-expansivel>
            </v-flex>
          </v-col>
        </v-row>

        <v-card elevation="0" class="rounded-xl mt-5">
          <tabela-tmt-intervalo-gerencial
            :newApi="true"
            :actionUrl="actionUrl"
            :numSuperior="3"
            :produto="usuarioProduto"
            :meta="[usuarioProduto == 'NET' ? { meta: 480 } : { meta: 510 }]"
            :withFilter="false"
            title="Operador"
            :skill="meuSkill"
          ></tabela-tmt-intervalo-gerencial>
        </v-card>
        <!--  -->
        <v-col class="mx-0 px-0">
          <TabelaMinhaRechamada :tipoPerfil="1"></TabelaMinhaRechamada>
        </v-col>
        <!--  -->
        <grafico-evolucao-indicadores
          :parameters="usuarioAlmope"
          :items="getHeadersAndFilters.filtros"
          :tipo="'1'"
        ></grafico-evolucao-indicadores>
        <tabela-indicadores-dia-dia
          :parameters="usuarioAlmope"
          :headers="getHeadersAndFilters.headers"
        ></tabela-indicadores-dia-dia>
        <!-- Meus Scoreboard -->
        <resultado-scoreboard
          title="Meu Scoreboard"
          typeTable="meu-scoreboard"
          :headers="getHeadersAndFilters.headerScoreboardMes"
          :actionUrl="actionUrlResultadoMeuScoreboard"
        />
        <!-- Historico -->
        <resultado-scoreboard
          title="Scoreboard Historico"
          typeTable="historico-scoreboard"
          :headers="getHeadersAndFilters.headersScoreboardHistorico"
          :actionUrl="actionUrlResultadoHistoricoScoreboard"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script>
  import config from '@/core/config.js'
  import headersAndFilters from './headersAndFilters.json'

  import tableMeusDados from './table/meusDados.vue'
  import EscalaTrabalho from './cards/escalaTrabalho.vue'
  import cardMeusIndevidos from './cards/cardMeusIndevidos.vue'
  import TabelaMinhaRechamada from '../../../TabelaMinhaRechamada.vue'
  import resultadoScoreboard from '../../../scoreboard/tableScoreboard.vue'
  import cardExpansivel from '@/shared/components/cards/cardExpansivel.vue'
  import MinimalCards from '../../../../../shared/components/cards/minimalCards.vue'
  import cardResultadoInline from '@/shared/components/cards/cardResultadoInline.vue'
  import titleBackground from '@/shared/components/cards/cardTituloPaginaComFundo.vue'
  import CardVisitaTecnica from '@/pages/operacao/_components/visitaTecnica/CardVisitaTecnica.vue'
  import tabelaIndicadoresDiaDia from '@/pages/indicadoresDiaDia/table/tableIndicadoresDiaDia.component.vue'
  import tabelaTmtIntervaloGerencial from '@/pages/indicadorGerencial/tmt/table/tabelaTmtIntervaloGerencial.vue'
  import mplayMotivoHora from '@/pages/operacao/net/campanhas/retencao/retencaoMPlay/table/motivoHora.component.vue'
  import graficoEvolucaoIndicadores from '@/shared/components/charts/evolucaoIndicadores/evolucaoIndicadores.component.vue'
  import minhaPerformanceOs from '@/pages/operacao/net/campanhas/retencao/performanceOs/table/minhaPerformance.component.vue'
  import mplayPerformanceHora from '@/pages/operacao/net/campanhas/retencao/retencaoMPlay/table/performanceHora.component.vue'
  import mplayComparativoIntervalo from '@/pages/operacao/net/campanhas/retencao/retencaoMPlay/table/comparativoIntervalo.component.vue'

  export default {
    name: 'operador-component',
    components: {
      MinimalCards,
      cardExpansivel,
      tableMeusDados,
      mplayMotivoHora,
      titleBackground,
      CardVisitaTecnica,
      cardMeusIndevidos,
      minhaPerformanceOs,
      cardResultadoInline,
      resultadoScoreboard,
      TabelaMinhaRechamada,
      mplayPerformanceHora,
      tabelaIndicadoresDiaDia,
      mplayComparativoIntervalo,
      graficoEvolucaoIndicadores,
      tableEscalaTrabalho: EscalaTrabalho,
      tabelaTmtIntervaloGerencial
      // alertOperador,
    },
    props: {
      usuarioConsulta: {
        type: [String, Number],
        default: null
      },
      isUserNameConsulta: {
        type: [String, Number],
        default: null
      },
      colorProps: {
        type: String,
        default: 'white'
      },
      classProps: {
        type: String,
        default: 'ma-8 pa-8'
      }
    },
    data: () => ({
      meuSkill: '',
      cards: []
    }),
    computed: {
      getHeadersAndFilters() {
        return headersAndFilters
      },
      usuarioProduto() {
        return this.$store.getters.usuario.produto
      },
      actionUrl() {
        return `${config.pyxisReceptivoUrl}receptivo/dados-online/meu-tmt/operador/`
      },
      actionUrlResultadoMeuScoreboard() {
        return `api/shared/scoreboard/supervisor/${this.usuarioAlmope}`
      },
      actionUrlResultadoHistoricoScoreboard() {
        return `${config.pyxisReceptivoUrl}receptivo/dados-online/meu-scoreboard/historico/operador`
      },
      usuarioAlmope() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.almope
      },
      usuarioNome() {
        return this.isUserNameConsulta ? this.isUserNameConsulta : this.$store.getters.usuario.nome
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
      loadMeuSkill() {
        let urlData = `${config.baseUrl}api/shared/tmt/meu_skill/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.meuSkill = res.data[0].SKILL || ''
        })
      },
      loadMeusIndicadores($almope) {
        return this.$store.dispatch('loadMeusIndicadores', $almope)
      }
    },
    watch: {
      usuarioConsulta() {
        this.loadMeusIndicadores(this.usuarioConsulta)
      }
    },
    async created() {
      this.loadMeuSkill()
      this.loadConfigCards()
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
