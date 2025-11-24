<template>
  <div class="mx-auto">
    <div style="display: flex; justify-content: end">
      <v-btn icon small @click="graphPausa" v-if="graphPausaIsVisible">
        <v-icon small>fa-solid fa-eye-slash</v-icon>
      </v-btn>
    </div>
    <v-row class="mt-2 mb-2" justify="center" v-if="graphPausaIsVisible">
      <v-col v-for="(item, i) in dadosArrayGraphPausas" :key="i">
        <grafico-pausa
          :agrupamento="item.AGRUPAMENTO"
          :apiUrl="item.ENDPOINT"
          :nameColumn="item.SERIE1"
          :nameArea="item.SERIE2"
          :produtoParams="produtoParams"
        ></grafico-pausa>
      </v-col>
    </v-row>
    <v-row justify="end" align="center" v-else class="mt-1 mr-2">
      <p>
        <v-chip small color="error" @click="graphPausa">Gráfico oculto</v-chip>
        <v-btn icon small @click="graphPausa"><v-icon small>fa-solid fa-eye</v-icon></v-btn>
      </p>
    </v-row>
  </div>
</template>

<script>
  import graficoPausa from '../charts/graphPausas.vue'
  export default {
    components: { graficoPausa },
    props: {
      arrayDados: {
        type: [Array, Object]
      },
      produtoParams: {
        type: String,
        default: 'NET'
      }
    },
    data: () => ({
      graphPausaIsVisible: true
    }),
    computed: {
      dadosArrayGraphPausas() {
        let dados = this.arrayDados
        let abs = dados.filter(item => {
          return item.COMPONENT == 'grafico-pausa'
        })
        return abs
      }
    },
    methods: {
      graphPausa() {
        this.graphPausaIsVisible = !this.graphPausaIsVisible
      }
    }
  }
</script>

<style></style>
