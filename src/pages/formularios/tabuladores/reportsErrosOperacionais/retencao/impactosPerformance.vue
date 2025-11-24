<template>
  <v-card>
    <title-negative-margin
      title="Report Erros Operacionais"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-col>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <v-row class="mx-2" style="gap: 10px">
            <v-col class="ma-0 pa-0">
              <v-text-field
                placeholder="Login"
                dense
                outlined
                label="Login"
                :value="loginT"
                readonly
              ></v-text-field>
            </v-col>
            <v-col class="ma-0 pa-0">
              <validation-provider
                v-slot="{ errors }"
                name="codigo contrato"
                rules="required|min:3|max:3"
              >
                <v-text-field
                  :error-messages="errors"
                  placeholder="Código contrato"
                  v-mask="['###']"
                  label="Código contrato"
                  dense
                  outlined
                  v-model="formErrosOperacionais.codContrato"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="contrato" rules="required|min:10">
                <v-text-field
                  :error-messages="errors"
                  placeholder="Núm. contrato"
                  v-mask="['########-#']"
                  label="Núm. contrato"
                  dense
                  outlined
                  v-model="formErrosOperacionais.numContrato"
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="mx-2" style="gap: 10px">
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="quem errou?" rules="required">
                <v-select
                  :error-messages="errors"
                  placeholder="Quem errou?"
                  label="Quem errou?"
                  :items="itemsQuemErrou"
                  item-text="text"
                  dense
                  outlined
                  v-model="formErrosOperacionais.quemErrou"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="descrição do erro" rules="required">
                <v-select
                  :error-messages="errors"
                  placeholder="Descrição do erro"
                  label="Descrição do erro"
                  :items="itemsDescricaoErro"
                  item-text="text"
                  dense
                  outlined
                  v-model="formErrosOperacionais.descricaoErro"
                ></v-select>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="mx-2" style="gap: 10px">
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="observação" rules="required|max:255">
                <v-textarea
                  outlined
                  counter="255"
                  placeholder="Descrição breve"
                  label="Descrição breve"
                  auto-grow
                  max-height="450"
                  maxlength="255"
                  :error-messages="errors"
                  v-model="formErrosOperacionais.observacao"
                ></v-textarea>
              </validation-provider>
            </v-col>
          </v-row>
          <v-col class="mt-2">
            <v-row justify="end">
              <v-btn depressed color="error" class="mr-2 rounded-r-xl rounded-bl-xl">Limpar</v-btn>
              <v-btn
                type="submit"
                :disabled="invalid"
                depressed
                color="success"
                class="mr-2 rounded-r-xl rounded-bl-xl"
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
  import config from '../../../../../core/config'
  import alerts from '../../../../../mixins/alerts.mixins'
  export default {
    components: { ValidationObserver, ValidationProvider },
    data: () => ({
      formErrosOperacionais: {
        codContrato: null,
        numContrato: null,
        quemErrou: null,
        descricaoErro: null,
        observacao: null
      },
      itemsQuemErrou: [
        { text: 'REVERSÃO' },
        { text: 'VENDAS' },
        { text: 'MTF' },
        { text: 'LOJA' },
        { text: 'OUTROS' }
      ],
      itemsDescricaoErro: [
        { text: 'CANCELAMENTO O.S REVERSÃO' },
        { text: 'ERROS MTF - SEM SEGMENTO' },
        { text: '2 CONTRATOS NO MESMO ENDEREÇO - MODIFICANDO COMPLEMENTO ' },
        { text: 'LOJA NÃO REALIZOU O CANCELAMENTO' }
      ]
    }),
    mixins: [alerts],
    computed: {
      loginT() {
        return this.$store.getters.usuario.login_t
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      limparForm() {
        let newForm = Object.assign({}, this.formErrosOperacionais)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.$refs.observer.reset()
        this.formErrosOperacionais = newForm
      },
      async submit() {
        try {
          let isValid = await this.$refs.observer.validate()
          if (isValid) {
            this.formErrosOperacionais.almope = this.usuarioAlmope
            let urlData = `${config.baseUrl}api/shared/formularios/report_erros_operacionais/impactos_performance`
            await this.$api.post(urlData, this.formErrosOperacionais)
            this.limparForm()
            this.toast('Dados salvos com sucesso!', 'top-rigth', false, 3000, 'success')
          }
        } catch (e) {
          this.toast('Dados não foram salvos! Tente novamente.', 'top-rigth', false, 3000, 'error')
        }
      }
    }
  }
</script>

<style></style>
