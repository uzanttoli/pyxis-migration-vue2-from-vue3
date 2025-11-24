<template>
  <v-col>
    <v-card class="mt-5">
      <title-negative-margin title="Motivos Macro">
        <pre>{{ new Date().get }}</pre>
        <v-col class="d-flex" cols="12" sm="2">
          <v-select
            label="Selecione um Coordenador"
            dense
            solo
            no-data-text="Não há items"
            :items="listarCoordenadores"
            item-text="COORDENADOR"
            v-model="coordenadorSelecionado"
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
            @change="carregarDados()"
          ></v-select>
        </v-col>
      </title-negative-margin>
      <div class="hello" ref="chartdiv"></div>
    </v-card>
  </v-col>
</template>

<script>
  import * as am4core from '@amcharts/amcharts4/core'
  import * as am4charts from '@amcharts/amcharts4/charts'
  import am4themes_animated from '@amcharts/amcharts4/themes/animated'

  am4core.useTheme(am4themes_animated)
  am4core.options.autoDispose = true

  export default {
    name: 'graficoMotivoMacroAtivacao',
    data: () => ({
      interval: null,
      coordenadorSelecionado: '',
      mesSelecionado: '',
      anoSelecionado: '',
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
      ]
    }),
    mounted() {
      this.gerarGraficoMotivoAtivacao()
    },
    computed: {
      // listarMeses() {
      //   let listarMeses = this.$store.getters.listarMeses;
      //   return listarMeses ? listarMeses : [];
      // },

      dadosGraficoMotivoMacro() {
        let dadosGraficoMotivoMacro = this.$store.getters.dadosGraficoMotivoMacro
        return dadosGraficoMotivoMacro ? dadosGraficoMotivoMacro : []
      },
      listarCoordenadores() {
        let listarCoordenadores = this.$store.getters.listarCoordenadores
        // listarCoordenadores.unshift({ COORDENADOR: "" });
        return listarCoordenadores ? listarCoordenadores : []
      }
    },
    methods: {
      carregarDados() {
        this.loadDadosGraficoMotivoMacro()
      },
      gerarGraficoMotivoAtivacao() {
        let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
        chart.scrollbarX = new am4core.Scrollbar()

        let data = []

        for (let i = 0; i < this.dadosGraficoMotivoMacro.length; i++) {
          data.push({
            motivo: this.dadosGraficoMotivoMacro[i].MOTIVO_MACRO,
            quantidade: this.dadosGraficoMotivoMacro[i].QTD_MOTIVO_MACRO
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
      // loadListarMeses() {
      //   this.$store.dispatch("loadListarMeses", {
      //     mes: this.mesSelecionado,
      //     ano: this.anoSelecionado,
      //   });
      // },
      loadDadosGraficoMotivoMacro() {
        if (this.mesSelecionado == '') {
          return
        } else {
          this.$store.dispatch('loadDadosGraficoMotivoMacro', {
            condition: this.coordenadorSelecionado != '' ? 2 : 1,
            coordenador: this.coordenadorSelecionado,
            mes: this.mesSelecionado,
            ano: this.anoSelecionado
          })
        }
      },
      loadListarCoordenadores() {
        this.$store.dispatch('loadListarCoordenadores')
      }
    },
    watch: {
      anoSelecionado() {
        this.mesSelecionado = ''
      },
      mesSelecionado() {
        this.loadDadosGraficoMotivoMacro()
      },
      coordenadorSelecionado() {
        this.loadDadosGraficoMotivoMacro()
      },
      data() {
        this.gerarGraficoMotivoAtivacao()
      },
      dadosGraficoMotivoMacro() {
        this.gerarGraficoMotivoAtivacao()
      }
    },
    created() {
      // this.mesSelecionado = this.moment()
      //   .locale("PT")
      //   .format("MMMM")
      //   .toUpperCase();

      // this.loadDadosGraficoMotivoMacro();
      this.gerarGraficoMotivoAtivacao()
      this.loadListarCoordenadores()
      // this.loadListarMeses();
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
