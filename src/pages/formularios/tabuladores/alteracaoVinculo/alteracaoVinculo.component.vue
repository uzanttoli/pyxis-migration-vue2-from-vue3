<template>
  <v-card>
    <title-negative-margin title="Alteração Vínculo" id="title">
      <template v-slot:button>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              class="mx-2"
              v-bind="attrs"
              v-on="on"
              fab
              dark
              x-small
              color="grey lighten-5"
              @click="novoCadastro = !novoCadastro"
            >
              <v-icon dark color="black">
                {{ novoCadastro ? 'fa-solid fa-arrow-left' : 'fa-solid fa-plus' }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ novoCadastro ? 'Voltar' : 'Cadastrar' }}</span>
        </v-tooltip>
      </template>
    </title-negative-margin>
    <v-card v-if="novoCadastro">
      <v-col>
        <validation-observer v-slot="{ invalid, validate }" ref="observer">
          <form @submit.prevent="validate().then(submit)">
            <v-row>
              <v-col cols="3">
                <validation-provider
                  v-slot="{ errors }"
                  name="matricula"
                  rules="required|min:5|max:6"
                >
                  <v-text-field
                    @change="loadDadosColaborador()"
                    label="Insira a matricula"
                    required
                    dense
                    :error-messages="errors"
                    outlined
                    v-mask="masks.matricula"
                    v-model="formAlteracaoVinculo.matricula"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="3">
                <validation-provider v-slot="{ errors }" name="almope">
                  <v-text-field
                    label="Almope"
                    dense
                    outlined
                    required
                    :error-messages="errors"
                    readonly
                    v-model="_dados.ALMOPE"
                    class="text-form"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="3">
                <validation-provider v-slot="{ errors }" name="nome">
                  <v-text-field
                    label="Nome"
                    readonly
                    outlined
                    :error-messages="errors"
                    v-model="_dados.NOME"
                    dense
                    class="text-form"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="3">
                <validation-provider v-slot="{ errors }" name="supervisor">
                  <v-text-field
                    label="Supervisor"
                    readonly
                    outlined
                    dense
                    :error-messages="errors"
                    v-model="_dados.SUPERIOR1"
                    class="text-form"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="3" class="mt-n6">
                <validation-provider name="gerente" v-slot="{ errors }">
                  <v-text-field
                    label="Gerente"
                    readonly
                    v-model="_dados.SUPERIOR3"
                    :error-messages="errors"
                    outlined
                    dense
                    class="text-form"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="3" class="mt-n6">
                <validation-provider name="cliente" rules="required">
                  <v-select
                    :items="itemsCliente"
                    label="Cliente"
                    required
                    persistent-hint
                    dense
                    outlined
                    v-model="formAlteracaoVinculo.cliente"
                    class="text-form"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col cols="3" class="mt-n6">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  v-model:return-value="date"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <validation-provider
                      rules="required"
                      name="data atualizacao"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="dateFormated"
                        label="Data"
                        readonly
                        required
                        outlined
                        :error-messages="errors"
                        class="text-form"
                        dense
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </validation-provider>
                  </template>
                  <v-date-picker
                    v-model="date"
                    no-title
                    locale="pt-br"
                    scrollable
                    :min="dateMinima"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">Cancelar</v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="3" class="mt-n6">
                <validation-provider name="vinculo" rules="required" v-slot="{ errors }">
                  <v-select
                    :items="itemsVinculo"
                    label="Vínculo"
                    persistent-hint
                    required
                    :error-messages="errors"
                    outlined
                    dense
                    v-model="formAlteracaoVinculo.vinculo"
                    class="text-form"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col cols="3" class="mt-n6">
                <validation-provider name="tipo atualização" rules="required" v-slot="{ errors }">
                  <v-select
                    :items="itemsAtualizacao"
                    label="Tipo Atualização"
                    required
                    persistent-hint
                    v-model="formAlteracaoVinculo.tipoAtualizacao"
                    dense
                    :error-messages="errors"
                    outlined
                    class="text-form"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col cols="12" class="mt-n6">
                <v-textarea
                  name="input-7-1"
                  label="Descreva o motivo"
                  rows="2"
                  required
                  outlined
                  hint="Seja breve ao descrever o motivo!"
                  auto-grow
                  v-model="formAlteracaoVinculo.motivo"
                ></v-textarea>
              </v-col>
            </v-row>
            <div style="display: flex; gap: 10px">
              <v-btn :disabled="invalid" type="submit" color="success">Enviar</v-btn>
              <v-btn @click="reset" color="error">Limpar</v-btn>
            </div>
          </form>
        </validation-observer>
      </v-col>
    </v-card>
    <v-card v-else>
      <cadastros></cadastros>
    </v-card>
  </v-card>
