<template>
  <div id="chart">
    <apexchart type="polarArea" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
  import config from '../../../core/config.js'
  export default {
    data: () => ({
      series: [],
      chartOptions: {
        chart: {
          width: 380,
          type: 'polarArea'
        },
        labels: ['(%) Gato', '(%) Tubarão', '(%) Aguia', '(%) Lobo'],
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
            colors: ['#2979FF', '#00E676', '#ffcd56', '#ff6384']
          }
        },
        fill: {
          opacity: 1,
          colors: ['#2979FF', '#00E676', '#ffcd56', '#ff6384']
        },
        stroke: {
          width: 1,
          colors: ['#fff', '#fff', '#fff', '#fff']
        },
        yaxis: {
          show: false
        },
        title: {
          text: '(%) Meus Perfis comportamentais',
          align: 'center'
        },
        legend: {
          labels: {
            useSeriesColors: true,
            colors: ['#2979FF', '#00E676', '#ffcd56', '#ff6384']
          },
          position: 'bottom'
        },
        plotOptions: {
          polarArea: {
            rings: {
              strokeWidth: 0
            },
            spokes: {
              strokeWidth: 0
            }
          }
        },
        theme: {
          monochrome: {
            enabled: false,
            shadeTo: 'light',
            shadeIntensity: 0.6
          }
        }
      },
      dadosAnaliseGrafico: []
    }),
    computed: {},
    methods: {
      loadDetalheGraficoAnalisePerfil() {
        let urlData = `${config.baseUrl}api/shared/analise_perfil/detalhes_grafico/${this.$store.getters.usuario.almope}`
        this.$api.get(urlData).then(res => {
          let dados = res.data
          this.series = Object.values(dados[0])
        })
      }
    },
    created() {
      this.loadDetalheGraficoAnalisePerfil()
    }
  }
</script>

<style scoped>
  #chart .apexcharts-legend {
    color: blue; /* Cor da legenda */
  }

  #chart {
    margin-top: 10px;
    background-color: #eeeeee;
    border-radius: 25px;
  }

  .apexcharts-legend {
    background-color: RED !important;
  }
</style>
