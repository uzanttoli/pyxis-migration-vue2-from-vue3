<template>
  <v-card>
    <title-negative-margin :title="title" className="rounded-r-xl"></title-negative-margin>
    <v-col>
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="3">
              <validation-provider
                v-slot="{ errors }"
                name="Número Contato"
                rules="required|min:14"
              >
                <v-text-field
                  placeholder="Número contato"
                  label="Número contato"
                  dense
                  outlined
                  v-mask="[masksComputed.telefoneBrFixo, masksComputed.telefoneBrMovel]"
                  required
                  :error-messages="errors"
                  v-model="form.NUMERO_TEL"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3">
              <validation-provider
                v-slot="{ errors }"
                name="Almope Transferência"
                rules="required|min:7"
              >
                <v-text-field
                  placeholder="Almope Transferência"
                  label="Almope Transferência"
                  dense
                  outlined
                  v-mask="[masksComputed.almope]"
                  required
                  :error-messages="errors"
                  v-model="form.ALMOPE_TRANSFERENCIA"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3">
              <validation-provider v-slot="{ errors }" name="UC" rules="required">
                <v-text-field
                  placeholder="UC"
                  label="UC"
                  dense
                  outlined
                  v-mask="['##########']"
                  required
                  :error-messages="errors"
                  v-model="form.UC"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3">
              <validation-provider v-slot="{ errors }" name="CPF Cliente" rules="required|min:14">
                <v-text-field
                  placeholder="CPF Cliente"
                  label="CPF Cliente"
                  dense
                  outlined
                  v-mask="[masksComputed.cpf]"
                  required
                  :error-messages="errors"
                  v-model="form.CPF_CLIENTE"
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="pa-0 ma-0" style="gap: 10px; display: flex; justify-content: end">
            <v-btn color="error" @click="clearForm()">Limpar</v-btn>
            <v-btn :disabled="invalid" type="submit" color="success" :loading="send">Salvar</v-btn>
          </v-row>
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
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      send: false,
      form: {
        NUMERO_TEL: null,
        ALMOPE_TRANSFERENCIA: null,
        UC: null,
        CPF_CLIENTE: null
      }
    }),
    mixins: [alerts],
    computed: {
      masksComputed() {
        return masks
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      produto() {
        return this.$store.getters.usuario.produto
      }
    },
    methods: {
      clearForm() {
        let newForm = Object.assign({}, this.form)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.form = newForm
        this.$refs.observer.reset()
      },
      async submit() {
        try {
          this.send = true
          this.form.ALMOPE_CADASTRO = this.usuarioAlmope
          this.form.PRODUTO = this.produto
          let urlData = `${config.baseUrl}api/shared/formularios/transferencia/indevida`
          await this.$api.post(urlData, this.form)
          this.toast('Tabulação salva!', 'top-right', false, 2000, 'success')
          this.clearForm()
          this.send = false
        } catch (e) {
          this.toast('Tabulação não foi salva, tente novamente!', 'top-right', false, 2000, 'error')
          this.send = false
        }
      }
    }
  }
</script>

<style></style>
