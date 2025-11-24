<template>
  <!-- <v-dialog v-model="dialogCadastroDeImprodutivo" width="900" persistent> -->
  <v-form ref="form" lazy-validation v-model="valid">
    <v-card ref="form">
      <title-negative-margin title="Cadastro de Improdutivos" className="rounded-r-xl">
        <v-tooltip bottom color="green">
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              @click="dialogValidacaoImprodutivo = !dialogValidacaoImprodutivo"
            >
              <v-icon size="20" color="info">fa-solid fa-user-check</v-icon>
            </v-btn>
          </template>
          <span>Validação de Improdutivos</span>
        </v-tooltip>
      </title-negative-margin>
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row class="ma-2">
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" name="almope" rules="required|min:7">
                <v-text-field
                  label="Almope"
                  outlined
                  required
                  dense
                  :error-messages="errors"
                  v-model="formCadastroImprodutivo.almope"
                  v-mask="masks.almope"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" name="motivo" rules="required">
                <v-select
                  outlined
                  dense
                  :items="motivosImprodutivos"
                  item-value="ID_IMPRODUTIVOS_MOTIVO"
                  item-text="MOTIVOS"
                  required
                  :error-messages="errors"
                  v-model="formCadastroImprodutivo.motivo"
                  label="Motivo"
                  no-data-text="Não há items"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col
              cols="4"
              v-if="
                formCadastroImprodutivo.motivo == 4 ||
                formCadastroImprodutivo.motivo == 6 ||
                formCadastroImprodutivo.motivo == 12 ||
                formCadastroImprodutivo.motivo == 13 ||
                formCadastroImprodutivo.motivo == 14 ||
                formCadastroImprodutivo.motivo == 15 ||
                formCadastroImprodutivo.motivo == 16
              "
            >
              <validation-provider v-slot="{ errors }" name="número chamado" rules="required">
                <v-text-field
                  label="Nª Chamado"
                  outlined
                  v-model="formCadastroImprodutivo.numeroChamado"
                  dense
                  v-mask="masks.chamado"
                  :error-messages="errors"
                  required
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12" style="margin-top: -20px">
              <validation-provider v-slot="{ errors }" name="observação" rules="required|min:15">
                <v-textarea
                  label="Observação"
                  :error-messages="errors"
                  dense
                  outlined
                  required
                  auto-grow
                  v-model="formCadastroImprodutivo.observacaoCadastro"
                  row-height="15"
                ></v-textarea>
              </validation-provider>
            </v-col>
          </v-row>
          <v-col>
            <v-row style="margin-top: -50px">
              <v-spacer></v-spacer>
              <v-btn color="success" class="ma-2" depressed type="submit" :disabled="invalid">
                Cadastrar
              </v-btn>
              <v-btn color="red white--text" class="ma-2" depressed @click="limparFormulario()">
                Limpar
              </v-btn>
            </v-row>
          </v-col>
        </form>
      </validation-observer>

      <validacao-improdutivo
        :dialogValidacaoImprodutivo="dialogValidacaoImprodutivo"
        @closeDialogValidacaoImprodutivo="dialogValidacaoImprodutivo = !dialogValidacaoImprodutivo"
      ></validacao-improdutivo>
    </v-card>
  </v-form>
  <!-- </v-dialog> -->
</template>

<script>
  import { ValidationProvider, ValidationObserver } from 'vee-validate'
  import config from '../../../../../core/config'

  import validacaoImprodutivo from './dialogs/validacao.vue'
  import masks from '../../../../../shared/masks/masks'
  import alerts from '../../../../../mixins/alerts.mixins'
  export default {
    components: {
      validacaoImprodutivo,
      ValidationProvider,
      ValidationObserver
    },
    props: {
      dialogCadastroDeImprodutivo: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      valid: true,
      dialogValidacaoImprodutivo: false,
      formCadastroImprodutivo: {
        almope: null,
        numeroChamado: null,
        motivo: null,
        observacaoCadastro: null
      }
    }),
    mixins: [alerts],
    computed: {
      motivosImprodutivos() {
        let motivosImprodutivos = this.$store.getters.motivosImprodutivos
        return motivosImprodutivos ? motivosImprodutivos : []
      },
      masks() {
        return masks
      }
    },
    methods: {
      limparFormulario() {
        let newForm = Object.assign({}, this.formCadastroImprodutivo)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formCadastroImprodutivo = newForm
        this.$refs.observer.reset()
      },
      loadMotivosImprodutivos() {
        this.$store.dispatch('loadMotivosImprodutivos')
      },
      async submit() {
        this.formCadastroImprodutivo.almopeCadastro = this.$store.getters.usuario.almope
        let urlData = `${config.baseUrl}api/shared/formularios/cadastro_improdutivo/insert`
        await this.$api.post(urlData, this.formCadastroImprodutivo)
        this.limparFormulario()
        this.toast('Cadastrado com sucesso!', 'top-right', false, 2000, 'success')
      }
    },
    watch: {
      dialogCadastroDeImprodutivo() {
        if (this.dialogCadastroDeImprodutivo === true) {
          this.loadMotivosImprodutivos()
        }
      }
    },
    created() {
      this.loadMotivosImprodutivos()
    }
  }
</script>

<style></style>
