<template>
  <v-tooltip right>
    <template v-slot:activator="{ attrs, on }">
      <v-icon class="ml-2" size="18" color="blue" v-on="on" v-bind="attrs" style="cursor: pointer">
        fa-regular fa-circle-question
      </v-icon>
    </template>
    <v-card class="rounded-xl" width="200">
      <v-card-title class="pa-2 justify-center">Sumário</v-card-title>
      <v-divider></v-divider>
      <div class="summary-humor">
        <img src="@/assets/img/humor/img-humor-2.0/feliz.png" />
        <span>Feliz</span>
      </div>
      <div class="summary-humor">
        <img src="@/assets/img/humor/img-humor-2.0/animado.png" />
        <span>Animado</span>
      </div>
      <div class="summary-humor">
        <img src="@/assets/img/humor/img-humor-2.0/cansado.png" />
        <span>Cansado</span>
      </div>
      <div class="summary-humor">
        <img src="@/assets/img/humor/img-humor-2.0/chateado.png" />
        <span>Chateado</span>
      </div>
      <div class="summary-humor">
        <img src="@/assets/img/humor/img-humor-2.0/triste.png" />
        <span>Triste</span>
      </div>
    </v-card>
  </v-tooltip>
</template>

<script>
  export default {}
</script>

<style scoped>
  .summary-humor {
    display: flex;
    align-items: center;
    padding: 3px;
    margin: 0 4px;
  }

  .summary-humor:last-child {
    padding-bottom: 10px;
  }

  .summary-humor img {
    height: 25px;
    margin-right: 3px;
  }

  :deep(.v-tooltip__content) {
    box-shadow: none !important;
  }
</style>
