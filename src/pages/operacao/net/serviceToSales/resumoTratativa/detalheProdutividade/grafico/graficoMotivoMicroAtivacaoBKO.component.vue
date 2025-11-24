<template>
  <v-col>
    <v-card class="mt-2">
      <title-negative-margin title="Motivos Micro">
        <v-col class="d-flex" cols="12" sm="2">
          <v-select
            label="Selecione um coordenador"
            dense
            solo
            :items="listarCoordenadores"
            item-text="COORDENADOR"
            no-data-text="Não há items"
            v-model="coordenadorSelecionado"
          ></v-select>
        </v-col>
        <v-col class="d-flex" cols="12" sm="2">
          <v-select
            label="Selecione um submotivo"
            dense
            solo
            no-data-text="Não há items"
            v-model="motivoMacro"
            item-text="MOTIVO_MACRO"
            :items="listarMotivosMacros"
            :disabled="mesSelecionado == ''"
          ></v-select>
        </v-col>
        <v-col class="d-flex" cols="12" sm="2">
          <v-select
            label="Selecione um Ano"
            dense
            solo
            no-data-text="Não há items"
            item-text="MES"
            :items="listarAno"
            v-model="anoSelecionado"
          ></v-select>
        </v-col>
        <v-col class="d-flex" cols="12" sm="2">
          <v-select
            label="Selecione um mês"
            dense
            solo
            no-data-text="Não há items"
            item-text="MES"
            :items="listarMeses"
            v-model="mesSelecionado"
            @change="loadDadosGraficoMotivoMicro()"
          ></v-select>
        </v-col>
      </title-negative-margin>
      <div class="hello" ref="chartdiv"></div>
      <load-envio-dados :envioDados="baixandoInfor"></load-envio-dados>
    </v-card>
  </v-col>
</template>

