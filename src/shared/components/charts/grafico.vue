<template>
  <div>
    <div class="grafico" ref="chartdiv" @change="gerarGrafico()"></div>
  </div>
</template>

<script>
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'

  am4core.useTheme(am4themes_animated)

  export default {
    name: 'amchart4',
    data: () => ({
      interval: null
    }),

    mounted() {
      this.gerarGrafico()
      this.interval = setTimeout(() => {
        this.gerarGrafico()
      }, 100)
    },
    computed: {
      dadosGraficos() {
        return this.$store.getters.dadosGraficos
      }
    },
    methods: {
      createSeries(field, name, chart) {
        // Set up series
        var series = chart.series.push(new am4charts.ColumnSeries())
        series.name = name
        series.dataFields.valueY = field
        series.dataFields.categoryX = 'COORDENADOR'
        series.sequencedInterpolation = true

        // Make it stacked
        series.stacked = true

        // Configure columns
        series.columns.template.width = am4core.percent(50)
        series.columns.template.tooltipText = '[#fff font-size: 14px]{valueY}'

        // Add label
        var labelBullet = series.bullets.push(new am4charts.LabelBullet())
        labelBullet.label.text = '{valueY}'
        labelBullet.locationY = 0.5
        labelBullet.label.hideOversized = true

        return series
      },
      gerarGrafico() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
        // chart.scrollbarX = new am4core.Scrollbar();

        // for teste in this.dadosGraficos
        let data = []

        for (let i = 0; i < this.dadosGraficos.length; i++) {
          data.push({
            coordenador: this.dadosGraficos[i].COORDENADOR,
            escalados: this.dadosGraficos[i].ESCALADOS
          })
        }

        chart.data = data

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        categoryAxis.dataFields.category = 'coordenador'
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.renderer.minGridDistance = 60
        categoryAxis.tooltip.disabled = true

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.renderer.minWidth = 50
        valueAxis.min = 0
        valueAxis.cursorTooltipEnabled = false

        // Create series

        var series = chart.series.push(new am4charts.ColumnSeries())
        series.sequencedInterpolation = true
        series.dataFields.valueY = 'escalados'
        series.dataFields.categoryX = 'coordenador'
        series.tooltipText = '[{categoryX}: bold]{valueY}[/]'
        series.columns.template.strokeWidth = 0

        series.tooltip.pointerOrientation = 'vertical'

        series.columns.template.column.cornerRadiusTopLeft = 10
        series.columns.template.column.cornerRadiusTopRight = 10
        series.columns.template.column.fillOpacity = 0.8

        this.createSeries('ESCALADOS', 'Escalados', chart)
        this.createSeries('ABS', 'Abs', chart)

        // on hover, make corner radiuses bigger
        var hoverState = series.columns.template.column.states.create('hover')
        hoverState.properties.cornerRadiusTopLeft = 0
        hoverState.properties.cornerRadiusTopRight = 0
        hoverState.properties.fillOpacity = 1

        series.columns.template.adapter.add('fill', function (fill, target) {
          return chart.colors.getIndex(target.dataItem.index)
        })

        // Cursor
        chart.cursor = new am4charts.XYCursor()
        chart.cursor.behavior = 'panX'

        chart.legend = new am4charts.Legend()
        this.chart = chart
      },
      loadDadosGraficos() {
        this.$store.dispatch('loadDadosGraficos')
      }
    },
    created() {
      this.loadDadosGraficos()
    },
    beforeUnmount() {
      clearInterval(this.interval)
      if (this.chart) {
        this.chart.dispose()
      }
    }
  }
</script>

<style scoped>
  .grafico {
    /* width: 50%; */
    height: 500px;
    align-content: center;
  }
</style>
