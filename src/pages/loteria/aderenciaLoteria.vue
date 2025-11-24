<template>
  <div class="container-aderencia">
    <v-row justify="end">
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn icon v-bind="attrs" v-on="on" to="/pyxis/loteria/bilhetes">
            <v-icon color="primary">fa-solid fa-person-walking-arrow-loop-left</v-icon>
          </v-btn>
        </template>
        <span>Voltar</span>
      </v-tooltip>
    </v-row>
    <concursos-em-andamento nameRoute="AderenciaLoteria"></concursos-em-andamento>
    <aderencia :apiBase="apiRoute" style="margin-top: 50px"></aderencia>
    <dados-users-resgate style="margin-top: 50px"></dados-users-resgate>
    <informacoes-saldo style="margin-top: 50px"></informacoes-saldo>
  </div>
</template>

<script>
  import concursosEmAndamento from './concursosEmAndamento.vue'
  import aderencia from './painel/aderencia.vue'
  import DadosUsersResgate from './painel/setting/tableDadosUsersResgate.vue'
  import InformacoesSaldo from './painel/setting/tableInformacoesSaldo.vue'
  export default {
    components: {
      aderencia,
      DadosUsersResgate,
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
    }
  }
</script>

<style scoped>
  .container-aderencia {
    padding: 20px;
    margin-top: 25px;
  }
</style>
