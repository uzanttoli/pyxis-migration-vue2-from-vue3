<template>
  <v-card class="mt-2 rounded-xl" v-if="dadosConsulta != ''" elevation="0">
    <v-card-title>{{titleTratado()}}</v-card-title>
    <v-divider></v-divider>
    <v-data-table
      no-data-text="Não há dados no momento"
      class="text-no-wrap"
      dense
      :headers="getHeaders()"
      :items="arrLength()"
    ></v-data-table>
  </v-card>
</template>

<script>
  // import config from "../../../../core/config";
  export default {
    props: {
      nome: {
        type: String
      },
      consulta: {
        type: String
      },
      date: {
        type: String
      },
      dateFim: {
        type: String
      },
      dadosConsulta: {
        type: Array,
        require: true
      },
      fonte: {
        type: String,
        default: 'Não identificado'
      },
      responsavel: {
        type: String,
        default: 'Não identificado'
      }
    },
    data() {
      return {
        nomeColuna: []
      }
    },
    methods: {
      arrLength() {
        let dados = this.dadosConsulta
        let result = []
        for (let i = 0; i < 200; i++) {
          result.push(dados[i])
        }

        return result
      },
      titleTratado() {
        return `<p>Preview Da Base | 200 linhas Superiores | Fonte:  ${this.fonte} | Responsável: ${this.responsavel} </p>`
      },
      getHeaders() {
        let dados = []
        Object.keys(this.dadosConsulta[0]).forEach(item => {
          dados.push({
            text: item,
            value: item,
            align: 'center'
          })
        })

        this.$emit('update:columns-table', dados)
        return dados
      }
    },
    watch: {
      dadosConsulta() {
        return this.fonte, this.responsavel
      }
    }
  }
</script>

<style></style>
