<template>
  <v-col :cols="cols" :offset="offset" :order="order" :align-self="alignSelf" class="coluna">
    <slot />
  </v-col>
</template>

<script>
  export default {
    name: 'ui-coluna',
    props: {
      cols: {
        type: [String, Number],
        default: 12 // Define o número de colunas ocupadas (1-12)
      },
      offset: {
        type: [String, Number],
        default: 0 // Define o deslocamento da coluna
      },
      order: {
        type: [String, Number],
        default: 0 // Define a ordem da coluna
      },
      alignSelf: {
        type: String,
        default: 'auto' // Valores possíveis: auto, start, center, end, baseline, stretch
      }
    }
  }
</script>

<style scoped>
  .coluna {
    /* Lindão caso queira alterar o css, já deixei a classe vinculada aqui */
  }
</style>
