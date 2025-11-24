<template>
  <!-- <v-dialog v-model="dialogTableErrSystem" width="900" persistent> -->
  <v-card>
    <title-negative-margin title="Erro Sistêmico" className="rounded-r-xl"></title-negative-margin>
    <v-divider></v-divider>
    <v-col>
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="3">
              <validation-provider
                v-slot="{ errors }"
                name="nª chamador"
                rules="required|min:14|max:15"
              >
                <v-text-field
                  outlined
                  dense
                  label="Nª Chamador"
                  :error-messages="errors"
                  v-model="formErrorSystem.contact"
                  v-mask="[mask.telefoneBrMovel, mask.telefoneBrFixo]"
                  placeholder="Ex.: (79) 99999-9999"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3" v-if="usuario.produto == 'NET'">
              <validation-provider
                v-slot="{ errors }"
                name="contrato"
                rules="required|min:14|max:14"
              >
                <v-text-field
                  :error-messages="errors"
                  label="Contrato"
                  outlined
                  dense
                  v-model="formErrorSystem.contract"
                  v-mask="[mask.contratoComCodCidade]"
                  placeholder="Ex.: 121/25252525-2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3">
              <validation-provider v-slot="{ errors }" name="data">
                <v-text-field
                  label="Data"
                  outlined
                  :error-messages="errors"
                  :value="dateNow()"
                  disabled
                  dense
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3">
              <validation-provider v-slot="{ errors }" name="hora" rules="required">
                <v-text-field
                  label="Hora"
                  :error-messages="errors"
                  outlined
                  dense
                  v-model="formErrorSystem.hours"
                  v-mask="[mask.hora]"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="mt-n5" v-if="usuario.produto == 'NET'">
              <validation-provider v-slot="{ errors }" name="ramal" rules="required">
                <v-text-field
                  label="Ramal"
                  outlined
                  :error-messages="errors"
                  dense
                  v-model="formErrorSystem.branch"
                  v-mask="[mask.ramal]"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3" v-if="usuario.produto == 'ENEL'">
              <validation-provider v-slot="{ errors }" name="pole" rules="required">
                <v-select
                  label="Pole"
                  outlined
                  :items="['POLE 1', 'POLE 2']"
                  :error-messages="errors"
                  dense
                  v-model="formErrorSystem.pole"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="mt-n5" v-if="usuario.produto == 'ENEL'">
              <validation-provider
                v-slot="{ errors }"
                name="número da pole(ramal)"
                rules="required|numeric"
              >
                <v-text-field
                  placeholder="Nª da pole (ramal)"
                  label="Nª da pole (ramal)"
                  dense
                  outlined
                  v-model="formErrorSystem.numeroPole"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="mt-n5">
              <validation-provider v-slot="{ errors }" name="falha" rules="required">
                <v-select
                  label="Falha"
                  outlined
                  dense
                  :items="failures"
                  item-text="FALHA"
                  :error-messages="errors"
                  item-value="ID_FALHA"
                  v-model="formErrorSystem.failure"
                  no-data-text="Não há itens"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="mt-n5" v-if="usuario.produto == 'NET'">
              <validation-provider v-slot="{ errors }" name="bandeira" rules="required">
                <v-select
                  label="Bandeira"
                  outlined
                  :items="flags"
                  :error-messages="errors"
                  item-text="BANDEIRA"
                  item-value="ID_BANDEIRA"
                  dense
                  v-model="formErrorSystem.flag"
                  no-data-text="Não há itens"
                ></v-select>
              </validation-provider>
            </v-col>
          </v-row>
          <div style="display: flex; justify-content: end; gap: 10px">
            <v-btn type="submit" :disabled="invalid" color="success" :loading="send">Enviar</v-btn>
            <v-btn color="error" @click="clearForm">Limpar</v-btn>
          </div>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>

<script>
  import config from '../../../../core/config'
  import masks from '../../../../shared/masks/masks'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    components: { ValidationObserver, ValidationProvider },
    props: {
      dialogTableErrSystem: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      valid: false,
      send: false,
      interval: null,
      alert: false,
      typeAlert: null,
      msgAlert: '',
      failures: [],
      flags: [],
      formErrorSystem: {
        contact: null,
        contract: null,
        date: null,
        hours: null,
        branch: null,
        failure: null,
        flag: null,
        pole: null,
        numeroPole: null
      }
    }),
    computed: {
      mask() {
        return masks
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    mixins: [alerts],
    methods: {
      dateNow() {
        let date = new Date()
        let day = date.getDate().toString()
        let dayF = day.length == 1 ? '0' + day : day
        let month = (date.getMonth() + 1).toString()
        let monthF = month.length == 1 ? '0' + month : month
        let year = date.getFullYear()

        return dayF + '/' + monthF + '/' + year
      },
      isValidationHours() {
        let hours = this.formErrorSystem.hours
        function isValidHours(hoursValid) {
          // if (!/^\d{1,2}\/\d{1,2}$/.test(hoursValid)) return false;

          var parts = hoursValid.split(':')
          var h = parseInt(parts[0])
          var m = parseInt(parts[1], 10)
          if (h >= '00' && h <= '23') {
            if (m >= '00' && m <= '59') {
              return true
            } else {
              return false
            }
          } else {
            return false
          }
        }
        return isValidHours(hours)
      },
      isValidationDate() {
        let dataConvertida = this.formErrorSystem.date
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
      loadFailuresErrorSystem() {
        let urlData = `${config.baseUrl}api/shared/formularios/tabulator_error_system/failures_system_error`
        this.$api
          .get(urlData)
          .then(res => {
            this.failures = res.data
          })
          .catch(e => {
            console.error(e)
          })
      },
      loadFlagErrorSystem() {
        let urlData = `${config.baseUrl}api/shared/formularios/tabulator_error_system/flag_error_system`
        this.$api
          .get(urlData)
          .then(res => {
            this.flags = res.data
          })
          .catch(e => {
            console.error(e)
          })
      },
      clearForm() {
        let newForm = Object.assign({}, this.formErrorSystem)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formErrorSystem = newForm
        this.$refs.observer.reset()
      },
      async submit() {
        if (this.isValidationHours()) {
          this.send = true
          let urlData = `${config.baseUrl}api/shared/formularios/tabulator_error_system/insert`

          this.formErrorSystem.user = this.usuario.almope
          this.formErrorSystem.date = this.dateNow()
          this.formErrorSystem.produto = this.usuario.produto

          this.$api
            .post(urlData, this.formErrorSystem)
            .then(() => {
              this.clearForm()
              this.send = false
              this.toast('Cadastro realizado!', 'top-right', false, 2500, 'success')
            })
            .catch(error => {
              console.error(error)
              this.send = false
              this.toast('Cadastro não realizado!', 'top-right', false, 2500, 'error')
            })
        } else {
          this.toast('Informe um horário válido!', 'top-right', false, 2500, 'error')
        }
      }
    },
    watch: {},
    created() {
      this.loadFailuresErrorSystem()
      this.loadFlagErrorSystem()
    }
  }
</script>

<style scoped></style>
