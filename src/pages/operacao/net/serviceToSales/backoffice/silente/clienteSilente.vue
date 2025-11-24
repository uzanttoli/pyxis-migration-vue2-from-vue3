<template>
  <div>
    <section>
      <v-card elevation="0" outlined>
        <title-negative-margin title="Cliente Silente" className="rounded-r-xl">
          <v-btn icon to="/pyxis/service-to-sales/backoffice/">
            <v-icon>fa-solid fa-xmark</v-icon>
          </v-btn>
        </title-negative-margin>
        <validation-observer v-slot="{ invalid }" ref="observer">
          <form @submit.prevent="submit">
            <v-col>
              <fieldset>
                <legend>Dados</legend>
                <v-row>
                  <v-col v-for="(item, i) in items" :key="i" :cols="item.TAMANHOCOL" class="mb-n4">
                    <v-text-field
                      outlined
                      dense
                      :placeholder="item.CAMPO"
                      :label="item.CAMPO"
                      :readonly="item.READONLY"
                      :value="dados ? dados[item.VALOR_CAMPO] : ''"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </fieldset>
              <fieldset>
                <legend>Tratativa</legend>
                <v-row>
                  <v-col>
                    <validation-provider
                      v-slot="{ errors }"
                      name="Cliente tem uso de dados?"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        placeholder="Cliente tem uso de dados?"
                        label="Cliente tem uso de dados?"
                        :items="['SIM', 'NÃO']"
                        v-model="formSilente.USO_DE_DADOS"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col>
                    <validation-provider
                      v-slot="{ errors }"
                      name="Cliente tem uso de voz?"
                      rules="required"
                    >
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        placeholder="Cliente tem uso de voz?"
                        label="Cliente tem uso de voz?"
                        :items="['SIM', 'NÃO']"
                        v-model="formSilente.USO_DE_VOZ"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col>
                    <validation-provider
                      v-slot="{ errors }"
                      name="Existe fatura paga?"
                      rules="required"
                    >
                      <!-- :rules="1 != 1 ? 'required' : ''" -->
                      <v-autocomplete
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        placeholder="Existe fatura paga?"
                        label="Existe fatura paga?"
                        :items="['SIM', 'NÃO']"
                        v-model="formSilente.EXISTE_FATURA_PAGA"
                      ></v-autocomplete>
                      <!-- :required="1 != 1 ? true : false" -->
                    </validation-provider>
                  </v-col>
                </v-row>
              </fieldset>
            </v-col>
            <v-row class="my-2 mx-3" justify="start" style="gap: 10px">
              <v-btn :disabled="invalid" depressed color="success" type="submit">Salvar</v-btn>
              <v-btn depressed color="info" @click="novoCaso">Novo caso</v-btn>
            </v-row>
          </form>
        </validation-observer>
      </v-card>
    </section>
  </div>
</template>

<script>
  import { ValidationProvider, ValidationObserver } from 'vee-validate'
  import config from '../../../../../../core/config'
  import alerts from '../../../../../../mixins/alerts.mixins'
  export default {
    components: { ValidationProvider, ValidationObserver },
    data: () => ({
      dados: [],
      formSilente: {
        USO_DE_DADOS: null,
        USO_DE_VOZ: null,
        EXISTE_FATURA_PAGA: null
      },
      items: [
        {
          CAMPO: 'Núm. Caso',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'NUM_CASO',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Cód. Contrato',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'CONTRATO',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Cidade',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'DSC_MUNICIPIO_BI',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Data Venda',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'DATA_VENDA_BRUTA',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Data Ativação',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'DATA_MOVIMENTO',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Login Vendedor',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'LOGIN_USUARIO',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Plano Vendido',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'DSC_PRODUTO_BACKEND',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Nome Vendedor',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'NOME_VENDEDOR',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Supervisor',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'SUPERVISOR',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Coordenador',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'COORDENADOR',
          ISMASK: false,
          MASCARA: null
        },
        {
          CAMPO: 'Status Ura Checkout',
          READONLY: true,
          TAMANHOCOL: 3,
          VALOR_CAMPO: 'STATUS_URA_CHECKOUT',
          ISMASK: false,
          MASCARA: null
        }
      ]
    }),
    mixins: [alerts],
    methods: {
      clearForm() {
        let newForm = Object.assign({}, this.formSilente)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formSilente = newForm
        this.$refs.observer.reset()
      },
      novoCaso() {
        let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/novo_caso_client_silent`
        this.$api
          .get(urlData, {
            params: {
              almope: this.$store.getters.usuario.almope
            }
          })
          .then(res => {
            this.dados = res?.data[0]
          })
      },
      async submit() {
        try {
          let isValid = await this.$refs.observer.validate()
          if (isValid) {
            this.formSilente.NUM_CASO = this.dados.NUM_CASO
            let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/finalizar_caso_client_silente`
            this.$api.post(urlData, this.formSilente)
            await this.toast('Dados salvos com sucesso!', 'top-right', false, 2000, 'success')
            this.clearForm()
            this.dados = ''
          }
        } catch (e) {
          this.toast('Dados não foram salvos!', 'top-right', false, 2000, 'error')
        }
      }
    }
  }
</script>

<style scoped>
  section {
    padding: 10px;
  }
  fieldset {
    padding: 15px;
    border: 1px solid #3333;
    margin-bottom: 15px;
  }
  legend {
    padding: 0 10px;
    font-size: 20px;
  }
</style>
