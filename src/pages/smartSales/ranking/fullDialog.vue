<template>
  <!-- v-model="abrirFullRanking" -->

  <v-dialog
    fullscreen
    persistent
    :model-value="abrirFullRanking"
    @update:modelValue="val => $emit('update:abrirFullRanking', val)"
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <ranking-full-screen @update:close="updateClose"></ranking-full-screen>
  </v-dialog>
</template>

<script>
  import RankingFullScreen from './rankingFullScreen.vue'
  export default {
    components: { RankingFullScreen },
    props: {
      abrirFullRanking: {
        Type: Boolean,
        default: false
      }
    },
    methods: {
      updateClose() {
        this.$emit('update:close')
      }
    }
  }
</script>

<style scoped></style>
