<template>
  <v-card height="665px" class="mt-7">
    <div class="hello" ref="chartdiv"></div>
  </v-card>
</template>

<script>
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'

  am4core.useTheme(am4themes_animated)
  am4core.options.autoDispose = true
  export default {
    name: 'amchartsAcesso',
    props: {
      title: {
        type: String,
        default: 'Histórico de Acessos'
      }
    },
    data: () => ({
      interval: null
    }),
    mounted() {
      this.gerarGraficoHistorico()
      // this.interval = setTimeout(() => {
      //   this.gerarGraficoHistorico();
      // }, 100);
    },
    computed: {
      historicoLogPyxis() {
        return this.$store.getters.historicoLogPyxis
      }
    },
    methods: {
      loadHistoricoLogPyxis() {
        this.$store.dispatch('loadHistoricoLogPyxis')
      },
      gerarGraficoHistorico() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)

        // chart.paddingRight = 20;

        let data = []
        for (let i = 0; i < this.historicoLogPyxis.length; i++) {
          data.push({
            dia: this.historicoLogPyxis[i].DATA,
            acessos: this.historicoLogPyxis[i].CONTAGEM
          })
        }
        chart.data = data

        chart.padding(40, 40, 40, 40)

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.dataFields.category = 'dia'
        categoryAxis.renderer.minGridDistance = 60
        categoryAxis.renderer.inversed = false
        categoryAxis.renderer.grid.template.disabled = true
        var label = categoryAxis.renderer.labels.template
        label.truncate = false
        label.wrap = true
        label.tooltipText = '{category}'

        categoryAxis.events.on('sizechanged', function (ev) {
          var axis = ev.target
          var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex)
          axis.renderer.labels.template.maxWidth = cellWidth
        })
        label.maxWidth = 300

        categoryAxis.events.on('sizechanged', function (ev) {
          var axis = ev.target
          var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex)
          if (cellWidth < axis.renderer.labels.template.maxWidth) {
            axis.renderer.labels.template.rotation = -45
            axis.renderer.labels.template.horizontalCenter = 'right'
            axis.renderer.labels.template.verticalCenter = 'middle'
          } else {
            axis.renderer.labels.template.rotation = -90
            axis.renderer.labels.template.horizontalCenter = 'middle'
            axis.renderer.labels.template.verticalCenter = 'center'
          }
        })

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.min = 0
        valueAxis.extraMax = 0.1
        valueAxis.renderer.grid.template.disabled = true

        valueAxis.rangeChangeEasing = am4core.ease.linear
        valueAxis.rangeChangeDuration = 1500

        var series = chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.categoryX = 'dia'
        series.dataFields.valueY = 'acessos'
        series.tooltipText = '{valueY.value}'
        series.columns.template.strokeOpacity = 0
        series.columns.template.column.cornerRadiusTopRight = 10
        series.columns.template.column.cornerRadiusTopLeft = 10
        series.interpolationDuration = 1500
        series.interpolationEasing = am4core.ease.linear
        var labelBullet = series.bullets.push(new am4charts.LabelBullet())
        labelBullet.label.verticalCenter = 'bottom'
        labelBullet.label.dy = -10
        labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}"
        chart.zoomOutButton.disabled = true

        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
        series.columns.template.adapter.add('fill', function (fill, target) {
          return chart.colors.getIndex(target.dataItem.index)
        })

        this.chart = chart
      },

      beforeDestroy() {
        clearInterval(this.interval)
        if (this.chart) {
          this.chart.dispose()
        }
      }
    },
    created() {
      this.loadHistoricoLogPyxis()
    },
    watch: {
      historicoLogPyxis() {
        this.gerarGraficoHistorico()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
    width: 100%;
    height: 600px;
  }
</style>
