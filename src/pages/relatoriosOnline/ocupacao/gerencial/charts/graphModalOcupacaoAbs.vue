<template>
  <div id="chart">
    <apexchart
      :key="agrupamento"
      type="line"
      height="350"
      :options="chartOptions"
      :series="chartSeries"
    ></apexchart>
  </div>
</template>

<script>
  import config from '../../../../../core/config'
  export default {
    props: {
      agrupamento: {
        type: String,
        required: true
      },
      produto: {
        type: String,
        default: 'NET'
      },
      apiUrl: {
        type: String,
        required: true
      },
      nameColumn: {
        type: String,
        required: true
      },
      nameArea: {
        type: String,
        required: true
      },
      produtoParams: {
        type: String
      }
    },
    data: () => ({
      labels: [],
      percAbs: [],
      abs: [],
      escalados: []
    }),
    computed: {
      chartSeries() {
        return this.seriesMethods()
      },
      chartOptions() {
        return this.options()
      }
    },
    methods: {
      seriesMethods() {
        let series = [
          {
            name: this.nameColumn,
            type: 'column',
            data: this.abs
          },
          {
            name: this.nameArea,
            type: 'area',
            data: this.percAbs
          }
        ]
        return series
      },
      options() {
        let chartOptions = {
          chart: {
            height: 350,
            type: 'line',
            toolbar: {
              show: false
            },
            // stacked: false,
            zoom: {
              enabled: false
            }
          },
          stroke: {
            width: [0, 2],
            curve: 'smooth'
          },
          // title: {
          //   text: `${this.agrupamento}`,
          //   align: "left",
          // },
          plotOptions: {
            barOptions: {
              distributed: true // Adicionar espaçamento entre as colunas
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

          // labels: this.labels,
          markers: {
            size: 0
          },
          xaxis: {
            // type: "text",
            categories: this.labels,
            axisBorder: {
              show: false
            },
            axisTicks: {
              show: false
            },
            labels: {
              style: {
                colors: '#333',
                fontSize: '11px'
              }
            }
          },
          grid: {
            show: false // Esconder as linhas de grade
          },
          yaxis: [
            {
              show: false
            }
          ],
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 'bold',
              colors: ['#2979FF', '#00E676']
            }
          },
          tooltip: {
            shared: true,
            intersect: false,
            y: {
              formatter: function (val, { seriesIndex }) {
                if (seriesIndex === 1) {
                  return val + '%'
                }
                return val
              }
            }
          },
          legend: {
            labels: {
              formatter: function (val, { seriesIndex }) {
                if (seriesIndex === 1) {
                  return val + ' (%)'
                }
                return val
              }
            }
          }
        }

        return chartOptions
      },
      loadDadosGraficos() {
        this.labels = []
        this.percAbs = []
        this.abs = []
        let urlData = `${config.baseUrl}${this.apiUrl}`
        this.$api
          .get(urlData, {
            params: {
              agrupamento: this.agrupamento,
              produto: this.produtoParams
            }
          })
          .then(res => {
            let dadosFiltrado = res.data
            for (let i = 0; i < dadosFiltrado.length; i++) {
              this.labels.push(dadosFiltrado[i].DESCRICAO)
              this.percAbs.push((dadosFiltrado[i].PERC_JUSTI * 100).toFixed(2))
              this.abs.push(dadosFiltrado[i].DENOMINADOR.toFixed(0))
            }
            this.$emit('upload:load-completed')
          })
      }
    },
    watch: {
      agrupamento: function (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.loadDadosGraficos()
        }
      }
    },
    created() {
      this.loadDadosGraficos()
    }
  }
</script>

<style scoped></style>
