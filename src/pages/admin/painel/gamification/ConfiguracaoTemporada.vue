<template>
  <div class="container-configuracao">
    <div class="configuracao">
      <h2>
        O gamification está na temporada {{ temporada.ID }} - {{ temporada.NOME_TEMPORADA }} do
        produto {{ temporada.PRODUTO }}. Iniciamos dia {{ convertDate(temporada.DATA_INICIO) }} e
        está previsto para término dia {{ convertDate(temporada.DATA_FIM) }}.
      </h2>
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            fab
            class="ma-2"
            depressed
            small
            v-bind="attrs"
            v-on="on"
            @click="abrirConfiguracaoTemporada = true"
            disabled
          >
            <v-icon>mdi-cog</v-icon>
          </v-btn>
        </template>
        <span>Configurar temporada</span>
      </v-tooltip>
      <modal-configuracao-temporada
        :abrirConfiguracaoTemporada="abrirConfiguracaoTemporada"
      ></modal-configuracao-temporada>
    </div>
    <v-divider></v-divider>
  </div>
</template>

<script>
  import config from '../../../../core/config'
  import ModalConfiguracaoTemporada from './modal/ModalConfiguracaoTemporada.vue'
  export default {
    components: { ModalConfiguracaoTemporada },
    name: 'configuracao-temporada',
    data: () => ({
      temporada: [],
      visivel: 1,
      abrirConfiguracaoTemporada: false
    }),
    filters: {},
    methods: {
      convertDate(value) {
        if (value) {
          let data = value.split('-').reverse().join('/')
          return data
        }
      },
      loadTemporada() {
        let urlData = `${config.baseUrl}api/shared/painel_administrativo/gamification/temporada/${this.visivel}`
        this.$api.get(urlData).then(res => {
          this.temporada = res.data[0]
        })
      }
    },
    created() {
      this.loadTemporada()
    }
  }
</script>

<style scoped>
  .container-configuracao {
    display: flex;
    flex-direction: column;
  }
  .configuracao {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  h2 {
    color: grey;
    text-align: center;
  }
</style>
