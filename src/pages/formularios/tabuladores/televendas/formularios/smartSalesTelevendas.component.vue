<template>
  <!-- v-model="dialogModalTelevendas" -->
  <v-dialog
    :model-value="dialogModalTelevendas"
    @update:modelValue="val => $emit('update:dialogModalTelevendas', val)"
    width="900"
    persistent
  >
    <v-card>
      <title-negative-margin title="Finalizar Venda" className="rounded-r-xl">
        <v-btn icon @click="$emit('update:close-tlvsmart')">
          <v-icon>fa fa-close</v-icon>
        </v-btn>
      </title-negative-margin>
      <v-col cols="12">
        <v-card-text class="pl-0 mt-n8">
          <div class="mt-2">
            <v-icon color="red">fa-solid fa-heart-pulse</v-icon>
            {{ `Olá ${nome}, tenha um excelente dia de vendas!` }}
          </div>
          <v-divider class="mt-2"></v-divider>
        </v-card-text>
      </v-col>
      <template>
        <validation-observer v-slot="{ invalid }" ref="observer">
          <form @submit.prevent="submit">
            <v-row class="mx-1">
              <v-col class="mt-n3" cols="4">
                <validation-provider
                  v-slot="{ errors }"
                  rules="required|numero_valido"
                  name="numero chamador"
                >
                  <v-text-field
                    dense
                    v-model="formVendaNet.numeroChamador"
                    :error-messages="errors"
                    v-mask="['(##) #####-####']"
                    label="Número que o cliente está ligando"
                    required
                    placeholder="Número que o cliente está ligando"
                    outlined
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col class="mt-n3" cols="4">
                <validation-provider
                  v-slot="{ errors }"
                  rules="required|numero_valido"
                  name="numero whatsapp"
                >
                  <v-text-field
                    dense
                    v-model="formVendaNet.melhorNumeroContato"
                    :error-messages="errors"
                    v-mask="['(##) #####-####']"
                    label="Melhor número p/ contato (WhatsApp)"
                    required
                    placeholder="Melhor número p/ contato (WhatsApp)"
                    outlined
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col class="mt-n3" cols="4">
                <validation-provider v-slot="{ errors }" rules="required" name="Tipo">
                  <v-autocomplete
                    dense
                    v-model="formVendaNet.tipo"
                    :items="tipoFormVenda"
                    item-text="DESCRICAO"
                    item-value="COD"
                    :error-messages="errors"
                    no-data-text="Não há items"
                    @change="loadProdutoFormVenda"
                    label="Tipo"
                    placeholder="Tipo"
                    outlined
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col class="mt-n3" cols="4">
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="Por onde foi finalizado a venda?"
                >
                  <v-select
                    placeholder="Por onde foi finalizado a venda?"
                    dense
                    outlined
                    :error-messages="errors"
                    v-model="formVendaNet.canalVenda"
                    required
                    :items="['NET SALES', 'SOLAR NBA']"
                    no-data-text="Não há items"
                    label="Por onde foi finalizada a venda?"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col class="mt-n3" cols="4" v-if="formVendaNet.canalVenda == 'NET SALES'">
                <validation-provider
                  v-slot="{ errors }"
                  name="Qual o motivo da venda não ser feita através do NBA?"
                  rules="required"
                >
                  <v-autocomplete
                    outlined
                    :error-messages="errors"
                    placeholder="Qual o motivo da venda não ser feita através do NBA?"
                    dense
                    no-data-text="Não há items"
                    :items="motivoNaoAtendNBA"
                    item-text="text"
                    v-model="formVendaNet.itemMotivoNaoAtendNBA"
                    item-value="text"
                    label="Qual o motivo da venda não ser feita através do NBA?"
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col class="mt-n3" cols="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="Venda foi tabulada no IRIDE?"
                  rules="required"
                >
                  <v-select
                    outlined
                    required
                    :error-messages="errors"
                    placeholder="Venda foi tabulada no IRIDE?"
                    dense
                    no-data-text="Não há items"
                    v-model="formVendaNet.vendaTabulada"
                    :items="['SIM', 'NÃO']"
                    label="Venda foi tabulada no IRIDE?"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col class="mt-n3" cols="4" v-if="formVendaNet.vendaTabulada == 'NÃO'">
                <validation-provider
                  v-slot="{ errors }"
                  name="Por que a venda não foi tabulada?"
                  rules="required"
                >
                  <v-autocomplete
                    outlined
                    placeholder="Por que a venda não foi tabulada?"
                    dense
                    :error-messages="errors"
                    no-data-text="Não há items"
                    v-model="formVendaNet.motivoNaoTransCheck"
                    :items="motivoNaoTransfIride"
                    label="Por que a venda não foi tabulada?"
                    @change="loadMotivosNaoTransIride()"
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col class="mt-n3" cols="4" v-if="formVendaNet.vendaTabulada == 'NÃO'">
                <validation-provider
                  v-slot="{ errors }"
                  name="Motivo da não transferência"
                  rules="required"
                >
                  <v-autocomplete
                    outlined
                    placeholder="Motivo da não transferência."
                    dense
                    :error-messages="errors"
                    v-model="formVendaNet.submotivoNaoTransCheck"
                    :items="subMotivosNaoTransfIride"
                    item-text="DESCRICAO"
                    item-value="DESCRICAO"
                    no-data-text="Não há items"
                    label="Motivo da não transferência."
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
            </v-row>
            <div class="pa-3" style="display: flex; justify-content: flex-end">
              <v-btn
                type="submit"
                class="rounded-bl-xl rounded-r-xl mr-2"
                color="success"
                :disabled="invalid"
              >
                <v-icon class="mr-1" small>fa-solid fa-floppy-disk</v-icon>
                Salvar
              </v-btn>
              <v-btn class="" color="error" @click="limparDadosFormulario()">
                <v-icon class="mr-1" small>fa-solid fa-trash</v-icon>
                Limpar
              </v-btn>
            </div>
          </form>
        </validation-observer>
      </template>
    </v-card>
  </v-dialog>
