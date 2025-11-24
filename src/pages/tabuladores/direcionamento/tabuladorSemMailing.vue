<template>
  <v-container v-if="dadosTab != ''">
    <v-card class="rounded-xl" elevation="1">
      <v-card-title class="card white--text">
        <!-- <v-icon color="white" class="mr-2">fa-solid fa-tablet-button</v-icon> -->
        <p class="pa-0 ma-0 text-capitalize">
          {{ dadosTab[0].titulo.toLowerCase() }}
        </p>
        <v-spacer></v-spacer>
        <v-btn icon to="/pyxis/tabuladores/">
          <v-icon color="white">fas fa-close</v-icon>
        </v-btn>
      </v-card-title>
      <!-- <pre>{{ listarCampos }}</pre> -->
      <v-divider></v-divider>
      <v-col>
        <!-- <pre>{{dadosForm}}</pre> -->
        <validation-observer v-slot="{ validate, invalid }" ref="observer">
          <form @submit.prevent="validate().then(submit)">
            <fieldset>
              <legend>Preenchimento</legend>
              <v-row class="mb-2">
                <v-col v-for="(item, i) in listarCampos" :key="i" cols="4" class="mb-n7">
                  <validation-provider
                    :rules="
                      item.OBRIGATORIO
                        ? `required${
                            item.ATRIBUTO == 'text' || item.ATRIBUTO == null
                              ? ''
                              : '|' + item.ATRIBUTO
                          }`
                        : ''
                    "
                    :name="item.NOME_CAMPO_TAB"
                    v-slot="{ errors }"
                  >
                    <!-- <pre>{{mascara(item.MASCARA_CAMPO)}}</pre> -->
                    <component
                      v-if="item.MASCARA_CAMPO"
                      :is="item.TEG"
                      :label="item.NOME_CAMPO_TAB"
                      outlined
                      dense
                      :error-messages="errors"
                      no-data-text="Não há items"
                      :items="item.items || []"
                      item-text="NOME_CAMPO_TAB"
                      item-value="ID_VALOR_MODULO_ARVORE"
                      v-mask="mascara(item.MASCARA_CAMPO)"
                      v-model="dadosForm[item.NOME_CAMPO_TAB]"
                    ></component>
                    <component
                      v-else
                      :is="item.TEG"
                      :label="item.NOME_CAMPO_TAB"
                      outlined
                      dense
                      :error-messages="errors"
                      no-data-text="Não há items"
                      :items="item.items || []"
                      item-text="NOME_CAMPO_TAB"
                      item-value="ID_VALOR_MODULO_ARVORE"
                      v-model="dadosForm[item.NOME_CAMPO_TAB]"
                    ></component>
                  </validation-provider>
                </v-col>
              </v-row>
            </fieldset>
            <div style="display: flex; gap: 10px">
              <v-btn :disabled="invalid" color="success" type="submit" :loading="send">
                Salvar
              </v-btn>
              <v-btn color="error" @click="clearForm">Limpar</v-btn>
            </div>
          </form>
        </validation-observer>
      </v-col>
    </v-card>
  </v-container>
</template>

