<template>
  <v-col>
    <v-container fluid>
      <v-data-table :headers="getHeaders" :items="dados" dense class="text-no-wrap"></v-data-table>
    </v-container>
  </v-col>
</template>

<script>
  export default {
    props: {
      dados: {
        type: [Array, Object],
        required: true
      }
    },
    computed: {
      getHeaders() {
        let dados = this.dados[0]
        if (!dados) return
        let header = Object.keys(dados)
          .map((dado, index) => {
            return {
              index: index,
              text: dado,
              value: dado,
              sortable: true,
              class: 'blue accent-3 white--text',
              align: 'center',
              icon: 'mdi-arrow-up'
            }
          })
          .filter(item => {
            if (item.text != 'AGRUPAMENTO') {
              return item
            }
          })
        return header
      }
    }
  }
</script>

<style></style>
