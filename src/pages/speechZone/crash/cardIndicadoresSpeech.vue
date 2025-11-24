<template>
  <v-card style="margin: 15px 0; position: relative" min-height="220" class="rounded-xl vcard">
    <div class="card-container">
      <div class="circle-primary">
        <div class="circle-secundary">
          <p class="pa-0 ma-0 white--text text-subtitle-1 font-weight-bold">
            {{ indicador }}
          </p>
        </div>
      </div>
      <div class="indicador-info">
        <i :class="iconIndicador"></i>
        <p>
          {{ consolidado }}
        </p>
        <span>Análise</span>
      </div>
      <div class="grafico">
        <grafico-intervalor-speech></grafico-intervalor-speech>
      </div>
    </div>
    <v-btn
      fab
      x-small
      style="position: absolute; right: -15px; top: 45%; background-color: #1bc5d1"
      @click="toggleTable"
    >
      <v-icon color="white">fa-solid fa-plus</v-icon>
    </v-btn>
    <transition name="slide-x">
      <v-data-table
        v-if="isTable"
        key="table"
        no-data-text="Não há dados para serem apresentados"
        :headers="headers"
        :items="itemsData"
      ></v-data-table>
    </transition>
  </v-card>
</template>

<script>
  import graficoIntervalorSpeech from './graficoIntervalorSpeech.vue'
  export default {
    components: { graficoIntervalorSpeech },
    props: {
      consolidado: {
        type: Number,
        default: 0
      },
      indicador: {
        type: String,
        default: 'Indicador'
      },
      iconIndicador: {
        type: String,
        default: 'fa-solid fa-phone'
      }
    },
    data: () => ({
      isTable: false,
      itemsData: [],
      headers: []
    }),
    methods: {
      toggleTable() {
        this.isTable = !this.isTable
      }
    }
  }
</script>

<style scoped>
  .vcard {
    background-image: linear-gradient(290deg, #8f0e8f, #00ecff);
  }

  .card-container {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    /* padding: 10px; */
  }

  .circle-primary {
    height: 200px;
    width: 200px;
    background-color: #f5f5f5;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.35);
  }

  .circle-secundary {
    height: 165px;
    width: 165px;
    /* background-color: #783ff0; */
    background-color: #1bc5d1;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .indicador-info {
    color: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  p {
    margin: 0;
    padding: 0;
  }
  .indicador-info i {
    font-size: 39px;
    box-shadow: inherit;
  }

  .indicador-info p {
    font-size: 32px;
    font-family: 'Jeju Gothic', sans-serif;
  }

  .indicador-indo span {
    font-size: 15px;
    font-family: 'Jeju Gothic', sans-serif;
  }

  .apexcharts-menu {
    display: none !important; /* Oculta o menu do gráfico */
  }

  /* Estilos do card */
  .slide-x-enter-active,
  .slide-x-leave-active {
    transition: transform 0.5s;
  }
  .slide-x-enter,
  .slide-x-leave-to {
    transform: translateY(100%);
  }
</style>
