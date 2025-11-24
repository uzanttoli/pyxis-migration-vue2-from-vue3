<template>
  <!-- v-model="openAcompPedido" -->
  <v-dialog
    width="800"
    persistent
    :model-value="openAcompPedido"
    @update:modelValue="val => $emit('update:openAcompPedido', val)"
  >
    <v-card>
      <v-card-title
        style="display: flex; justify-content: space-between; align-items: center; margin-top: -5px"
      >
        <span style="align-items: center; display: flex; gap: 10px">
          <v-icon color="orange">fa-solid fa-chart-simple</v-icon>
          Acompanhar pedido (VDI)
        </span>
        <span>
          <v-btn icon @click="$emit('update:close')">
            <v-icon>fas fa-close</v-icon>
          </v-btn>
        </span>
      </v-card-title>
      <v-divider></v-divider>
      <v-col>
        <v-data-table
          no-data-text="Nada tabulado ainda..."
          :items-per-page="5"
          :loading="loading"
          :headers="getHeaders"
          :items="tabulacao"
        >
          <template v-slot:item.STATUS_DISPARO="{ item }">
            <v-tooltip v-if="item.STATUS_DISPARO == 0" right>
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">
                  <i id="icon" class="fa-solid fa-spinner"></i>
                </span>
              </template>
              <span>Abrindo solicitação</span>
            </v-tooltip>
            <v-tooltip v-else-if="item.STATUS_DISPARO == 1" right>
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">
                  <i class="fa-solid fa-circle-check" style="font-size: 20px; color: green"></i>
                </span>
              </template>
              <span>Solicitação aberta</span>
            </v-tooltip>
            <v-tooltip v-else-if="item.STATUS_DISPARO == 3" right>
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">
                  <i class="fa-solid fa-circle-exclamation" style="font-size: 20px; color: red"></i>
                </span>
              </template>
              <span>
                <div style="width: 500px">
                  Ocorreu um erro na abertura da solicitação. Peço ao seu gestor que faça a abertura
                  manual e reporte o erro ao Centro de Controle Operacional.
                </div>
              </span>
            </v-tooltip>
            <v-tooltip v-else-if="item.STATUS_DISPARO == 4" right>
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">
                  <i class="fa-solid fa-lock" style="font-size: 20px; color: red"></i>
                </span>
              </template>
              <span>
                <div style="width: 500px">
                  As credenciais do seu gestor para a abertura do chamado estão incorretas. Solicite
                  que ele entre em contato com o Centro de Controle Operacional
                </div>
              </span>
            </v-tooltip>
            <v-tooltip v-else bottom>
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">
                  <i
                    class="fa-solid fa-triangle-exclamation"
                    style="font-size: 20px; color: orange"
                  ></i>
                </span>
              </template>
              <span>
                Está solicitação não foi aberta, pois
                <br />
                ultrapassou o prazo de 4 horas para abertura.
                <br />
                Caso ainda esteja com problema,
                <br />
                siga nova tabulação e se o erro continuar
                <br />
                acione seu supervisor.
              </span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../../../../core/config'
  export default {
    props: {
      openAcompPedido: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      tabulacao: [],
      loading: false
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      getHeaders() {
        let dados = this.tabulacao[0]
        if (!dados) return

        let headers = Object.keys(dados).map(item => {
          return {
            text: item,
            value: item,
            align: 'center'
          }
        })
        return headers
      }
    },
    methods: {
      loadTabulacao() {
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/automacoes/tabulacao/acomp_dados_tabulado`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuario.almope
            }
          })
          .then(res => {
            this.loading = false
            this.tabulacao = res.data
          })
      }
    },
    created() {},
    watch: {
      openAcompPedido: function (newVal) {
        if (newVal == true) {
          this.loadTabulacao()
          setInterval(() => {
            if (newVal == true) {
              this.loadTabulacao()
            }
          }, 60000)
        }
      }
    }
  }
</script>

<style scoped>
  #icon {
    font-size: 20px;
    color: #333;
    animation: circle infinite 2s linear;
  }

  @keyframes circle {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
