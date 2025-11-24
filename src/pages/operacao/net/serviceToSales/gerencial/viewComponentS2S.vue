<template>
  <v-container fluid>
    <component :is="$route.params.id"></component>
  </v-container>
</template>

<script>
  import mtfS2s from './gerencialS2S.component.vue'
  import comboS2s from './gerencialCmS2S.component.vue'

  export default {
    components: { mtfS2s, comboS2s }
  }
</script>

<style></style>
