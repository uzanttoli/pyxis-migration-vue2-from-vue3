<template>
  <v-row>
    <v-col>
      <div class="hello" ref="chartdiv"></div>
    </v-col>
  </v-row>
</template>

<script>
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'
  import config from '../../../../core/config'

  am4core.useTheme(am4themes_animated)

  export default {
    name: 'pendentes-tratamento',
    props: {
      produto: {
        type: String,
        default: 'COMBO BKO'
      }
    },
    data: () => ({
      base: []
    }),
    mounted() {
      this.gerarGrafico()
    },
    methods: {
      loadBase() {
        let urlData = `${config.baseUrl}api/shared/backoffice/gerencial/dados_grafico/${this.produto}`
        this.$api.get(urlData).then(res => {
          this.base = res.data
        })
      },
      gerarGrafico() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.PieChart3D)
        chart.hiddenState.properties.opacity = 0

        let data = []

        for (let i = 0; i < this.base.length; i++) {
          data.push({
            agrupamento: this.base[i].AGRUPAMENTO,
            value: this.base[i].TOTAL
          })
        }

        let soma = 0
        for (let i = 0; i < this.base.length; i++) {
          soma += this.base[i].TOTAL
        }

        chart.innerRadius = 100

        var series = chart.series.push(new am4charts.PieSeries3D())
        series.dataFields.value = 'value'
        series.dataFields.category = 'agrupamento'

        var title = chart.titles.create()
        title.text = `Total de ${soma.toLocaleString()} Pendências.`
        title.fontSize = 20
        title.paddingBottom = 10

        chart.legend = new am4charts.Legend()

        chart.data = data
        this.chart = chart
      }
    },
    created() {
      this.loadBase()
      this.gerarGrafico()
    },
    watch: {
      produto() {
        this.loadBase()
      },
      data() {
        this.gerarGrafico()
      },
      base() {
        this.gerarGrafico()
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
