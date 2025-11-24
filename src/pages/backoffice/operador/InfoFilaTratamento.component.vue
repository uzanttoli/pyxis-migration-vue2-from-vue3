<template>
  <div style="display: flex; flex-direction: row; align-items: center; margin-top: 5px">
    <v-icon color="grey" text x-large class="mr-2">fa-sharp fa-solid fa-folder-open</v-icon>
    <h4 class="mr-1">{{ nomeFila }}: {{ qtdDentroPrazo + qtdForaFora }}</h4>
    <span class="mr-1" style="font-size: 14px">
      (
      <v-icon color="green" text small>fas fa-clipboard-check</v-icon>
      Dentro do Prazo: {{ qtdDentroPrazo }} |
    </span>

    <span style="font-size: 14px">
      <v-icon color="error" text small>fa-solid fa-triangle-exclamation</v-icon>
      Fora do Prazo: {{ qtdForaFora }})
    </span>
  </div>
</template>

<script>
  export default {
    props: {
      nomeFila: {
        type: String,
        default: 'Fila indisponível'
      },
      qtdTotal: {
        type: Number,
        default: 0
      },
      qtdDentroPrazo: {
        type: Number,
        default: 0
      },
      qtdForaFora: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style></style>
