<template>
  <div>
    <section>
      <v-card elevation="0" outlined>
        <title-negative-margin title="Tratativa Não cliente" className="rounded-r-xl">
          <v-btn icon to="/pyxis/service-to-sales/backoffice/">
            <v-icon>fa-solid fa-xmark</v-icon>
          </v-btn>
        </title-negative-margin>
        <validation-observer v-slot="{ invalid, validate }" ref="observer">
          <form @submit.prevent="validate().then(submit)">
            <v-col class="mt-4">
              <fieldset>
                <legend>Dados</legend>
                <v-row>
                  <v-col v-for="(item, i) in items" :key="i" :cols="item.TAMANHOCOL" class="mb-n4">
                    <v-text-field
                      outlined
                      dense
                      :placeholder="item.CAMPO"
                      :label="item.CAMPO"
                      :readonly="item.READONLY"
                      :value="dados ? dados[item.VALOR_CAMPO] : ''"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </fieldset>
              <fieldset>
                <legend>Tratativa</legend>
                <v-alert
                  border="bottom"
                  colored-border
                  type="warning"
                  elevation="2"
                  v-show="agendamento"
                >
                  Caso oriundo de agendamento.
                </v-alert>
                <v-row>
                  <v-col class="mb-n4" cols="3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Ativo realizado?"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        no-data-text="Sem dados disponíveis"
                        placeholder="Ativo realizado?"
                        label="Ativo realizado?"
                        :items="simNao"
                        v-model="form.ATIVO_CLIENTE"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col class="mb-n4" cols="3" v-if="form.ATIVO_CLIENTE == 'SIM'">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Cliente atendeu?"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        no-data-text="Sem dados disponíveis"
                        placeholder="Cliente atendeu?"
                        label="Cliente atendeu?"
                        :items="simNao"
                        v-model="form.CLIENTE_ATENDEU_LIG"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col class="mb-n4" cols="3" v-if="form.CLIENTE_ATENDEU_LIG == 'SIM'">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Venda realizada?"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        no-data-text="Sem dados disponíveis"
                        placeholder="Venda realizada?"
                        label="Venda realizada?"
                        :items="simNao"
                        v-model="form.VENDA_REALIZADA"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col class="mb-n4" cols="3" v-if="form.VENDA_REALIZADA == 'SIM'">
                    <v-menu
                      ref="menu"
                      v-model="menu"
                      :close-on-content-click="false"
                      v-model:return-value="date"
                      transition="scale-transition"
                      top
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <validation-provider
                          v-slot="{ errors }"
                          rules="required"
                          name="Previsão de instalação"
                        >
                          <v-text-field
                            v-model="computedDateFormatted"
                            outlined
                            dense
                            :error-messages="errors"
                            label="Previsão de instalação"
                            readonly
                            required
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </validation-provider>
                      </template>
                      <v-date-picker
                        v-model="date"
                        no-title
                        scrollable
                        locale="pt-br"
                        :min="dateNow"
                      >
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
                  <v-col cols="3" class="mb-n4" v-if="form.VENDA_REALIZADA == 'SIM'">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Número do contrato"
                      rules="required|min:14"
                    >
                      <v-text-field
                        placeholder="Número do contrato"
                        label="Número do contrato"
                        dense
                        outlined
                        :error-messages="errors"
                        v-mask="['###/########-#']"
                        v-model="form.CONTRATO_GERADO"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12">
                    <validation-provider v-slot="{ errors }" name="observação" rules="required">
                      <v-textarea
                        placeholder="Observação (Descreva sua tratativa aqui)"
                        label="Observação (Descreva sua tratativa aqui)"
                        outlined
                        dense
                        v-model="form.OBSERVACAO"
                        :error-messages="errors"
                        required
                        counter="255"
                        maxlength="255"
                      ></v-textarea>
                    </validation-provider>
                  </v-col>
                </v-row>
              </fieldset>
            </v-col>
            <div style="display: flex; justify-content: end; gap: 10px; margin: 0 10px 13px 0">
              <v-btn color="info" @click="novoCaso()" :disabled="dados != ''">Novo Caso</v-btn>
              <v-btn
                type="submit"
                :disabled="form.CLIENTE_ATENDEU_LIG == 'NAO' || invalid"
                color="success"
              >
                Salvar
              </v-btn>
              <v-btn
                color="warning"
                @click="abrirSheetFooterAgendar = true"
                :disabled="form.CLIENTE_ATENDEU_LIG == null || form.CLIENTE_ATENDEU_LIG == 'SIM'"
              >
                Agendar
              </v-btn>
              <v-btn color="error" @click="clearForm">Limpar</v-btn>
            </div>
          </form>
        </validation-observer>
      </v-card>
      <RightSideBarTratativa />
    </section>
    <AgendamentoComponent
      :abrirSheetFooterAgendar="abrirSheetFooterAgendar"
      @updated-close="abrirSheetFooterAgendar = !abrirSheetFooterAgendar"
      @updated:salvar="submitAgendamento"
    />
  </div>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import RightSideBarTratativa from '../../../../../../backoffice/RightSideBarTratativa.vue'
  import AgendamentoComponent from '../../../../../../../shared/components/bottomSheet/agendamento.component.vue'

  import config from '../../../../../../../core/config'
  import alerts from '../../../../../../../mixins/alerts.mixins'
  export default {
    components: {
      ValidationObserver,
      ValidationProvider,
      RightSideBarTratativa,
      AgendamentoComponent
    },
    data: () => ({
      dados: [],
      date: null,
      time: null,
      menu: false,
      abrirSheetFooterAgendar: false,
      simNao: ['SIM', 'NAO'],
      items: [
        {
          CAMPO: 'Núm. Caso',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'NUM_CASO',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Telefone Contato 1',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'TEL_CONTATO_1',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Telefone Contato 2',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'TEL_CONTATO_2',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Nome Contato',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'NOME_CONTATO',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'CPF',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'CPF_CLIENTE',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Horario Contato',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'HORARIO_CONTATO',
          ISMASK: false,
          MASCARA: null
        }
      ],
      form: {
        ALMOPE_TRATATIVA: null,
        STATUS_TRATATIVA: null,
        ATIVO_CLIENTE: null,
        CLIENTE_ATENDEU_LIG: null,
        VENDA_REALIZADA: null,
        CONTRATO_GERADO: null,
        OBSERVACAO: null
      }
    }),
    mixins: [alerts],
    computed: {
      agendamento() {
        return this.dados?.DATA_AGENDAMENTO != null
      },
      computedDateFormatted() {
        return this.formatDate(this.date)
      },
      dateNow() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-MM-DD hh:mm:ss')
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      clearForm() {
        let newForm = Object.assign({}, this.form)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.$refs.observer.reset()
        this.form = newForm
      },
      async submitAgendamento(dataAgendamento) {
        try {
          this.form.STATUS_TRATATIVA = 2
          this.form.ALMOPE_TRATATIVA = this.usuarioAlmope
          this.form.DATA_PREV_INSTALACAO = ''
          this.form.DATA_AGENDAMENTO = `${dataAgendamento}:00`
          this.form.NUM_CASO = this.dados.NUM_CASO
          let urlData = `${config.baseUrl}api/shared/service_to_sales/nao_cliente/tratativa/change_status`
          await this.$api.post(urlData, this.form)
          this.toast('Agendamento realizado com sucesso!', 'top-right', false, 2500, 'success')
          this.clearForm()
          this.dados = ''
        } catch (e) {
          this.toast(
            'Agendamento não realizado, tente novamente!',
            'top-right',
            false,
            2500,
            'warning'
          )
        }
      },
      async submit() {
        try {
          this.form.STATUS_TRATATIVA = 3
          this.form.ALMOPE_TRATATIVA = this.usuarioAlmope
          this.form.DATA_PREV_INSTALACAO = `${this.date} ${this.time}:00`
          this.form.NUM_CASO = this.dados.NUM_CASO
          let urlData = `${config.baseUrl}api/shared/service_to_sales/nao_cliente/tratativa/change_status`
          await this.$api.post(urlData, this.form)
          this.toast('Caso finalizado!', 'top-right', false, 2500, 'success')
          this.clearForm()
          this.dados = ''
        } catch (e) {
          this.toast(
            'Não foi possivel finalizar o caso, tente novamente!',
            'top-right',
            false,
            2500,
            'warning'
          )
        }
      },
      novoCaso() {
        let urlData = `${config.baseUrl}api/shared/service_to_sales/nao_cliente/tratativa/novo_caso`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuarioAlmope
            }
          })
          .then(res => {
            this.dados = res?.data[0]
          })
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
      }
    }
  }
</script>

<style scoped>
  section {
    padding: 10px;
  }
  fieldset {
    padding: 15px;
    border: 1px solid #3333;
    margin-bottom: 15px;
  }
  legend {
    padding: 0 10px;
    font-size: 20px;
  }
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
