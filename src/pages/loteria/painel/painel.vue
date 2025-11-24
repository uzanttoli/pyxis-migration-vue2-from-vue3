<template>
  <div class="container-configuracao">
    <v-alert border="left" colored-border color="red accent-4" elevation="2">
      Carregando dados do bilhete 1000000. Para acompanhar outro bilhete selecione uma opção abaixo.
    </v-alert>
    <concursos-em-andamento nameRoute="EditarPainelLoteria"></concursos-em-andamento>
    <aderencia :apiBase="apiRoute"></aderencia>
    <concursos-disponiveis
      style="margin-top: 50px"
      @update:tab-edit="eventTabEdit"
    ></concursos-disponiveis>
    <dados-users-resgate style="margin-top: 50px"></dados-users-resgate>
    <informacoes-saldo style="margin-top: 50px"></informacoes-saldo>
  </div>
</template>

<script>
  import Aderencia from './aderencia.vue'
  import ConcursosDisponiveis from './setting/concursosDisponiveis.vue'
  import DadosUsersResgate from './setting/tableDadosUsersResgate.vue'

  import concursosEmAndamento from '../concursosEmAndamento.vue'
  import InformacoesSaldo from './setting/tableInformacoesSaldo.vue'
  export default {
    components: {
      ConcursosDisponiveis,
      DadosUsersResgate,
      Aderencia,
      concursosEmAndamento,
      InformacoesSaldo
    },
    computed: {
      queryId() {
        return this.$route.query.id ? this.$route.query.id : 1000000
      },
      apiRoute() {
        let url = `api/shared/loteria/configuracao/aderencia_bilhete/${this.queryId}`
        return url
      }
    },
    methods: {
      eventTabEdit(e) {
        this.$emit('update:tab-edit', e)
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Spectral:wght@200&display=swap"); */
  /* @import url("https://fonts.googleapis.com/css2?family=Syne&display=swap"); */
  .container-configuracao {
    padding: 20px;
  }
  h2 {
    font-family: 'Syne', sans-serif;
  }
</style>
