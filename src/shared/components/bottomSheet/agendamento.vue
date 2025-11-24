<template>
  <!-- v-model="abrirSheetFooterAgendar" -->

  <!-- :model-value="dialogModal" @update:modelValue="val => $emit('update:dialogModal', val)" -->

  <v-bottom-sheet
    inset
    class="bottom-sheet"
    width="1000"
    persistent
    :model-value="abrirSheetFooterAgendar"
    @update:modelValue="val => $emit('update:abrirSheetFooterAgendar', val)"
  >
    <v-sheet class="text-center sheet mb-1" height="400px" width="1000">
      <div style="display: flex; flex-direction: row; justify-content: center">
        <div
          style="
            border: 1px solid white;
            width: 600px;
            border-bottom-right-radius: 20px;
            border-bottom-left-radius: 20px;
            color: white;
          "
          class="colorTitle"
        >
          <h2>Gereciamento de agendamento</h2>
        </div>
      </div>

      <v-alert class="pa-2 ma-2" type="error" v-if="dataVencimento">
        A data de agendamento não pode ser superior a {{ dataFormatada(dataVencimentoMenos30) }}.
        Agende com 30min de antecedência!
      </v-alert>

      <div class="my-3">
        <v-col>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="computedDateFormat"
                label="Data do agendamento"
                prepend-inner-icon="fa-sharp fa-solid fa-calendar"
                readonly
                outlined
                filled
                dense
              ></v-text-field>

              <v-text-field
                v-model="time"
                label="Hora do agendamento"
                prepend-inner-icon="fa-sharp fa-solid fa-clock"
                outlined
                filled
                v-mask="masks.hora"
                dense
                messages="Obs.: Horario de agendamento pode ser editado manualmente!"
              ></v-text-field>

              <div>
                <v-btn
                  depressed
                  class="mr-2"
                  color="success"
                  @click="agendarTratamento"
                  :disabled="!this.agendaIsValid()"
                >
                  Concluir
                </v-btn>

                <v-btn depressed color="orange white--text" @click="$emit('updated-close')">
                  Cancelar
                </v-btn>
              </div>
            </v-col>

            <v-divider vertical inset></v-divider>

            <v-col cols="12" sm="4" md="4">
              <v-date-picker
                v-model="date"
                @input="dataAgendamento = false"
                locale="pt"
                no-title
                :min="dateNow"
                :max="dataVencimento"
              ></v-date-picker>
            </v-col>

            <v-divider vertical inset></v-divider>

            <v-col cols="12" sm="4" md="4">
              <v-time-picker
                style="margin-top: -40px"
                v-model="time"
                format="24hr"
                no-title
              ></v-time-picker>
            </v-col>
          </v-row>
        </v-col>
      </div>

      <!-- <div class="my-7">
          <p class="text-caption">O agendamento será realizada para dia</p>
        </div> -->
    </v-sheet>

    <load-envio-dados
      :envioDados="baixandoInfor"
      :activeMsg="true"
      msg="Obtendo informações do segmento... Por favor aguarde!"
    ></load-envio-dados>
  </v-bottom-sheet>
</template>

<script>
  import loadEnvioDados from '../load/loadHastag.vue'
  import masks from '../../../shared/masks/masks'
  // import config from "../../../core/config";
  export default {
    components: { loadEnvioDados },
    props: {
      abrirSheetFooterAgendar: {
        type: Boolean,
        default: false
      },
      numCaso: {
        type: [String, Number]
      },
      observacao: {
        type: String,
        default: null
      },
      acaoParametro: {
        type: Number
      },
      filaProcedure: {
        type: String,
        default: ''
      },
      tipoOcorrencia: {
        type: Number,
        default: 1
      },
      dataVencimento: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      sheet: true,
      horaAgendamento: false,
      modal2: false,
      menu: false,
      modal: false,
      dataAgendamento: false,
      baixandoInfor: false,

      /**ENVIAR INFORMACOES ABAIXO PARA O BANCO */
      time: null,
      date: null
    }),
    // inject: ["message"],

    computed: {
      masks() {
        return masks
      },
      computedDateSend() {
        if (!this.date) return
        let [year, month, day] = this.date.split('-')
        return `${day}_subsData_${month}_subsData_${year} ${this.time}:00`
      },
      computedDateFormat() {
        return this.dateFormate(this.date)
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      dateNow() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-MM-DD')
      },
      horaVencimentoValido() {
        let dataVencimento = this.dataVencimento
        let dataVencFormatada = dataVencimento?.substring(0, 16)
        let dataEscolhida = this.date
        let horaEscolhida = this.time

        let dataCompleta = `${dataEscolhida} ${horaEscolhida}`
        let dataComFormatada = dataCompleta.substring(0, 16)

        let dataDigitada = new Date(dataComFormatada)
        let dataVenc = new Date(dataVencFormatada)

        dataVenc.setMinutes(dataVenc.getMinutes() - 30)

        if (dataDigitada < dataVenc) {
          return true
        } else {
          return false
        }
      },
      dataVencimentoMenos30() {
        let dataVencimento = this.dataVencimento

        let data = new Date(dataVencimento)

        data.setMinutes(data.getMinutes() - 31)
        const formattedDate = `${data.getFullYear()}-${(data.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${data.getDate().toString().padStart(2, '0')} ${data
          .getHours()
          .toString()
          .padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`
        return formattedDate
      }
    },
    methods: {
      dataFormatada(date) {
        if (!date) return
        let data = date.split(' ')
        let dataFormatada = data[0].split('-').reverse('').join('/')

        return `${dataFormatada} ${data[1].substring(0, 5)}`
      },
      clearContent() {
        this.time = null
        this.date = null
      },
      agendaIsValid() {
        return this.time && this.date
      },
      dateFormate(value) {
        if (!value) return

        const [year, month, day] = value.split('-')
        return `${day}/${month}/${year}`
      },
      agendarTratamento() {
        let data = `${this.date} ${this.time}`
        this.$emit('updated:salvar', data)
        this.$emit('updated-close')
      }
    }
  }
</script>

<style scoped>
  .colorTitle {
    background-image: linear-gradient(290deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }

  /* .bottom-sheet {
    border-top-left-radius: 30px !important;
    border-bottom-left-radius: 30px !important;
    bottom: 15px;
    margin-right: 10px !important;
  }
  
  .sheet {
    border-top-left-radius: 30px !important;
    border-bottom-left-radius: 30px !important;
  } */
</style>
