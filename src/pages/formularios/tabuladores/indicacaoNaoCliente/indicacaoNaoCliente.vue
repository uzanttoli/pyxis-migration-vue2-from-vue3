<template>
  <v-card>
    <img style="" src="../../../../assets/img/core/campanhaClaro.png" alt="" />
    <title-negative-margin
      title="Indicação não cliente"
      icon="fa-solid fa-cart-arrow-down"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-col>
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="6" class="my-0 py-0">
              <validation-provider
                v-slot="{ errors }"
                name="Telefone para contato 1"
                rules="required|min:14"
              >
                <v-text-field
                  placeholder="Telefone para contato 1"
                  label="Telefone para contato 1"
                  dense
                  outlined
                  v-mask="[masks.telefoneBrFixo, masks.telefoneBrMovel]"
                  v-model="form.TEL_CONTATO_1"
                  required
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="6" class="my-0 py-0">
              <validation-provider name="Telefone para contato 2">
                <v-text-field
                  placeholder="Telefone para contato 2"
                  label="Telefone para contato 2"
                  dense
                  v-mask="[masks.telefoneBrFixo, masks.telefoneBrMovel]"
                  outlined
                  v-model="form.TEL_CONTATO_2"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="my-0 py-0">
              <validation-provider
                v-slot="{ errors }"
                name="Nome Cliente"
                rules="required|alpha_spaces"
              >
                <v-text-field
                  placeholder="Nome Cliente"
                  label="Nome Cliente"
                  dense
                  outlined
                  v-model="form.NOME_CONTATO"
                  required
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" rules="required|min:14" name="CPF">
                <v-text-field
                  placeholder="CPF Cliente"
                  label="CPF Cliente"
                  dense
                  outlined
                  v-model="form.CPF_CLIENTE"
                  required
                  v-mask="[masks.cpf]"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="my-0 py-0">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                v-model:return-value="date"
                transition="scale-transition"
                offset-x
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="Melhor horário para retorno"
                  >
                    <v-text-field
                      v-model="computedDateFormatted"
                      outlined
                      dense
                      :error-messages="errors"
                      label="Melhor horário para retorno (ativo)"
                      readonly
                      required
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </validation-provider>
                </template>
                <v-date-picker v-model="date" no-title scrollable locale="pt-br" :min="dateNow">
                  <div style="margin-top: -35px; z-index: 1; width: 100%">
                    <v-divider></v-divider>
                    <div style="display: flex; flex-direction: column; margin: 10px 0">
                      <label for="standard">Horário para contato (Obrigatório)</label>
                      <validation-provider
                        v-slot="{ errors }"
                        rules="required"
                        name="horário para contato"
                      >
                        <div style="display: flex; flex-direction: column">
                          <input
                            :style="
                              errors.length > 0
                                ? 'border: 1px solid red;'
                                : 'border: 1px solid #9d9d9d;'
                            "
                            type="time"
                            class="input-time"
                            id="standard"
                            required
                            v-model="time"
                          />
                          <span style="font-size: 11px; color: red">{{ errors[0] }}</span>
                        </div>
                      </validation-provider>
                    </div>
                    <v-spacer></v-spacer>
                    <div style="display: flex; justify-content: end">
                      <v-btn text color="error" @click="menu = false">Cancelar</v-btn>
                      <v-btn text color="success" @click="$refs.menu.save(date)">OK</v-btn>
                    </div>
                  </div>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <div style="display: flex; justify-content: end; gap: 10px">
            <v-btn type="submit" :disabled="invalid" color="success" :loading="send">Salvar</v-btn>
            <v-btn color="error" @click="clearForm">Limpar</v-btn>
          </div>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import masks from '../../../../shared/masks/masks'
  import config from '../../../../core/config'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    components: { ValidationObserver, ValidationProvider },
    data: () => ({
      date: null,
      menu: false,
      time: null,
      form: {
        TEL_CONTATO_1: null,
        TEL_CONTATO_2: null,
        NOME_CONTATO: null
      },
      send: false
    }),
    mixins: [alerts],
    computed: {
      computedDateFormatted() {
        return this.formatDate(this.date)
      },
      dateNow() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-MM-DD hh:mm:ss')
      },
      masks() {
        return masks
      }
    },
    methods: {
      clearForm() {
        let newForm = Object.assign({}, this.form)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.form = newForm
        this.date = null
        this.time = null
        this.$refs.observer.reset()
      },
      formatDate(date) {
        if (!date) return null
        let dateMinutes = new Date()
        let hours = dateMinutes.getHours().toString()
        let hoursF = hours.length == 1 ? '0' + hours : hours

        let minutes = dateMinutes.getMinutes().toString()
        let minutesF = minutes.length == 1 ? '0' + minutes : minutes

        let timeF = `${hoursF}:${minutesF}`

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year} ${this.time ? this.time : timeF}`
      },
      async submit() {
        try {
          this.send = true
          this.form.ALMOPE_CADASTRO = this.$store.getters.usuario.almope
          this.form.HORARIO_CONTATO = `${this.date} ${this.time}:00`
          let urlData = `${config.baseUrl}api/shared/formularios/indicacao_nao_cliente/create`
          await this.$api.post(urlData, this.form)
          this.toast('Indicação cadastrada com sucesso!', 'bottom-right', false, 2500, 'success')
          this.send = false
          this.clearForm()
        } catch (e) {
          this.toast(
            'Indicação não cadastrada, tente novamente!',
            'bottom-right',
            false,
            2500,
            'error'
          )
          this.send = false
        }
      }
    }
  }
</script>

<style scoped>
  label {
    display: block;
    font-size: 0.8em;
    font-weight: bold;
  }

  .input-time {
    padding: 8px;
    border: 1px solid #9d9d9d;
    border-radius: 4px;
  }

  .input-time {
    font-size: 17px;
    color: #616161;
    cursor: pointer;
    line-height: normal;
  }

  .input-time:focus {
    outline: none;
  }
</style>
