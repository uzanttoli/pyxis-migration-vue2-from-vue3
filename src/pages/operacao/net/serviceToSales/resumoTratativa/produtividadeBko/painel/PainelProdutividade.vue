<template>
  <v-container fluid>
    <v-col cols="12" v-for="(item, i) in configTratativaBko" :key="i">
      <component
        :is="item.COMPONENT"
        :key="i"
        :title="item.TITULO"
        :titleIcon="item.ICONE_TITULO"
        :actionUrl="item.ENDPOINT"
        :data="data"
        :produto="produto"
      ></component>
    </v-col>
  </v-container>
</template>

<script>
  import TabelaProdutividadeOnline from '../table/tableProdutividadeBKO.component.vue'
  export default {
    props: {
      data: {
        type: [Date, String],
        default: () => new Date()
      },
      produto: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      intervalId: null
    }),
    components: {
      TabelaProdutividadeOnline
    },
    computed: {
      configTratativaBko() {
        let config = this.$store.getters.configTratativaBko
        return config ? config : []
      }
    },
    methods: {
      loadConfigTratativaBko() {
        this.$store.dispatch('loadConfigTratativaBko')
      }
    },
    created() {
      this.loadConfigTratativaBko()
    }
  }
</script>

<style></style>
