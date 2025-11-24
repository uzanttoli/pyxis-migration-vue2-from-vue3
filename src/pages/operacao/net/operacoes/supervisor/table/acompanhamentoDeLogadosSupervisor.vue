<template>
  <v-flex>
    <v-card>
      <title-negative-margin :title="title" icon="mdi-account-multiple-check">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Pesquisar"
          single-line
          hide-details
        ></v-text-field>
      </title-negative-margin>
      <v-data-table
        no-data-text="Ops! Aparentemente ninguem logou ainda..."
        no-results-text="Informação não localizada."
        :headers="headers"
        dense
        multi-sort
        :items="operadoresLogadosPorSupervisor"
        :search="search"
      ></v-data-table>
    </v-card>
  </v-flex>
</template>
<script>
  export default {
    name: 'acompanhamento-de-logados-supervisor',
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
            value: 'ALMOPE'
          },
          {
            text: 'Nome',
            align: 'center',
            value: 'NOME'
          },
          {
            text: 'Supervisor',
            align: 'center',
            value: 'SUPERIOR1'
          },
          {
            text: 'Coordenador',
            align: 'center',
            value: 'SUPERIOR2'
          }
        ]
      }
    },
    computed: {
      usuarioNome() {
        return this.$store.getters.usuario.nome
      },
      operadoresLogadosPorSupervisor() {
        return this.$store.getters.operadoresLogadosPorSupervisor
      }
    },
    methods: {
      loadOperadoresLogadosPorSupervisor() {
        this.$store.dispatch('loadOperadoresLogadosPorSupervisor', this.usuarioNome)
      }
    },
    created() {
      this.loadOperadoresLogadosPorSupervisor()
    }
  }
</script>
