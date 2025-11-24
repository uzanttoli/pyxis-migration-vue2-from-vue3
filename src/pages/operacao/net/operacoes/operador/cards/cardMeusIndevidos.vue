<template>
  <v-card elevation="0">
    <v-card-text v-for="item in Object.entries(meusIndevidos)" :key="item[1].OCORRENCIA">
      <v-row class="ma-4">
        <v-card class="mt-4 mx-auto" width="100%" @click="dialogIndevidos = true">
          <v-sheet
            class="v-sheet--offset mx-auto text-center mt-n6 rounded-br-xl rounded-tl-xl"
            color="secondary"
            elevation="4"
            height="60"
            max-width="calc(100% - 32px)"
          >
            <v-row no-gutters style="height: 100%">
              <v-col align-self="center" class="text-h4 white--text">
                <small>Oc:</small>
                {{ item[1].OCORRENCIA }}
              </v-col>
            </v-row>
          </v-sheet>
          <v-card-text class="pt-0 mt-5">
            <div class="text-h6 font-weight-light mb-2">
              <v-icon class="mr-2" small>mdi-calendar</v-icon>
              {{ item[1].DATA_ABERTURA }}
            </div>
            <div class="subheading font-weight-light grey--text">
              {{ item[1].OBSERVAÇÃO }}
            </div>
            <v-divider class="my-2"></v-divider>
            <v-icon class="mr-2" small>mdi-tag</v-icon>
            <span class="text-caption grey--text font-weight-light">
              Referência: {{ item[1].REFERENCIA }}
            </span>
          </v-card-text>
        </v-card>
      </v-row>
    </v-card-text>
    <v-dialog
      v-model="dialogIndevidos"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card tile>
        <v-toolbar dark flat color="primary">
          <v-btn icon dark @click="dialogIndevidos = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Minhas Indevidas</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="mt-8">
          <listar-indevidos-operador></listar-indevidos-operador>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  const listarIndevidosOperador = () => import('../meusIndevidos/listarIndevidosOperador.vue')
  export default {
    name: 'card-meus-indevidos-operador',
    components: {
      listarIndevidosOperador
    },
    data: () => ({
      dialogIndevidos: false
    }),
    props: {
      usuarioAlmope: {
        type: [String, Number],
        default: null
      }
    },
    computed: {
      meusIndevidos() {
        return this.$store.getters.meusIndevidos
      }
    },
    methods: {
      loadMeusIndevidos() {
        return this.$store.dispatch('loadMeusIndevidos', {
          usuario: this.usuarioAlmope,
          qtd: 50
        })
      },
      suspendSheet() {
        this.height += 20
      }
    },
    watch: {
      usuarioAlmope() {
        this.loadMeusIndevidos()
      }
    },
    created() {
      this.loadMeusIndevidos()
    }
  }
</script>

<style></style>
