<template>
  <v-card>
    <title-negative-margin
      title="Gestão de Bloqueados"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-divider></v-divider>
    <v-col class="mt-3">
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col>
              <fieldset class="mt-n4">
                <legend>Dados do colaborador</legend>
                <v-row class="mt-1">
                  <v-col cols="2" class="my-0 py-0">
                    <validation-provider v-slot="{ errors }" name="Almope" rules="required">
                      <v-text-field
                        outlined
                        dense
                        persistent-placeholder
                        placeholder="Almope"
                        label="Almope"
                        ref="almope"
                        :error-messages="errors"
                        required
                        v-model="dadosFormulario.almope"
                        @change="
                          dadosFormulario.almope.length <= 7 ? getDadosColaborador() : undefined
                        "
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="4" class="my-0 py-0">
                    <v-text-field
                      outlined
                      dense
                      persistent-placeholder
                      placeholder="Nome"
                      readonly
                      filled
                      label="Nome"
                      :value="dadosFormulario.camposView.nome"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3" class="my-0 py-0">
                    <v-text-field
                      outlined
                      dense
                      persistent-placeholder
                      placeholder="CPF"
                      readonly
                      filled
                      label="CPF"
                      :value="dadosFormulario.camposView.cpf"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3" class="my-0 py-0">
                    <v-text-field
                      outlined
                      dense
                      persistent-placeholder
                      placeholder="Campanha"
                      readonly
                      filled
                      label="Campanha"
                      :value="dadosFormulario.camposView.campanha"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="4" class="my-0 py-0">
                    <v-text-field
                      outlined
                      dense
                      persistent-placeholder
                      placeholder="Supervisor"
                      readonly
                      filled
                      label="Supervisor"
                      :value="dadosFormulario.camposView.superior1"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" class="my-0 py-0">
                    <v-text-field
                      outlined
                      dense
                      persistent-placeholder
                      placeholder="Coordenador"
                      readonly
                      filled
                      label="Coordenador"
                      :value="dadosFormulario.camposView.superior2"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" class="my-0 py-0">
                    <v-text-field
                      outlined
                      dense
                      persistent-placeholder
                      placeholder="Gerente"
                      readonly
                      filled
                      label="Gerente"
                      :value="dadosFormulario.camposView.superior3"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </fieldset>
              <fieldset>
                <legend>Informações do bloqueio</legend>
                <v-row class="mt-1">
                  <v-col cols="4" class="my-0 py-0">
                    <validation-provider v-slot="{ errors }" name="Login Claro" rules="required">
                      <v-select
                        :error-messages="errors"
                        required
                        persistent-placeholder
                        :items="['LOGIN CLARO', 'LOGIN NET', 'OS DOIS']"
                        v-model="dadosFormulario.tipoLogin"
                        outlined
                        dense
                        placeholder="Qual tipo de login"
                        label="Qual tipo de login"
                      ></v-select>
                    </validation-provider>
                  </v-col>
                  <v-col
                    cols="4"
                    class="my-0 py-0"
                    v-if="
                      dadosFormulario.tipoLogin === 'LOGIN CLARO' ||
                      dadosFormulario.tipoLogin === 'OS DOIS'
                    "
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Login Claro"
                      rules="required|max:10|min:7|numeric|starts_with_93_or_94"
                    >
                      <v-text-field
                        outlined
                        dense
                        persistent-placeholder
                        placeholder="Login Claro"
                        label="Login Claro"
                        :error-messages="errors"
                        required
                        v-model="dadosFormulario.preenchimento.loginClaro"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col
                    cols="4"
                    class="my-0 py-0"
                    v-if="
                      dadosFormulario.tipoLogin === 'LOGIN NET' ||
                      dadosFormulario.tipoLogin === 'OS DOIS'
                    "
                  >
                    <validation-provider
                      v-slot="{ errors }"
                      name="Login Net"
                      rules="required|max:10|min:7"
                    >
                      <v-text-field
                        outlined
                        dense
                        persistent-placeholder
                        placeholder="Login Net"
                        label="Login Net"
                        :error-messages="errors"
                        required
                        v-model="dadosFormulario.preenchimento.loginNet"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="4" class="my-0 py-0">
                    <div style="margin-top: -10px">
                      <DatePicker
                        label="Data bloqueio"
                        v-model="dadosFormulario.preenchimento.dataBloqueio"
                      />
                    </div>
                  </v-col>
                  <v-col cols="4" class="my-0 py-0">
                    <validation-provider v-slot="{ errors }" name="Login" rules="required">
                      <v-autocomplete
                        placeholder="Motivo"
                        label="Motivo"
                        :error-messages="errors"
                        required
                        outlined
                        :items="motivos"
                        item-text="VALOR_CAMPO"
                        dense
                        persistent-placeholder
                        v-model="dadosFormulario.preenchimento.motivo"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                </v-row>
              </fieldset>
            </v-col>
          </v-row>
          <v-btn type="submit" :disabled="invalid" color="success" class="mr-2">Salvar</v-btn>
          <v-btn @click="clearFormulario" color="warning">Limpar</v-btn>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>

