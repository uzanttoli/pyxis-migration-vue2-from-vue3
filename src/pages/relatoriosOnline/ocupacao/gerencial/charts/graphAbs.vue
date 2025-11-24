<template>
  <div id="chart">
    <apexchart
      type="line"
      ref="chart"
      height="350"
      :options="optionsMethods()"
      :series="seriesMethods()"
    ></apexchart>
  </div>
</template>

<script>
  import config from '../../../../../core/config'
  export default {
    props: {
      agrupamento: {
        type: String,
        default: 'NET MTF'
      },
      dados: {
        type: Object
      },
      apiUrl: {
        type: String,
        required: true
      },
      nameColumn: {
        type: String,
        required: true
      },
      nameColumn2: {
        type: String,
        required: true,
        default: ''
      },
      nameLine: {
        type: String,
        required: true,
        default: ''
      },
      nameArea: {
        type: String,
        required: true
      },
      produtoParams: {
        type: String,
        default: 'NET'
      },
      grupo: {
        type: String,
        default: 'N1'
      }
    },
    data: () => ({
      labels: [],
      percAbs: [],
      percAbsPonto: [],
      abs: [],
      absPonto: [],
      escalados: [],
      series: [],
      options: {}
      // hiddenSeries: [false, false, true],
    }),
    methods: {
      seriesMethods() {
        let series = [
          {
            name: this.nameColumn,
            type: 'column',
            data: this.abs
          },
          {
            name: this.nameColumn2,
            type: 'column',
            data: this.absPonto
          },
          {
            name: this.nameArea,
            type: 'line',
            data: this.percAbs
          },
          {
            name: this.nameLine,
            type: 'line',
            data: this.percAbsPonto
          }
        ]
        return series
      },
      optionsMethods() {
        let chartOptions = {
          chart: {
            height: 350,
            type: 'line',
            stacked: false,
            zoom: {
              enabled: false
            },
            animations: {
              enabled: true
            }
          },
          stroke: {
            width: [0, 2],
            curve: 'smooth'
          },
          title: {
            text: `${this.agrupamento}`,
            align: 'left'
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
            opacity: [0.85, 0.85, 1],
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
            categories: this.labels
          },
          grid: {
            show: false
          },
          yaxis: [
            {
              show: false
            }
          ],
          dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
              if (opts.seriesIndex === 3 || opts.seriesIndex === 4 || opts.seriesIndex === 2) {
                return val + '%'
              }
              return val
            },
            style: {
              fontSize: '12px',
              fontWeight: 'bold',
              colors: ['#2979FF', '#00E676']
            }
          },
          tooltip: {
            shared: true,
            intersect: false,
            y: {
              formatter: function (val, opts) {
                if (opts.seriesIndex === 3 || opts.seriesIndex === 4 || opts.seriesIndex === 2) {
                  return val + '%'
                }
                return val
              }
            }
          }
        }

        return chartOptions
      },
      loadDadosGraficos() {
        this.dadosFiltrado = ''
        let urlData = `${config.baseUrl}${this.apiUrl}`
        this.$api
          .get(urlData, {
            params: {
              agrupamento: this.agrupamento,
              produto: this.produtoParams,
              grupo: this.grupo
            }
          })
          .then(res => {
            ;['labels', 'percAbs', 'percAbsPonto', 'abs', 'absPonto', 'escalados', 'series'].map(
              key => (this[key] = [])
            )
            let dadosFiltrado = res.data
            for (let i = 0; i < dadosFiltrado.length; i++) {
              this.labels.push(dadosFiltrado[i].SUPERIOR2)
              this.percAbs.push((dadosFiltrado[i].PERC_ABS * 100).toFixed(2))
              this.abs.push(dadosFiltrado[i].OP_ABS_CTI.toFixed(0))

              this.absPonto.push(dadosFiltrado[i].OP_ABS_PONTO.toFixed(0))
              this.percAbsPonto.push((dadosFiltrado[i].PERC_ABS_PONTO * 100).toFixed(2))
            }
            this.series = this.seriesMethods()
            this.options = this.optionsMethods()
          })
      }
    },
    created() {
      this.loadDadosGraficos()
    },
    watch: {}
  }
</script>

<style></style>
