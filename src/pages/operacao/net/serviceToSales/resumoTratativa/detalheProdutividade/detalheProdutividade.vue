<template>
  <section>
    <!-- <v-row class="mt-5" align="center" justify="center">
      <template>
        <v-col v-for="i in 5" :key="i" cols="2">
          <CardResultadoInline
            :title="'item.COLUNA'"
            :icon="'item.MDI_ICON'"
            :valor="'item.VALOR'"
          />
        </v-col>
        <v-divider vertical inset class="" :key="i"></v-divider>
      </template>
    </v-row> -->
    <v-col cols="12" v-for="(item, i) in configDetalheTratativa" :key="i">
      <component
        :is="item.COMPONENT"
        :key="i"
        :title="item.TITULO"
        :icon="item.ICONE_TITULO"
        :numSuperior="item.NUM_SUPERIOR"
        :actionUrl="item.ENDPOINT"
      ></component>
    </v-col>
    <GraficoMotivoMacro />
    <GraficoMotivoMicro />
  </section>
</template>

<script>
  import GraficoMotivoMacro from './grafico/graficoMotivoMacroAtivacaoBKO.component.vue'
  import GraficoMotivoMicro from './grafico/graficoMotivoMicroAtivacaoBKO.component.vue'
  import TabelaDetalheProdutividade from './tabela/tabelaDetalheProdutividade.component.vue'
  // import CardResultadoInline from "../../../../shared/components/cards/cardResultadoInline.vue";

  export default {
    components: {
      GraficoMotivoMacro,
      GraficoMotivoMicro,
      TabelaDetalheProdutividade
      // CardResultadoInline,
    },
    computed: {
      configDetalheTratativa() {
        let configDetalheTratativa = this.$store.getters.configDetalheTratativa
        return configDetalheTratativa ? configDetalheTratativa : []
      }
    },
    methods: {
      loadConfigDetalheTratativa() {
        this.$store.dispatch('loadConfigDetalheTratativa')
      }
    },
    created() {
      this.loadConfigDetalheTratativa()
    }
  }
</script>
<style scoped></style>
