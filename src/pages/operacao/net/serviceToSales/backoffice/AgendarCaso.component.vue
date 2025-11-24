<template>
  <!-- v-model="abrirSheetFooterAgendar" -->
  <v-bottom-sheet
    :model-value="abrirSheetFooterAgendar"
    @update:modelValue="val => $emit('update:abrirSheetFooterAgendar', val)"
    inset
    class="bottom-sheet"
    width="1000"
    persistent
  >
    <!-- <pre>{{ dadosAgenda }}</pre> -->
    <v-sheet class="text-center sheet" height="350px" width="1000">
      <div style="display: flex; flex-direction: row; justify-content: center">
        <div
          style="
            border: 1px solid white;
            width: 500px;
            border-bottom-right-radius: 20px;
            border-bottom-left-radius: 20px;
            color: white;
          "
          class="colorTitle"
        >
          <h2>Gereciamento de agendamento</h2>
        </div>
      </div>
      <div class="my-3">
        <v-col>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="dataConsiderar"
                label="Data do agendamento"
                prepend-inner-icon="fa-sharp fa-solid fa-calendar"
                readonly
                outlined
                filled
                dense
                :disabled="!this.isContactUnSuccessFully()"
              ></v-text-field>
              <v-text-field
                v-model="time"
                label="Hora do agendamento"
                prepend-inner-icon="fa-sharp fa-solid fa-clock"
                outlined
                filled
                dense
                messages="Obs.: Horario de agendamento pode ser editado manualmente!"
                disabled
              ></v-text-field>
              <div>
                <v-btn
                  depressed
                  class="mr-2"
                  color="success"
                  :disabled="!this.agendaIsValid()"
                  @click="agendarCasoActions()"
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
                :min="dateMin"
                :disabled="!this.isContactUnSuccessFully()"
              ></v-date-picker>
            </v-col>
            <v-divider vertical inset></v-divider>
            <v-col cols="12" sm="4" md="4">
              <v-time-picker v-model="time" format="24hr" no-title disabled></v-time-picker>
            </v-col>
          </v-row>
        </v-col>
      </div>
    </v-sheet>
    <load-envio-dados :envioDados="baixandoInfor"></load-envio-dados>
  </v-bottom-sheet>
</template>

<script>
  import loadEnvioDados from '@/shared/components/load/loadHastag.vue'

  // import config from "../../../core/config";
  export default {
    components: { loadEnvioDados },
    props: {
      abrirSheetFooterAgendar: {
        type: Boolean,
        default: false
      },
      dadosAgenda: {
        type: [Object, Array],
        require: true
      }
      // idStatusContatoAtivo: {
      //   type: Number,
      //   require: true,
      // },
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

    computed: {
      computedDateFormat() {
        return this.dateFormate(this.date)
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      dateNow() {
        this.moment.locale('pt-br')
        // Dias futuros para agendamento
        return this.moment()
          .add(
            this.dadosAgenda.itemCausaMacro === 1 ||
              this.dadosAgenda.itemCausaMacro === 2 ||
              this.dadosAgenda.itemCausaMacro === 3
              ? 3
              : 3,
            'days'
          )
          .format('YYYY-MM-DD')
      },
      dateMin() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-MM-DD')
      },
      dataConsiderar() {
        if (
          this.dadosAgenda.statusContato == 2 ||
          this.dadosAgenda.statusContato == 3 ||
          this.dadosAgenda.statusContato == 4 ||
          this.dadosAgenda.motivoPortabilidade == 4 ||
          this.dadosAgenda.motivoPortabilidade == 5 ||
          this.dadosAgenda.motivoPortabilidade == 8
        ) {
          return this.date
        } else {
          return this.dateNow
        }
      }
    },
    methods: {
      isContactUnSuccessFully() {
        return (
          this.dadosAgenda.statusContato == 2 ||
          this.dadosAgenda.statusContato == 3 ||
          this.dadosAgenda.statusContato == 4 ||
          this.dadosAgenda.motivoPortabilidade == 4 ||
          this.dadosAgenda.motivoPortabilidade == 5 ||
          this.dadosAgenda.motivoPortabilidade == 8
        )
      },
      clearContent() {
        this.time = null
        this.date = null
      },
      agendaIsValid() {
        return this.dataConsiderar
      },
      dateFormate(value) {
        if (!value) return

        const [year, month, day] = value.split('-')
        return `${day}/${month}/${year}`
      },
      async agendarCasoActions() {
        this.baixandoInfor = true
        let data = {}
        if (this.dadosAgenda.typeForm == 'ativacao') {
          data = {
            procedimento: 2,
            statusTratamento: 2,
            almope: this.usuarioAlmope,
            casoAtivo:
              this.dadosAgenda.itemCasoAtivo != null
                ? this.dadosAgenda.itemCasoAtivo
                : 5 /**Validacao quando contato for sem sucesso */,
            motivoMacro:
              this.dadosAgenda.itemCausaMacro != null
                ? this.dadosAgenda.itemCausaMacro
                : 15 /**Validacao quando contato for sem sucesso */,
            motivoMicro:
              this.dadosAgenda.itemCausaMicro != null
                ? this.dadosAgenda.itemCausaMicro
                : 226 /**Validacao quando contato for sem sucesso */,
            dataAgendamento: this.dataConsiderar,
            idMailing: this.dadosAgenda.idMailing,
            statusContato: this.dadosAgenda.statusContato,
            observacao:
              this.dadosAgenda.observacao != null
                ? this.dadosAgenda.observacao
                : 'CONTATO REALIZADO SEM SUCESSO' /**Validacao quando contato for sem sucesso */,
            numCaso: this.dadosAgenda.numCaso,
            statusMeioContato: this.dadosAgenda.statusMeioContato
          }
        } else if (this.dadosAgenda.typeForm == 'portabilidade') {
          data = {
            procedimento: 3,
            statusTratamento: 2,
            almope: this.usuarioAlmope,
            casoAtivo: null /**Validacao quando contato for sem sucesso */,
            motivoMacro: null /**Validacao quando contato for sem sucesso */,
            motivoMicro: null /**Validacao quando contato for sem sucesso */,
            dataAgendamento: this.dataConsiderar,
            idMailing: this.dadosAgenda.idMailing,
            statusContato: null,
            observacao:
              this.dadosAgenda.observacao != null
                ? this.dadosAgenda.observacao
                : 'CONTATO REALIZADO SEM SUCESSO' /**Validacao quando contato for sem sucesso */,
            numCaso: this.dadosAgenda.numCaso,
            statusPortabilidade: this.dadosAgenda.statusPortabilidade,
            motivoPortabilidade: this.dadosAgenda.motivoPortabilidade,
            dataAgendPortabilidade: this.dataConsiderar,
            statusMeioContato: this.dadosAgenda.statusMeioContato
          }
        }
        await this.$store.dispatch('atualizarCasoActions', data)
        this.$emit('updated:agendado', { completed: true })
        this.$emit('updated-close')
        this.baixandoInfor = false
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
