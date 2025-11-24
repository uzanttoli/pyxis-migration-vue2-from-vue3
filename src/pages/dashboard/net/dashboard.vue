<template>
  <div>
    <v-col cols="6">
      <v-col cols="12">
        <amchart v-if="absMtf.length > 0" :data="absMtf"></amchart>
      </v-col>
      <v-col cols="12">
        <amchart v-if="absCombo.length > 0" :data="absCombo"></amchart>
      </v-col>
    </v-col>
  </div>
</template>

<script>
  import amchart from '../../../shared/components/charts/amchart'

  export default {
    name: 'dashboard-gerencial',
    components: {
      amchart
    },
    data: () => ({
      campanhasResumo: ['MTF N1 TOTAL', 'COMBO N1 TOTAL']
    }),
    computed: {
      absResumo() {
        let abs = this.$store.getters.absResumo
        abs.forEach(element => {
          element.forEach(subElement => {
            subElement.PERCENT_ABS = parseFloat(subElement.PERCENT_ABS).toFixed(2)
          })
        })
        return abs[0]
      },
      absCombo() {
        let abs = this.$store.getters.absCombo
        abs.forEach(element => {
          element.PERCENT_ABS = parseFloat(element.PERCENT_ABS).toFixed(2)
        })
        return abs
      },
      absMtf() {
        let abs = this.$store.getters.absMtf
        abs.forEach(element => {
          element.PERCENT_ABS = parseFloat(element.PERCENT_ABS).toFixed(2)
        })
        return abs
      },
      absRetencao() {
        return this.$store.getters.absRetencao
      },
      campanhas: {
        get() {
          return this.$store.getters.dashboardCampanhas
        },
        set(campanhas) {
          this.$store.dispatch('setDashboardCampanhas', campanhas)
        }
      }
    },
    methods: {
      loadResumoAbs() {
        this.campanhasResumo.forEach(element => {
          this.$store.dispatch('loadAbsCampanha', element)
        })
      }
    },
    created: function () {
      this.loadResumoAbs()
    }
  }
</script>
