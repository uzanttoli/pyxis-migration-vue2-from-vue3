<template>
  <v-col v-if="configTabulador.length > 0">
    <validation-observer ref="observer" v-slot="{ invalid }">
      <template v-for="(item, i) in formField" :key="i">
        <fieldset>
          <legend>{{ item.nome_bloco }}</legend>

          <v-row>
            <v-col>
              <form>
                <v-row>
                  <template v-for="(quest, j) in item.perguntas">
                    <v-col cols="3" class="py-0" v-if="shouldShowField(quest)" :key="j">
                      <validation-provider
                        v-slot="{ errors }"
                        :rules="item.type_bloco == 'write' ? 'required' : 'undefined'"
                        :name="`'${quest.label}'`"
                      >
                        <component
                          v-if="item.type_bloco === 'read'"
                          :value="dadosParaTratativa[quest.vModel]"
                          @input="value => setQuestModel(item, quest, value)"
                          :readonly="item.type_bloco == 'read'"
                          :filled="item.type_bloco == 'read'"
                          :error-messages="errors"
                          :is="quest.type"
                          :placeholder="quest.placeholder"
                          :label="quest.label"
                          :items="quest.items"
                          outlined
                          dense
                          no-data-text="Nenhum dado encontrado"
                        />

                        <component
                          v-if="item.type_bloco === 'write'"
                          v-model="formData[quest.vModel]"
                          @input="value => setQuestModel(item, quest, value)"
                          :readonly="item.type_bloco == 'read'"
                          :filled="item.type_bloco == 'read'"
                          :error-messages="errors"
                          :is="quest.type"
                          :placeholder="quest.placeholder"
                          :label="quest.label"
                          :items="quest.items"
                          outlined
                          dense
                          no-data-text="Nenhum dado encontrado"
                        />
                      </validation-provider>
                    </v-col>
                  </template>
                </v-row>

                <template v-if="item.type_bloco == 'write'">
                  <v-divider class="mt-2"></v-divider>

                  <div class="d-flex justify-end mt-2" style="gap: 5px">
                    <v-btn
                      :disabled="ObjectLength(dadosParaTratativa) > 0"
                      color="info"
                      @click="newCase(configTabulador[0].PARAMETRO_NOVO_CASO)"
                    >
                      Novo caso
                    </v-btn>

                    <v-btn
                      :disabled="invalid"
                      type="button"
                      color="success"
                      @click="handlerSubmit(configTabulador[0].PARAMETRO_SALVAR)"
                      :loading="isSend"
                    >
                      Salvar
                    </v-btn>

                    <v-btn
                      color="warning"
                      :disabled="
                        !opcoesAgendamento
                          .map(item => formData[item.vModel] == item.item)
                          .includes(true)
                      "
                      @click="abrirSheetFooterAgendar = true"
                    >
                      Agendar
                    </v-btn>

                    <v-btn color="error" @click="clearForm()">Limpar</v-btn>
                  </div>
                </template>
              </form>
            </v-col>
          </v-row>
        </fieldset>
      </template>
    </validation-observer>

    <AgendamentoComponent
      :abrirSheetFooterAgendar="abrirSheetFooterAgendar"
      @updated-close="abrirSheetFooterAgendar = !abrirSheetFooterAgendar"
      @updated:salvar="submitAgendamento"
    />

    <CustomNavigationDrawerRightRoot :abrirModal="abrirModal">
      <CustomNavigationDrawerRightSearch v-model="search" />

      <v-divider></v-divider>

      <span style="font-size: 0.7rem">
        <v-icon size="15" color="orange" class="mr-1">fa-solid fa-triangle-exclamation</v-icon>
        Para retornar casos agendados é necessário que você esteja disponivel.
      </span>

      <v-divider></v-divider>

      <v-list-item
        v-for="(item, i) in filterCasosAgendados"
        :key="i"
        @click="liberarAgendamento(item.NUM_CASO)"
        :disabled="dadosParaTratativa != ''"
      >
        <v-list-item-content>
          <v-list-item-subtitle>Contrato: {{ item.NUM_CONTRATO }}</v-list-item-subtitle>

          <v-list-item-subtitle>Cidade: {{ item.NM_CIDADE }}</v-list-item-subtitle>

          <v-list-item-subtitle>Data Agendamento:{{ item.DATA_RETORNO_CASO }}</v-list-item-subtitle>

          <v-list-item-subtitle>Data Venda Bruta: {{ item.DT_VENDA_BRUTA }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </CustomNavigationDrawerRightRoot>
  </v-col>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import {
    FilaService,
    TratativaBkoVendasService
  } from '@/data/services/bko/serviceToSales/index.js'
  import { CustomNavigationDrawerRight } from '@/shared/components/NavigationDrawer'
  import AgendamentoComponent from '@/shared/components/bottomSheet/agendamento.component.vue'
  import VTextField from 'vuetify/lib/components/VTextField'
  import VTextArea from 'vuetify/lib/components/VTextarea'
  import VAutocomplete from 'vuetify/lib/components/VAutocomplete'

  import FormFieldsService from '@/data/services/formOptions/formFields'
  import alerts from '@/mixins/alerts.mixins'
  export default {
    props: {
      abrirModal: Boolean
    },
    components: {
      VTextField,
      VTextArea,
      VAutocomplete,
      ValidationObserver,
      ValidationProvider,
      AgendamentoComponent,
      CustomNavigationDrawerRightRoot: CustomNavigationDrawerRight.Root,
      CustomNavigationDrawerRightSearch: CustomNavigationDrawerRight.Search
    },
    data: () => ({
      tabulador: 'TABULADOR BKO S2S MOVEL',
      formData: {},
      formField: [],
      configTabulador: [],
      dadosParaTratativa: [],
      abrirSheetFooterAgendar: false,
      isSend: false,
      opcoesAgendamento: [],
      casosAgendados: [],
      search: null
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      filterCasosAgendados() {
        const pesquisa = this.search
        if (!pesquisa) return this.casosAgendados
        const result = this.casosAgendados.filter(caso => {
          return (
            caso.NM_CIDADE.toLowerCase().includes(pesquisa.toLowerCase()) ||
            caso.NUM_CONTRATO.toString().includes(pesquisa) ||
            caso.DT_VENDA_BRUTA.includes(pesquisa)
          )
        })
        return result
      }
    },
    mixins: [alerts],
    methods: {
      liberarAgendamento(numCaso) {
        this.swalConfirmation(
          async () => {
            const result = await TratativaBkoVendasService.processarOperacoesTratativas({
              idForm: this.$route.query.idForm,
              segmento: this.$route.params.fila,
              action: this.configTabulador[0].PARAMETRO_LIBERAR_AGEND,
              numOcorrencia: numCaso,
              dataAgendamento: null,
              usuario: this.usuario.almope,
              produto: this.$route.query.queueOf || this.usuario.produto,
              procedureOperation: this.configTabulador[0].FILA_PROCEDURE
            })

            this.dadosParaTratativa = result && result[0]
            await this.listarCasosAgendados()
          },
          'Atenção',
          'Deseja retornar esse caso agora?',
          'Sim',
          'O caso retornará para tratativa',
          '',
          true,
          true
        )
      },
      ObjectLength(object) {
        var length = 0
        for (var key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            ++length
          }
        }
        return length
      },
      setQuestModel(item, quest, value) {
        if (item.type_bloco !== 'read') {
          this.$set(this.formData, quest.vModel, value)
        }
      },
      async listarCasosAgendados() {
        const formularioPreenchido = {
          idForm: this.$route.query.idForm,
          segmento: this.$route.params.fila,
          action: this.configTabulador[0].PARAMETRO_EXIBIR_AGEND,
          numOcorrencia: null,
          dataAgendamento: null,
          usuario: this.usuario.almope,
          produto: this.$route.query.queueOf || this.usuario.produto,
          procedureOperation: this.configTabulador[0].FILA_PROCEDURE
        }
        const result = await TratativaBkoVendasService.processarOperacoesTratativas(
          formularioPreenchido
        )
        this.casosAgendados = result
      },
      async newCase(action) {
        const formularioPreenchido = {
          idForm: this.$route.query.idForm,
          segmento: this.$route.params.fila,
          action,
          numOcorrencia: null,
          dataAgendamento: null,
          usuario: this.usuario.almope,
          produto: this.$route.query.queueOf || this.usuario.produto,
          procedureOperation: this.configTabulador[0].FILA_PROCEDURE
        }
        const result = await TratativaBkoVendasService.processarOperacoesTratativas(
          formularioPreenchido
        )
        this.dadosParaTratativa = result && result[0]
      },
      async handlerSubmit(action) {
        await this.$nextTick()
        const validate = await this.$refs.observer.validate()
        if (!validate) {
          return
        }
        this.submit(action)
      },
      async submit(action) {
        if (this.dadosParaTratativa == '' || this.dadosParaTratativa == null) {
          this.toast('Você não está tratando...', 'top-right', false, 2500, 'warning')
          return
        }
        try {
          this.isSend = true
          let dadosPerguntas = {}
          this.formField.forEach(item => {
            if (item.type_bloco === 'read') {
              item.perguntas.forEach(quest => {
                dadosPerguntas[quest.vModel] = this.dadosParaTratativa[quest.vModel]
              })
            }
          })

          let formularioPreenchido = {
            idForm: this.$route.query.idForm,
            analiseCaso: [{ ...dadosPerguntas }],
            respostas: [{ ...this.formData }],
            segmento: this.$route.params.fila,
            action,
            numOcorrencia: this.dadosParaTratativa.HASH_MAILING,
            dataAgendamento: null,
            usuario: this.usuario.almope,
            produto: this.$route.query.queueOf,
            procedureOperation: this.configTabulador[0].FILA_PROCEDURE
          }
          await TratativaBkoVendasService.processarOperacoesTratativas(formularioPreenchido)
          this.isSend = false
          this.dadosParaTratativa = ''
          this.clearForm()
          this.toast('Tratativa salva com sucesso', 'top-right', false, 2500, 'success')
        } catch (e) {
          console.error(e)
          this.toast(
            'Erro ao salvar, tente novamente mais tarde!',
            'top-right',
            false,
            2500,
            'warning'
          )
          this.isSend = false
        }
      },
      clearForm() {
        let formularioPreenchido = Object.assign({}, this.formData)
        Object.keys(formularioPreenchido).forEach(key => (formularioPreenchido[key] = null))
        this.formData = formularioPreenchido

        if (Array.isArray(this.$refs.observer)) {
          this.$refs.observer.forEach(obs => obs.reset())
        } else if (this.$refs.observer) {
          this.$refs.observer.reset()
        }
      },
      async loadDadosForm() {
        const result = await FormFieldsService.getFormsFields()
        const opcoes = await TratativaBkoVendasService.getOpcoesAgendamento(
          this.$route.query.idForm
        )
        this.opcoesAgendamento = opcoes
        this.formField = result
      },
      async getConfigById() {
        const result = await FilaService.getConfigById(this.$route.query.configId)
        this.configTabulador = result
        this.$emit('update:loadData', false)
      },
      async submitAgendamento(dataAgendada) {
        if (this.dadosParaTratativa == '' || this.dadosParaTratativa == null) {
          this.toast('Você não está tratando...', 'top-right', false, 2500, 'warning')
          return
        }

        let formularioPreenchido = {
          idForm: this.$route.query.idForm,
          ...this.formData,
          segmento: this.$route.params.fila,
          action: 3,
          numOcorrencia: this.dadosParaTratativa.HASH_MAILING,
          dataAgendamento: dataAgendada,
          usuario: this.usuario.almope,
          produto: this.$route.query.queueOf,
          procedureOperation: this.configTabulador[0].FILA_PROCEDURE
        }

        await TratativaBkoVendasService.processarOperacoesTratativas(formularioPreenchido)
        this.dadosParaTratativa = ''
        await this.listarCasosAgendados()
        this.clearForm()
      },
      shouldShowField(item) {
        if (!item.parent) {
          return true
        }
        return item.parentValue.includes(this.formData[item.parent])
      }
    },
    async created() {
      await this.getConfigById()
      this.loadDadosForm()
      await this.listarCasosAgendados()
    }
  }
</script>

<style scoped>
  fieldset {
    padding: 15px;
    border: 1px solid #3333;
    border-radius: 10px;
    padding: 20px;
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
</style>
