<template>
  <div>
    <div class="hello" ref="chartdiv"></div>
  </div>
</template>

<script>
  import config from '../../../../../core/config'

  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'

  am4core.useTheme(am4themes_animated)

  export default {
    name: 'HelloWorld',
    props: {
      agrupamento: {
        type: String
      },
      abs: {
        type: [String, Number],
        default: 0
      },
      percentualAbs: {
        type: [Number],
        default: 0
      },
      dados: {
        type: [String, Object, Array]
      }
    },
    data: () => ({
      showTooltip: true,
      pausaDadosGraficos: [],
      interval: null
    }),
    mounted() {
      this.gerarGrafico()
      // this.interval = setTimeout(() => {
      //   this.gerarGrafico();
      // }, 1000);
    },
    methods: {
      calcularPercentualPausas(value1) {
        return (value1 * 100).toFixed(2).concat('%')
      },
      loadPausaDadosGraficos() {
        let urlData = `${config.baseUrl}api/shared/ocupacao/dados_pausa_grafico/${this.agrupamento}`
        this.$api.get(urlData).then(res => {
          this.pausaDadosGraficos = res.data
        })
      },
      gerarGrafico() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)

        chart.paddingRight = 20

        let data = []
        var title = chart.titles.push(new am4core.Label())
        // title.text = `${this.agrupamento}: ${this.abs} | ${this.percentualAbs}`;
        // title.text = `MTF N1: ${data.AGRUPAMENTO}: ${data.OP_ABS}`;
        title.fontSize = 15
        title.marginBottom = 15
        for (let i = 0; i < this.pausaDadosGraficos.length; i++) {
          data.push({
            nome: this.pausaDadosGraficos[i].SUPERIOR2,
            pausas: this.pausaDadosGraficos[i].OP_PAUSAS,
            percentPausas: this.calcularPercentualPausas(this.pausaDadosGraficos[i].PERC_PAUSAS)
          })
        }
        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        categoryAxis.dataFields.category = 'nome'
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.renderer.minGridDistance = 30
        // categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.grid.template.disabled = true
        // categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.location = 0

        categoryAxis.events.on('sizechanged', function (ev) {
          var axis = ev.target
          var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex)
          axis.renderer.labels.template.maxWidth = cellWidth
        })
        // label.maxWidth = 300;

        categoryAxis.events.on('sizechanged', function (ev) {
          var axis = ev.target
          var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex)
          if (cellWidth < axis.renderer.labels.template.maxWidth) {
            axis.renderer.labels.template.rotation = -45
            axis.renderer.labels.template.horizontalCenter = 'right'
            axis.renderer.labels.template.verticalCenter = 'middle'
          } else {
            axis.renderer.labels.template.rotation = 0
            axis.renderer.labels.template.horizontalCenter = 'middle'
            axis.renderer.labels.template.verticalCenter = 'center'
          }
        })

        var label = categoryAxis.renderer.labels.template
        label.truncate = false
        label.wrap = true
        label.fontSize = 12
        label.fullWords = false
        label.ellipsis = '5px'
        label.textAlign = 'middle'
        label.parent = categoryAxis
        label.horizontalCenter = 'middle'
        label.verticalCenter = 'middle'

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.renderer.inside = true
        valueAxis.renderer.labels.template.disabled = true
        valueAxis.min = 0
        valueAxis.renderer.grid.template.disabled = true

        //Lines Series
        var lineSeries = chart.series.push(new am4charts.LineSeries())
        lineSeries.name = '(%) Pausas'
        lineSeries.dataFields.valueY = 'percentPausas'
        lineSeries.dataFields.categoryX = 'nome'

        lineSeries.stroke = am4core.color('#45788C') // cor da linha
        lineSeries.strokeWidth = 3
        lineSeries.propertyFields.strokeDasharray = 'lineDash'
        lineSeries.tooltip.label.textAlign = 'vertical'

        var bullet = lineSeries.bullets.push(new am4charts.Bullet())
        bullet.fill = am4core.color('#E53935') // tooltips grab fill from parent by default // cor do rotulo da linha
        // bullet.align = "top";
        // bullet.valign = "top";
        bullet.tooltipText = '[/][#fff font-size: 17px]{valueY}[/][#fff font-size: 12px]%[/]'
        bullet.alwaysShowTooltip = this.showTooltip

        var circle = bullet.createChild(am4core.Circle)
        circle.radius = 4
        circle.fill = am4core.color('#fff')
        circle.strokeWidth = 3

        // Create series
        function createSeries(field, name) {
          // Set up series
          var series = chart.series.push(new am4charts.ColumnSeries())
          series.name = name
          series.dataFields.valueY = field
          series.dataFields.categoryX = 'nome'
          series.sequencedInterpolation = true

          // Make it stacked
          series.stacked = true

          // Configure columns
          series.columns.template.width = am4core.percent(60)
          series.fill = am4core.color('#6A7BD9') // // cor da barra
          series.columns.template.tooltipText =
            '[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}'

          // Add label
          var labelBullet = series.bullets.push(new am4charts.LabelBullet())
          labelBullet.label.text = '{valueY}'
          labelBullet.locationY = 0.5
          labelBullet.label.fill = am4core.color('#fff')
          // labelBullet.label.hideOversized = true;

          return series
        }

        createSeries('pausas', 'Pausas')
        chart.data = data
        // Legend
        chart.legend = new am4charts.Legend()
        this.chart = chart
      }
    },
    watch: {
      data() {
        this.gerarGrafico()
      },
      pausaDadosGraficos() {
        this.gerarGrafico()
      },
      showTooltip() {
        this.gerarGrafico()
      }
    },
    created() {
      this.loadPausaDadosGraficos()
      this.gerarGrafico()
      this.interval = setInterval(() => {
        this.loadPausaDadosGraficos()
        this.gerarGrafico()
      }, 15 * 60 * 1000)
    },
    beforeUnmount() {
      clearInterval(this.interval)
      if (this.chart) {
        this.chart.dispose()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
    width: 100%;
    height: 320px;
  }
</style>
