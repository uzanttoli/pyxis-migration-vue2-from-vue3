<template>
  <v-card class="mx-auto pa-4" elevation="0">
    <v-col>
      <card-app-bar
        customClass="rounded-xl"
        :minHeight="135"
        style="margin-top: 10px"
        styleCustom="display: flex; height: 135px; padding: 25px; align-items:center; color: #fafafa;"
      >
        <template v-slot:title>
          <h3>
            <v-icon color="white" x-large class="mr-3">fa-solid fa-cart-shopping</v-icon>
            Visão Geral de Vendas
          </h3>
        </template>
        <template v-slot:imagem>
          <img
            src="@/assets/img/geral/03-index-bf-sem-fundo.png"
            style="position: absolute; height: 185px; bottom: -30px; right: 20px"
          />
        </template>
      </card-app-bar>
      <v-card class="rounded-lg cor-padrao">
        <v-row class="mt-8">
          <v-col xl="4" md="4" lg="4" sm="12">
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
                flex-direction: row;
              "
            >
              <template
                v-for="(item, i) in dadosCardFilter == '' ? dadosCard : dadosCardFilter"
                :key="i"
              >
                <v-col>
                  <card-dash
                    class="card"
                    :id="i"
                    :cardIndex="i"
                    @move-card="moveCard"
                    @update:validateVisible="cardInfoValid"
                    style="min-width: 100px"
                    :title="item.COLUNA"
                    :valor="item.VALOR"
                    :iconFa="item.FA_ICON"
                    :buttonIsVisible="item.OCULTAR"
                    :draggable="true"
                  ></card-dash>
                </v-col>
              </template>
            </div>
            <graph-vendas-online
              :loadOptions="options"
              :loadSeries="gerarSeries"
            ></graph-vendas-online>
          </v-col>
          <v-col xl="8" md="8" lg="8" sm="12">
            <div class="container-table">
              <v-col v-for="(item, i) in config" :key="i">
                <component
                  :is="item.COMPONENT"
                  :key="i"
                  :title="item.TITULO"
                  :actionUrl="item.ENDPOINT"
                  :titleIcon="item.ICONE_TITULO"
                  :numSuperior="item.NUM_SUPERIOR"
                ></component>
              </v-col>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <loadhastag
      :envioDados="dadosCarregados"
      :activeMsg="true"
      msg="Carregando dados..."
    ></loadhastag>
  </v-card>
</template>

