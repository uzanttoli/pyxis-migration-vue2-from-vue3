<template>
  <div class="mx-auto">
    <div style="display: flex; justify-content: end">
      <v-btn icon small @click="graphAbs" v-if="graphAbsIsVisible">
        <v-icon small>fa-solid fa-eye-slash</v-icon>
      </v-btn>
    </div>
    <v-row justify="center" v-if="graphAbsIsVisible">
      <v-col v-for="(item, i) in dadosArrayGraphAbs" :key="i">
        <grafico-abs
          :agrupamento="item.AGRUPAMENTO"
          :apiUrl="item.ENDPOINT"
          :nameColumn="item.SERIE1"
          :nameArea="item.SERIE2"
          :nameColumn2="item.SERIE3 ? item.SERIE3 : '0'"
          :nameLine="item.SERIE4 ? item.SERIE4 : '0'"
          :dados="item"
          :produtoParams="produtoParams"
          :grupo="grupo"
        ></grafico-abs>
      </v-col>
    </v-row>
    <v-row justify="end" align="center" v-else class="mt-1 mr-2">
      <p>
        <v-chip small color="error" @click="graphAbs">Gráfico oculto</v-chip>
        <v-btn icon small @click="graphAbs">
          <v-icon small>fa-solid fa-eye</v-icon>
        </v-btn>
      </p>
    </v-row>
  </div>
</template>

<script>
  import graficoAbs from '../charts/graphAbs.vue'
  export default {
    components: { graficoAbs },
    props: {
      arrayDados: {
        type: [Array, Object]
      },
      produtoParams: {
        type: String,
        default: 'NET'
      },
      grupo: {
        type: [String, Number],
        default: 'N1'
      }
    },
    data: () => ({
      graphAbsIsVisible: true
    }),
    computed: {
      dadosArrayGraphAbs() {
        let dados = this.arrayDados
        let abs = dados.filter(item => {
          return item.COMPONENT == 'grafico-abs'
        })
        return abs
      }
    },
    methods: {
      graphAbs() {
        this.graphAbsIsVisible = !this.graphAbsIsVisible
      }
    }
  }
</script>

<style></style>
