<template>
  <div class="mt-8">
    <section>
      <v-card elevation="1" outlined class="rounded-xl">
        <title-negative-margin title="Checkout Silente" className="rounded-r-xl">
          <v-btn icon to="/pyxis/service-to-sales/backoffice/">
            <v-icon>fa-solid fa-xmark</v-icon>
          </v-btn>
        </title-negative-margin>
        <v-divider></v-divider>
        <validation-observer v-slot="{ invalid }" ref="observer">
          <form @submit.prevent="submit">
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
                <div
                  :style="
                    'display: flex; flex-direction: row; width: 100%;' + dados.NUM_CASO
                      ? 'justify-content: space-between;'
                      : 'justify-content: end;'
                  "
                >
                  <div>
                    <v-banner
                      v-if="dados != ''"
                      class="mb-6"
                      dense
                      :color="dados.DATA_AGENDAMENTO != null ? 'warning' : 'success'"
                    >
                      <v-icon color="white" class="mr-2">fa-solid fa-triangle-exclamation</v-icon>
                      <span style="color: #fff">
                        {{
                          dados.DATA_AGENDAMENTO != null
                            ? 'Retorno de agendamento!'
                            : 'Caso novo para tratamento...'
                        }}
                      </span>
                    </v-banner>
                  </div>
                  <div style="width: 300px">
                    <v-text-field
                      outlined
                      dense
                      placeholder="Pesquisar núm. caso"
                      label="Pesquisar núm. caso"
                      v-model="numCasoSearch"
                    ></v-text-field>
                  </div>
                </div>

                <v-row>
                  <v-col cols="3">
                    <validation-provider
                      rules="required"
                      name="meio de contato"
                      v-slot="{ errors }"
                    >
                      <v-select
                        outlined
                        dense
                        required
                        :error-messages="errors"
                        label="Meio de contato"
                        no-data-text="Nada encontrado!"
                        :items="listarMeioContato"
                        item-text="text"
                        item-value="text"
                        v-model="formBkoSilente.MEIO_DE_CONTATO"
                      ></v-select>
                    </validation-provider>
                  </v-col>
                  <v-col class="mb-n4" cols="3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="existe reclamação?"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        placeholder="Existe reclamação por fraude?"
                        label="Existe reclamação por fraude?"
                        :error-messages="errors"
                        :items="itemSimNao"
                        v-model="formBkoSilente.RECLAMACAO_POR_FRAUDE"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col class="mb-n4" cols="3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="atendeu ligação?"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        placeholder="Cliente atendeu ligação?"
                        label="Cliente atendeu ligação?"
                        :items="itemSimNao"
                        v-model="formBkoSilente.ATENDEU_LIGACAO"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col class="mb-n4" cols="3" v-if="formBkoSilente.ATENDEU_LIGACAO == 'SIM'">
                    <validation-provider
                      v-slot="{ errors }"
                      name="titular do contrato"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        placeholder="Titular do contrato?"
                        label="Titular do contrato?"
                        :items="itemSimNao"
                        v-model="formBkoSilente.TITULAR_CONTRATO"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col
                    class="mb-n4"
                    cols="3"
                    v-if="
                      formBkoSilente.ATENDEU_LIGACAO == 'SIM' &&
                      formBkoSilente.TITULAR_CONTRATO == 'SIM'
                    "
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="informado os beneficios"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        placeholder="Falamos dos beneficios?"
                        label="Falamos dos beneficios?"
                        :items="itemSimNao"
                        v-model="formBkoSilente.FALAMOS_BENEFICIOS"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col
                    class="mb-n4"
                    cols="3"
                    v-if="
                      formBkoSilente.ATENDEU_LIGACAO == 'SIM' &&
                      formBkoSilente.TITULAR_CONTRATO == 'SIM'
                    "
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="motivo não utilização"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        placeholder="Motivo da não utilização da Linha?"
                        label="Motivo da não utilização da Linha?"
                        v-model="formBkoSilente.MOTIVO_NAO_UTILIZACO"
                        :items="listMotivoNaoUtilizacao"
                        item-text="DESCRICAO"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col
                    cols="3"
                    class="mb-n4"
                    v-if="
                      formBkoSilente.MOTIVO_NAO_UTILIZACO == 'CLIENTE INFORMA QUE NÃO RECEBEU CHIP'
                    "
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="qual status da os"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        placeholder="Qual status da OS de chip(Tabulado)?"
                        label="Qual status da OS de chip(Tabulado)?"
                        v-model="formBkoSilente.STATUS_TABULADO_OS_CHIP"
                        :items="itemsTextfields.qualStatusOsChip"
                        item-text="text"
                        item-value="value"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col
                    cols="3"
                    class="mb-n4"
                    v-if="
                      formBkoSilente.STATUS_TABULADO_OS_CHIP == 'OS BAIXADA (CLIENTE AUSENTE)' ||
                      formBkoSilente.STATUS_TABULADO_OS_CHIP == 'OS BAIXADA (ENTREGA REALIZADA)'
                    "
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="endereço do cliente está correto?"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        placeholder="Endereço do cliente está correto?"
                        label="Endereço do cliente está correto?"
                        v-model="formBkoSilente.ENDERECO_CORRETO"
                        :items="itemsTextfields.enderecoClienteCorreto"
                        item-text="text"
                        item-value="value"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col
                    cols="3"
                    class="mb-n4"
                    v-if="
                      formBkoSilente.STATUS_TABULADO_OS_CHIP == 'OS BAIXADA (CLIENTE AUSENTE)' ||
                      formBkoSilente.STATUS_TABULADO_OS_CHIP == 'OS BAIXADA (ENTREGA REALIZADA)'
                    "
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="direcionado cliente loja"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        placeholder="Direcione o cliente para uma loja fisica. Cliente aceita ir a loja ?"
                        label="Direcione o cliente para uma loja fisica. Cliente aceita ir a loja ?"
                        v-model="formBkoSilente.DIRECIONADO_CLIENTE_LOJA"
                        :items="itemsTextfields.direcionadoClienteLoja"
                        item-text="text"
                        item-value="value"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" class="mb-n4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="descrição"
                      rules="required|max:255|min:15"
                    >
                      <v-textarea
                        outlined
                        :error-messages="errors"
                        counter="255"
                        :placeholder="
                          formBkoSilente.STATUS_TABULADO_OS_CHIP == 'OS CANCELADA'
                            ? 'Qual a descrição da baixa'
                            : 'Observação'
                        "
                        :label="
                          formBkoSilente.STATUS_TABULADO_OS_CHIP == 'OS CANCELADA'
                            ? 'Qual a descrição da baixa'
                            : 'Observação'
                        "
                        auto-grow
                        max-height="450"
                        v-model="formBkoSilente.OBSERVACAO"
                      ></v-textarea>
                    </validation-provider>
                  </v-col>
                </v-row>
              </fieldset>
            </v-col>
            <v-col>
              <v-row class="ma-2" justify="start" style="gap: 20px">
                <v-btn color="info" @click="novoCaso" :loading="loading" :disabled="dados != ''">
                  Novo caso
                </v-btn>
                <v-btn color="error" @click="clearForm">Limpar</v-btn>
                <v-btn
                  v-if="dados != ''"
                  color="orange"
                  class="white--text"
                  @click="abrirSheetFooterAgendar = true"
                  :disabled="
                    dados != '' &&
                    formBkoSilente.ATENDEU_LIGACAO != 'NÃO' &&
                    formBkoSilente.TITULAR_CONTRATO != 'NÃO' &&
                    formBkoSilente.MOTIVO_NAO_UTILIZACO != 'CLIENTE INFORMA QUE VAI ULTILIZAR'
                  "
                  :loading="abrirSheetFooterAgendar || loadingAgendamento"
                >
                  Agendar
                </v-btn>
                <v-btn
                  v-if="dados != ''"
                  type="submit"
                  color="success"
                  :disabled="
                    invalid ||
                    formBkoSilente.ATENDEU_LIGACAO == 'NÃO' ||
                    (formBkoSilente.ATENDEU_LIGACAO == 'SIM' &&
                      formBkoSilente.TITULAR_CONTRATO == 'NÃO') ||
                    formBkoSilente.MOTIVO_NAO_UTILIZACO == 'CLIENTE INFORMA QUE VAI ULTILIZAR'
                  "
                  :loading="loadingSubmit"
                >
                  Salvar
                </v-btn>
              </v-row>
            </v-col>
          </form>
        </validation-observer>
      </v-card>
    </section>
    <agendamento-component
      :abrirSheetFooterAgendar="abrirSheetFooterAgendar"
      @updated-close="abrirSheetFooterAgendar = false"
      @updated:salvar="salvarCasoAgendamento"
    ></agendamento-component>
  </div>
