<template>
  <v-card>
    <title-negative-margin
      title="Checkout Reclamações"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-col>
      <v-row>
        <fieldset>
          <legend>Dados Checkout</legend>
          <v-row>
            <v-col
              class="py-0"
              v-for="(item, i) in listFieldDadosCheckout"
              :key="'A' + i"
              :cols="item.cols"
            >
              <component
                :is="item.component"
                :label="item.label"
                :value="formCheckoutContigencia[item.model]"
                :isMasks="item.isMasks"
                :disabled="item.isDisabled"
                :readonly="item.readonly"
                :propsMasks="item.masks"
              ></component>
            </v-col>
          </v-row>
        </fieldset>
        <fieldset>
          <legend>Tratativa Checkout</legend>
          <v-row>
            <v-col style="padding: 0px 12px 0px 12px">
              <v-select
                label="Existe Protocolo Aberto Para Este Contrato?"
                v-model="formTratativaContigencia.existeProtocolo"
                :items="simNao"
                :disabled="formCheckoutContigencia.numeroLinha == null"
                text="TEXT"
                value2="VALUE"
              ></v-select>
            </v-col>
            <v-col
              style="padding: 0px 12px 0px 12px"
              v-show="formTratativaContigencia.existeProtocolo == 'NAO'"
            >
              <v-select
                label="Qual Ação foi Realizada?"
                v-model="formTratativaContigencia.acaoRealizada"
                :items="listAcaoRealizada"
                text="TEXT"
                value2="VALUE"
              ></v-select>
            </v-col>
            <v-col
              style="padding: 0px 12px 0px 12px"
              v-show="
                formTratativaContigencia.existeProtocolo == 'NAO' &&
                formTratativaContigencia.acaoRealizada
              "
            >
              <v-select
                label="Houve Isenção da Multa?"
                v-model="formTratativaContigencia.isencaoMulta"
                :items="simNao"
                text="TEXT"
                value2="VALUE"
              ></v-select>
            </v-col>
            <v-col
              style="padding: 0px 12px 0px 12px"
              v-show="
                formTratativaContigencia.existeProtocolo == 'NAO' &&
                formTratativaContigencia.isencaoMulta
              "
            >
              <v-select
                label="Necessário efetuar contestação de valores?"
                v-model="formTratativaContigencia.contestacaoValores"
                :items="simNao"
                text="TEXT"
                value2="VALUE"
              ></v-select>
            </v-col>
            <v-col
              style="padding: 0px 12px 0px 12px"
              v-show="
                formTratativaContigencia.existeProtocolo == 'NAO' &&
                formTratativaContigencia.contestacaoValores == 'SIM'
              "
            >
              <v-text-field
                label="Valor contestado?"
                v-model="formTratativaContigencia.valorContestado"
                :isMasks="true"
                propsMasks="moeda"
              ></v-text-field>
            </v-col>
            <v-col
              style="padding: 0px 12px 0px 12px"
              v-show="
                formTratativaContigencia.existeProtocolo == 'NAO' &&
                (formTratativaContigencia.contestacaoValores == 'NAO' ||
                  formTratativaContigencia.valorContestado)
              "
            >
              <v-select
                label="Necessário abrir protocolo para outra EPS?"
                v-model="formTratativaContigencia.necessarioProtocoloEps"
                :items="simNao"
                text="TEXT"
                value2="VALUE"
              ></v-select>
            </v-col>
            <v-col
              style="padding: 0px 12px 0px 12px"
              v-show="
                formTratativaContigencia.existeProtocolo == 'NAO' &&
                formTratativaContigencia.necessarioProtocoloEps == 'SIM'
              "
            >
              <v-text-field
                label="Número do Protocolo Gerado?"
                v-model="formTratativaContigencia.protocoloGerado"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              style="padding: 0px 12px 0px 12px"
              v-show="
                formTratativaContigencia.existeProtocolo == 'NAO' &&
                formTratativaContigencia.protocoloGerado
              "
            >
              <v-text-area
                label="Memorando Protocolo"
                v-model="formTratativaContigencia.memorandoProtocolo"
              ></v-text-area>
            </v-col>
          </v-row>
        </fieldset>
      </v-row>
      <v-row justify="end" class="ma-0 pa-0 mt-2">
        <v-btn
          color="blue"
          class="rounded-bl-xl rounded-r-xl mr-2 white--text"
          @click="newCase"
          :disabled="idCaso != null"
        >
          Novo Caso
        </v-btn>
        <v-btn
          color="success"
          class="rounded-bl-xl rounded-r-xl mr-2"
          @click="finalizarAgendarCaso"
          :disabled="!formIsValid()"
        >
          Salvar
        </v-btn>
        <v-btn
          color="orange"
          class="rounded-bl-xl rounded-r-xl mr-2 white--text"
          :disabled="formTratativaContigencia.acaoRealizada != 'AGENDAMENTO' || idCaso == null"
          @click="agendar = true"
        >
          Agendar
        </v-btn>
        <v-btn color="error" class="rounded-bl-xl rounded-r-xl" @click="clearForm">Limpar</v-btn>
      </v-row>
    </v-col>
    <agendar-caso-component
      :abrirSheetFooterAgendar="agendar"
      @updated-close="agendar = !agendar"
      @updated:salvar="finalizarAgendarCaso"
    ></agendar-caso-component>
  </v-card>
