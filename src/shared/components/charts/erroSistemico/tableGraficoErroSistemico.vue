<template>
  <v-sheet elevation="3">
    <title-negative-margin title="Falha Sistêmica" icon="mdi-chart-bell-curve-cumulative">
      <v-col class="d-flex">
        <v-select
          :items="items"
          label="Selecione a Falha"
          v-model="falha"
          @change="loadFalhaErroSistemico()"
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
</template>

<script>
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'
  // import am4themes_material from "@amcharts/amcharts4/themes/material";

  am4core.useTheme(am4themes_animated)
  // am4core.useTheme(am4themes_material);

  export default {
    name: 'HelloWorld',
    data: () => ({
      falha: 'LIGAÇÃO MUDA - CLIENTE',
      items: [
        { text: 'LIGAÇÃO MUDA - CLIENTE', value: 'LIGAÇÃO MUDA - CLIENTE' },
        { text: 'LIGAÇÃO MUDA - OPERADOR', value: 'LIGAÇÃO MUDA - OPERADOR' },
        {
          text: 'LIGAÇÃO RUIM - PICOTANDO/RUÍDO/ROBOTIZADA',
          value: 'LIGAÇÃO RUIM - PICOTANDO/RUÍDO/ROBOTIZADA'
        },
        {
          text: 'QUEDA DE LIGAÇÃO - SEM OPÇÃO DE CALLBACK',
          value: 'QUEDA DE LIGAÇÃO - SEM OPÇÃO DE CALLBACK'
        },
        {
          text: 'QUEDA DE LIGAÇÃO - CALLBACK NÃO COMPLETA',
          value: 'QUEDA DE LIGAÇÃO - CALLBACK NÃO COMPLETA'
        },
        {
          text: 'QUEDA DE LIGAÇÃO - CALLBACK SEM SUCESSO',
          value: 'QUEDA DE LIGAÇÃO - CALLBACK SEM SUCESSO'
        },
        {
          text: 'QUEDA DE LIGAÇÃO - CALLBACK COM SUCESSO',
          value: 'QUEDA DE LIGAÇÃO - CALLBACK COM SUCESSO'
        }
      ],
      showTooltip: true,
      interval: null
    }),

    computed: {
      falhaErroSistemico() {
        let dados = this.$store.getters.falhaErroSistemico
        return dados ? dados : []
      },
      labelIcon() {
        return this.showTooltip ? 'mdi-tag-off' : 'mdi-tag'
      }
    },
    beforeUpdate() {
      this.falha
    },
    mounted() {
      this.montarGrafico()
      this.interval = setTimeout(() => {
        this.montarGrafico()
      }, 100)
    },
    methods: {
      loadFalhaErroSistemico() {
        this.$store.dispatch('loadFalhaErroSistemico', this.falha)
      },
      montarGrafico() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
        chart.exporting.menu = new am4core.ExportMenu()
        chart.exporting.menu.items = [
          {
            label: '...',
            menu: [
              { type: 'csv', label: 'CSV' },
              { type: 'xlsx', label: 'XLSX' }
            ]
          }
        ]

        // chart.cursor = new am4charts.XYCursor();
        // chart.scrollbarX = new am4core.Scrollbar();
        // Data for both series
        let data = []

        for (let i = 0; i < this.falhaErroSistemico.length; i++) {
          data.push({
            falha: this.falhaErroSistemico[i].BANDEIRA,
            quantidade: this.falhaErroSistemico[i].QTDE,
            percentual: this.falhaErroSistemico[i].PERC
          })
        }

        /* Create axes */
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        categoryAxis.dataFields.category = 'falha' // ONDE VEM OS DADOS - COLUNA
        categoryAxis.renderer.minGridDistance = 30
        // categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.grid.template.disabled = true
        // categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.location = 0

        var label = categoryAxis.renderer.labels.template
        label.truncate = false
        label.wrap = true
        label.fontSize = 11
        label.fullWords = true
        label.ellipsis = '5px'
        label.textAlign = 'middle'
        label.parent = categoryAxis
        label.horizontalCenter = 'middle'
        label.verticalCenter = 'middle'

        // Tamanho nome
        // label.tooltipText = "{category}";
        // label.isOversized = true;
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

        /* Create value axis */
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.renderer.inside = true
        valueAxis.renderer.labels.template.disabled = true
        valueAxis.renderer.grid.template.disabled = true

        var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis2.min = 0
        valueAxis2.max = 40
        // valueAxis2.extraMin = 0.2;
        // valueAxis2.extraMax = 0.2;
        valueAxis2.strictMinMax = false
        valueAxis2.renderer.grid.template.disabled = true
        // valueAxis2.renderer.minGridDistance = 1;

        valueAxis2.numberFormatter = new am4core.NumberFormatter()
        valueAxis2.numberFormatter.numberFormat = '#.00'
        valueAxis2.renderer.grid.template.disabled = true
        valueAxis2.renderer.labels.template.disabled = true

        /* Create series */
        var columnSeries = chart.series.push(new am4charts.ColumnSeries())
        columnSeries.name = 'Quantidade'
        columnSeries.dataFields.valueY = 'quantidade'
        columnSeries.dataFields.categoryX = 'falha' // ONDE VEM OS DADOS - COLUNA

        columnSeries.columns.template.tooltipText =
          '[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]'
        columnSeries.columns.template.propertyFields.fillOpacity = 'fillOpacity'
        columnSeries.columns.template.propertyFields.stroke = 'stroke'
        columnSeries.columns.template.propertyFields.strokeWidth = 'strokeWidth'
        columnSeries.columns.template.propertyFields.strokeDasharray = 'columnDash'
        columnSeries.tooltip.label.textAlign = 'start'
        columnSeries.columns.template.column.cornerRadiusTopRight = 5
        columnSeries.columns.template.column.cornerRadiusTopLeft = 5

        // categoryAxis.sortBySeries = columnSeries;
        // Add label
        var labelBullet = columnSeries.bullets.push(new am4charts.LabelBullet())
        labelBullet.label.text = '{valueY}'
        labelBullet.locationY = 0.5
        labelBullet.label.hideOversized = true
        labelBullet.label.fontSize = 20
        // Make it stacked
        columnSeries.stacked = true

        // Configure columns
        columnSeries.columns.template.width = am4core.percent(50)
        columnSeries.columns.template.tooltipText = '[#fff font-size: 9px]{valueY}'

        var lineSeries = chart.series.push(new am4charts.LineSeries())
        lineSeries.name = 'Percentual'
        lineSeries.dataFields.valueY = 'percentual'
        lineSeries.dataFields.categoryX = 'falha' // ONDE VEM OS DADOS - COLUNA
        // lineSeries.zIndex = 10;

        lineSeries.stroke = am4core.color('#fdd400')
        lineSeries.strokeWidth = 3
        lineSeries.propertyFields.strokeDasharray = 'lineDash'
        lineSeries.tooltip.label.textAlign = 'start'
        lineSeries.yAxis = valueAxis2
        lineSeries.numberFormatter = new am4core.NumberFormatter()
        lineSeries.numberFormatter.numberFormat = '#.00'

        var bullet = lineSeries.bullets.push(new am4charts.Bullet())
        // bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
        bullet.tooltipText = '[/][#fff font-size: 17px]{valueY}[/][#fff font-size: 12px]%[/]'
        bullet.alwaysShowTooltip = this.showTooltip
        // var image = bullet.createChild(am4core.Image);
        // image.href = "https://www.amcharts.com/lib/images/star.svg";
        // image.width = 30;
        // image.height = 30;
        // image.horizontalCenter = "middle";
        // image.verticalCenter = "middle";

        var circle = bullet.createChild(am4core.Circle)
        circle.radius = 4
        circle.fill = am4core.color('#fff')
        circle.strokeWidth = 3

        chart.legend = new am4charts.Legend()

        chart.data = data
        this.chart = chart
      }
    },
    created() {
      this.loadFalhaErroSistemico()
      this.montarGrafico()
    },
    watch: {
      data() {
        this.montarGrafico()
      },
      falhaErroSistemico() {
        this.montarGrafico()
      },
      showTooltip() {
        this.montarGrafico()
      }
    },
    beforeUnmount() {
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
    height: 500px;
  }
</style>