<script>
  import { ValidationObserver, ValidationProvider, Validator } from 'vee-validate'
  import VTextField from 'vuetify/lib/components/VTextField'
  import VSelect from 'vuetify/lib/components/VSelect'
  import config from '../../../core/config'
  import moment from 'moment'
  import alerts from '../../../mixins/alerts.mixins'

  Validator.extend('dateTimeFormat', {
    validate(value) {
      // Use moment.js para validar o formato
      return moment(value, 'DD/MM/YYYY HH:mm', true).isValid()
    },
    getMessage: field => `${field} O campo deve estar no formato "dd/MM/yyyy hh:mm`
  })

  Validator.extend('dateFormat', {
    validate(value) {
      if (value.length === 10) {
        const year = parseInt(value.split('/')[2], 10)
        const currentYear = new Date().getFullYear()
        const nextYear = currentYear + 1

        if (year === currentYear || year === nextYear) {
          return moment(value, 'DD/MM/YYYY', true).isValid()
        }
      }
      return false
    },
    getMessage: field => `${field} deve estar no formato "DD/MM/YYYY" e ser válido.`
  })

  export default {
    components: {
      ValidationObserver,
      ValidationProvider,
      VTextField,
      VSelect
    },
    props: {},
    data: () => ({
      dadosForm: {},
      listarCampos: [],
      send: false,
      dadosTab: []
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    mixins: [alerts],
    methods: {
      mascara(item) {
        if (!item) return
        return item.split(',')
      },
      clearForm() {
        let newForm = Object.assign({}, this.dadosForm)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.dadosForm = newForm
        this.$refs.observer.reset()
      },
      async submit() {
        try {
          this.send = true
          this.dadosForm.almopeCadastro = this.usuario.almope
          let urlData = `${config.baseUrl}api/shared/py_tabuladores/config/tabulacao`
          await this.$api.post(urlData, this.dadosForm)
          this.toast('Tabulação salva com sucesso!', 'bottom-right', false, 2500, 'success')
          this.clearForm()
          this.send = false
        } catch (e) {
          this.toast(
            'Não foi possível salvar, tente novamente!',
            'bottom-right',
            false,
            2500,
            'warning'
          )
          this.send = false
        }
      },
      loadListarCampos() {
        let urlData = `${config.baseUrl}api/shared/py_tabuladores/campos/listar`
        this.$api
          .get(urlData, {
            params: {
              id_tab: 2,
              id_campo: '',
              retorno_consulta: 'LISTAR CAMPOS'
            }
          })
          .then(async res => {
            this.listarCampos = res.data
            const campos = res.data

            // Adiciona dinamicamente os itens para cada campo `v-select`
            const updatedCampos = await Promise.all(
              campos.map(async campo => {
                if (campo.TEG === 'v-select') {
                  // Carrega os itens dinamicamente de acordo com o campo
                  campo.items = await this.loadItemsForSelect(campo.ID_MODULO_ARVORE)
                }
                return campo
              })
            )
            this.listarCampos = updatedCampos

            res.data?.forEach(element => {
              this.$set(this.dadosForm, element.NOME_CAMPO_TAB, null)
            })
          })
      },
      async loadItemsForSelect(idCampo) {
        try {
          let urlData = `${config.baseUrl}api/shared/py_tabuladores/campos/listar`
          const response = await this.$api.get(urlData, {
            params: {
              id_tab: this.$route.query.id_tabulador,
              id_campo: idCampo,
              retorno_consulta: 'LISTAR VALOR CAMPOS'
            }
          })
          return response.data
        } catch (error) {
          console.error(`Erro ao carregar itens para o campo ${idCampo}:`, error)
          return []
        }
      },
      loadDadosTab() {
        let urlData = `${config.baseUrl}api/shared/py_tabuladores/config/dados_tabulador`
        this.$api
          .get(urlData, {
            params: {
              id_tab: this.$route.query.id_tabulador,
              almope: this.usuario.almope,
              perfil: this.usuario.filtro,
              regional: this.usuario.regional
            }
          })
          .then(res => {
            if (res.data.length > 0) {
              this.dadosTab = res.data
            } else {
              this.$router.push('/pyxis/tabuladores')
            }
          })
      }
    },
    created() {
      this.loadListarCampos()
      this.loadDadosTab()
    }
  }
</script>

<style scoped>
  fieldset {
    padding: 15px;
    border: 1px solid #3333;
    margin-bottom: 15px;
  }
  legend {
    padding: 0 10px;
    font-size: 15px;
  }

  .card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(
      90deg,
      rgb(0, 183, 255) 0%,
      rgb(0, 183, 255) 5%,
      rgb(255, 48, 255) 100%
    );
  }
</style>