<script>
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'

  am4core.useTheme(am4themes_animated)
  am4core.options.autoDispose = true

  import config from '@/core/config'
  import loadEnvioDados from '@/shared/components/load/loadHastag.vue'
  export default {
    name: 'graficoMotivoMicroAtivacao',
    components: { loadEnvioDados },
    data: () => ({
      interval: null,
      motivoMacro: 'FORA DA POLITICA',
      coordenadorSelecionado: '',
      mesSelecionado: '',
      anoSelecionado: '',
      baixandoInfor: false,
      listarAno: [2022, 2023],
      listarMeses: [
        {
          MES: 'JANEIRO',
          VALUE: 1
        },
        {
          MES: 'FEVEREIRO',
          VALUE: 2
        },
        {
          MES: 'MARÇO',
          VALUE: 3
        },
        {
          MES: 'ABRIL',
          VALUE: 4
        },
        {
          MES: 'MAIO',
          VALUE: 5
        },
        {
          MES: 'JUNHO',
          VALUE: 6
        },
        {
          MES: 'JULHO',
          VALUE: 7
        },
        {
          MES: 'AGOSTO',
          VALUE: 8
        },
        {
          MES: 'SETEMBRO',
          VALUE: 9
        },
        {
          MES: 'OUTUBRO',
          VALUE: 10
        },
        {
          MES: 'NOVEMBRO',
          VALUE: 11
        },
        {
          MES: 'DEZEMBRO',
          VALUE: 12
        }
      ],
      listarMotivosMacros: []
    }),
    mounted() {
      this.gerarGraficoMotivoAtivacao()
    },
    computed: {
      dadosGraficoMotivoMacro() {
        let dadosGraficoMotivoMacro = this.$store.getters.dadosGraficoMotivoMacro
        return Array.from(dadosGraficoMotivoMacro, ({ MOTIVO_MACRO }) => MOTIVO_MACRO)
      },
      dadosGraficoMotivoMicro() {
        let dadosGraficoMotivoMicro = this.$store.getters.dadosGraficoMotivoMicro
        return dadosGraficoMotivoMicro ? dadosGraficoMotivoMicro : []
      },
      listarCoordenadores() {
        let listarCoordenadores = this.$store.getters.listarCoordenadores
        return listarCoordenadores ? listarCoordenadores : []
      }
    },
    methods: {
      loadMotivoMacro() {
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/lista_motivos_macros`
        this.$api.get(urlData).then(res => {
          this.listarMotivosMacros = res.data
        })
      },
      maiorNumero() {
        let dados = this.dadosGraficoMotivoMicro
        if (dados != '') {
          let maxNum = dados.reduce((prev, current) => {
            return prev.QTD_MOTIVO_MACRO > current.QTD_MOTIVO_MACRO ? prev : current
          })
          return maxNum['MOTIVO_MICRO']
        }
      },
      gerarGraficoMotivoAtivacao() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
        chart.scrollbarX = new am4core.Scrollbar()

        let data = []

        for (let i = 0; i < this.dadosGraficoMotivoMicro.length; i++) {
          data.push({
            motivo: this.dadosGraficoMotivoMicro[i].MOTIVO_MICRO,
            quantidade: this.dadosGraficoMotivoMicro[i].QTD_MOTIVO_MACRO
          })
        }

        prepareParetoData()

        function prepareParetoData() {
          let total = 0

          for (let i = 0; i < data.length; i++) {
            let value = data[i].quantidade
            total += value
          }

          let sum = 0
          for (let i = 0; i < data.length; i++) {
            let value = data[i].quantidade
            sum += value
            data[i].pareto = (sum / total) * 100
          }
        }

        // Create axes
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        categoryAxis.dataFields.category = 'motivo'
        categoryAxis.renderer.grid.template.location = 0
        categoryAxis.renderer.minGridDistance = 60
        categoryAxis.tooltip.disabled = true

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.renderer.minWidth = 50
        valueAxis.min = 0
        valueAxis.cursorTooltipEnabled = false
        valueAxis.renderer.labels.template.disabled = true

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
        label.fontSize = 11
        label.fullWords = false
        label.ellipsis = '5px'
        label.textAlign = 'middle'
        label.parent = categoryAxis
        label.horizontalCenter = 'middle'
        label.verticalCenter = 'middle'
        label.maxWidth = 100

        // Create series
        var series = chart.series.push(new am4charts.ColumnSeries())
        series.sequencedInterpolation = true
        series.dataFields.valueY = 'quantidade'
        series.dataFields.categoryX = 'motivo'
        series.tooltipText = '[{categoryX}: bold]{valueY}[/]'
        series.columns.template.strokeWidth = 0

        series.tooltip.pointerOrientation = 'vertical'

        series.columns.template.column.cornerRadiusTopLeft = 10
        series.columns.template.column.cornerRadiusTopRight = 10
        series.columns.template.column.fillOpacity = 0.8

        var labelBullet = series.bullets.push(new am4charts.LabelBullet())
        labelBullet.label.text = '{valueY}'
        labelBullet.locationY = 0.03
        labelBullet.label.hideOversized = true
        labelBullet.label.fontSize = 15

        // on hover, make corner radiuses bigger
        var hoverState = series.columns.template.column.states.create('hover')
        hoverState.properties.cornerRadiusTopLeft = 0
        hoverState.properties.cornerRadiusTopRight = 0
        hoverState.properties.fillOpacity = 1

        series.columns.template.adapter.add('fill', function (fill, target) {
          return chart.colors.getIndex(target.dataItem.index)
        })

        var paretoValueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        paretoValueAxis.renderer.opposite = true
        paretoValueAxis.min = 0
        paretoValueAxis.max = 100
        paretoValueAxis.strictMinMax = true
        paretoValueAxis.renderer.grid.template.disabled = true
        paretoValueAxis.numberFormatter = new am4core.NumberFormatter()
        paretoValueAxis.numberFormatter.numberFormat = "#'%'"
        paretoValueAxis.cursorTooltipEnabled = false
        paretoValueAxis.renderer.labels.template.disabled = true

        var paretoSeries = chart.series.push(new am4charts.LineSeries())
        paretoSeries.dataFields.valueY = 'pareto'
        paretoSeries.dataFields.categoryX = 'motivo'
        paretoSeries.yAxis = paretoValueAxis
        paretoSeries.tooltipText = "pareto: {valueY.formatNumber('#.0')}%[/]"
        paretoSeries.bullets.push(new am4charts.CircleBullet())
        paretoSeries.strokeWidth = 2
        paretoSeries.stroke = new am4core.InterfaceColorSet().getFor('alternativeBackground')
        paretoSeries.strokeOpacity = 0.5

        // Cursor
        chart.cursor = new am4charts.XYCursor()
        chart.cursor.behavior = 'panX'

        chart.data = data
        this.chart = chart
      },
      loadDadosGraficoMotivoMicro() {
        this.baixandoInfor = true
        if (this.mesSelecionado == '') {
          this.baixandoInfor = false
          return
        } else {
          this.$store
            .dispatch('loadDadosGraficoMotivoMicro', {
              condition: this.coordenadorSelecionado != '' ? 2 : 1,
              motivoMacro: this.motivoMacro,
              coordenador: this.coordenadorSelecionado,
              mes: this.mesSelecionado,
              ano: this.anoSelecionado
            })
            .then(() => {
              this.baixandoInfor = false
            })
        }
      }
    },
    watch: {
      anoSelecionado() {
        this.mesSelecionado = ''
      },
      mesSelecionado() {
        this.loadDadosGraficoMotivoMicro()
      },
      data() {
        this.gerarGraficoMotivoAtivacao()
      },
      motivoMacro() {
        this.loadDadosGraficoMotivoMicro()
      },
      coordenadorSelecionado() {
        this.loadDadosGraficoMotivoMicro()
      },
      coordenador() {
        this.loadDadosGraficoMotivoMicro()
      },
      dadosGraficoMotivoMicro() {
        this.gerarGraficoMotivoAtivacao()
      }
    },
    created() {
      this.gerarGraficoMotivoAtivacao()
      this.loadMotivoMacro()
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
