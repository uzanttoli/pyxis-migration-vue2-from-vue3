<template>
  <v-container>
    <v-card class="rounded-xl" elevation="1">
      <v-card-title>
        <i class="fa-solid fa-tablet-button orange--text mr-3"></i>
        Visita técnica
        <v-spacer></v-spacer>
        <v-btn icon to="/pyxis/tabuladores/">
          <v-icon color="error">fas fa-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-col>
        <!-- <pre>{{ dadosTratativa }}</pre> -->
        <validation-observer v-slot="{ invalid, validate }" ref="observer">
          <form @submit.prevent="validate().then(submit)">
            <v-row>
              <v-col cols="2" class="pb-n2 mb-n4">
                <v-select
                  outlined
                  dense
                  placeholder="Selecione um produto"
                  label="Selecione um produto"
                  :items="['NET COMBO', 'NET MTF']"
                  v-model="produtoSelecionado"
                ></v-select>
              </v-col>
            </v-row>
            <fieldset>
              <legend>Dados p/ Tratativa</legend>
              <v-row>
                <v-col cols="4" class="pb-n2 mb-n6">
                  <v-text-field
                    outlined
                    dense
                    placeholder="ID"
                    label="ID"
                    readonly
                    filled
                    :value="dadosTratativa.ID"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="pb-n2 mb-n6">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Contrato"
                    label="Contrato"
                    readonly
                    filled
                    :value="dadosTratativa.CONTRATO"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="pb-n2 mb-n6">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Nome Cliente"
                    label="Nome Cliente"
                    readonly
                    filled
                    :value="dadosTratativa.NOME_CLIENTE"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="pb-n2 mb-n6">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Produto"
                    label="Produto"
                    readonly
                    filled
                    :value="dadosTratativa.PRODUTO"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="pb-n2 mb-n6">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Melhor número de contato"
                    label="Melhor número de contato"
                    readonly
                    filled
                    :value="dadosTratativa.MELHOR_TEL_CONTATO"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="pb-n2 mb-n6">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Status Equipamento"
                    label="Status Equipamento"
                    readonly
                    filled
                    :value="dadosTratativa.STATUS_EQUIPAMENTO"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="pb-n2 mb-n6">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Falha do Equipamento"
                    label="Falha do Equipamento"
                    readonly
                    filled
                    :value="dadosTratativa.FALHA_EQUIPAMENTO"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="pb-n2 mb-n6">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Nome Cadastro"
                    label="Nome Cadastro"
                    readonly
                    filled
                    :value="dadosTratativa.NOME_CADASTRO"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="pb-n2 mb-n6">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Supervisor"
                    label="Supervisor"
                    readonly
                    :value="dadosTratativa.SUPERVISOR"
                    filled
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="pb-n2 mb-n6">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Coordenador"
                    label="Coordenador"
                    readonly
                    filled
                    :value="dadosTratativa.COORDENADOR"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="pb-n2 mb-n6">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Data de agendamento"
                    label="Data de agendamento"
                    readonly
                    filled
                    :value="dadosTratativa.DATA_AGENDAMENTO"
                  ></v-text-field>
                </v-col>
              </v-row>
            </fieldset>
            <fieldset>
              <legend>Tratativa</legend>

              <v-row>
                <v-col cols="4">
                  <validation-provider v-slot="{ errors }" name="ativo realizado?" rules="required">
                    <v-select
                      :error-messages="errors"
                      outlined
                      dense
                      placeholder="Ativo realizado?"
                      label="Ativo realizado?"
                      :items="['SIM', 'NÃO']"
                      v-model="dadosForm.ativoRealizado"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <v-col cols="4">
                  <validation-provider
                    v-slot="{ errors }"
                    name="procedimentos realizados?"
                    rules="required"
                  >
                    <v-select
                      :error-messages="errors"
                      outlined
                      dense
                      placeholder="Procedimentos realizados?"
                      label="Procedimentos realizados?"
                      :items="['SIM', 'NÃO']"
                      v-model="dadosForm.procedimentosRealizados"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <v-col cols="4">
                  <validation-provider
                    v-slot="{ errors }"
                    name="problema resolvido?"
                    rules="required"
                  >
                    <v-select
                      :error-messages="errors"
                      outlined
                      dense
                      placeholder="Problema resolvido?"
                      label="Problema resolvido?"
                      :items="['SIM', 'NÃO']"
                      v-model="dadosForm.problemaResolvido"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <v-col cols="4" class="mt-n6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="necessário manter visita?"
                    rules="required"
                  >
                    <v-select
                      :error-messages="errors"
                      outlined
                      dense
                      placeholder="Necessário manter visita?"
                      label="Necessário manter visita?"
                      :items="['SIM', 'NÃO']"
                      v-model="dadosForm.necessárioManterVisita"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <v-col cols="12" class="mt-n6">
                  <validation-provider v-slot="{ errors }" name="observação" rules="required">
                    <v-textarea
                      :error-messages="errors"
                      outlined
                      dense
                      placeholder="Observação"
                      label="Observação"
                      :items="['SIM', 'NÃO']"
                      v-model="dadosForm.observacao"
                    ></v-textarea>
                  </validation-provider>
                </v-col>
              </v-row>
            </fieldset>
            <div style="display: flex; gap: 10px">
              <v-btn color="info" @click="loadDadosTratativa" :disabled="dadosTratativa != ''">
                Novo caso
              </v-btn>
              <v-btn
                :disabled="invalid"
                color="success"
                type="submit"
                :loading="loadSend"
                v-if="dadosTratativa != ''"
              >
                Enviar
              </v-btn>
              <v-btn color="error" @click="clearForm">Limpar</v-btn>
              <v-btn
                color="warning"
                @click="abrirSheetFooterAgendar = true"
                v-if="dadosTratativa != ''"
              >
                Agendar
              </v-btn>
            </div>
          </form>
        </validation-observer>
      </v-col>
    </v-card>
    <agendamento-component
      :abrirSheetFooterAgendar="abrirSheetFooterAgendar"
      @updated-close="abrirSheetFooterAgendar = !abrirSheetFooterAgendar"
      @updated:salvar="agendarTratativa"
    ></agendamento-component>
  </v-container>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import config from '../../../core/config'
  import AgendamentoComponent from '../../../shared/components/bottomSheet/agendamento.component.vue'
  import alerts from '../../../mixins/alerts.mixins'
  export default {
    components: {
      ValidationObserver,
      ValidationProvider,
      AgendamentoComponent
    },
    data: () => ({
      dadosTratativa: [],
      dadosForm: {
        ativoRealizado: null,
        procedimentosRealizados: null,
        problemaResolvido: null,
        necessárioManterVisita: null,
        dataAgendamento: null,
        observacao: null
      },
      loadSend: false,
      abrirSheetFooterAgendar: false,
      produtoSelecionado: null
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario ?? []
      }
    },
    mixins: [alerts],
    methods: {
      async agendarTratativa(e) {
        this.dadosForm.dataAgendamento = e
        await this.submit(2)
      },
      async submit(statusTratamento = 3) {
        try {
          this.loadSend = true
          this.dadosForm.id = this.dadosTratativa?.ID
          this.dadosForm.statusTratamento = statusTratamento
          let urlData = `${config.baseUrl}api/shared/py_tabuladores/tratativa/salvar_caso`
          await this.$api.post(urlData, this.dadosForm)
          this.toast('Tratativa salva com sucesso!', 'top-right', false, 3500, 'success')
          this.clearForm()
          this.dadosTratativa = ''
          this.loadSend = false
        } catch (error) {
          this.toast(
            'Não foi possível salvar o caso, tente novamente!',
            'top-right',
            false,
            3500,
            'error'
          )
        }
      },
      clearForm() {
        let newForm = Object.assign({}, this.dadosForm)
        for (let i in newForm) {
          newForm[i] = null
        }
        this.dadosForm = newForm
        this.$refs.observer.reset()
      },
      loadDadosTratativa() {
        let urlData = `${config.baseUrl}api/shared/py_tabuladores/tratativa/novo_caso/`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuario.almope,
              produto: this.produtoSelecionado
            }
          })
          .then(res => (this.dadosTratativa = res?.data[0]))
      }
    }
  }
</script>

<style scoped>
  fieldset {
    padding: 15px;
    border: 1px solid #3333;
    margin-bottom: 15px;
  }
  legend {
    padding: 0 10px;
    font-size: 15px;
  }
</style>
