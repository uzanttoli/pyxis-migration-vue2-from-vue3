<template>
  <v-col>
    <v-col cols="3">
      <!-- <pre>{{ filteredDados }}</pre> -->
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Pesquisar"
        single-line
        hide-details
      ></v-text-field>
    </v-col>
    <v-row align="center" justify="center" class="mt-5">
      <v-col v-for="(item, i) in filteredDados" :key="i" cols="12" md="4" sm="7">
        <card-download
          :nomePlanilha="item.NOME"
          :fonte="item.FONTE"
          :link="item.ROTA"
        ></card-download>
      </v-col>
    </v-row>
    <div
      v-if="filteredDados == ''"
      style="display: flex; justify-content: center; align-items: center; flex-direction: column"
    >
      <p class="text-h3 grey--text" style="margin-top: 10%">Nada encontrado!</p>
      <p class="mt-n2">Verifique novamente o campo de pesquisa.</p>
    </div>
  </v-col>
</template>

<script>
  import cardDownload from '../../shared/components/cards/cardDownload.vue'
  import config from '../../core/config'
  export default {
    components: { cardDownload },
    data: () => ({
      dados: [],
      search: ''
    }),
    computed: {
      filteredDados() {
        return this.dados.filter(item => {
          return (
            item.NOME.toLocaleLowerCase().match(this.search.toLocaleLowerCase()) ||
            item.FONTE.match(this.search.toLocaleLowerCase())
          )
        })
      }
    },
    methods: {
      loadInfoDownload() {
        let urlBase = `${config.baseUrl}api/download/planilhas/padrao/links/`
        this.$api.get(urlBase).then(res => {
          this.dados = res.data
        })
      }
    },
    created() {
      this.loadInfoDownload()
    }
  }
</script>

<style></style>
