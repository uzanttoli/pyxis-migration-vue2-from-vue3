<template>
  <v-card class="mx-auto px-3" elevation="0">
    <v-row class="ma-0 pa-0">
      <v-col cols="12">
        <dados-player-validacao-bencao></dados-player-validacao-bencao>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
  import DadosPlayerValidacaoBencao from './DadosPlayerValidacaoBencao.vue'
  export default {
    components: { DadosPlayerValidacaoBencao },
    data: () => ({
      dadosParaValidacao: []
    })
  }
</script>

<style></style>
