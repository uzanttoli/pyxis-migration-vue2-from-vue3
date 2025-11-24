<template>
  <v-dialog v-model="dialogDiarioDeBordo" persistent max-width="600px">
    <v-card>
      <title-negative-margin title="Diario de Bordo">
        <v-checkbox
          class="ml-2 mb-4"
          v-model="ocorreuHoje"
          label="Falha ocorreu hoje?"
          color="indigo"
          hide-details
        ></v-checkbox>
        <v-btn icon @click.stop="$emit('closeDialogDiarioDeBordo')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </title-negative-margin>
      <v-spacer></v-spacer>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col class="d-flex">
              <v-select
                label="Informe aqui!"
                outlined
                :items="logBookList"
                item-text="DESCRICAO"
                item-value="ID_FILTRO_DB"
                v-model="formlogBook.ocorrido"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" v-if="!this.ocorreuHoje">
              <v-text-field
                v-model="formlogBook.dataOcorrido"
                label="Data do ocorrido"
                outlined
                v-mask="masks.data"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                label="Descreva aqui!"
                auto-grow
                outlined
                v-model="formlogBook.observacao"
                rows="3"
                row-height="25"
                shaped
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <load-spinner :visible="enviarDados"></load-spinner>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="clearFormLogBook()">Limpar</v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="saveDataLogBook()"
          :disabled="!this.formIsValid()"
        >
          Enviar
        </v-btn>
      </v-card-actions>
      <template>
        <div class="text-center ma-2">
          <v-snackbar v-model="snackbar">
            {{ text }}

            <template v-slot:action="{ attrs }">
              <v-icon color="pink" text v-bind="attrs">mdi-information-outline</v-icon>
            </template>
          </v-snackbar>
        </div>
      </template>
    </v-card>
  </v-dialog>
</template>

<script>
  import masks from '../../../../../shared/masks/masks'
  import loadSpinner from '../../../../../shared/components/load/loadSpinner2.vue'
  export default {
    name: 'DiarioDeBordo',
    props: {
      dialogDiarioDeBordo: {
        type: Boolean,
        default: false
      }
    },
    components: {
      loadSpinner
    },
    data: () => ({
      snackbar: false,
      text: `Data informada não pode ser cadastrada!`,
      enviarDados: false,
      ocorreuHoje: false,
      formlogBook: {
        ocorrido: null,
        dataOcorrido: null,
        observacao: null
      },
      formlogBookDefault: {
        ocorrido: null,
        dataOcorrido: null,
        observacao: null
      }
    }),
    computed: {
      masks() {
        return masks
      },
      validacaoData() {
        let dataConvertida = this.formlogBook.dataOcorrido
        function isValidDate(dateString) {
          // First check for the pattern
          if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false

          // Parse the date parts to integers
          var parts = dateString.split('/')
          var day = parseInt(parts[0], 10)
          var month = parseInt(parts[1], 10)
          var year = parseInt(parts[2], 10)
          var data = new Date()
          var anoAtual = data.getFullYear()
          // Check the ranges of month and year
          if (year < 1000 || year > anoAtual || month == 0 || month > 12) return false

          var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

          // Adjust for leap years
          if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) monthLength[1] = 29

          // Check the range of the day
          return day > 0 && day <= monthLength[month - 1]
        }
        return isValidDate(dataConvertida)
      },
      date() {
        let date = new Date()
        let day = date.getDate().toString()
        let dayFormat = day.length == 1 ? '0' + day : day
        let month = parseInt(date.getMonth() + 1).toString()
        let monthFormat = month.length == 1 ? '0' + month : month
        let year = date.getFullYear()

        return dayFormat + '/' + monthFormat + '/' + year
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      logBookList() {
        let logBookList = this.$store.getters.logBookList
        return logBookList ? logBookList : []
      }
    },
    methods: {
      formIsValid() {
        if (this.ocorreuHoje != true) {
          return (
            this.formlogBook.ocorrido &&
            this.formlogBook.dataOcorrido &&
            this.formlogBook.observacao &&
            this.formlogBook.dataOcorrido.length == 10
          )
        } else {
          return this.formlogBook.ocorrido && this.formlogBook.observacao
        }
      },
      saveDataLogBook() {
        if (this.formlogBook.dataOcorrido > this.date) {
          this.text = 'Data não é valida!'
          this.snackbar = true
          setTimeout(() => {
            this.snackbar = false
          }, 2000)
        } else {
          if (this.validacaoData == true || this.ocorreuHoje == true) {
            this.enviarDados = true
            setTimeout(() => {
              if (this.ocorreuHoje == true) {
                this.formlogBook.almope = this.$store.getters.usuario.almope
                this.formlogBook.dataOcorrido = this.date
                this.$store.dispatch('saveDataLogBook', this.formlogBook).then(() => {
                  this.clearFormLogBook()
                  this.enviarDados = false
                })
              } else {
                this.formlogBook.almope = this.$store.getters.usuario.almope
                this.$store.dispatch('saveDataLogBook', this.formlogBook).then(() => {
                  this.clearFormLogBook()
                  this.enviarDados = false
                })
              }
            }, 3000)
          } else {
            this.snackbar = true
            setTimeout(() => {
              this.snackbar = false
            }, 2000)
          }
        }
      },
      clearFormLogBook() {
        Object.assign(this.formlogBook, this.formlogBookDefault)
      },
      loadLogBookList() {
        this.$store.dispatch('loadLogBookList')
      }
    },
    watch: {
      ocorreuHoje() {
        this.formlogBook.dataOcorrido = ''
      },
      dialogDiarioDeBordo() {
        if (this.dialogDiarioDeBordo == true) {
          this.loadLogBookList()
        }
      }
    }
  }
</script>

<style></style>
