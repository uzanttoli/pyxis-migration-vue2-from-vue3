<template>
  <v-card>
    <title-negative-margin
      title="Enel X"
      icon="fa-solid fa-receipt"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-col>
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="6" class="my-0 py-0">
              <validation-provider
                v-slot="{ errors }"
                name="telefone"
                rules="required|min:14|max:15"
              >
                <v-text-field
                  placeholder="Telefone Contato"
                  label="Telefone Contato"
                  dense
                  outlined
                  v-mask="[masks.telefoneBrFixo, masks.telefoneBrMovel]"
                  required
                  :error-messages="errors"
                  v-model="form.telefone"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="6" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="UC" rules="digits:7">
                <v-text-field
                  placeholder="UC"
                  label="UC"
                  dense
                  outlined
                  required
                  :error-messages="errors"
                  v-model="form.uc"
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <v-btn type="submit" :disabled="invalid" color="success">Enviar</v-btn>
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
      form: {
        telefone: null,
        uc: null
      }
    }),
    computed: {
      masks() {
        return masks
      }
    },
    mixins: [alerts],
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
        this.form.almope = this.$store.getters.usuario.almope
        let urlData = `${config.baseUrl}api/shared/formularios/enelx/inserir`
        await this.$api.post(urlData, this.form)
        this.toast('Dados cadastrados', 'top-right', false, 2000, 'success')
        this.clearForm()
      }
    }
  }
</script>

<style></style>