<script>
  import { ValidationObserver, ValidationProvider, Validator } from 'vee-validate'
  import { GestaoBloqueadosService } from '@/data/services/tabuladores'

  import DatePicker from '@/shared/components/DatePicker/DatePicker.vue'
  import config from '@/core/config'
  import alerts from '@/mixins/alerts.mixins'

  import { loadFormOptions } from '@/utils/formOptions'

  Validator.extend('starts_with_93_or_94', {
    getMessage: field => `${field} deve iniciar com 93 ou 94`,
    validate: value => {
      return value.startsWith('93') || value.startsWith('94')
    }
  })

  export default {
    components: { ValidationObserver, ValidationProvider, DatePicker },
    data: () => ({
      dadosFormulario: {
        almope: null,
        tipoLogin: null,
        camposView: {
          nome: null,
          cpf: null,
          campanha: null,
          superior1: null,
          superior2: null,
          superior3: null
        },
        preenchimento: {
          loginClaro: null,
          loginNet: null,
          dataBloqueio: null,
          motivo: null
        }
      },
      motivos: [
        // { text: 'MATRIZ DE RECHAMADAS 72 HORAS', value: 'MATRIZ DE RECHAMADAS 72 HORAS' },
        // { text: 'CASOS ESPECIAIS - INSULTO', value: 'CASOS ESPECIAIS - INSULTO' },
        // { text: 'MATRIZ DE RETENÇÃO', value: 'MATRIZ DE RETENÇÃO' },
        // { text: 'ANTIFRAUDE - REAGENDAMENTO', value: 'ANTIFRAUDE - REAGENDAMENTO' },
        // { text: 'ANTIFRAUDE - ACERTO FINANCEIRO', value: 'ANTIFRAUDE - ACERTO FINANCEIRO' },
        // { text: 'ERRO OPERACIONAL - VENDA', value: 'ERRO OPERACIONAL - VENDA' },
      ]
    }),
    mixins: [alerts],
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async loadFormOptions() {
        await loadFormOptions('TABULADOR GESTAO BLOQUEADOS', 'MOTIVO_BLOQUEIO', 'motivos', this)
      },
      clearFormulario() {
        this.dadosFormulario.almope = null
        let newFormCamposView = Object.assign({}, this.dadosFormulario.camposView)
        let newFormPreenchimento = Object.assign({}, this.dadosFormulario.preenchimento)

        Object.keys(newFormCamposView).forEach(item => {
          newFormCamposView[item] = null
        })

        Object.keys(newFormPreenchimento).forEach(item => {
          if (item === 'dataBloqueio') return
          newFormPreenchimento[item] = null
        })

        this.dadosFormulario.camposView = newFormCamposView
        this.dadosFormulario.preenchimento = newFormPreenchimento
        this.$refs.observer.reset()
      },
      async submit() {
        const data = {
          ...this.dadosFormulario.preenchimento,
          ...this.dadosFormulario.camposView,
          cpf: this.dadosFormulario.camposView.cpf.replace(/\./g, '').replace('-', ''),
          almope: this.dadosFormulario.almope,
          almopeCadastro: this.usuario.almope,
          loginClaro: this.dadosFormulario.preenchimento.loginClaro,
          loginNet: this.dadosFormulario.preenchimento.loginNet
            ? this.dadosFormulario.preenchimento.loginNet.toUpperCase()
            : null
        }
        try {
          await GestaoBloqueadosService.salvarDadosTabulacao(data)
          this.toast('Registro salvo com sucesso', 'top-right', false, 3000, 'success')
          this.clearFormulario()
        } catch (Error) {
          if (Error.response.status === 406) {
            this.toast(
              'Já existe um cadastro para esse almope feito por outro usuário',
              'top-right',
              false,
              3000,
              'error'
            )
          }
        }
      },
      async getDadosColaborador() {
        try {
          let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/dados_cadastrais/${this.dadosFormulario.almope}`
          const res = await this.$api.get(urlData)
          const dados = res.data[0]

          const camposMapeados = {
            nome: dados.nome,
            cpf: dados.cpf.padStart(11, '0').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
            campanha: dados.regional,
            superior1: dados.superior1,
            superior2: dados.superior2,
            superior3: dados.superior3
          }

          Object.assign(this.dadosFormulario.camposView, camposMapeados)
        } catch (e) {
          return e
        }
      }
    },
    created() {
      this.loadFormOptions()
    }
  }
</script>
, DatePicker
<style scoped>
  fieldset {
    padding: 15px;
    border: 1px solid #3333;
    margin-bottom: 15px;
    border-radius: 8px;
  }

  legend {
    padding: 0 10px;
    font-size: 18.5px;
  }
</style>
