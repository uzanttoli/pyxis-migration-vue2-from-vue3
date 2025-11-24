<template>
  <div id="chart">
    <apexchart
      type="bar"
      height="200"
      width="500"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
  export default {
    props: {
      dataItem: {
        type: Array
      }
    },
    data: () => ({
      series: [
        {
          name: 'valor',
          data: [2.3, 3.1, 4.0, 12.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 5, 10, 4.5, 8.5, 5]
        }
      ],
      chartOptions: {
        chart: {
          type: 'bar',
          toolbar: {
            show: false
          }
        },

        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: 'top' // top, center, bottom
            },
            barOptions: {
              distributed: true // Adicionar espaçamento entre as colunas
            }
          }
        },
        colors: ['#fff'],
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + '%'
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ['#fff']
          }
        },

        xaxis: {
          categories: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15'
          ],
          labels: {
            style: {
              colors: '#f5f5f5'
            }
          },
          position: 'bottom',
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5
              }
            }
          },
          tooltip: {
            enabled: true
          }
        },

        grid: {
          show: false // Esconder as linhas de grade
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + '%'
            }
          }
        }
        // title: {
        //   text: "Monthly Inflation in Argentina, 2002",
        //   floating: true,
        //   offsetY: 330,
        //   align: "center",
        //   style: {
        //     color: "#444",
        //   },
        // },
      }
    })
  }
</script>

<style scoped>
  .apexcharts-menu {
    display: none !important; /* Oculta o menu do gráfico */
  }
</style>
