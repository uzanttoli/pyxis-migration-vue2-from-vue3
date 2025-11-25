<template>
  <div>
    <v-sheet elevation="3">
      <title-negative-margin icon="mdi-chart-bell-curve-cumulative" :title="title">
        <v-col class="d-flex" cols="2">
          <v-select
            :items="items"
            label="Selecione o produto"
            v-model="itemSelecionado"
            @change="loadAbsDadosGraficos()"
          ></v-select>
        </v-col>
      </title-negative-margin>

      <v-btn @click="showTooltip = !showTooltip" icon>
        <v-icon>{{ labelIcon }}</v-icon>
      </v-btn>

      <template>
        <div class="hello" ref="chartdiv"></div>
      </template>
    </v-sheet>
  </div>
</template>

<script>
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'

  am4core.useTheme(am4themes_animated)
  am4core.options.autoDispose = true
  export default {
    name: 'am-chart',
    props: {
      data: {
        type: Array,
        required: false
      },
      title: {
        type: String,
        default: 'Abs Diário'
      }
    },
    data: () => ({
      items: [
        { text: 'COMBO', value: 'NET COMBO' },
        { text: 'MTF', value: 'NET MTF' }
      ],
      itemSelecionado: 'NET MTF',
      interval: null,
      showTooltip: true
    }),
    computed: {
      absDadosGraficos() {
        return this.$store.getters.absDadosGraficos
      },

      labelIcon() {
        return this.showTooltip ? 'mdi-tag-off' : 'mdi-tag'
      }
    },
    beforeUpdate() {
      this.itemSelecionado
    },
    mounted() {
      this.gerarGrafico()
      this.interval = setTimeout(() => {
        this.gerarGrafico()
      }, 100)
    },
    methods: {
      loadAbsDadosGraficos() {
        this.$store.dispatch('loadAbsDadosGraficos', this.itemSelecionado)
      },

      createSeries(field, name, chart) {
        // Set up series
        var series = chart.series.push(new am4charts.ColumnSeries())
        series.name = name
        series.dataFields.valueY = field
        series.dataFields.categoryX = 'COORDENADOR'
        series.sequencedInterpolation = false

        // Make it stacked
        series.stacked = true

        // Configure columns
        series.columns.template.width = am4core.percent(65)
        series.columns.template.tooltipText = '[#fff font-size: 9px]{valueY}'

        // Add label
        var labelBullet = series.bullets.push(new am4charts.LabelBullet())
        labelBullet.label.text = '{valueY}'
        labelBullet.locationY = 0.5
        labelBullet.label.hideOversized = true

        return series
      },
      gerarGrafico() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)

        chart.exporting.menu = new am4core.ExportMenu()
        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        categoryAxis.dataFields.category = 'COORDENADOR'
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.renderer.grid.template.disabled = true
        var label = categoryAxis.renderer.labels.template
        label.truncate = true
        label.wrap = true

        // Tamanho nome
        label.tooltipText = '{category}'
        label.isOversized = true
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

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.renderer.inside = true
        valueAxis.renderer.labels.template.disabled = true
        valueAxis.renderer.grid.template.disabled = true

        var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis2.min = 0
        valueAxis2.max = 100
        valueAxis2.strictMinMax = true
        valueAxis2.renderer.grid.template.disabled = true

        // Create series

        this.createSeries('ESCALADOS', 'Escalados', chart)
        this.createSeries('ABS', 'Abs', chart)

        var lineSeries = chart.series.push(new am4charts.LineSeries())
        lineSeries.name = '(%)Abs'
        lineSeries.dataFields.valueY = 'PERCENT_ABS'
        lineSeries.dataFields.categoryX = 'COORDENADOR'

        lineSeries.stroke = am4core.color('#fdd400')
        lineSeries.strokeWidth = 3
        lineSeries.propertyFields.strokeDasharray = 'lineDash'
        lineSeries.tooltip.label.textAlign = 'center'
        lineSeries.yAxis = valueAxis2

        var bullet = lineSeries.bullets.push(new am4charts.Bullet())
        // bullet.fill = am4core.color("#3c3c3c"); // tooltips grab fill from parent by default
        bullet.tooltipText = '[/][#fff font-size: 17px]{valueY}[/][#fff font-size: 11px]%[/]'
        bullet.alwaysShowTooltip = this.showTooltip

        var circle = bullet.createChild(am4core.Circle)
        circle.radius = 4
        circle.fill = am4core.color('#fff')
        circle.strokeWidth = 3

        // Adicionando dados
        let data = []

        for (let i = 0; i < this.absDadosGraficos.length; i++) {
          data.push({
            COORDENADOR: this.absDadosGraficos[i].SUPERIOR2,
            ESCALADOS: this.absDadosGraficos[i].ESCALADOS,
            ABS: this.absDadosGraficos[i].FALTAS,
            PERCENT_ABS: this.absDadosGraficos[i].PERC_ABS
          })
        }
        chart.data = data

        // Legend
        chart.legend = new am4charts.Legend()

        this.chart = chart
      }
    },

    created() {
      this.loadAbsDadosGraficos()
      this.gerarGrafico()
    },
    watch: {
      absDadosGraficos() {
        this.gerarGrafico()
      },
      showTooltip() {
        this.gerarGrafico()
      },
      data() {
        this.gerarGrafico()
      }
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
    height: 488px;
  }
</style>
