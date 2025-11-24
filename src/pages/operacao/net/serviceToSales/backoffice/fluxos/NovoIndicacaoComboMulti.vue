<template>
  <div>
    <section>
      <v-card elevation="0" outlined>
        <title-negative-margin title="Indicação Combo Multi" className="rounded-r-xl">
          <v-btn icon to="/pyxis/service-to-sales/backoffice/">
            <v-icon>fa-solid fa-xmark</v-icon>
          </v-btn>
        </title-negative-margin>
        <validation-observer v-slot="{ invalid, validate }" ref="observer">
          <form @submit.prevent="validate().then(submit)">
            <v-col class="mt-4">
              <fieldset>
                <legend>Análise do caso</legend>
                <v-row>
                  <v-col v-for="(item, i) in items" :key="i" :cols="item.TAMANHOCOL" class="mb-n4">
                    <v-component
                      :is="item.COMPONET"
                      outlined
                      filled
                      dense
                      :placeholder="item.CAMPO"
                      :label="item.CAMPO"
                      :readonly="item.READONLY"
                      :value="dados ? dados[item.VALOR_CAMPO] : ''"
                    ></v-component>
                  </v-col>
                </v-row>
              </fieldset>
              <fieldset>
                <legend>Tratativa do caso</legend>
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
                      name="localizado solar?"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        no-data-text="Sem dados disponíveis"
                        placeholder="Cliente localizado solar?"
                        label="Cliente localizado solar?"
                        :items="simNao"
                        v-model="form.clienteLocalizadoSolar"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col class="mb-n4" cols="3" v-if="form.clienteLocalizadoSolar == 'SIM'">
                    <validation-provider
                      v-slot="{ errors }"
                      name="cliente possui residencial"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        no-data-text="Sem dados disponíveis"
                        placeholder="Cliente possui residencial"
                        label="Cliente possui residencial"
                        item-text="VALOR_CAMPO"
                        :items="itemsClientePossuiResidencial"
                        v-model="form.clientePossuiResidencial"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col class="mb-n4" cols="3" v-if="form.clientePossuiResidencial == 'SIM'">
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
                        v-model="form.ativoCliente"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col
                    class="mb-n4"
                    cols="3"
                    v-if="form.ativoCliente == 'SIM' && form.clientePossuiResidencial == 'SIM'"
                  >
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
                        v-model="form.clienteAtendeu"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col class="mb-n4" cols="3">
                    <!-- v-if="form.clienteAtendeu == 'SIM' && form.clientePossuiResidencial == 'SIM'" -->
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
                        v-model="form.vendaRealizada"
                        @change="
                          form.vendaRealizada == 'NÃO' ? loadFormOptionsParentChange() : false
                        "
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>

                  <!-- v-if="
                      form.vendaRealizada == 'SIM' &&
                      form.clienteAtendeu == 'SIM' &&
                      form.clientePossuiResidencial == 'SIM'
                    " -->
                  <v-col cols="3" class="mb-n4" v-if="form.vendaRealizada == 'SIM'">
                    <validation-provider v-slot="{ errors }" name="Tipo produto" rules="required">
                      <v-autocomplete
                        placeholder="Tipo produto"
                        label="Tipo produto"
                        dense
                        :items="itemsTipoProduto"
                        item-text="VALOR_CAMPO"
                        outlined
                        :error-messages="errors"
                        v-model="form.tipoProduto"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <!-- form.vendaRealizada == 'SIM' &&
                      form.clienteAtendeu == 'SIM' &&
                      form.clientePossuiResidencial == 'SIM' && -->
                  <v-col cols="3" v-if="form.vendaRealizada == 'SIM' && form.tipoProduto">
                    <validation-provider
                      v-slot="{ errors }"
                      name="número contrato"
                      rules="required|min:14"
                    >
                      <v-text-field
                        label="Número contrato"
                        placeholder="Número contrato"
                        v-mask="masks.contratoComCodCidade"
                        outlined
                        dense
                        :error-messages="errors"
                        v-model="form.numContrato"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col
                    cols="3"
                    class="mb-n4"
                    v-if="form.vendaRealizada == 'NÃO' && form.clientePossuiResidencial == 'SIM'"
                  >
                    <validation-provider v-slot="{ errors }" name="Motivo" rules="required">
                      <v-autocomplete
                        placeholder="Motivo"
                        label="Motivo"
                        dense
                        :items="itemsMotivoNaoAceite"
                        item-text="VALOR_CAMPO"
                        outlined
                        :error-messages="errors"
                        v-model="form.motivoNaoVenda"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" v-if="form.clientePossuiResidencial == 'SIM'">
                    <validation-provider v-slot="{ errors }" name="observação" rules="required">
                      <v-textarea
                        placeholder="Observação (Descreva sua tratativa aqui)"
                        label="Observação (Descreva sua tratativa aqui)"
                        outlined
                        dense
                        v-model="form.observacao"
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
                :loading="isSend"
                :disabled="dados == '' || invalid"
                color="success"
              >
                Salvar
              </v-btn>
              <v-btn
                color="warning"
                @click="abrirSheetFooterAgendar = true"
                :disabled="form.clienteAtendeu == null || form.clienteAtendeu == 'SIM'"
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
  import RightSideBarTratativa from '../../../../../backoffice/RightSideBarTratativa.vue'
  import AgendamentoComponent from '../../../../../../shared/components/bottomSheet/agendamento.component.vue'

  import alerts from '../../../../../../mixins/alerts.mixins'
  import { loadFormOptions, loadFormOptionsParent } from '@/utils/formOptions'
  import TratativaIndicacaoMulti from '@/data/services/bko/serviceToSales/indicacaoComboMulti/Tratativa'
  import VTextField from 'vuetify/lib/components/VTextField'
  import VTextArea from 'vuetify/lib/components/VTextarea'
  import masks from '@/shared/masks/masks'
  export default {
    components: {
      ValidationObserver,
      ValidationProvider,
      RightSideBarTratativa,
      AgendamentoComponent,
      VTextArea,
      VTextField
    },
    data: () => ({
      dados: [],
      tabulador: 'INDICACAO COMBO MULTI',
      date: null,
      time: null,
      menu: false,
      abrirSheetFooterAgendar: false,
      simNao: ['SIM', 'NÃO'],
      items: [
        {
          CAMPO: 'Telefone contato',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'NUM_SSID_TELEFONE_INDICACAO',
          ISMASK: false,
          MASCARA: null,
          COMPONET: 'v-text-field'
        },
        {
          CAMPO: 'Nome Contato',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'NOME_CLIENTE_INDICACAO',
          ISMASK: false,
          MASCARA: null,
          COMPONET: 'v-text-field'
        },
        {
          CAMPO: 'CPF',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'CPF_INDICACAO',
          ISMASK: false,
          MASCARA: null,
          COMPONET: 'v-text-field'
        },
        {
          CAMPO: 'Horario Contato',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'MELHOR_HORA_CONTATO_INDICACAO',
          ISMASK: false,
          MASCARA: null,
          COMPONET: 'v-text-field'
        },
        {
          CAMPO: 'Observação Indicação',
          READONLY: true,
          TAMANHOCOL: 12,
          VALOR_CAMPO: 'OBSERVACAO_INDICACAO',
          ISMASK: false,
          MASCARA: null,
          COMPONET: 'v-textarea'
        }
      ],
      isSend: false,
      form: {
        ativoCliente: null,
        clienteAtendeu: null,
        clientePossuiResidencial: null,
        motivoNaoVenda: null,
        observacao: null,
        vendaRealizada: null,
        tipoProduto: null,
        clienteLocalizadoSolar: null,
        numContrato: null
      },
      itemsMotivoNaoAceite: [],
      itemsTipoProduto: [],
      itemsClientePossuiResidencial: [],
      itemsVendaRealizada: []
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
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
      async loadFormOptionsParentChange() {
        await loadFormOptionsParent(
          this.tabulador,
          'MOTIVO NÃO ACEITE',
          'VENDA_REALIZADA',
          'NÃO',
          'itemsMotivoNaoAceite',
          this
        )
      },
      async loadFormOptions() {
        await loadFormOptions(this.tabulador, 'VENDA_REALIZADA', 'itemsVendaRealizada', this)
        await loadFormOptions(
          this.tabulador,
          'CLIENTE_POSSUI_RESIDENCIAL',
          'itemsClientePossuiResidencial',
          this
        )
        await loadFormOptions(this.tabulador, 'TIPO_PRODUTO', 'itemsTipoProduto', this)
      },
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
          const AGENDADO = 2
          await TratativaIndicacaoMulti.saveStatusCase({
            ...this.form,
            numCaso: this.dados.ID,
            dataAgendamento: dataAgendamento,
            statusTratatamento: AGENDADO
          })

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
          const FINALIZADO = 3
          this.isSend = true
          await TratativaIndicacaoMulti.saveStatusCase({
            ...this.form,
            numCaso: this.dados.ID,
            dataAgendamento: null,
            statusTratatamento: FINALIZADO
          })

          this.toast('Caso finalizado!', 'top-right', false, 2500, 'success')
          this.clearForm()
          this.dados = ''
          this.isSend = false
        } catch (e) {
          this.toast(
            'Não foi possivel finalizar o caso, tente novamente!',
            'top-right',
            false,
            2500,
            'warning'
          )
          this.isSend = false
        }
      },
      async novoCaso() {
        const result = await TratativaIndicacaoMulti.getNewCase(this.$store.getters.usuario.almope)
        this.dados = result && result[0]
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
    },
    created() {
      this.loadFormOptions()
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
