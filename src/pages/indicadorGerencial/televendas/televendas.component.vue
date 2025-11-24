<template>
  <v-sheet v-if="televendasConfig">
    <v-col
      cols="12"
      md="12"
      v-for="(item, i) in televendasConfig"
      :key="i"
      @produtoatual="reloadData()"
    >
      <component
        :is="item.COMPONENT"
        :key="i"
        :title="item.TITULO"
        :titleIcon="item.ICONE_TITULO"
        :actionUrl="item.ENDPOINT"
        :skill="item.SKILL"
        :grouping="item.AGRUPAMENTO"
        :numSuperior="item.NUM_SUPERIOR"
      ></component>
    </v-col>
  </v-sheet>
</template>

<script>
  const tabelaVendasRelatorioDiaDia = () =>
    import('../televendas/table/tabelaVendasRelatorioDiaDia.vue')
  const tabelaVendasGerencialMes = () => import('../televendas/table/tabelaVendasGerencialMes.vue')

  export default {
    name: 'televendas-component',
    components: {
      tabelaVendasRelatorioDiaDia,
      tabelaVendasGerencialMes
    },
    computed: {
      televendasConfig() {
        return this.$store.getters.televendasConfig
      }
    },
    methods: {
      async loadTelevendasConfig() {
        await this.$store.dispatch('loadTelevendasConfig', {
          produto: this.produtoAtual,
          agrupamento: this.agrupamento
        })
      },
      async reloadData() {
        await this.loadTelevendasConfig()
      }
    },
    created() {
      this.reloadData()
    }
  }
</script>
<style></style>