<script>
  import cardResultadoInline from '../../../shared/components/cards/cardResultadoInline.vue'
  import tabelaVendasBfOnline from './table/tableVendasOnline.vue'

  import config from '@/core/config'
  import CardAppBar from '../../../shared/components/cards/modern/cardAppBar.vue'
  import graphVendasOnline from './chart/graphVendasOnline.vue'
  import CardDash from '../../../shared/components/cards/modern/cardDash.vue'
  import Loadhastag from '../../../shared/components/load/loadHastag.vue'
  export default {
    components: {
      cardResultadoInline,
      tabelaVendasBfOnline,
      CardAppBar,
      graphVendasOnline,
      CardDash,
      Loadhastag
    },
    data: () => ({
      vendasOnline: [],
      config: [],
      dadosCard: [],
      dadosCardFilter: [],
      indicador: 'VENDAS',
      agrupamento: 'BROWNFIELD',
      isDadosConfig: true,
      isDadosCard: true,
      isLoad: true,
      isLoadGraph: true,
      dados: [],
      dadosLength: 0,
      categories: [],
      labels: [],
      dataSolicitacao: null
    }),
    computed: {
      validColumn() {
        let dadosLength = this.dadosCard.length
        if (dadosLength == 1) {
          return "sm='12' md='12' lg='12' xl='12'"
        } else if (dadosLength == 2) {
          return "sm='12' md='12' lg='12' xl='6'"
        } else {
          return "xl='6'  md='6' lg='12' sm='12'  "
        }
      },
      dadosCarregados() {
        return this.isDadosCard && this.isDadosConfig && this.isLoadGraph
      },
      options() {
        let chartOptions = {
          chart: {
            height: 350,
            type: 'line',
            stacked: false,
            zoom: {
              enabled: false
            }
          },
          plotOptions: {
            bar: {
              borderRadius: 5
            }
          },
          stroke: {
            width: [0, 4]
          },
          title: {
            text: `Vendas Dia x Dia`,
            align: 'left'
          },
          subtitle: {
            text: `Dados oficiais até dia ${this.formatDate(
              this.dataSolicitacao
            )}, dados posteriores são tabulações.`,
            align: 'left'
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: [1]
          },
          labels: this.labels,
          // xaxis: {
          //   type: "datetime",
          //   categories: this.categories,
          //   tickAmount: this.dadosLength - 1,
          //   labels: {
          //     formatter: function(value, timestamp, opts) {
          //       let i = opts.dateFormatter(new Date(timestamp), "dd.MM");
          //       return i;
          //     },
          //   },
          // },
          yaxis: [
            {
              title: {
                text: 'Atendidas'
              },
              show: false
            },
            {
              opposite: true,
              title: {
                text: 'Vendas'
              },
              show: false
            }
          ]
        }
        return chartOptions
      },
      gerarSeries() {
        let dados = this.dados

        let dadosColun = {
          name: 'Atendidas',
          type: 'column',
          data: []
        }

        let dadosLine = {
          name: 'Vendas',
          type: 'line',
          data: []
        }

        for (let i = 0; i < dados.length; i++) {
          let item = dados[i]
          dadosColun.data.push(item.ATENDIDAS * 1)
        }

        for (let i = 0; i < dados.length; i++) {
          let item = dados[i]
          dadosLine.data.push(item.VENDAS)
        }

        let result = [dadosColun, dadosLine]

        return result
      }
    },
    methods: {
      cardInfoValid(e) {
        let dados = this.dadosCard
        if (e.visible === false) {
          let i = dados.filter(dado => {
            return dado.COLUNA != e.title
          })
          this.dadosCardFilter = i
        } else {
          this.dadosCardFilter = []
        }
      },
      moveCard(sourceIndex, targetIndex) {
        // Obter o cartão de origem
        const sourceCard =
          this.dadosCardFilter == ''
            ? this.dadosCard[sourceIndex]
            : this.dadosCardFilter[sourceIndex]
        // Remover o cartão de origem do array
        this.dadosCardFilter == ''
          ? this.dadosCard.splice(sourceIndex, 1)
          : this.dadosCardFilter.splice(sourceIndex, 1)
        // Inserir o cartão de origem na posição de destino
        this.dadosCardFilter == ''
          ? this.dadosCard.splice(targetIndex, 0, sourceCard)
          : this.dadosCardFilter.splice(targetIndex, 0, sourceCard)
      },
      formatDate(date) {
        if (!date) return 'Carregando...'
        let dateFormate = date.split('-')
        const [year, month, day] = dateFormate
        return `${day}/${month}/${year}`
      },
      loadDataSolicitacao() {
        let urlData = `${config.baseUrl}api/shared/brownfield/gerencial/data_ult_solicitacao`
        this.$api.get(urlData).then(res => {
          this.dataSolicitacao = res.data[0].DATA_SOLICITACAO
        })
      },
      loadDadosGrafico() {
        let urlData = `${config.baseUrl}api/shared/brownfield/gerencial/dia_grafico`
        this.$api.get(urlData).then(res => {
          this.dados = res.data
          for (let i = 0; i < res.data.length; i++) {
            let item = res.data[i]
            this.categories.push(item.DATA_VENDA)
          }
          for (let i = 0; i < res.data.length; i++) {
            let date = res.data[i].DATA_VENDA.split('-').reverse()
            this.labels.push(`${date[0]}.${date[1]}`)
          }
          this.isLoadGraph = false
          this.loadDataSolicitacao()
          this.dadosLength = res.data.length
        })
      },

      async loadConfig() {
        try {
          let urlData = `${config.baseUrl}api/shared/config/s2s/${this.indicador}/${this.agrupamento}`
          await this.$api.get(urlData).then(res => {
            this.config = res.data
            this.isDadosConfig = false
          })
        } catch (e) {
          return []
        }
      },
      loadDadosCard() {
        let urlData = `${config.baseUrl}api/shared/brownfield/gerencial/dados_card`
        this.$api.get(urlData).then(res => {
          this.dadosCard = res.data
          this.isDadosCard = false
        })
      }
    },
    created() {
      this.loadConfig()
      this.loadDadosCard()
      this.loadDadosGrafico()
    }
  }
</script>

<style scoped>
  .cor-padrao {
    background-image: linear-gradient(260deg, rgb(0, 236, 255), #8f0e8f);
  }
  .card {
    flex-basis: auto;
  }
</style>
