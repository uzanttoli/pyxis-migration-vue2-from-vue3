<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: space-between" class="my-2">
      <div style="display: flex; align-items: center">
        <h2 class="mr-1">Inf. Saldo</h2>
        <download-excel
          :data="items"
          name="DADOS_LOTERIA_PYXIS_SALDO"
          worksheet="DADOS_LOTERIA_PYXIS_SALDO"
        >
          <v-btn icon color="primary">
            <v-icon>fa-solid fa-download</v-icon>
          </v-btn>
        </download-excel>
      </div>
      <div style="display: flex">
        <v-text-field outlined dense placeholder="🏸Pesquisar" v-model="search"></v-text-field>
      </div>
    </div>
    <div>
      <v-data-table
        no-data-text="Concurso finalizado. Sem dados de resgate!"
        :headers="headers"
        :items="items"
        :search="search"
      ></v-data-table>
    </div>
  </div>
</template>

<script>
  import config from '../../../../core/config'
  export default {
    data: () => ({
      closeOnContentClick: false,
      search: null,
      selected: [],
      headers: [
        { text: 'Almope', value: 'ALMOPE', align: 'center' },
        { text: 'Nome', value: 'NOME_COMPRADOR', align: 'center' },
        { text: 'Supervisor', value: 'SUPERVISOR', align: 'center' },
        { text: 'Coordenador', value: 'COORDENADOR', align: 'center' },
        { text: 'Cargo', value: 'CARGO', align: 'center' },
        { text: 'Regional', value: 'REGIONAL', align: 'center' },
        { text: 'Bilhete', value: 'BILHETE', align: 'center' },
        { text: 'Qtd. Compra', value: 'QUANTIDADE_COMPRA', align: 'center' },
        {
          text: 'Bilhetes Restantes',
          value: 'BILHETES_RESTANTES',
          align: 'center'
        }
      ],
      items: []
    }),
    computed: {
      queryId() {
        return this.$route.query.id ? this.$route.query.id : 1000000
      }
    },
    methods: {
      loadInfoSaldo() {
        let urlData = `${config.baseUrl}api/shared/loteria/configuracao/info_saldo_resg/${this.queryId}`
        this.$api.get(urlData).then(res => {
          this.items = res.data
        })
      }
    },
    created() {
      this.loadInfoSaldo()
    },
    watch: {
      queryId: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadInfoSaldo()
        }
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Syne&display=swap"); */
  h2 {
    font-family: 'Syne', sans-serif;
  }
</style>
