<template>
  <v-sheet elevation="3" class="mt-10">
    <v-row>
      <v-col>
        <div>
          <title-negative-margin icon="mdi-account-child-circle" :title="title">
            <v-col class="d-flex" cols="2">
              <v-select
                :items="items"
                label="Selecione o Indicador"
                v-model="indicadorSelecionado"
              ></v-select>
            </v-col>
          </title-negative-margin>
          <div class="hello" ref="chartdiv"></div>
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
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
      }
    },
    data: () => ({
      interval: null,
      porcentage: '%',
      indicadorSelecionado: 'ATENDIDAS',
      items: [
        { text: 'Atendidas', value: 'ATENDIDAS' },
        { text: 'TMT', value: 'TMT' },
        { text: '% Rechamada', value: 'RECHAMADAS_P' },
        { text: 'Rechamada 72h', value: 'RECHAMADA_72H' },
        { text: 'Desconexão', value: 'DESCONEXAO' },
        // { text: "Tempo Logado", value: "LOGADO_CTI" },
        // { text: "Jackin", value: "JACKIN_CHE_CTI" },
        { text: 'Shortcall', value: 'SHORTCALL' }
      ]
    }),
    mounted() {
      this.gerarGraficoMinhaEvolucaoSupervisor()
      this.interval = setTimeout(() => {
        this.gerarGraficoMinhaEvolucaoSupervisor()
      }, 100)
    },
    computed: {
      usuarioNome() {
        return this.$store.getters.usuario.nome
      },
      minhaEvolucaoSupervisor() {
        let minhaEvolucaoSupervisor = this.$store.getters.minhaEvolucaoSupervisor
        minhaEvolucaoSupervisor.map(item => {
          if (item.RECHAMADAS_P) {
            item.RECHAMADAS_P = item.RECHAMADAS_P.concat(this.porcentage)
          } else {
            item.RECHAMADAS_P = 0 + '%'
          }
          if (item.RECHAMADA_72H) {
            item.RECHAMADA_72H = (item.RECHAMADA_72H / item.IDENTIFICADAS) * 100
          } else {
            item.RECHAMADA_72H = 0
          }
          if (item.DESCONEXAO) {
            item.DESCONEXAO = (item.DESCONEXAO / item.ATENDIDAS) * 100
          } else {
            item.DESCONEXAO = 0
          }
          if (item.SHORTCALL) {
            item.SHORTCALL = (item.SHORTCALL / item.ATENDIDAS) * 100
          } else {
            item.SHORTCALL = 0
          }
        })
        return minhaEvolucaoSupervisor
      }
    },
    beforeUpdate() {
      this.indicadorSelecionado
    },
    methods: {
      loadMinhaEvolucaoSupervisor() {
        this.$store.dispatch('loadMinhaEvolucaoSupervisor', this.usuarioNome)
      },
      gerarGraficoMinhaEvolucaoSupervisor() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
        let data = []

        for (let i = 0; i < this.minhaEvolucaoSupervisor.length; i++) {
          switch (this.indicadorSelecionado) {
            case 'ATENDIDAS':
              data.push({
                dataRef: this.minhaEvolucaoSupervisor[i].DATA.substr(0, 10)
                  .split('-')
                  .reverse()
                  .join('/'),
                resultadoRef: this.minhaEvolucaoSupervisor[i].ATENDIDAS
              })
              break
            case 'TMT':
              data.push({
                dataRef: this.minhaEvolucaoSupervisor[i].DATA.substr(0, 10)
                  .split('-')
                  .reverse()
                  .join('/'),
                resultadoRef: this.minhaEvolucaoSupervisor[i].TMT
              })
              break
            case 'RECHAMADAS_P':
              data.push({
                dataRef: this.minhaEvolucaoSupervisor[i].DATA.substr(0, 10)
                  .split('-')
                  .reverse()
                  .join('/'),
                resultadoRef: this.minhaEvolucaoSupervisor[i].RECHAMADAS_P
              })
              break
            case 'LOGADO_CTI':
              data.push({
                dataRef: this.minhaEvolucaoSupervisor[i].DATA.substr(0, 10)
                  .split('-')
                  .reverse()
                  .join('/'),
                resultadoRef: this.minhaEvolucaoSupervisor[i].LOGADO_CTI
              })
              break
            case 'JACKIN_CHE_CTI':
              data.push({
                dataRef: this.minhaEvolucaoSupervisor[i].DATA.substr(0, 10)
                  .split('-')
                  .reverse()
                  .join('/'),
                resultadoRef: this.minhaEvolucaoSupervisor[i].JACKIN_CHE_CTI
              })
              break
            case 'RECHAMADA_72H':
              data.push({
                dataRef: this.minhaEvolucaoSupervisor[i].DATA.substr(0, 10)
                  .split('-')
                  .reverse()
                  .join('/'),
                resultadoRef: this.minhaEvolucaoSupervisor[i].RECHAMADA_72H.toFixed(2).concat(
                  this.porcentage
                )
              })
              break
            case 'DESCONEXAO':
              data.push({
                dataRef: this.minhaEvolucaoSupervisor[i].DATA.substr(0, 10)
                  .split('-')
                  .reverse()
                  .join('/'),
                resultadoRef: this.minhaEvolucaoSupervisor[i].DESCONEXAO.toFixed(2).concat(
                  this.porcentage
                )
              })
              break
            case 'SHORTCALL':
              data.push({
                dataRef: this.minhaEvolucaoSupervisor[i].DATA.substr(0, 10)
                  .split('-')
                  .reverse()
                  .join('/'),
                resultadoRef: this.minhaEvolucaoSupervisor[i].SHORTCALL.toFixed(2).concat(
                  this.porcentage
                )
              })
              break
            default:
              break
          }
        }

        chart.padding(40, 40, 40, 40)

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.dataFields.category = 'dataRef'
        categoryAxis.renderer.minGridDistance = 60
        categoryAxis.renderer.inversed = false
        categoryAxis.renderer.grid.template.disabled = true

        var label = categoryAxis.renderer.labels.template
        label.truncate = false
        label.wrap = false
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
        //   series.columns.template.width = am4core.percent(40);
        //   series.columns.template.tooltipText = "[font-size: 11px]{valueY}";
        //   series.interpolationDuration = 1500;
        //   series.interpolationEasing = am4core.ease.linear;
        var labelBullet = series.bullets.push(new am4charts.LabelBullet())
        labelBullet.label.verticalCenter = 'bottom'
        labelBullet.label.dy = -10
        labelBullet.label.text = '[font-size: 15px bold]{resultadoRef}'
        chart.zoomOutButton.disabled = true

        // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
        series.columns.template.adapter.add('fill', function (fill, target) {
          return chart.colors.getIndex(target.dataItem.index)
        })

        chart.data = data
        // Legend

        this.chart = chart
      },

      beforeDestroy() {
        clearInterval(this.interval)
      }
    },
    created() {
      this.loadMinhaEvolucaoSupervisor()
    },
    watch: {
      indicadorSelecionado() {
        this.gerarGraficoMinhaEvolucaoSupervisor()
      },
      minhaEvolucaoSupervisor() {
        this.gerarGraficoMinhaEvolucaoSupervisor()
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
