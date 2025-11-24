<template>
  <div class="container-bilhete">
    <card-app-bar
      customClass="rounded-xl"
      :minHeight="135"
      style="margin-top: 10px"
      styleCustom="display: flex; height: 135px; padding: 25px; align-items:center; color: #fafafa;"
    >
      <template v-slot:title>
        <h3>
          <v-icon color="white" x-large class="mr-3">fa-solid fa-square-poll-vertical</v-icon>
          Resultados
        </h3>
      </template>
      <template v-slot:imagem>
        <img
          src="../../assets/img/geral/resultado.png"
          style="position: absolute; height: 250px; bottom: -40px; right: 10px"
        />
      </template>
    </card-app-bar>
    <div class="ma-2">*Para exibir o resultado de algum concurso, preencha os campos abaixo!</div>
    <div style="margin: 20px 0 0px 0">
      <div class="container">
        <div style="display: flex; padding: 0; margin: 0">
          <v-autocomplete
            no-data-text="Não há regionais disponiveis"
            dense
            outlined
            label="Selecione uma regional"
            placeholder="Selecione uma regional"
            :items="regionais"
            item-text="CAMPANHA"
            v-model="regionalSelecionada"
            class="mx-2 rounded-bl-xl rounded-r-xl"
          ></v-autocomplete>
          <v-autocomplete
            no-data-text="Não há bilhetes com resultados disponiveis"
            dense
            outlined
            :items="concursosResultados"
            item-text="BILHETE_RESG"
            v-model="concursoSelecionado"
            label="(Ou/E) Bilhete"
            placeholder="(Ou/E) Bilhete"
            class="mx-2 rounded-bl-xl rounded-r-xl"
          ></v-autocomplete>
          <v-btn
            tile
            to="/pyxis/loteria/bilhetes"
            class="rounded-bl-xl rounded-r-xl"
            color="success"
          >
            Voltar
          </v-btn>
        </div>
      </div>
    </div>
    <div>
      <card-resultado-loteria
        :regionalSelecionada="regionalSelecionada"
        :concursoSelecionado="concursoSelecionado"
      ></card-resultado-loteria>
    </div>
  </div>
</template>

<script>
  import cardResultadoLoteria from './painel/cardResultadoLoteria.vue'
  import cardAppBar from '../../shared/components/cards/modern/cardAppBar.vue'

  import config from '../../core/config'
  export default {
    components: {
      cardResultadoLoteria,
      cardAppBar
    },
    data: () => ({
      regionais: [],
      concursosResultados: [],
      regionalSelecionada: '',
      concursoSelecionado: 0
    }),
    methods: {
      loadRegionais() {
        let urlData = `${config.baseUrl}api/shared/regional/portal`
        this.$api.get(urlData).then(res => {
          this.regionais = res.data
        })
      },
      loadConcursosResultaodos() {
        let urlData = `${config.baseUrl}api/shared/loteria/resultado/concursos_disponiveis`
        this.$api.get(urlData).then(res => {
          this.concursosResultados = res.data
        })
      }
    },
    created() {
      this.loadConcursosResultaodos()
      this.loadRegionais()
    }
  }
</script>

<style scoped>
  .container-configuracao {
    padding: 20px;
  }

  .container-bilhete {
    margin-top: 50px;
  }
</style>
