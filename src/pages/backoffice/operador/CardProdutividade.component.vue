<template>
  <v-row>
    <v-col v-for="i in 5" :key="i">
      <CardCss title="Sem título" />
    </v-col>
  </v-row>
</template>

<script>
  import CardCss from '../../../shared/components/cards/cardProdutividadeBko.component.vue'
  export default {
    components: { CardCss }
  }
</script>

<style></style>
