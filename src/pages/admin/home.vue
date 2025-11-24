<template>
  <div>
    <v-sheet elevation="3">
      <v-col>
        <v-row>
          <v-col cols="6">
            <grafico-acompanhamento-log></grafico-acompanhamento-log>
          </v-col>
          <v-col cols="6">
            <acompanhamento-de-logados></acompanhamento-de-logados>
          </v-col>
        </v-row>
      </v-col>
    </v-sheet>
  </div>
</template>

<script>
  import graficoAcompanhamentoLog from '../../shared/components/charts/graficoAcompanhamentoLogDia.vue'
  import acompanhamentoDeLogados from './table/registroLogado.vue'
  export default {
    name: 'HomeAdm',
    components: {
      acompanhamentoDeLogados,
      graficoAcompanhamentoLog
    },
    data: () => ({
      interval: null
    }),
    computed: {
      filtro() {
        return this.$store.getters.usuario.filtro
      },

      usuarioLogado() {
        return this.$store.getters.usuarioLogado
      }
    },
    methods: {
      clienteIP() {
        this.$store.dispatch('clienteIP')
      },
      loadUsuarioLogado() {
        this.$store.dispatch('loadUsuarioLogado')
      }
    },
    created() {
      this.clienteIP()
      this.loadUsuarioLogado()
    }
  }
</script>

<style scoped></style>