</template>
<script>
  import alerts from '../../../../../mixins/alerts.mixins'
  import config from '../../../../../core/config'

  import { ValidationObserver, ValidationProvider, Validator } from 'vee-validate'

  Validator.extend('numero_valido', {
    getMessage: field => `${field} deve ser um número valido`,
    validate: value =>
      new RegExp(`^\\([1-9]{2}\\) (?:[2-8]|9[0-9])[0-9]{3}\\-[0-9]{4}$`, 'i').test(value)
  })

  export default {
    components: {
      ValidationObserver,
      ValidationProvider
    },
    name: 'form-televendas',
    props: {
      dialogModalTelevendas: {
        type: Boolean,
        default: false
      },
      dadosPrePreenchidos: {
        type: [Array, Object]
      }
    },
    mixins: [alerts],
    data: () => ({
      valid: false,
      loadingVenda: false,
      abrir: true,
      formVendaNet: {
        tipo: '',
        canalVenda: null,
        vendaTabulada: null,
        motivoNaoTransCheck: null,
        submotivoNaoTransCheck: null,
        itemMotivoNaoAtendNBA: null,
        melhorNumeroContato: null,
        numeroChamador: null
        // nomeCliente: null,
      },
      motivoNaoTransfIride: [
        { text: 'Erro no Iride', value: 'ERRO_IRIDE' },
        { text: 'Regra de Negócio', value: 'REGRA_NEGOCIO' }
      ],
      motivoNaoAtendNBA: [
        // {
        //   text: "N/A (NÃO UTILIZA A JORNADA DE RENTABILIZAÇÃO)",
        //   value: "N/A (NÃO UTILIZA A JORNADA DE RENTABILIZAÇÃO)",
        // },
        {
          text: 'JORNADA COM ERRO AO CADASTRAR OFERTA',
          value: 'JORNADA COM ERRO AO CADASTRAR OFERTA'
        },
        {
          text: 'OFERTA NÃO DISPONÍVEL PARA CADASTRO',
          value: 'OFERTA NÃO DISPONÍVEL PARA CADASTRO'
        },
        {
          text: 'CADASTRO NÃO PERMITIDO POR TRAVA SISTÊMICA (OS EM ABERTO, PERFIL NÃO CONVIVE COM OFERTA)',
          value:
            'CADASTRO NÃO PERMITIDO POR TRAVA SISTÊMICA (OS EM ABERTO, PERFIL NÃO CONVIVE COM OFERTA)'
        }
      ],
      subMotivosNaoTransfIride: []
    }),
    computed: {
      tipoFormVenda() {
        return this.$store.getters.tipoFormVenda
      },
      nome() {
        return this.$store.getters.usuario.nome
      },
      produtoFormVenda() {
        return this.$store.getters.produtoFormVenda
      }
    },
    methods: {
      async submit() {
        let isValid = await this.$refs.observer.validate()
        if (isValid) {
          try {
            this.loadingVenda = true
            this.dadosPrePreenchidos.tipo = this.formVendaNet.tipo
            this.dadosPrePreenchidos.almopeCadastro = this.$store.getters.usuario.almope
            this.dadosPrePreenchidos.motivoNaoAceite = null
            this.dadosPrePreenchidos.canalVenda = this.formVendaNet.canalVenda
            this.dadosPrePreenchidos.vendaTabulada = this.formVendaNet.vendaTabulada
            this.dadosPrePreenchidos.motivoNaoTransCheck = this.formVendaNet.motivoNaoTransCheck
            this.dadosPrePreenchidos.submotivoNaoTransCheck =
              this.formVendaNet.submotivoNaoTransCheck
            this.dadosPrePreenchidos.itemMotivoNaoAtendNBA = this.formVendaNet.itemMotivoNaoAtendNBA
            this.dadosPrePreenchidos.melhorNumeroContato = this.formVendaNet.melhorNumeroContato
            this.dadosPrePreenchidos.numeroChamador = this.formVendaNet.numeroChamador
            let data = {
              almope: this.$store.getters.usuario.almope,
              ddd: this.dadosPrePreenchidos.codCidade,
              contrato: this.dadosPrePreenchidos.numeroContrato,
              clienteAceitouOferta: 1,
              clienteElegivel: 1,
              tipo: this.formVendaNet.tipo,
              operacao: 'NET',
              produto: this.dadosPrePreenchidos.planoEscolha,
              dataVenda: new Date().toISOString().substring(0, 10),
              canalVenda: this.formVendaNet.canalVenda,
              melhorNumeroContato: this.formVendaNet.melhorNumeroContato
            }
            await this.$store.dispatch('saveDadosVendasNet', data)
            let urlData = `${config.baseUrl}api/shared/smartsales/televendas/inserir/`
            this.$api.post(urlData, this.dadosPrePreenchidos).then(() => {
              this.$emit('update:dadosEnviados')
              this.limparDadosFormulario()
            })
            this.toast('Dados cadastrados com sucesso!', 'top-right', false, 4000, 'success')
            this.loadingVenda = false
          } catch (error) {
            if (error.response.status) {
              this.toast(error.response.data, 'top-right', false, 4000, 'error')
              this.loadingVenda = false
            }
          }
        }
      },
      loadProdutoFormVenda() {
        return this.$store.dispatch('loadProdutoFormVenda')
      },
      loadTipoFormVenda() {
        return this.$store.dispatch('loadTipoFormVenda')
      },
      // motivos de transferencia uracheckout
      loadMotivosNaoTransIride() {
        let urlData = `${config.baseUrl}api/shared/televendas/motivos_nao_tabulacao_iride/${this.formVendaNet.motivoNaoTransCheck}`
        this.$api.get(urlData).then(res => {
          this.subMotivosNaoTransfIride = res.data
        })
      },
      limparDadosFormulario() {
        let newForm = Object.assign({}, this.formVendaNet)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formVendaNet = newForm
        this.$refs.observer.reset()
      }
    },
    watch: {
      'formVendaNet.motivoNaoTransCheck': function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.formVendaNet.submotivoNaoTransCheck = null
        }
      },
      'formVendaNet.vendaTabulada': function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.formVendaNet.motivoNaoTransCheck = null
          this.formVendaNet.submotivoNaoTransCheck = null
        }
      }
    },
    created() {
      this.loadTipoFormVenda()
    }
  }
</script>

<style scoped>
  details {
    /* width: 100%; */
    background-color: red;
  }

  summary {
    color: #909090;
    font-weight: 600;
    margin-left: 20px;
  }
</style>
