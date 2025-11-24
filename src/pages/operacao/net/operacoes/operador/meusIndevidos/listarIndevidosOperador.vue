<template>
  <v-card>
    <v-toolbar flat color="primary" dark>
      <v-toolbar-title>Ocorrência Indevidas</v-toolbar-title>
    </v-toolbar>
    <v-tabs vertical v-if="meusIndevidos">
      <v-tab v-for="(item, i) in meusIndevidos" :key="i">
        <v-icon left>mdi-note</v-icon>
        {{ item.REFERENCIA }}
      </v-tab>
      <v-tab-item v-for="(item, i) in meusIndevidos" :key="i">
        <v-card flat>
          <v-card-text>
            <v-col cols="12">
              <v-row>
                <v-col cols="6">
                  <div>
                    <p>
                      <b>Ocorrencia:</b>
                      {{ item.OCORRENCIA }}
                    </p>
                    <p>
                      <b>Contrato/PU/Telefone:</b>
                      {{ item.REFERENCIA }}
                    </p>
                    <p>
                      <b>Tipo de Ocorrência:</b>
                      {{ item.TIPO_OC }}
                    </p>
                    <p>
                      <b>Observação da Tratativa:</b>
                      {{ item.OBSERVAÇÃO }}
                    </p>
                  </div>
                </v-col>
                <v-col cols="6">
                  <v-row>
                    <v-textarea
                      filled
                      auto-grow
                      label="Explique o motivo de concordar ou discordar"
                      rows="4"
                      v-model="formJustificativaIndevidas.OBSERVACAO_OPERADOR"
                      row-height="26"
                      shaped
                    ></v-textarea>
                  </v-row>
                  <v-btn
                    color="primary"
                    class="mr-2"
                    height="30"
                    :loading="loadingIndevidas"
                    :disabled="loadingIndevidas"
                    @click="updateDataFormJustificativaIndevidas(item, 1)"
                  >
                    <v-icon left>mdi-check</v-icon>
                    Aceito
                  </v-btn>
                  <v-btn
                    color="error"
                    height="30"
                    :loading="loadingIndevidas"
                    :disabled="loadingIndevidas"
                    @click="updateDataFormJustificativaIndevidas(item, 0)"
                  >
                    <v-icon left>mdi-close</v-icon>
                    Discordo
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
  export default {
    name: 'meus-indevidos-operador',
    props: {
      ocorrencia: {
        type: String,
        Default: 'Ocorrência'
      }
    },
    components: {},

    data: () => ({
      loadingIndevidas: false,
      dialog: true,
      formJustificativaIndevidas: {
        DATA_TRATAMENTO: '',
        ALMOPE_TRATAMENTO: '',
        OCORRENCIA: '',
        REFERENCIA: '',
        ALMOPE_ABERTURA: '',
        OBSERVAÇÃO: '',
        ACEITE_OPERADOR: '',
        OBSERVACAO_OPERADOR: '',
        ACEITE_SUPERVISOR: '',
        OBSERVACAO_SUPERVISOR: ''
      },
      formJustificativaIndevidasDefault: {
        DATA_TRATAMENTO: '',
        ALMOPE_TRATAMENTO: '',
        OCORRENCIA: '',
        REFERENCIA: '',
        ALMOPE_ABERTURA: '',
        OBSERVAÇÃO: '',
        ACEITE_OPERADOR: '',
        OBSERVACAO_OPERADOR: '',
        ACEITE_SUPERVISOR: '',
        OBSERVACAO_SUPERVISOR: ''
      }
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      meusIndevidos() {
        return this.$store.getters.meusIndevidos
      }
    },
    methods: {
      formIsValidIndevidas() {
        return this.formJustificativaIndevidas.OBSERVACAO_OPERADOR
      },
      resetarFormularioIndevidas() {
        return (
          this.loadMeusIndevidos(), (this.formJustificativaIndevidas.OBSERVACAO_OPERADOR = null)
        )
      },
      loadMeusIndevidos() {
        return this.$store.dispatch('loadMeusIndevidos', {
          usuario: this.usuarioAlmope
        })
      },
      updateDataFormJustificativaIndevidas(item, value) {
        if (item) {
          this.loadingIndevidas = true
          item.ACEITE_OPERADOR = value
          item.OBSERVACAO_OPERADOR = this.formJustificativaIndevidas.OBSERVACAO_OPERADOR
          this.$store.dispatch('updateDataFormJustificativaIndevidas', item).then(() => {
            this.loadingIndevidas = false
          })
          this.resetarFormularioIndevidas()
        }
      }
    },
    created() {
      this.loadMeusIndevidos()
    }
  }
</script>

<style></style>
