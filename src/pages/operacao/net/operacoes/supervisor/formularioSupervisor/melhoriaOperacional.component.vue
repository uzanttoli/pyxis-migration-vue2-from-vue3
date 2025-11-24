<template>
  <!-- v-model="dialogMelhoria" -->
  <v-dialog
    :model-value="dialogMelhoria"
    @update:modelValue="val => $emit('update:dialogMelhoria', val)"
    width="1000"
    persistent
  >
    <v-col class="pa-0 ma-0 overflow-hidden">
      <v-card class="py-2">
        <v-row class="pa-2 mt-n7">
          <v-col>
            <title-negative-margin :title="title">
              <v-btn icon @click="$emit('update:close')"><v-icon>fa fa-close</v-icon></v-btn>
            </title-negative-margin>

            <v-textarea
              auto-grow
              filled
              label="Descreva aqui..."
              rows="4"
              counter="500"
              maxlength="500"
              row-height="30"
              v-model="formularioMelhoria.descricao"
            ></v-textarea>
            <v-row class="pr-3 my-1" align="end" justify="end">
              <v-btn
                class="rounded-r-xl rounded-bl-xl"
                color="success"
                :loading="loading"
                :disabled="!this.formIsValid() || loading"
                @click="salvarInformacoesNoBancoPesquisaPyxis()"
              >
                Enviar
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-dialog>
</template>

<script>
  import config from '@/core/config'
  import alerts from '@/mixins/alerts.mixins'
  export default {
    name: 'form-supervisor-component',
    mixins: [alerts],
    components: {},
    props: {
      title: {
        type: String,
        default: 'Sugestão'
      },
      dialogMelhoria: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      loading: false,
      alertSuccess: false,
      formularioMelhoria: {
        descricao: null
      }
    }),
    computed: {
      almope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      formIsValid() {
        return this.formularioMelhoria.descricao
      },
      async salvarInformacoesNoBancoPesquisaPyxis() {
        try {
          this.formularioMelhoria.almope = this.almope
          this.formularioMelhoria.tipoPesquisa = 'GAMIFICATION'
          let urlData = `${config.baseUrl}api/shared/pesquisa_pyxis/create/`

          let getFormData = object =>
            Object.keys(object).reduce((formData, key) => {
              formData.append(key, object[key])
              return formData
            }, new FormData())
          await this.$api.post(urlData, getFormData(this.formularioMelhoria)).then(res => {
            this.toast(res.data, 'bottom-end', false, 3500, 'success')
            this.formularioMelhoria.descricao = null
            this.$emit('update:close')
          })
        } catch (error) {
          this.toast(error.status, 'bottom-end', false, 3500, 'error')
        }
      }
    }
  }
</script>

<style scoped>
  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }
</style>
