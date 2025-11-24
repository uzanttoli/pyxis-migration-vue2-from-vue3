<template>
  <v-card class="mb-6">
    <title-negative-margin :title="title" icon="mdi-account-multiple-check">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Pesquisar"
        single-line
        hide-details
        multi-sort
      ></v-text-field>
    </title-negative-margin>
    <v-data-table
      no-data-text="Ops! Aparentemente ninguem logou ainda..."
      no-results-text="Informação não localizada."
      :headers="headers"
      dense
      class="text-no-wrap"
      :items-per-page="15"
      :items="operadoresLogadosPorCoordenador"
      :search="search"
    ></v-data-table>
  </v-card>
</template>
<script>
  export default {
    name: 'AcompanhamentoDeLogadosCoordenador',
    props: {
      title: {
        type: String,
        default: 'Logados na Pyxis'
      }
    },
    data() {
      return {
        search: '',
        headers: [
          {
            text: 'Almope',
            align: 'center',
            sortable: false,
            value: 'ALMOPE'
          },
          {
            text: 'Nome',
            align: 'center',
            sortable: false,
            value: 'NOME'
          },
          {
            text: 'Supervisor',
            align: 'center',
            sortable: false,
            value: 'SUPERIOR1'
          }
        ]
      }
    },
    computed: {
      usuarioNome() {
        return this.$store.getters.usuario.nome
      },
      operadoresLogadosPorCoordenador() {
        return this.$store.getters.operadoresLogadosPorCoordenador
      }
    },
    methods: {
      loadOperadoresLogadosPorCoordenador() {
        this.$store.dispatch('loadOperadoresLogadosPorCoordenador', this.usuarioNome)
      }
    },
    created() {
      this.loadOperadoresLogadosPorCoordenador()
    }
  }
</script>
