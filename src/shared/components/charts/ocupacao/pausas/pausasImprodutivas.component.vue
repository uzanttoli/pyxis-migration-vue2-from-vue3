<template>
  <div class="hello" ref="chartdiv"></div>
</template>

<script>
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'

  am4core.useTheme(am4themes_animated)

  import config from '../../../../../core/config'
  export default {
    name: 'pausas-improdutivas',
    props: {
      agrupamento: {
        type: String
      }
    },
    data: () => ({
      basePausasIndevidas: []
    }),
    mounted() {
      this.gerarGraficos()
    },
    methods: {
      calcularPercent() {
        let dados = this.basePausasIndevidas
        if (dados) {
          let sistemas = []
          let result
          for (let i = 0; i < dados.length; i++) {
            sistemas.push(Number(dados[i].OP_SISTEMA))
          }
          result = sistemas.reduce(function (a, b) {
            return a + b
          })
          return result
        }
      },
      loadBaseIndevidasPausa() {
        let urlData = `${config.baseUrl}api/shared/ocupacao/dados_pausa_indevidas_grafico/${this.agrupamento}`
        this.$api.get(urlData).then(res => {
          this.basePausasIndevidas = res.data
        })
      },
      calcularPercentualIndevidas(value1, value2) {
        return ((value1 / value2) * 100).toFixed(2)
      },
      gerarGraficos() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.PieChart)

        // Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries())
        pieSeries.dataFields.value = 'quantPausas'
        pieSeries.dataFields.category = 'pausas'

        // Let's cut a hole in our Pie chart the size of 30% the radius
        chart.innerRadius = am4core.percent(30)

        // Put a thick white border around each Slice
        pieSeries.slices.template.stroke = am4core.color('#fff')
        pieSeries.slices.template.strokeWidth = 2
        pieSeries.slices.template.strokeOpacity = 1
        // change the cursor on hover to make it apparent the object can be interacted with
        pieSeries.slices.template.cursorOverStyle = [
          {
            property: 'cursor',
            value: 'pointer'
          }
        ]

        pieSeries.alignLabels = false
        pieSeries.labels.template.bent = true
        pieSeries.labels.template.radius = 3
        pieSeries.labels.template.padding(0, 0, 0, 0)

        pieSeries.ticks.template.disabled = true

        // Create a base filter effect (as if it's not there) for the hover to return to
        let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter())
        shadow.opacity = 0

        // Create hover state
        let hoverState = pieSeries.slices.template.states.getKey('hover') // normally we have to create the hover state, in this case it already exists

        // Slightly shift the shadow and make it more prominent on hover
        let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter())
        hoverShadow.opacity = 0.7
        hoverShadow.blur = 5

        // Add a legend
        // chart.legend = new am4charts.Legend();
        let data = []
        for (let i = 0; i < this.basePausasIndevidas.length; i++) {
          data.push({
            pausas: this.basePausasIndevidas[i].MOTIVOS_PAUSA_IMPRODU,
            quantPausas: this.calcularPercentualIndevidas(
              this.basePausasIndevidas[i].OP_SISTEMA,
              this.calcularPercent()
            )
          })
        }
        // chart.data = [
        //   {
        //     pausas: "Lithuania",
        //     quantPausas: 501.9,
        //   },
        //   {
        //     pausas: "Germany",
        //     quantPausas: 165.8,
        //   },
        //   {
        //     pausas: "Australia",
        //     quantPausas: 139.9,
        //   },
        //   {
        //     pausas: "Austria",
        //     quantPausas: 128.3,
        //   },
        //   {
        //     pausas: "UK",
        //     quantPausas: 99,
        //   },
        //   {
        //     pausas: "Belgium",
        //     quantPausas: 60,
        //   },
        // ];
        chart.data = data
        this.chart = chart
      }
    },
    watch: {
      data() {
        this.gerarGraficos()
      },
      basePausasIndevidas() {
        this.gerarGraficos()
      }
    },
    created() {
      this.loadBaseIndevidasPausa()
      this.gerarGraficos()
      this.interval = setInterval(() => {
        this.loadBaseIndevidasPausa()
        this.gerarGraficos()
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
    height: 500px;
  }
</style>
