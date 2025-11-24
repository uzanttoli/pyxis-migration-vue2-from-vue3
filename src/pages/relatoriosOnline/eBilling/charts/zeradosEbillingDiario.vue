<template>
  <div v-if="base">
    <apexchart :options="options()" :series="series()"></apexchart>
  </div>
</template>

<script>
  import config from '../../../../core/config.js'
  export default {
    props: {
      agrupamento: {
        type: String,
        default: 'MASSIVO GO'
      }
    },
    data: function () {
      return {
        base: []
      }
    },
    methods: {
      series() {
        let series = [
          {
            name: 'Tabuladas',
            data: []
          }
        ]
        for (let i = 0; i < this.base.length; i++) {
          let qtd = this.base[i].OP_ZERADOS
          series[0].data.push(qtd)
        }
        return series
      },
      options() {
        let xaxis = {
          chart: {
            type: 'bar',
            height: 275
          },
          xaxis: {
            categories: []
          },
          dataLabels: {
            enabled: true
          },
          title: {
            text: 'E-billing Zerados Diário | Pyxis'
          },
          colors: ['#0e808f']
          // fill: {
          //   type: "gradient",
          //   gradient: {
          //     shade: "light",
          //     type: "horizontal",
          //     shadeIntensity: 0.25,
          //     gradientToColors: undefined,
          //     inverseColors: true,
          //     opacityFrom: 0.85,
          //     opacityTo: 0.85,
          //     stops: [50, 0, 100],
          //   },
          // },
        }

        for (let i = 0; i < this.base.length; i++) {
          let date = this.base[i].DATA
          xaxis.xaxis.categories.push(date)
        }
        return xaxis
      },
      loadBase() {
        let urlData = `${config.baseUrl}api/shared/ebilling/ebilling_graf_zerados_diario/${this.agrupamento}`
        this.$api.get(urlData).then(res => {
          this.base = res.data
        })
      }
    },
    watch: {
      agrupamento() {
        this.loadBase()
      }
    },
    created() {
      this.loadBase()
    }
  }
</script>

<style></style>
