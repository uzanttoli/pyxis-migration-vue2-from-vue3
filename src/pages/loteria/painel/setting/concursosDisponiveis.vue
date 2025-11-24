<template>
  <div>
    <h2 class="my-2">Concursos Disponíveis</h2>
    <div>
      <v-data-table no-data-text="Não há dados no momento" :headers="headers" :items="dados">
        <template v-slot:item.VISIVEL="{ item }">
          <v-icon :color="item.VISIVEL == 1 ? 'success' : 'error'" dense>fa-solid fa-circle</v-icon>
        </template>
        <template v-slot:item.DATA_INICIO="{ item }">{{ formatedData(item.DATA_INICIO) }}</template>
        <template v-slot:item.DATA_FIM="{ item }">{{ formatedData(item.DATA_FIM) }}</template>
        <template v-slot:item.DATA_SORTEIO="{ item }">
          {{ formatedData(item.DATA_SORTEIO) }}
        </template>
        <template v-slot:item.EDITAR="{ item }">
          <v-btn icon @click="editConcurso(item)">
            <v-icon dense>fa-regular fa-pen-to-square</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
  import config from '../../../../core/config'
  export default {
    data: () => ({
      dados: [],
      headers: [
        { text: 'Bilhetes', value: 'BILHETES', align: 'center' },
        { text: 'Concursos', value: 'CONCURSO', align: 'center' },
        { text: 'Criado por', value: 'NOME', align: 'center' },
        { text: 'Data InÍcio', value: 'DATA_INICIO', align: 'center' },
        { text: 'Data Fim', value: 'DATA_FIM', align: 'center' },
        { text: 'Status', value: 'VISIVEL', align: 'center' },
        { text: 'Data do Sorteio', value: 'DATA_SORTEIO', align: 'center' },
        { text: 'Público', value: 'REGIONAL', align: 'center' },
        { text: 'Editar', value: 'EDITAR', align: 'center' }
      ]
    }),
    methods: {
      editConcurso(item) {
        this.$emit('update:tab-edit', item)
      },
      formatedData(value) {
        if (!value) return
        let data = value.split('-').reverse().join('/')
        return data
      },
      loadListDadosConcursos() {
        let urlData = `${config.baseUrl}/api/shared/loteria/configuracao/concursos_ativo/`
        this.$api.get(urlData).then(res => {
          this.dados = res.data
        })
      }
    },
    created() {
      this.loadListDadosConcursos()
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Syne&display=swap"); */
  h2 {
    font-family: 'Syne', sans-serif;
  }
</style>
