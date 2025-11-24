<template>
  <!-- v-model="dialogPortabilidade" -->
  <v-dialog
    :model-value="dialogPortabilidade"
    @update:modelValue="val => $emit('update:dialogPortabilidade', val)"
    width="1000"
    persistent
    class="rounded-xl"
  >
    <v-card class="rounded-xl">
      <title-negative-margin
        :minWidth="380"
        title="Agendamento - portabilidade"
        className="rounded-l-0 rounded-r-xl"
        icon="fa-regular fa-clock"
      >
        <v-btn icon @click="$emit('update:close-portabilidade')">
          <v-icon>fas fa-close</v-icon>
        </v-btn>
      </title-negative-margin>
      <v-col>
        <v-data-table
          dense
          :headers="getHeaders"
          :items="dados"
          :loading="loading"
          class="text-no-wrap"
          loading-text="Carregando..."
          :footer-props="footerProps"
          no-data-text="Não há portabilidade para acompanhamento"
        >
          <template v-slot:item.ACOES="{ item }">
            <v-btn
              fab
              @click="tratarPortabilidade(item)"
              x-small
              :color="diffDate(item.DATA_AGENDAMENTO_PORTABILIDADE)"
              class="my-1"
            >
              <v-icon color="white">fa-solid fa-plus</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../../../../core/config'
  import alerts from '../../../../../mixins/alerts.mixins'
  export default {
    props: {
      dialogPortabilidade: {
        type: Boolean,
        default: false
      },
      tratativaEmAndamento: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      dados: [],
      loading: false,
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      }
    }),
    mixins: [alerts],
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      getHeaders() {
        let dados = this.dados[0]
        let arrDados = { ACOES: null, ...dados }
        if (!dados) return
        let headers = Object.keys(arrDados).map(item => {
          return {
            text: item,
            value: item,
            sortable: true,
            align: 'center'
          }
        })

        return headers
      }
    },
    methods: {
      tratarPortabilidade(item) {
        if (this.tratativaEmAndamento) {
          this.toast(
            'Você não pode tratar um caso agendado quando há um em andamento. Finalize o caso atual primeiro.',
            'top-right',
            false,
            2000,
            'warning'
          )
        } else {
          let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/dados_portabilidade`
          this.$api
            .get(urlData, {
              params: {
                idMailing: item.ID_MAILING
              }
            })
            .then(res => {
              this.$emit('update:dados-portabilidade', res.data[0])
            })
        }
      },
      diffDate(date) {
        let dateIn = this.moment(date)
        let now = this.moment(new Date())
        let diff = dateIn.diff(now, 'days')
        if (diff < 0) {
          return 'red'
        }
        return 'green'
      },
      loadDadosAgendamentoPortabilidade() {
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/agendamento_portabilidade`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuarioAlmope
            }
          })
          .then(res => {
            this.dados = res.data
            this.loading = false
          })
      }
    },
    watch: {
      dialogPortabilidade: function (val) {
        if (val) {
          this.loadDadosAgendamentoPortabilidade()
        }
      }
    }
  }
</script>

<style></style>
