<template>
  <v-card
    class="grafico rounded-xl"
    style="min-width: 300px; flex: 1; align-items: end"
    elevation="1"
  >
    <div id="chart" style="margin-top: 15px">
      <apexchart type="line" height="350" :options="chartOptions" :series="chartSeries"></apexchart>
    </div>
  </v-card>
</template>

<script>
  export default {
    props: {
      dadosGrafico: {
        type: [Array, Object]
      },
      chartOptions: {
        type: [Array, Object]
      }
    },
    data: () => ({
      chartSeries: []
    }),
    methods: {
      processarDados() {
        if (!this.dadosGrafico || !Array.isArray(this.dadosGrafico)) return

        const series = [
          { name: 'Atendidas', type: 'column', data: [] },
          { name: 'Interações', type: 'area', data: [] },
          { name: '(%) Ofertas', type: 'line', data: [] }
        ]

        for (let i = 0; i < this.dadosGrafico.length; i++) {
          const dataItem = this.dadosGrafico[i]
          series[0].data.push(dataItem.CHAMADAS_ATEN || 0)
          series[1].data.push(dataItem.INTERACOES || 0)
          series[2].data.push((dataItem.PERC_VISAO * 100).toFixed(2) || 0)
        }

        this.chartSeries = series
      }
    },
    watch: {
      dadosGrafico: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal !== oldVal) {
            this.processarDados()
          }
        }
      }
      // intervalos: {
      //   immediate: true,
      //   handler(newVal, oldVal) {
      //     this.chartOptions.labels = newVal;
      //   },
      // },
    }
  }
</script>

<style></style>
