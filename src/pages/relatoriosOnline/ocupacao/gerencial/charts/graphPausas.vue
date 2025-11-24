<template>
  <div id="chart">
    <apexchart type="line" height="350" :options="options()" :series="seriesMethods()"></apexchart>
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
      produto: {
        type: String,
        default: 'NET'
      },
      apiUrl: {
        type: String,
        require: true
      },
      nameColumn: {
        type: String,
        require: true
      },
      nameArea: {
        type: String,
        require: true
      },
      produtoParams: {
        type: String,
        default: 'NET'
      }
    },
    data: () => ({
      // data: {
      labels: [],
      percAbs: [],
      abs: [],
      escalados: []
      // },
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
            name: this.nameArea,
            type: 'line',
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
            stacked: false,
            zoom: {
              enabled: false
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
            categories: this.labels
          },
          yaxis: [
            {
              show: false
            }
          ],
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '12px',
              fontWeight: 'bold',
              colors: ['#2979FF', '#00E676']
            }
          },
          tooltip: {
            shared: true,
            intersect: false
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
              produto: this.produtoParams,
              agrupamento: this.agrupamento
            }
          })
          .then(res => {
            let dadosFiltrado = res.data
            for (let i = 0; i < dadosFiltrado.length; i++) {
              this.labels.push(dadosFiltrado[i].SUPERIOR2)
              this.percAbs.push((dadosFiltrado[i].PERC_PAUSAS * 100).toFixed(2))
              this.abs.push(dadosFiltrado[i].OP_PAUSAS.toFixed(0))
            }
          })
      }
    },
    created() {
      this.loadDadosGraficos()
    }
  }
</script>

<style></style>
