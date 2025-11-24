<template>
  <v-card class="card" outlined>
    <div class="card__header">
      <v-icon class="icon">mdi-chart-bar</v-icon>
      <h4 class="title">Vendas do Mês</h4>
    </div>
    <v-divider></v-divider>
    <v-card-text>
      <div class="card__body">
        <div class="subtitle-container">
          <h2 class="subtitle">126</h2>
          <v-icon class="icon icon-trend-up"></v-icon>
        </div>
        <div class="caption-container">
          <span class="caption">Vendas realizadas</span>
          <!-- <span class="caption caption--subtle"
                          >+15% em relação ao mês anterior</span
                        > -->
        </div>
        <v-col cols="5" class="d-flex justify-center align-center">
          <v-icon size="70" class="rounded-lg opacity-50">fa-solid fa-chart-simple</v-icon>
        </v-col>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {}
</script>

<style scoped>
  .card {
    /* max-width: 300px; */
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    transition: all 0.2s ease-in-out;
  }

  .card:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
    transform: translateY(-4px);
  }

  .card__header {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 8px 8px 0 0;
  }

  .icon {
    font-size: 24px;
    margin-right: 8px;
    color: #3e3d3d;
  }

  .title {
    display: inline;
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    color: #3e3d3d;
  }

  .card__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
  }

  .subtitle-container {
    display: flex;
    align-items: baseline;
  }

  .subtitle {
    font-size: 32px;
    margin: 0;
    color: #333;
  }

  .icon-trend-up {
    font-size: 18px;
    color: green;
    margin-left: 8px;
  }

  .caption-container {
    display: flex;
    flex-direction: column;
    /* align-items: flex-end; */
  }

  .caption {
    font-size: 14px;
    color: #999;
    margin-top: 8px;
  }

  .caption--subtle {
    font-size: 12px;
    color: #333;
    margin-top: 4px;
  }
</style>
