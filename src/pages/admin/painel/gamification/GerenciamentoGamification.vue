<template>
  <div class="mt-5">
    <v-col class="ma-0 pa-0">
      <configuracao-temporada></configuracao-temporada>
    </v-col>
    <v-row justify="center" align="center" class="mt-2">
      <v-col cols="6">
        <criar-comunicado></criar-comunicado>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import ConfiguracaoTemporada from './ConfiguracaoTemporada.vue'
  import CriarComunicado from './CriarComunicado.vue'
  export default {
    components: { ConfiguracaoTemporada, CriarComunicado }
  }
</script>

<style></style>
