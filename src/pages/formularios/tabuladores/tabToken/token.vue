<template>
  <v-card>
    <title-negative-margin title="Tabulador Célula Ativação"></title-negative-margin>
    <v-col>
      <validation-observer v-slot="{ invalid }" ref="observer">
        <form @submit.prevent="submit">
          <v-row class="mx-2" style="gap: 10px">
            <v-col class="ma-0 pa-0">
              <validation-provider
                v-slot="{ errors }"
                name="contrato"
                rules="required|min:14|max:14"
              >
                <v-text-field
                  placeholder="Contrato"
                  label="Contrato"
                  dense
                  outlined
                  required
                  class=""
                  :error-messages="errors"
                  v-mask="[masks.contratoComCodCidade]"
                  v-model="formToken.CONTRATO"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="ma-0 pa-0">
              <validation-provider
                v-slot="{ errors }"
                name="telefone"
                rules="required|min:14|max:15"
              >
                <v-text-field
                  v-mask="[masks.telefoneBrFixo, masks.telefoneBrMovel]"
                  placeholder="Telefone contato"
                  label="Telefone contato"
                  dense
                  required
                  outlined
                  :error-messages="errors"
                  v-model="formToken.TELEFONE"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="motivo contato" rules="required">
                <v-autocomplete
                  hide-no-data
                  placeholder="Motivo contato"
                  label="Motivo contato"
                  :items="motivoContato"
                  item-text="NOME_SUP_OPCAO1"
                  item-value="NOME_SUP_OPCAO1"
                  dense
                  outlined
                  required
                  :error-messages="errors"
                  v-model="formToken.MOTIVO_CONTATO"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="mx-2" style="gap: 10px">
            <v-col class="pa-0 ma-0">
              <validation-provider v-slot="{ errors }" name="submotivo contato" rules="required">
                <v-autocomplete
                  hide-no-data
                  placeholder="Submotivo contato"
                  label="Submotivo contato"
                  dense
                  outlined
                  required
                  :items="submotivoContato"
                  item-text="NOME_SUP_OPCAO2"
                  item-value="NOME_SUP_OPCAO2"
                  :error-messages="errors"
                  v-model="formToken.SUBMOTIVO_CONTATO"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="problema resolvido" rules="required">
                <v-select
                  placeholder="Foi possivel revolver problema no atendimento?"
                  label="Foi possivel revolver problema no atendimento?"
                  dense
                  required
                  outlined
                  :error-messages="errors"
                  v-model="formToken.PROBLEMA_RESOL_ATEND"
                  :items="['SIM', 'NAO']"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col class="pa-0 ma-0" v-if="formToken.PROBLEMA_RESOL_ATEND == 'NAO'">
              <validation-provider
                v-slot="{ errors }"
                name="porque nao foi resolvido"
                rules="required"
              >
                <v-autocomplete
                  :error-messages="errors"
                  dense
                  required
                  outlined
                  label="Porque não foi resolvida?"
                  placeholder="Porque não foi resolvida?"
                  v-model="formToken.PQ_N_RESOLVIDO"
                  :items="problemaNaoResolvido"
                  item-text="NOME_SUP_OPCAO2"
                  item-value="NOME_SUP_OPCAO2"
                  hide-no-data
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col
              class="ma-0 pa-0"
              v-if="
                formToken.MOTIVO_CONTATO == 'RECEBIMENTO DO CHIP' &&
                formToken.PROBLEMA_RESOL_ATEND == 'SIM'
              "
            >
              <validation-provider
                v-slot="{ errors }"
                name="prazo passado para cliente"
                rules="required"
              >
                <v-autocomplete
                  :error-messages="errors"
                  dense
                  required
                  outlined
                  no-data-text="Não há item aqui!"
                  label="Qual prazo o cliente informado p/ entrega do chip?"
                  placeholder="Qual prazo o cliente informado p/ entrega do chip?"
                  v-model="formToken.PRAZO_INFOR_CLIENTE"
                  :items="['1 DIA', '2 DIAS', '3 DIAS', '4 DIAS', '5 DIAS']"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="mx-2" style="gap: 10px">
            <v-col
              class="pa-0 ma-0"
              v-if="
                formToken.MOTIVO_CONTATO == 'RECEBIMENTO DO CHIP' &&
                formToken.PROBLEMA_RESOL_ATEND == 'SIM' &&
                formToken.PRAZO_INFOR_CLIENTE
              "
            >
              <validation-provider
                v-slot="{ errors }"
                name="prazo dia util ou corrido"
                rules="required"
              >
                <v-autocomplete
                  :error-messages="errors"
                  dense
                  required
                  outlined
                  no-data-text="Não há item aqui!"
                  label="Prazo informado dia util ou corrido?"
                  placeholder="Prazo informado dia util ou corrido?"
                  :items="['UTIL', 'CORRIDO']"
                  v-model="formToken.TIPO_DIA"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-col class="mt-2">
            <v-row justify="end">
              <v-btn
                color="error"
                @click="clearForm"
                depressed
                class="rounded-r-xl rounded-bl-xl mr-2"
              >
                Limpar
              </v-btn>
              <v-btn
                type="submit"
                :disabled="invalid"
                depressed
                color="success"
                :loading="loading"
                class="rounded-r-xl rounded-bl-xl"
              >
                Salvar
              </v-btn>
            </v-row>
          </v-col>
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
      formToken: {
        CONTRATO: null,
        TELEFONE: null,
        MOTIVO_CONTATO: null,
        SUBMOTIVO_CONTATO: null,
        PROBLEMA_RESOL_ATEND: null,
        PQ_N_RESOLVIDO: null,
        PRAZO_INFOR_CLIENTE: null,
        TIPO_DIA: null
      },
      dadosValidacao: [],
      loading: false
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
      motivoContato() {
        let dados = this.dadosValidacao
        return dados.filter(dado => {
          return dado.NOME_CAMPO == 'SUB_MOTIVO_CONTATO'
        })
      },
      submotivoContato() {
        let dados = this.dadosValidacao
        return dados.filter(dado => {
          return dado.NOME_SUP_OPCAO1 == this.formToken.MOTIVO_CONTATO
        })
      },
      problemaNaoResolvido() {
        let dados = this.dadosValidacao
        return dados.filter(dado => {
          return (
            dado.NOME_SUP_OPCAO1 ==
            this.formToken.MOTIVO_CONTATO + ' - ' + this.formToken.PROBLEMA_RESOL_ATEND
          )
        })
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      async saveTab() {
        try {
          this.loading = true
          let urlData = `${config.baseUrl}api/shared/formularios/token/salvar`
          this.formToken.ALMOPE_CADASTRO = this.usuarioAlmope
          await this.$api.post(urlData, this.formToken)
          this.toast('Cadastro realizado com sucesso!', 'top-right', false, 2000, 'success')
          this.loading = false
          this.clearForm()
        } catch (e) {
          this.toast(
            'Cadastro não foi realizada, favor verifique os dados e tente novamente!',
            'top-right',
            false,
            2000,
            'error'
          )
          this.loading = false
        }
      },
      loadListDadosValidacao() {
        let urlData = `${config.baseUrl}api/shared/formularios/token/listar_validacao`
        this.$api.get(urlData).then(res => {
          this.dadosValidacao = res.data
        })
      },
      clearForm() {
        let newForm = Object.assign({}, this.formToken)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formToken = newForm
        this.$refs.observer.reset()
      },
      async submit() {
        const isValid = await this.$refs.observer.validate()
        if (isValid) {
          await this.saveTab()
        }
      }
    },
    created() {
      this.loadListDadosValidacao()
    }
  }
</script>

<style></style>