</template>

<script>
  import cadastros from './table/cadastros.component.vue'
  import config from '../../../../core/config'
  import masks from '../../../../shared/masks/masks'
  import alerts from '../../../../mixins/alerts.mixins'

  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  export default {
    props: {
      dialogAlteracaoVinculo: {
        type: Boolean,
        default: false
      }
    },
    components: {
      cadastros,
      ValidationObserver,
      ValidationProvider
    },
    data: () => ({
      valid: false,
      snackbar: false,
      cor: '',
      text: '',
      icon: '',
      novoCadastro: false,
      dados: [],
      itemsVinculo: [
        { text: 'Presencial', value: 'PRESENCIAL' },
        { text: 'HomeOffice', value: 'HOMEOFFICE' }
      ],
      itemsAtualizacao: [
        { text: 'Definitivo', value: 'DEFINITIVO' },
        { text: 'Pontual', value: 'PONTUAL' },
        { text: 'Emergência', value: 'EMERGÊNCIA' }
      ],
      itemsCliente: [
        { text: 'NET Serviços', value: 'NET SERVICOS' },
        { text: 'CLARO', value: 'CLARO' },
        { text: 'ENEL', value: 'ENEL' },
        { text: 'SKY', value: 'SKY' },
        { text: 'GOL', value: 'GOL' }
      ],
      formAlteracaoVinculo: {
        matricula: null,
        cliente: null,
        vinculo: null,
        tipoAtualizacao: null,
        motivo: null
      },
      date: null,
      dateMinima: null,
      menu: false,
      modal: false
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
      dateFormated() {
        return this.formate(this.date)
      },
      _dados() {
        let dados = this.dados[0]
        if (dados) {
          return dados
        } else {
          return ''
        }
      }
    },
    methods: {
      dateValid() {
        let date = new Date()
        let day = (date.getDate() + 2).toString()
        let dayF = day.length == 1 ? '0' + day : day

        let month = (date.getMonth() + 1).toString()
        let monthF = month.length == 1 ? '0' + month : month

        let year = date.getFullYear()

        let dateComplete = `${year}-${monthF}-${dayF}`

        return (this.dateMinima = dateComplete)
      },
      formate(date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      _date() {
        let date = new Date()
        let day = (date.getDate() + 2).toString()
        let dayF = day.length == 1 ? '0' + day : day

        let month = (date.getMonth() + 1).toString()
        let monthF = month.length == 1 ? '0' + month : month
        let year = date.getFullYear()

        return (this.date = `${dayF}/${monthF}/${year}`)
      },
      async submit() {
        try {
          let urlData = `${config.baseUrl}api/shared/formularios/alteracao_vinculo/insert`

          this.formAlteracaoVinculo.usuarioCadastro = this.$store.getters.usuario.almope
          this.formAlteracaoVinculo.almope = this._dados.ALMOPE
          this.formAlteracaoVinculo.date = this.date
          await this.$api.post(urlData, this.formAlteracaoVinculo)

          this.toast('Cadastro Realizado com sucesso!', 'bottom-right', false, 2500, 'success')
          this.reset()
        } catch (error) {
          if (error.response.status == 409 || error.response.status == 500) {
            this.toast(error.response.data, 'bottom-right', false, 2500, 'error')
          }
        }
      },
      reset() {
        let newForm = Object.assign({}, this.formAlteracaoVinculo)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formAlteracaoVinculo = newForm
        this.$refs.observer.reset()
        this.dados = []
      },
      loadDadosColaborador() {
        let urlData = `${config.baseUrl}api/shared/formularios/alteracao_vinculo/dados_alteracao_vinculo/`
        this.$api
          .get(urlData, {
            params: {
              matricula: this.formAlteracaoVinculo.matricula
            }
          })
          .then(res => {
            this.dados = res.data
          })
      }
    },
    created() {
      this.dateValid()
    },
    watch: {
      dialogAlteracaoVinculo() {
        if (this.dialogAlteracaoVinculo == true) {
          return this.dateValid()
        }
      },
      'formAlteracaoVinculo.matricula': function (newVal, oldVal) {
        if (newVal != oldVal) {
          if (newVal?.length == 6) {
            this.loadDadosColaborador()
          }
        }
      }
    }
  }
</script>

<style scoped></style>
