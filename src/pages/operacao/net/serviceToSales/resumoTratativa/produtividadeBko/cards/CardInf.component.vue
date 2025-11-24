<template>
  <v-col>
    <v-card rounded="xl" elevation="2" min-height="300" class="pa-1">
      <v-card-title class="align-start">
        <span class="font-weight-semibold text-h4">
          Produtividade BKO
          <span v-if="loading" class="">
            <v-progress-circular indeterminate size="25" color="primary"></v-progress-circular>
          </span>
        </span>
        <v-spacer></v-spacer>
        <template v-if="produto == 'NET'">
          <v-btn
            class="mr-2"
            small
            color="deep-purple lighten-1 white--text"
            @click="openRetornarCasos = true"
          >
            <v-icon small class="mr-2">fa-solid fa-person-walking-arrow-loop-left</v-icon>
            Gerenciar Casos
          </v-btn>

          <v-btn
            color="deep-purple lighten-1 white--text"
            small
            @click="liberarCasos = !liberarCasos"
          >
            <v-icon color="white">mdi-list-box-outline</v-icon>
            Liberar agendamentos
          </v-btn>
        </template>
      </v-card-title>
      <v-row class="mx-1 mb-3">
        <v-col xl="2" md="4" sm="4" lg="3" v-for="(list, i) in base" :key="i">
          <v-card class="mx-auto rounded-xl" elevation="0" outlined>
            <v-list-item>
              <v-list-item-content>
                <div>
                  <strong>{{ list.Publico }}</strong>
                </div>
                <v-divider></v-divider>
                <v-list-item-title class="headline mb-1">
                  Total Tratado:{{ list.Qtd_Casos_Tratados | formarNumber }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Mailing Pendente: {{ list.Qtd_Mailing_Pendente }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  (%) Mailing Pendente: {{ formatPercent(list.Perc_Mailing_Pendente) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <LiberarAgendamentoComponent
      :liberarAgendamento="liberarCasos"
      @updated:close="liberarCasos = !liberarCasos"
      @updated:dados-graficos="casosLiberados = true"
    />
    <RetonarCasos
      :openRetornarCasos="openRetornarCasos"
      @update:closeRetornarCasos="openRetornarCasos = !openRetornarCasos"
    />
  </v-col>
</template>

<script>
  import config from '@/core/config'
  import RetonarCasos from '../dialog/RetornarCasos.vue'
  import LiberarAgendamentoComponent from '../dialog/LiberarAgendamento.component.vue'
  export default {
    components: { RetonarCasos, LiberarAgendamentoComponent },
    props: {
      produto: {
        type: String,
        default: ''
      },
      base: {
        type: [Array, Object],
        default: () => []
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      tipoFileSelecionada: undefined,
      tipoAgendamentoSelecionado: undefined,
      // listaProdutividadeBko: [],
      tipoFila: [
        { nome: 'BASE OFICIAL', value: 'BASE_OFICIAL' },
        { nome: 'TABULAÇÃO', value: 'TABULACAO' }
      ],
      tipoLiberacaoAgendamento: [
        { nome: 'PERMITIR', value: 1 },
        { nome: 'NÃO PERMITIR', value: 0 }
      ],
      btnDesabilitado: false,
      btnLoadingAgendamento: false,
      liberarCasos: false,
      openRetornarCasos: false
    }),
    computed: {},
    filters: {
      formarNumber(number) {
        if (!number) return

        let result = new Intl.NumberFormat('pt-BR').format(number)
        return result
      }
    },
    methods: {
      inserirEscolhaFila() {
        this.btnDesabilitado = true
        setTimeout(() => {
          let data = {
            alteradoPor: this.$store.getters.usuario.almope,
            tipoFila: this.tipoFileSelecionada
          }
          let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/tipo_fila`
          let getFormData = object =>
            Object.keys(object).reduce((FormData, key) => {
              FormData.append(key, object[key])
              return FormData
            }, new FormData())
          this.$api
            .post(urlData, getFormData(data))
            .then(res => {
              const Toast = this.$swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: toast => {
                  toast.addEventListener('mouseenter', this.$swal.stopTimer)
                  toast.addEventListener('mouseleave', this.$swal.resumeTimer)
                }
              })
              Toast.fire({
                icon: 'success',
                title: res.data
              })
              this.btnDesabilitado = false
              this.filaSelecionada()
            })
            .catch(e => {
              console.error(e)
            })
        }, 2500)
      },
      async filaSelecionada() {
        try {
          let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/fila_selecionada`
          var res = await this.$api.get(urlData)
          this.tipoFileSelecionada = res?.data[0]?.TIPO_FILA ?? ''
        } catch (error) {
          const Toast = this.$swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: toast => {
              toast.addEventListener('mouseenter', this.$swal.stopTimer)
              toast.addEventListener('mouseleave', this.$swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'warning',
            title: error.response.data
          })
        }
      },

      inserirPermissaoAgendamento() {
        this.btnLoadingAgendamento = true
        setTimeout(() => {
          let data = {
            permitirAgendamento: this.tipoAgendamentoSelecionado,
            alteradoPor: this.$store.getters.usuario.almope
          }
          let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/permitir_agendamento`
          let getFormData = object =>
            Object.keys(object).reduce((FormData, key) => {
              FormData.append(key, object[key])
              return FormData
            }, new FormData())
          this.$api.post(urlData, getFormData(data)).then(res => {
            const Toast = this.$swal.mixin({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: toast => {
                toast.addEventListener('mouseenter', this.$swal.stopTimer)
                toast.addEventListener('mouseleave', this.$swal.resumeTimer)
              }
            })
            Toast.fire({
              icon: 'success',
              title: res.data
            })
          })
          this.btnLoadingAgendamento = false
          this.agendamentoSelecionado()
        }, 2500)
      },
      async agendamentoSelecionado() {
        try {
          let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/permitir_agendamento/`
          var res = await this.$api.get(urlData)
          this.tipoAgendamentoSelecionado = res?.data[0]?.PERMITIR_AGENDAMENTO ?? ''
        } catch (error) {
          const Toast = this.$swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: toast => {
              toast.addEventListener('mouseenter', this.$swal.stopTimer)
              toast.addEventListener('mouseleave', this.$swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'warning',
            title: error.response.data
          })
        }
      },
      formatPercent(value) {
        if (value) {
          return (value * 100).toFixed(2).concat('%')
        } else {
          return 0
        }
      },
      formatTempoTratativa(value) {
        if (value) {
          return Math.round(value)
        } else {
          return 0
        }
      }
      // loadListaProdutividadeBko() {
      //   let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/produtividade_bko`;
      //   this.$api.get(urlData).then((res) => {
      //     this.listaProdutividadeBko = res.data;
      //   });
      // },
    },
    created() {
      this.filaSelecionada()
      this.agendamentoSelecionado()
      // this.loadListaProdutividadeBko();
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Satisfy&display=swap"); */
  #title-seg {
    font-family: 'Satisfy', cursive !important;
  }
  .container-gestao-fila {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .label-gestao h4 {
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
  }

  .swal2-title {
    font-family: 'Montserrat', sans-serif;
  }
</style>
