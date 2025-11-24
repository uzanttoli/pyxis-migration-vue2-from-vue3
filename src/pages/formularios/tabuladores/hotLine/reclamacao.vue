<template>
  <v-card>
    <title-negative-margin
      title="Reclamações Lojistas"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-col>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <v-row class="mx-2" style="gap: 10px">
            <v-col class="pa-0 ma-0">
              <validation-provider
                v-slot="{ errors }"
                rules="required|min:14|max:14"
                name="numero do contrato"
              >
                <v-text-field
                  required
                  placeholder="Contrato"
                  label="Contrato"
                  :error-messages="errors"
                  outlined
                  dense
                  v-mask="[masks.contratoComCodCidade]"
                  v-model="formReclamacao.NUMERO_CONTRATO"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pa-0 ma-0">
              <validation-provider
                v-slot="{ errors }"
                rules="required|alpha_spaces"
                name="nome do lojista"
              >
                <v-text-field
                  required
                  placeholder="Nome do lojista"
                  label="Nome do lojista"
                  :error-messages="errors"
                  outlined
                  dense
                  v-model="formReclamacao.NOME_LOJISTA"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pa-0 ma-0">
              <validation-provider v-slot="{ errors }" rules="required" name="cidade lojista">
                <v-autocomplete
                  required
                  placeholder="Cidade que lojista trabalha"
                  label="Cidade que lojista trabalha"
                  :error-messages="errors"
                  dense
                  outlined
                  hide-no-data
                  :items="listCidades"
                  item-text="NOME_CIDADE"
                  v-model="formReclamacao.CIDADE_LOJISTA"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="mx-2" style="gap: 10px">
            <v-col class="pa-0 ma-0">
              <validation-provider v-slot="{ errors }" rules="required" name="telefone">
                <v-text-field
                  required
                  placeholder="Número que lojista ligou"
                  label="Número que lojista ligou"
                  :error-messages="errors"
                  outlined
                  dense
                  v-model="formReclamacao.TELEFONE"
                  v-mask="[masks.telefoneBrMovel, masks.telefoneBrFixo]"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pa-0 ma-0">
              <validation-provider v-slot="{ errors }" rules="required" name="motivo reclamacao">
                <v-select
                  required
                  placeholder="Motivo reclamação"
                  label="Motivo reclamação"
                  :error-messages="errors"
                  outlined
                  dense
                  v-model="formReclamacao.MOTIVO_RECLAMACAO"
                  :items="itemsReclamacao"
                  item-text="text"
                ></v-select>
              </validation-provider>
            </v-col>
          </v-row>
          <v-col>
            <v-row justify="end" class="mr-1 mr-n1">
              <v-btn
                depressed
                @click="clearForm"
                class="rounded-r-xl rounded-bl-xl mr-2"
                color="error"
              >
                Limpar
              </v-btn>
              <v-btn
                type="submit"
                :disabled="invalid"
                depressed
                class="rounded-r-xl rounded-bl-xl"
                color="success"
              >
                Enviar
              </v-btn>
            </v-row>
          </v-col>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>

<script>
  import { ValidationProvider, ValidationObserver } from 'vee-validate'
  import config from '../../../../core/config'
  import masks from '../../../../shared/masks/masks'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    components: { ValidationProvider, ValidationObserver },
    data: () => ({
      listCidades: [],
      formReclamacao: {
        NUMERO_CONTRATO: null,
        NOME_LOJISTA: null,
        CIDADE_LOJISTA: null,
        TELEFONE: null,
        MOTIVO_RECLAMACAO: null
      },
      itemsReclamacao: [
        { text: 'Rispidez/ Ofensa' },
        { text: 'Não concorda em confirmar dados' },
        { text: 'Se recusa a fazer a biometria' }
      ]
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      async submit() {
        try {
          const isValid = await this.$refs.observer.validate()
          if (isValid) {
            this.formReclamacao.ALMOPE_CADASTRO = this.usuarioAlmope
            let urlData = `${config.baseUrl}api/shared/formularios/hotline/reclamacoes_lojistas/`
            await this.$api.post(urlData, this.formReclamacao)
            this.toast('Cadastro realizado com sucesso!', 'top-right', false, 2500, 'success')
            this.clearForm()
          }
        } catch (error) {
          this.toast(
            'Cadastro não foi realizado, favor tentar novamente. Caso erro persista sinalizar ao Supervisor.',
            'top-right',
            false,
            2500,
            'error'
          )
        }
      },
      clearForm() {
        let newForm = Object.assign({}, this.formReclamacao)
        Object.keys(newForm).forEach(item => (newForm[item] = null))
        this.formReclamacao = newForm
        this.$refs.observer.reset()
      },
      loadCidades() {
        let urlData = `${config.baseUrl}api/shared/utils/geral/cidades`
        this.$api.get(urlData).then(res => {
          this.listCidades = res.data
        })
      }
    },
    created() {
      this.loadCidades()
    }
  }
</script>

<style></style>