</template>

<script>
  import VAutocomplete from '../../../../shared/components/vuetifyComponents/VAutocomplete.vue'
  import VSelect from '../../../../shared/components/vuetifyComponents/VSelect.vue'
  import VTextArea from '../../../../shared/components/vuetifyComponents/VTextArea.vue'
  import VTextField from '../../../../shared/components/vuetifyComponents/VTextField.vue'
  import VInputField from '../../../../shared/components/vuetifyComponents/VInputField.vue'

  import config from '../../../../core/config'
  import AgendarCasoComponent from '../../../../shared/components/bottomSheet/agendamento.vue'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    components: {
      VAutocomplete,
      VSelect,
      VTextArea,
      VTextField,
      VInputField,
      AgendarCasoComponent
    },
    data: () => ({
      idCaso: null,
      formCheckoutContigencia: {
        numeroLinha: null,
        dataAtivacaoMig: null,
        codigoDealer: null,
        telefoneContato: null,
        nomeclaturaPlano: null,
        cpf: null
      },
      formTratativaContigencia: {
        existeProtocolo: null,
        acaoRealizada: null,
        isencaoMulta: null,
        contestacaoValores: null,
        valorContestado: null,
        necessarioProtocoloEps: null,
        protocoloGerado: null,
        memorandoProtocolo: null
      },
      agendar: false,
      existeProtocoloAberto: 'JÁ EXISTE PROTOCOLO ABERTO',
      items: [],
      simNao: [
        { text: 'SIM', value: 'SIM' },
        { text: 'NAO', value: 'NAO' }
      ]
    }),
    mixins: [alerts],
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      itemsList() {
        return {
          simNao: this.simNao,
          listAcaoRealizada: this.listAcaoRealizada
        }
      },
      listAcaoRealizada() {
        let items = this.items
        let novosItems = items
          .filter(e => {
            return e.NOME_CAMPO == 'QUAL_ACAO_REALIZADA?'
          })
          .map(item => {
            return {
              text: item.VALOR_CAMPO,
              value: item.VALOR_CAMPO
            }
          })
        return novosItems
      },
      listFieldDadosCheckout() {
        let fieldsCheckout = [
          {
            id: 1,
            component: 'v-text-field',
            label: 'Número da linha',
            model: 'numeroLinha',
            isDisabled: false,
            readonly: true,
            items: null,
            controleFcr: null,
            dependecies: null,
            valueExpected: null,
            isMasks: true,
            masks: 'telefoneBrFixo',
            cols: 4
          },
          {
            id: 2,
            component: 'v-text-field',
            label: 'Data Ativação ou migração',
            model: 'dataAtivacaoMig',
            items: null,
            isDisabled: false,
            readonly: true,
            controleFcr: null,
            dependecies: null,
            valueExpected: null,
            isMasks: true,
            masks: 'data',
            cols: 4
          },
          {
            id: 3,
            component: 'v-text-field',
            label: 'Código Dealer Ativação/Migração(cod.vendedor):',
            model: 'codigoDealer',
            items: null,
            isDisabled: false,
            readonly: true,
            controleFcr: null,
            dependecies: null,
            valueExpected: null,
            isMasks: false,
            masks: null,
            cols: 4
          },
          {
            id: 4,
            component: 'v-text-field',
            label: 'Telefone para contato:',
            model: 'telefoneContato',
            items: null,
            isDisabled: false,
            readonly: true,
            controleFcr: null,
            dependecies: null,
            valueExpected: null,
            isMasks: true,
            masks: 'telefoneBrFixo',
            cols: 4
          },
          {
            id: 5,
            component: 'v-text-field',
            label: 'CPF:',
            model: 'cpf',
            items: null,
            isDisabled: false,
            readonly: true,
            controleFcr: null,
            dependecies: null,
            valueExpected: null,
            isMasks: true,
            masks: 'cpf',
            cols: 4
          },
          {
            id: 6,
            component: 'v-text-field',
            label: 'Nomenclatura do Plano Cliente:',
            model: 'nomeclaturaPlano',
            items: null,
            isDisabled: false,
            readonly: true,
            controleFcr: null,
            dependecies: null,
            valueExpected: null,
            isMasks: false,
            masks: null,
            cols: 4
          }
        ]
        return fieldsCheckout
      }
    },
    methods: {
      async finalizarAgendarCaso(e) {
        try {
          let data = {
            ofensorAlmaviva:
              this.formTratativaContigencia.existeProtocolo == 'SIM'
                ? this.existeProtocoloAberto
                : this.formTratativaContigencia.ofensorAlmaviva,
            loginOfensor:
              this.formTratativaContigencia.existeProtocolo == 'SIM'
                ? this.existeProtocoloAberto
                : this.formTratativaContigencia.loginOfensor,
            acaoRealizada:
              this.formTratativaContigencia.existeProtocolo == 'SIM'
                ? this.existeProtocoloAberto
                : this.formTratativaContigencia.acaoRealizada,
            isencaoMulta:
              this.formTratativaContigencia.existeProtocolo == 'SIM'
                ? this.existeProtocoloAberto
                : this.formTratativaContigencia.isencaoMulta,
            contestacaoValores:
              this.formTratativaContigencia.existeProtocolo == 'SIM'
                ? this.existeProtocoloAberto
                : this.formTratativaContigencia.contestacaoValores,
            valorContestado: this.formTratativaContigencia.valorContestado,
            necessarioProtocoloEps:
              this.formTratativaContigencia.existeProtocolo == 'SIM'
                ? this.existeProtocoloAberto
                : this.formTratativaContigencia.necessarioProtocoloEps,
            protocoloGerado:
              this.formTratativaContigencia.existeProtocolo == 'SIM'
                ? this.existeProtocoloAberto
                : this.formTratativaContigencia.protocoloGerado,
            idCaso: this.idCaso,
            memorandoProtocolo:
              this.formTratativaContigencia.existeProtocolo == 'SIM'
                ? this.existeProtocoloAberto
                : this.formTratativaContigencia.memorandoProtocolo,
            dataAgendamento: this.formTratativaContigencia.acaoRealizada == 'AGENDAMENTO' ? e : null
          }

          let urlData = `${config.baseUrl}api/shared/formularios/reclamacao_contigencia/alter_status_caso/`
          await this.$api.post(urlData, data)
          this.clearForm()
          this.clearDadosCheckout()
          this.idCaso = null
          this.toast(`Tratativa salva com sucesso!`, 'top-right', false, 4000, 'success')
        } catch (e) {
          this.toast(
            'Oops! Não conseguimos salvar seus dados. Por favor, tente novamente!',
            'top-right',
            false,
            4000,
            'error'
          )
        }
      },
      async newCase() {
        try {
          let urlData = `${config.baseUrl}api/shared/formularios/reclamacao_contigencia/novo_caso/${this.usuarioAlmope}`
          var res = await this.$api.get(urlData)
          this.formCheckoutContigencia.numeroLinha = res.data[0].NUMERO_LINHA
          this.formCheckoutContigencia.dataAtivacaoMig = res.data[0].DATA_ATIV_MIG
          this.formCheckoutContigencia.codigoDealer = res.data[0].CODIGO_DEALER
          this.formCheckoutContigencia.telefoneContato = res.data[0].TELEFONE_CONTATO
          this.formCheckoutContigencia.nomeclaturaPlano = res.data[0].NOMENCLATURA_PLANO
          this.formCheckoutContigencia.cpf = res.data[0].CPF
          this.idCaso = res.data[0].NUM_CASO
          this.toast(
            `Caso Nª: ${res.data[0].NUM_CASO} foi atribuido a você!`,
            'top-right',
            false,
            4000,
            'success'
          )
        } catch (e) {
          this.toast('Ops! Não há casos para tratativa.', 'top-right', false, 4000, 'warning')
        }
      },
      clearForm() {
        let newForm = Object.assign({}, this.formTratativaContigencia)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })

        this.formTratativaContigencia = newForm
      },
      clearDadosCheckout() {
        let newForm = Object.assign({}, this.formCheckoutContigencia)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })

        this.formCheckoutContigencia = newForm
      },
      updateFormField(model, value) {
        this.formTratativaContigencia[model] = value
      },
      isDependecis(typeDependency, dependecis, valueExpected) {
        if (typeDependency == 'esperarValor') {
          if (!dependecis || !valueExpected) return true
          if (valueExpected.includes(this.formTratativaContigencia[dependecis])) {
            return true
          }
          return false
        }
      },
      isNotDependecis(valueExpected) {
        if (!valueExpected) return true
        if (
          this.formTratativaContigencia[valueExpected] == 'AGENDAMENTO' ||
          this.formTratativaContigencia[valueExpected] == null
        ) {
          return false
        }
        return true
      },
      loadDadosCampo() {
        let urlData = `${config.baseUrl}api/shared/formularios/reclamacao_contigencia/listar_dados_campo`
        this.$api.get(urlData).then(res => {
          this.items = res.data
        })
      },
      formIsValid() {
        return (
          this.formTratativaContigencia.existeProtocolo == 'SIM' ||
          (this.formTratativaContigencia.existeProtocolo == 'NAO' &&
            this.formTratativaContigencia.acaoRealizada &&
            this.formTratativaContigencia.isencaoMulta &&
            this.formTratativaContigencia.contestacaoValores == 'SIM' &&
            this.formTratativaContigencia.valorContestado &&
            this.formTratativaContigencia.necessarioProtocoloEps == 'SIM' &&
            this.formTratativaContigencia.protocoloGerado &&
            this.formTratativaContigencia.memorandoProtocolo) ||
          (this.formTratativaContigencia.existeProtocolo == 'NAO' &&
            this.formTratativaContigencia.acaoRealizada &&
            this.formTratativaContigencia.isencaoMulta &&
            this.formTratativaContigencia.contestacaoValores == 'SIM' &&
            this.formTratativaContigencia.valorContestado &&
            this.formTratativaContigencia.necessarioProtocoloEps == 'NAO') ||
          (this.formTratativaContigencia.existeProtocolo == 'NAO' &&
            this.formTratativaContigencia.acaoRealizada &&
            this.formTratativaContigencia.isencaoMulta &&
            this.formTratativaContigencia.contestacaoValores == 'NAO' &&
            this.formTratativaContigencia.necessarioProtocoloEps == 'SIM' &&
            this.formTratativaContigencia.protocoloGerado &&
            this.formTratativaContigencia.memorandoProtocolo) ||
          (this.formTratativaContigencia.existeProtocolo == 'NAO' &&
            this.formTratativaContigencia.acaoRealizada &&
            this.formTratativaContigencia.isencaoMulta &&
            this.formTratativaContigencia.contestacaoValores == 'NAO' &&
            this.formTratativaContigencia.necessarioProtocoloEps == 'NAO')
        )
      }
    },
    created() {
      this.loadDadosCampo()
    }
  }
</script>

<style scoped>
  fieldset {
    color: #333;
    margin: 8px;
    border: 1px solid #eee;
    padding: 10px;
    width: 100%;
  }

  fieldset legend {
    font-size: 18px;
  }
</style>
