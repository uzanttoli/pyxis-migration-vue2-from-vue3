<template>
  <v-card tile elevation="0" class="rounded-t-xl">
    <v-card class="rounded-t-xl" tile>
      <v-card class="rounded-xl white--text" id="card" tile elevation="0">
        <v-card-title>
          <v-icon class="mr-3" color="white">mdi-gamepad-circle-right</v-icon>
          Análise de perfil
        </v-card-title>
      </v-card>
    </v-card>
    <v-card class="overflow-auto" max-height="650" elevation="0">
      <v-card class="rounded-b-xl mb-1">
        <v-col>
          <Instrucao />
          <Aviso />
        </v-col>
      </v-card>

      <v-card-text>
        <v-container fluid>
          <Stepper @updated:closeQuestionario="emitRecebido" />
        </v-container>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script>
  import Instrucao from './Instrucao.vue'
  import Aviso from './Aviso.vue'
  import Stepper from './Questionario.vue'
  export default {
    components: { Instrucao, Aviso, Stepper },
    data: () => ({}),
    methods: {
      emitRecebido(e) {
        this.$emit('update:questionarioRespondido', e)
      }
    }
  }
</script>

<style scoped>
  #card {
    background: rgb(2, 0, 36);
    background: linear-gradient(
      90deg,
      rgb(0, 183, 255) 0%,
      rgb(0, 183, 255) 5%,
      rgb(255, 48, 255) 100%
    );
  }
</style>
