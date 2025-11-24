<template>
  <div class="mt-7" style="display: flex; justify-content: center">
    <v-col xl="6">
      <tabulador></tabulador>
    </v-col>
    <right-side-bar-tratativa :base="dados"></right-side-bar-tratativa>
  </div>
</template>

<script>
  import RightSideBarTratativa from '../../../../backoffice/RightSideBarTratativa.vue'
  import tabulador from './tabulador.vue'
  export default {
    components: { tabulador, RightSideBarTratativa },
    data: () => ({
      dados: []
    })
  }
</script>

<style></style>
