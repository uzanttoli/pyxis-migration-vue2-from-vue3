<template>
  <section class="pa-5" style="background-color: #f5f5f5; border-radius: 25px">
    <div style="display: flex; gap: 10px">
      <!-- avatar -->
      <avatar-speech-zone
        :dadosEstudos="dadosEstudos"
        @update-estudo-selecionado="estudoSelecionado"
      ></avatar-speech-zone>
      <div
        class="card-item"
        style="
          display: flex;
          gap: 20px;
          width: 100%;
          flex-wrap: wrap;
          justify-content: center;
          margin-left: 10px;
          overflow-x: auto;
          height: 250px;
          padding: 10px 0px;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.08);
          border-radius: 25px;
        "
        :style="dadosCards == '' ? 'align-items: center;' : ''"
      >
        <!-- <pre>{{ dadosEstudosSelecionado }}</pre> -->
        <!-- cards -->
        <cards-detalhes-speech-zone
          v-for="(item, i) in dadosCards"
          :key="i"
          :value="item.VALOR"
          :columnName="item.COLUNA"
        ></cards-detalhes-speech-zone>
        <p
          v-if="dadosCards == ''"
          class="font-weight-bold grey--text"
          style="display: flex; align-items: center"
        >
          <i
            class="fa-solid fa-circle-exclamation orange--text"
            style="font-size: 25px; margin-right: 5px"
          ></i>
          Filtre um segmento com estudo para carregar os dados...
        </p>
      </div>
    </div>
    <div style="display: flex; gap: 20px; margin-top: 25px">
      <!-- grafico -->
      <grafico-speech-dashboard
        :dadosGrafico="dadosGrafico"
        :chartOptions="options"
      ></grafico-speech-dashboard>
      <!-- calendario -->
      <calendario-speech-zone
        @update-date-default="dateDefault"
        :diasInteracoes="diasInteracoes"
      ></calendario-speech-zone>
    </div>
    <div style="margin-top: 45px" v-for="(item, i) in speechConfig" :key="i">
      <!-- tabela -->
      <component
        :is="item.COMPONENT"
        :title="item.TITULO"
        :functionDados="item.VIEW_FONTE"
        :dataSelecao="dateDefaultCalendario"
        :actionUrl="item.ENDPOINT"
        :baseEstudoSpeech="item.BASE"
        :icon="item.ICONE_TITULO"
      ></component>
    </div>
  </section>
</template>

<script>
  import AvatarSpeechZone from '../avatarSpeechZone.vue'
  import CalendarioSpeechZone from '../calendarioSpeechZone.vue'
  import CardsDetalhesSpeechZone from '../cardsDetalhesSpeechZone.vue'
  import graficoSpeechDashboard from '../graficoSpeechDashboard.vue'
  import TableDetalheSpeechZone from '../tableDetalheSpeechZone.vue'

  import config from '../../../core/config'
  export default {
    components: {
      graficoSpeechDashboard,
      CalendarioSpeechZone,
      TableDetalheSpeechZone,
      CardsDetalhesSpeechZone,
      AvatarSpeechZone
    },
    data: () => ({
      items: [],
      dadosCards: [],
      dadosEstudos: [],
      dateDefaultCalendario: [],
      dadosGrafico: [],
      dadosEstudosSelecionado: [],
      speechConfig: []
    }),
    computed: {
      options() {
        let chartOptions = {
          chart: {
            height: 350,
            type: 'line',
            stacked: false,
            toolbar: {
              show: false
            },
            zoom: {
              enabled: false
            }
          },
          // labels:[],
          dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
              if (opts.seriesIndex === 2) {
                return val + '%'
              }
              return val
            },
            offsetY: -2,
            style: {
              fontSize: '12px'
            }
          },
          stroke: {
            width: [0, 2, 5],
            curve: 'smooth'
          },
          plotOptions: {
            bar: {
              columnWidth: '50%'
            },
            barOptions: {
              distributed: true
            }
          },

          fill: {
            opacity: [0.85, 0.25, 1],
            gradient: {
              inverseColors: false,
              shade: 'light',
              type: 'vertical',
              opacityFrom: 0.85,
              opacityTo: 0.55,
              stops: [0, 100, 100, 100]
            }
          },
          markers: {
            size: 0
          },
          xaxis: {
            type: 'date',
            categories: this.dadosGrafico.map(item => item.PERIODO)
          },
          grid: {
            show: false
          },
          yaxis: [
            {
              opposite: true,
              title: {
                text: 'Points'
              },
              min: 0,
              show: false
            },
            {
              opposite: true,
              title: {
                text: '(%) Ofertas'
              },
              // max: 500
              show: false
            }
          ],
          tooltip: {
            shared: true,
            intersect: false,
            y: {
              formatter: function (val, opts) {
                if (opts.seriesIndex === 2) {
                  return val + '%'
                }
                return val
              }
            }
          }
        }
        return chartOptions
      },
      diasInteracoes() {
        let dados = this.dadosGrafico
        return dados.map(item => (item.INTERACOES > 0 ? item.PERIODO.substring(0, 2) * 1 : 0))
      },
      produto() {
        return this.$store.getters.usuario.produto
      }
    },
    methods: {
      dateDefault(e) {
        this.dateDefaultCalendario = []
        this.dateDefaultCalendario.push({ ...e })
        if (this.dadosEstudosSelecionado != '') {
          this.loadDadosCards()
          this.loadDadosGraficoEstudos()
        }
      },
      estudoSelecionado(e) {
        this.dadosEstudosSelecionado = e
        this.loadDadosCards()
        this.loadDadosGraficoEstudos()
        this.loadDadosSpeechConfig()
      },
      loadDadosCards() {
        let urlData = `${config.baseUrl}api/shared/speech_zone/dashboard/cards/${this.dateDefaultCalendario[0]?.dataInicio}/${this.dateDefaultCalendario[0]?.dataFim}`
        this.$api.get(urlData).then(res => {
          this.dadosCards = res.data
        })
      },
      loadDadosEstudos() {
        let urlData = `${config.baseUrl}api/shared/speech_zone/dashboard/dados_estudos`
        this.$api.get(urlData).then(res => {
          this.dadosEstudos = res.data
        })
      },
      loadDadosGraficoEstudos() {
        let urlData = `${config.baseUrl}api/shared/speech_zone/dashboard/dados_grafico/${this.dateDefaultCalendario[0]?.dataInicio}/${this.dateDefaultCalendario[0]?.dataFim}`
        this.$api.get(urlData).then(res => {
          this.dadosGrafico = res.data
        })
      },
      loadDadosSpeechConfig() {
        let urlData = `${config.baseUrl}api/shared/speech_zone/dashboard/config_componentes/${this.produto}/${this.dadosEstudosSelecionado[0].BASE}`
        this.$api.get(urlData).then(res => {
          this.speechConfig = res.data
        })
      }
    },
    created() {
      // this.loadDadosCards();
      // this.loadDadosGraficoEstudos();
      this.loadDadosEstudos()
      // this.loadDadosSpeechConfig();
    }
  }
</script>

<style scoped>
  .card-container {
    align-items: flex-start;
  }

  .card-item::-webkit-scrollbar {
    width: 10px;
  }

  .card-item::-webkit-scrollbar-track {
    background: rgb(255, 255, 254);
  }

  .card-item::-webkit-scrollbar-thumb {
    background-color: rgba(9, 9, 121, 1);
    border-radius: 25px;
    border: 3px solid rgb(245, 245, 245);
  }
</style>
