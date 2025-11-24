<template>
  <v-sheet>
    <div class="hello" ref="chartdiv" style="width: 100%; height: 400px; margin-top: 40px"></div>
  </v-sheet>
</template>

<script>
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'

  am4core.useTheme(am4themes_animated)
  export default {
    name: 'amchart-4',
    mounted() {
      var chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
      chart.data = [
        {
          text: '01/11/2021',
          value: 562
        },
        {
          text: 'Fernando',
          value: 301
        },
        {
          text: 'Diego',
          value: 201
        },
        {
          text: 'Lucas Invaite',
          value: 165
        }
      ]
      /**RODAPE DO GRAFICO */
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'text'
      categoryAxis.title.text = 'Quantidade'

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.title.text = 'DDD'

      var series = chart.series.push(new am4charts.ColumnSeries())
      series.name = 'Sales'
      series.columns.template.tooltipText = 'Series: {name}\n Nome: {categoryX}\nValue: {valueY}'
      series.columns.template.fill = am4core.color('#104547') // fill
      series.dataFields.valueY = 'value'
      series.dataFields.categoryX = 'text'
    },
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      resumoIndicadores() {
        return this.$store.getters.resumoIndicadores
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
