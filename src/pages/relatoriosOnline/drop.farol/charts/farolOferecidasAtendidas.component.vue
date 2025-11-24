<template>
  <section>
    <div class="hello" ref="chartdiv"></div>
  </section>
</template>

<script>
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'

  am4core.useTheme(am4themes_animated)
  am4core.options.autoDispose = true
  export default {
    name: 'HelloWorld',
    props: {
      produto: {
        type: String
      },
      regional: {
        type: String
      },
      tipo: {
        type: String
      }
    },
    data: () => ({
      interval: null,
      intervalo: null
    }),
    mounted() {
      this.montarGraficos()
      this.interval = setTimeout(() => {
        this.montarGraficos()
      }, 50)
    },
    computed: {
      dadosFarol() {
        let dados = this.$store.getters.dadosFarol
        return dados ? dados : []
      }
    },
    methods: {
      loadDadosFarol() {
        this.$store.dispatch('loadDadosFarol', {
          produto: this.produto,
          regional: this.regional,
          tipo: this.tipo
        })
      },
      montarGraficos() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)

        let data = []

        for (let i = 0; i < this.dadosFarol.length; i++) {
          data.push({
            intervalo: this.dadosFarol[i].intervalo,
            forecast: this.dadosFarol[i].forecast,
            atendidas: this.dadosFarol[i].atendidas,
            oferecidas: this.dadosFarol[i].oferecidas
          })
        }
        chart.data = data

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        categoryAxis.dataFields.category = 'intervalo'
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.renderer.minGridDistance = 30
        categoryAxis.renderer.grid.template.disabled = true

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.renderer.inside = true
        valueAxis.renderer.labels.template.disabled = true
        valueAxis.renderer.grid.template.disabled = true
        valueAxis.min = 0

        var label = categoryAxis.renderer.labels.template
        label.truncate = false
        label.wrap = false
        label.fontSize = 11
        label.fullWords = true
        label.ellipsis = '5px'
        label.textAlign = 'middle'
        label.parent = categoryAxis
        label.horizontalCenter = 'middle'
        label.verticalCenter = 'middle'

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
            axis.renderer.labels.template.rotation = 0
            axis.renderer.labels.template.horizontalCenter = 'middle'
            axis.renderer.labels.template.verticalCenter = 'center'
          }
        })

        // Create series
        function createSeries(field, name) {
          // Set up series
          var series = chart.series.push(new am4charts.ColumnSeries())
          series.name = name
          series.dataFields.valueY = field
          series.dataFields.categoryX = 'intervalo'
          series.sequencedInterpolation = true

          // Make it stacked
          series.stacked = true

          // Configure columns
          series.columns.template.width = am4core.percent(60)
          series.columns.template.tooltipText =
            '[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}'

          // Add label
          // var labelBullet = series.bullets.push(new am4charts.LabelBullet());
          // labelBullet.label.text = "{valueY}";
          // labelBullet.locationY = 0.5;
          // labelBullet.label.hideOversized = true;

          return series
        }

        createSeries('forecast', 'Forecast')
        createSeries('atendidas', 'Atendidas')
        createSeries('oferecidas', 'Oferecidas')

        // Legend
        chart.legend = new am4charts.Legend()
        this.chart = chart
      }
    },
    watch: {
      // data() {
      //   this.montarGraficos();
      // },
      dadosFarol() {
        this.montarGraficos()
      }
    },
    created() {
      this.loadDadosFarol()
      this.montarGraficos()
      this.intervalo = setInterval(() => {
        this.loadDadosFarol()
        this.montarGraficos()
      }, 15 * 60 * 1000)
    },
    beforeUnmount() {
      clearInterval(this.intervalo)
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
    height: 300px;
  }
</style>
