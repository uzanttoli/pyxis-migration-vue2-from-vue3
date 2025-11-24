<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="1" class="rounded-xl">
        <title-negative-margin
          icon="fa-solid fa-chart-simple"
          :title="title"
          className="rounded-r-xl ml-n2"
        >
          <v-col class="d-flex pa-2" cols="2">
            <v-select
              :items="items"
              outlined
              dense
              label="Selecione o Indicador"
              v-model="indicadorSelecionado"
            ></v-select>
          </v-col>
        </title-negative-margin>
        <div class="hello" ref="chartdiv"></div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import config from '../../../../core/config'
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'

  am4core.useTheme(am4themes_animated)
  am4core.options.autoDispose = true

  export default {
    name: 'amchartsEvolucaoSupervisor',
    props: {
      title: {
        type: String,
        default: 'Evolução dos Indicadores'
      },
      parameters: {
        type: [String, Number],
        required: true
      },
      tipo: {
        type: String,
        required: true
      },
      items: {
        type: [Array, Object],
        required: true
      }
    },
    data: () => ({
      interval: null,
      porcentage: '%',
      minhaEvolucaoInicadores: [],
      indicadorSelecionado: 'ATENDIDAS'
      // items: [],
    }),
    mounted() {
      this.gerarGraficoMinhaEvolucaoSupervisor()
      this.loadMinhaEvolucaoSupervisor()
      this.interval = setTimeout(() => {
        this.gerarGraficoMinhaEvolucaoSupervisor()
      }, 100)
    },
    beforeUpdate() {
      this.indicadorSelecionado
    },
    computed: {},
    methods: {
      percent(value) {
        if (!value) return
        return (value * 100).toFixed(2).concat('%')
      },
      loadMinhaEvolucaoSupervisor() {
        let urlData = `${config.pyxisReceptivoUrl}receptivo/dados-online/indicadores-dia-dia/operador`
        // let urlData = `${config.pyxisReceptivoUrl}receptivo/dados-online/indicadores-dia-dia/operador?almope=${this.parameters}&coluna=${this.tipo}&ordem=2`
        this.$api
          .get(urlData, {
            params: {
              parametro: this.parameters,
              coluna: this.tipo,
              ordem: 2
            }
          })
          .then(res => {
            let dado = res.data.filter(item => {
              return item.DATA != 'CONSOLIDADO'
            })
            this.minhaEvolucaoInicadores = dado
          })
      },
      gerarGraficoMinhaEvolucaoSupervisor() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
        let data = []

        for (let i = 0; i < this.minhaEvolucaoInicadores.length; i++) {
          data.push({
            dataRef: this.minhaEvolucaoInicadores[i].data,
            resultadoRef: this.minhaEvolucaoInicadores[i][this.indicadorSelecionado]
          })
        }

        chart.padding(40, 40, 40, 40)

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.dataFields.category = 'dataRef'
        categoryAxis.renderer.minGridDistance = 30
        categoryAxis.renderer.inversed = false
        categoryAxis.renderer.grid.template.disabled = true

        var label = categoryAxis.renderer.labels.template
        label.truncate = false
        label.wrap = false
        label.tooltipText = '{category}'
        label.fontSize = 15
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
            axis.renderer.labels.template.rotation = -90
            axis.renderer.labels.template.horizontalCenter = 'middle'
            axis.renderer.labels.template.verticalCenter = 'center'
          }
        })

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.min = 0
        valueAxis.extraMax = 0.1
        valueAxis.renderer.inside = true
        valueAxis.renderer.grid.template.disabled = true
        valueAxis.renderer.labels.template.disabled = true
        //   valueAxis.strictMinMax = true;

        valueAxis.rangeChangeEasing = am4core.ease.linear
        valueAxis.rangeChangeDuration = 1500

        var series = chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.categoryX = 'dataRef'
        series.dataFields.valueY = 'resultadoRef'
        series.tooltipText = '{valueY}'
        series.columns.template.strokeOpacity = 0
        series.columns.template.column.cornerRadiusTopRight = 10
        series.columns.template.column.cornerRadiusTopLeft = 10

        var labelBullet = series.bullets.push(new am4charts.LabelBullet())
        labelBullet.label.verticalCenter = 'bottom'
        labelBullet.rotation = -90
        labelBullet.label.horizontalCenter = 'middle'
        labelBullet.label.verticalCenter = 'middle'
        labelBullet.label.truncate = false
        labelBullet.dy = -10 // moves it a bit down;
        labelBullet.inside = true // this is done to avoid settings which are not suitable when label is rotated
        labelBullet.label.text = '[font-size: 15px bold]{resultadoRef}'
        labelBullet.tooltipText = '[/][#fff font-size: 17px]{resultadoRef}'

        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
        series.columns.template.adapter.add('fill', function (fill, target) {
          return chart.colors.getIndex(target.dataItem.index)
        })
        chart.data = data
        // Legend

        this.chart = chart
      }
    },
    created() {
      this.loadMinhaEvolucaoSupervisor()
    },
    beforeUnmount() {
      clearInterval(this.interval)
    },
    watch: {
      indicadorSelecionado() {
        this.gerarGraficoMinhaEvolucaoSupervisor()
      },
      minhaEvolucaoInicadores() {
        this.gerarGraficoMinhaEvolucaoSupervisor()
      },
      parameters() {
        this.loadMinhaEvolucaoSupervisor()
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
    width: 100%;
    height: 400px;
  }
</style>
