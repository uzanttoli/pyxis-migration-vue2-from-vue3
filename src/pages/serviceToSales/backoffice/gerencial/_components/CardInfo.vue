<template>
  <div>
    <v-card
      min-height="541"
      class="rounded-xl pa-2 d-flex flex-column justify-center align-center"
      elevation="1"
    >
      <v-card-title>Resumo das tratativas</v-card-title>
      <v-progress-circular
        class="my-4"
        :value="
          listDados.length > 0
            ? (listDados[0]['CASOS TRATADOS'] / listDados[0].CONSOLIDADO) * 100
            : 0
        "
        color="red"
        size="160"
        width="8"
      >
        Pendente: {{ listDados.length > 0 ? milhar(listDados[0]['MAILING PENDENTE']) : 0 }}
      </v-progress-circular>
      <v-divider></v-divider>
      <div class="d-flex flex-column justify-space-between rounded-0">
        <span
          v-for="(item, index) in normalizeObj"
          :key="index"
          class="text-capitalize justify-space-between d-flex"
        >
          <strong class="mr-3">{{ item.title ? item.title.toLowerCase() : '' }}:</strong>
          {{ milhar(item.valor ? item.valor : 0) }}
        </span>
      </div>
    </v-card>
  </div>
</template>

<script>
  export default {
    props: {
      listDados: {
        type: Array,
        require: true
      }
    },
    computed: {
      normalizeObj() {
        let dados = this.listDados[0]
        if (!dados) return []
        let dadosArray = []
        for (let key in dados) {
          dadosArray.push({
            title: key,
            valor: dados[key]
          })
        }

        return dadosArray
      }
    },
    methods: {
      milhar(value) {
        if (!value) return '0'
        let num = value * 1
        if (!isNaN(value)) {
          return num.toLocaleString()
        } else {
          return value
        }
      }
    }
  }
</script>

<style scoped>
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
