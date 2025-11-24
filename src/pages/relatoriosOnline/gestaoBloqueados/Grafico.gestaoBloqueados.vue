<template>
  <div id="chart">
    <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
  import GestaoBloqueadosService from '@/data/services/tabuladores/GestaoBloqueados'
  export default {
    name: 'Grafico',
    props: {
      title: {
        type: String,
        required: true
      }
    },
    data: () => ({
      series: [],
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: false
          }
        },
        grid: {
          show: false
        },
        colors: ['#ef6c00', '#bdbdbd'],
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              total: {
                enabled: true,
                offsetX: 0,
                style: {
                  fontSize: '13px',
                  fontWeight: 900
                }
              }
            }
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          categories: [],
          labels: {
            show: false,
            formatter: function (val) {
              return val + 'K'
            }
          }
        },
        // yaxis: {
        //     title: {
        //         text: undefined
        //     },
        // },
        tooltip: {
          y: {
            formatter: function (val) {
              return val
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'left',
          offsetX: 40,
          offsetY: 9
        }
      }
    }),
    methods: {
      async loadDadosGrafico() {
        try {
          const res = await GestaoBloqueadosService.getDadosGraficoPainelGerencial(this.title)

          const meses = {
            '01': 'Jan',
            '02': 'Fev',
            '03': 'Mar',
            '04': 'Abr',
            '05': 'Mai',
            '06': 'Jun',
            '07': 'Jul',
            '08': 'Ago',
            '09': 'Set',
            10: 'Out',
            11: 'Nov',
            12: 'Dez'
          }

          const agrupado = {}

          res.forEach(item => {
            const [ano, mes] = item.DATA_REFERENCIA.split('-')
            const label = `${meses[mes]}/${ano}`

            if (!agrupado[label]) {
              agrupado[label] = {
                QTD_BLOQUEADOS: 0,
                QTD_OUTROS_DESTINOS: 0
              }
            }
            agrupado[label]['QTD_BLOQUEADOS'] += item.QTD_BLOQUEADOS * 1
            agrupado[label]['QTD_OUTROS_DESTINOS'] += item.QTD_OUTROS_DESTINOS * 1
          })

          const categories = Object.keys(agrupado).sort((a, b) => {
            const [mA, yA] = a.split('/')
            const [mB, yB] = b.split('/')

            return new Date(`${yB}-${mB}-01`) - new Date(`${yA}-${mA}-01`)
          })

          const qtdBloqueados = categories.map(categ => agrupado[categ]['QTD_BLOQUEADOS'] || 0)
          const qtdOutrosDestinos = categories.map(
            categ => agrupado[categ]['QTD_OUTROS_DESTINOS'] || 0
          )

          this.chartOptions.xaxis.categories.push(...categories)
          this.series.push(
            {
              name: this.title,
              data: qtdBloqueados
            },
            {
              name: 'DEMAIS PRODUTOS/STATUS',
              data: qtdOutrosDestinos
            }
          )
        } catch (error) {
          console.error(error)
        }
      }
    },
    async created() {
      await this.loadDadosGrafico()
    }
  }
</script>

<style scoped></style>
