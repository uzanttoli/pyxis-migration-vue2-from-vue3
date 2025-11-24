<template>
  <v-card class="mx-auto pa-4" elevation="0">
    <v-col>
      <card-app-bar
        customClass="rounded-xl"
        :minHeight="100"
        style="margin-top: 10px"
        styleCustom="display: flex; height: 100px; padding: 25px; align-items:center; color: #fafafa;"
      >
        <template v-slot:title>
          <h3>
            <v-icon color="white" class="mr-3" size="25">fa-solid fa-chart-line</v-icon>
            Gerencial de Vendas
          </h3>
        </template>
        <template v-slot:imagem>
          <img
            src="@/assets/img/geral/03-index-bf-sem-fundo.png"
            style="position: absolute; height: 155px; bottom: -30px; right: 20px"
          />
        </template>
      </card-app-bar>
      <v-card class="rounded-lg cor-padrao" elevation="1">
        <v-row class="mt-8">
          <v-col xl="4" md="4" lg="4" sm="12">
            <div
              style="display: flex; flex-wrap: wrap; justify-content: start; flex-direction: row"
            >
              <template v-for="(item, i) in dadosCardFilter == '' ? dadosCard : dadosCardFilter">
                <v-col :key="i" cols="4">
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
  </v-card>
</template>

<script>
  // import tabelaVendasOnline from "./table/tableGerencialS2S.component.vue";
  // import CardDash from "@/shared/components/cards/modern/cardDash.vue";
  import cardAppBar from '@/shared/components/cards/modern/cardAppBar.vue'

  import config from '@/core/config'

  // import cardResultadoInline from "../../../shared/components/cards/cardResultadoInline.vue";
  import tabelaVendasCmS2sOnline from './table/tableVendasOnline.vue'
  import CardDash from '@/shared/components/cards/modern/cardDash.vue'
  import graphVendasOnline from '../../../../brownfield/gerencial/chart/graphVendasOnline.vue'
  export default {
    components: {
      cardAppBar,
      tabelaVendasCmS2sOnline,
      CardDash,
      graphVendasOnline
      // cardResultadoInline
    },
    data() {
      return {
        // nomeComponent: "GERENCIAL_S2S",
        // configComparativo: [],
        // vendasOnlineGerencial: [],
        // vendasOnlineGerencialFilters: [],
        // infoCardLoading: false,
        // loadingHash: true,
        // produtos: [],
        // produtoAtual: "NET menos N1 TOTAL _mais_ SUL 2 _mais_ SP 3",
        config: [],
        dadosCard: [],
        indicador: 'VENDAS',
        agrupamento: 'COMBO-S2S',
        dados: [],
        dadosCardFilter: [],
        dadosLength: 0,
        categories: [],
        labels: []
      }
    },
    computed: {
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
            width: [0, 2]
          },
          title: {
            text: `Vendas Dia x Dia`,
            align: 'left'
          },
          subtitle: {
            text: `Dados de tabulações`,
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
          //   tickAmount: this.dadosLength ,
          //   labels: {
          //     formatter: function (value, timestamp, opts) {
          //       let correctTimestamp = Math.floor(new Date(timestamp).getTime()); // Forçar a precisão do timestamp
          //       let i = opts.dateFormatter(new Date(correctTimestamp), "dd.MM");
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
      loadDadosCard() {
        let urlData = `${config.baseUrl}api/shared/combo_s2s/gerencial/dados_card`
        this.$api.get(urlData).then(res => {
          this.dadosCard = res.data
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
      loadDadosGrafico() {
        let urlData = `${config.baseUrl}api/shared/combo_s2s/gerencial/dados_grafico`
        this.$api.get(urlData).then(res => {
          this.dados = res.data
          for (let i = 0; i < res.data.length; i++) {
            let item = res.data[i]
            this.categories.push(item.DATA_VENDA)
          }
          //
          for (let i = 0; i < res.data.length; i++) {
            let date = res.data[i].DATA_VENDA.split('-').reverse()
            this.labels.push(`${date[0]}.${date[1]}`)
          }
          this.isLoadGraph = false
          // this.loadDataSolicitacao();
          this.dadosLength = res.data.length
        })
      }
    },
    created() {
      this.loadConfig()
      this.loadDadosCard()
      this.loadDadosGrafico()
    },
    watch: {
      // produtoAtual() {
      //   this.loadVendasOnlineGerencial();
      // },
    }
  }
</script>

<style scoped>
  .cor-padrao {
    /* background-image: linear-gradient(260deg, rgb(0, 236, 255), #8f0e8f); */
  }

  .card__body2 {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 16px;
  }

  .scroll-cards::-webkit-scrollbar {
    width: 10px;
  }

  .scroll-cards::-webkit-scrollbar-track {
    background: rgb(255, 255, 254);
  }

  .scroll-cards::-webkit-scrollbar-thumb {
    background-color: rgb(143, 14, 143);
    /* border-radius: 25px; */
    border: 3px solid rgb(245, 245, 245);
  }

  .cor-padrao {
    background-image: linear-gradient(260deg, rgb(0, 236, 255), #8f0e8f);
  }
  .card {
    /* flex-basis: auto; */
    /* width: 200px; */
  }
</style>
