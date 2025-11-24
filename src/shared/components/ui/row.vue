<template>
  <v-row :align="align" :justify="justify" :dense="dense" :no-gutters="noGutters" class="linha">
    <slot />
  </v-row>
</template>

<script>
  export default {
    name: 'Linha',
    props: {
      align: {
        type: String,
        default: 'start' // Valores possíveis: start, center, end, baseline, stretch
      },
      justify: {
        type: String,
        default: 'start' // Valores possíveis: start, center, end, space-between, space-around
      },
      dense: {
        type: Boolean,
        default: false // Reduz o espaçamento vertical
      },
      noGutters: {
        type: Boolean,
        default: false // Remove os espaçamentos laterais
      }
    }
  }
</script>

<style scoped>
  .linha {
    /* Lindão caso queira alterar o css, já deixei a classe vinculada aqui */
  }
</style>