</template>

<script>
  import config from '../../../../../../core/config'
  import alerts from '../../../../../../mixins/alerts.mixins'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import masks from '../../../../../../shared/masks/masks'
  import itemsTextfields from './itemsTextfields'

  import AgendamentoComponent from '../../../../../../shared/components/bottomSheet/agendamento.component.vue'
  export default {
    components: { ValidationObserver, ValidationProvider, AgendamentoComponent },
    data: () => ({
      loading: false,
      abrirSheetFooterAgendar: false,
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
          CAMPO: 'Contrato',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'NUM_CONTRATO',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Cidade',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'DSC_MUNICIPIO_BI',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Login Ofensor',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'LOGIN_USUARIO',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Nª Chamador',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'TELEFONE',
          ISMASK: true,
          MASCARA: 'telefoneBrFixo'
        },
        {
          CAMPO: 'Data da venda',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'DATA_VENDA_BRUTA',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Data da ativação',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'DATA_MOVIMENTO',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Plano vendido',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'DSC_PRODUTO_BACKEND',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Status Ura checkout',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'STATUS_URA_CHECKOUT',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Coordenador',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'COORDENADOR',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Motivo venda não aceita',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'MOTIVO_VENDA_NAO_VALIDADA',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Tipo venda',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'TIPO_VENDA',
          ISMASK: false,
          MASCARA: null
        }
      ],
      formBkoSilente: {
        NUM_CASO: null,
        ALMOPE_TRATATIVA: null,
        STATUS_TRATATIVA: null,
        DATA_AGENDAMENTO: null,
        RECLAMACAO_POR_FRAUDE: null,
        ATENDEU_LIGACAO: null,
        TITULAR_CONTRATO: null,
        FALAMOS_BENEFICIOS: null,
        MOTIVO_NAO_UTILIZACO: null,
        STATUS_TABULADO_OS_CHIP: null,
        ENDERECO_CORRETO: null,
        DIRECIONADO_CLIENTE_LOJA: null,
        OBSERVACAO: null,
        MEIO_DE_CONTATO: null
      },
      numCasoSearch: null,
      oldValues: [{}],
      itemSimNao: ['SIM', 'NÃO'],
      listMotivoNaoUtilizacao: [],
      dados: [],
      loadingSubmit: false,
      loadingAgendamento: false,
      listarMeioContato: [{ text: 'WHATSAPP' }, { text: 'ATIVO (CALLBACK)' }]
    }),
    mixins: [alerts],
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      masks() {
        return masks
      },
      itemsTextfields() {
        return itemsTextfields
      }
    },
    methods: {
      async salvarCasoAgendamento(e) {
        try {
          this.loadingAgendamento = true
          this.formBkoSilente.ALMOPE_TRATATIVA = this.$store.getters.usuario.almope
          this.formBkoSilente.NUM_CASO = this.dados.NUM_CASO
          this.formBkoSilente.STATUS_TRATATIVA = 2
          this.formBkoSilente.DATA_AGENDAMENTO = e
          let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/set_status_caso`
          await this.$api.post(urlData, this.formBkoSilente)
          this.loadingAgendamento = false
          this.dados = ''
          this.toast('Agendamento realizado com sucesso!', 'top', false, 2000, 'success')
          this.clearForm()
        } catch (error) {
          this.toast('Falha ao agendar!', 'top', false, 2000, 'error')
        }
      },
      clearForm() {
        let newForm = Object.assign({}, this.formBkoSilente)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.$refs.observer.reset()
        this.formBkoSilente = newForm
      },
      async novoCaso() {
        try {
          this.loading = true
          let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/novo_caso_2`
          var res = await this.$api.get(urlData, {
            params: {
              almope: this.usuarioAlmope,
              numCaso: this.numCasoSearch
            }
          })
          this.dados = res.data[0]
          this.formBkoSilente.OBSERVACAO = res.data[0].OBSERVACAO
          this.loading = false
          if (res.data == '') {
            this.toast('Não há casos para tratativa!', 'top-right', false, 2000, 'warning')
            this.loading = false
          }
        } catch (error) {
          this.loading = false
          if (error.response.status === 406) {
            this.swalConfirmation(
              async () => {
                let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/novo_caso_2`
                var res = await this.$api.get(urlData, {
                  params: {
                    almope: this.usuarioAlmope,
                    numCaso: this.numCasoSearch,
                    next: true
                  }
                })
                this.dados = res.data[0]
                this.formBkoSilente.OBSERVACAO = res.data[0].OBSERVACAO
                this.loading = false
                if (res.data == '') {
                  this.toast('Não há casos para tratativa!', 'top-right', false, 2000, 'warning')
                  this.loading = false
                }
              },
              'Atenção',
              'Esse caso está sendo tratado, deseja continuar?',
              'Sim',
              'Caso disponivel para tratamento!',
              'Foi direcionado para você tratar!'
            )
          }
        }
      },
      async submit() {
        try {
          let isValid = await this.$refs.observer.validate()
          if (isValid) {
            this.loadingSubmit = true
            this.formBkoSilente.ALMOPE_TRATATIVA = this.$store.getters.usuario.almope
            this.formBkoSilente.NUM_CASO = this.dados.NUM_CASO
            this.formBkoSilente.STATUS_TRATATIVA = 3
            let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/set_status_caso`
            await this.$api.post(urlData, this.formBkoSilente)
            this.loadingSubmit = false
            this.toast('Dados foram salvos com sucesso!', 'top-right', false, 2000, 'success')
            this.dados = ''
            this.clearForm()
          }
        } catch (error) {
          this.toast('Dados não foram salvos!', 'top', false, 2000, 'error')
        }
      },
      loadListMotivosNaoUtilizacao() {
        let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/listar_dados_filtro/mot_nao_utilizacao`
        this.$api.get(urlData).then(res => {
          this.listMotivoNaoUtilizacao = res.data
        })
      }
    },
    created() {
      this.loadListMotivosNaoUtilizacao()
    },
    watch: {}
  }
</script>

<style>
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
</style>
