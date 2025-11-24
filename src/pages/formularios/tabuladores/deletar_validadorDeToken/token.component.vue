<template>
  <v-dialog persistent v-model="dialogToken" width="1300px">
    <v-card>
      <title-negative-margin title="Validação de Token">
        <v-btn icon @click="$emit('closeDialogToken')"><v-icon>mdi-close</v-icon></v-btn>
      </title-negative-margin>
      <v-card class="overflow-auto">
        <v-data-table dense hide-default-footer>
          <template v-slot:header>
            <thead>
              <tr>
                <th class="text-center">Normalizou?</th>
                <th class="text-center">Almope</th>
                <th class="text-center">Nome</th>
                <th class="text-center">Supervisor</th>
                <th class="text-center">Regional</th>
              </tr>
            </thead>
          </template>
          <template v-slot:body>
            <tbody>
              <tr v-for="(item, i) in base" :key="i" class="text-center">
                <td>
                  <v-tooltip bottom color="green">
                    <template v-slot:activator="{ attrs, on }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        icon
                        @click="dadosValidacaoToken(item, 1, 1, 1), sendFormTokenNormalizado()"
                      >
                        <v-icon color="green">mdi-check</v-icon>
                      </v-btn>
                    </template>
                    <span>Sim</span>
                  </v-tooltip>
                  <v-tooltip bottom color="red">
                    <template v-slot:activator="{ attrs, on }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        icon
                        @click=";(validarToken = !validarToken), dadosValidacaoToken(item, null)"
                      >
                        <v-icon color="red">mdi-close</v-icon>
                      </v-btn>
                    </template>
                    <span>Não</span>
                  </v-tooltip>
                </td>
                <td>{{ item.ALMOPE }}</td>
                <td>{{ item.NOME }}</td>
                <td>{{ item.SUPERIOR1 }}</td>
                <td>{{ item.REGIONAL }}</td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
        <v-dialog v-model="validarToken" width="600px">
          <v-card>
            <title-negative-margin title="Validar"></title-negative-margin>
            <v-col cols="12">
              <v-select
                dense
                outlined
                label="Token Funcionando?"
                :items="itemsValidacao"
                item-text="VALIDACAO"
                item-value="ID_VALIDACAO"
                v-model="itemValidacaoSelecionado"
                no-data-text="Não há items"
                @change="loadMotivoToken()"
              ></v-select>
              <v-select
                dense
                outlined
                label="Motivo"
                :items="itemsMotivo"
                item-text="MOTIVO"
                item-value="ID_MOTIVO"
                no-data-text="Não há items"
                v-model="itemMotivoSelecionado"
                @change="loadSubmotivoToken()"
              ></v-select>
              <v-select
                v-if="this.itemValidacaoSelecionado != 3"
                dense
                outlined
                label="SubMotivo"
                :items="itemsSubmotivo"
                no-data-text="Não há items"
                item-text="SUBMOTIVO"
                v-model="itemsSubmotivoSelecionado"
                item-value="ID_SUBMOTIVO"
              ></v-select>
              <v-row>
                <v-spacer></v-spacer>
                <button-send
                  :validateForm="!this.formIsValid()"
                  name="Enviar"
                  @sendFormData="sendFormTokenFalha()"
                ></button-send>
                <button-delete name="Limpar" @deleteInfoForm="clearForm()"></button-delete>
                <v-spacer></v-spacer>
              </v-row>
            </v-col>
            <v-overlay :value="validandoDadosTokenFalha">
              <v-card color="primary" dark>
                <v-card-text>
                  Validando... Aguarde!
                  <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-overlay>
          </v-card>
        </v-dialog>
        <v-overlay :value="validandoDadosTokenNormalizado">
          <v-card color="primary" dark>
            <v-card-text>
              Validando... Aguarde!
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-overlay>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../../../core/config'
  export default {
    name: 'validacao-token',
    props: {
      dialogToken: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      loading: true,
      validandoDadosTokenNormalizado: false,
      validandoDadosTokenFalha: false,
      base: [],
      itemsValidacao: [],
      itemsMotivo: [],
      itemsSubmotivo: [],
      itemValidacaoSelecionado: null,
      itemMotivoSelecionado: null,
      itemsSubmotivoSelecionado: null,
      validarToken: false,
      formValidarToken: {
        ID_TOKEN: null,
        ALMOPE: null,
        NOME: null,
        SUPERIOR1: null,
        SUPERIOR2: null,
        REGIONAL: null,
        AGRUPAMENTO: null,
        STATUS: null,
        SITUACAO: null,
        CPF: null,
        RH: null,
        LOGIN_CLARO: null,
        LOGIN_T: null,
        TOKEN_FUNCIONANDO: null,
        MOTIVO: null,
        SUBMOTIVO: null
      },
      formValidarTokenDefault: {
        ID_TOKEN: null,
        ALMOPE: null,
        NOME: null,
        SUPERIOR1: null,
        SUPERIOR2: null,
        REGIONAL: null,
        AGRUPAMENTO: null,
        STATUS: null,
        SITUACAO: null,
        CPF: null,
        RH: null,
        LOGIN_CLARO: null,
        LOGIN_T: null,
        TOKEN_FUNCIONANDO: null,
        MOTIVO: null,
        SUBMOTIVO: null
      }
    }),
    computed: {
      usuarioNome() {
        return this.$store.getters.usuario.nome
      }
    },
    methods: {
      formIsValid() {
        if (this.itemValidacaoSelecionado == 3) {
          return this.itemValidacaoSelecionado, this.itemMotivoSelecionado
        } else {
          return (
            this.itemValidacaoSelecionado,
            this.itemMotivoSelecionado,
            this.itemsSubmotivoSelecionado
          )
        }
      },
      clearForm() {
        return (
          (this.itemValidacaoSelecionado = null),
          (this.itemMotivoSelecionado = null),
          (this.itemsSubmotivoSelecionado = null)
        )
      },
      sendFormTokenNormalizado() {
        this.validandoDadosTokenNormalizado = true
        let urlData = `${config.baseUrl}api/shared/formularios/validacao_token/update`
        let getFormData = object =>
          Object.keys(object).reduce((FormData, key) => {
            FormData.append(key, object[key])
            return FormData
          }, new FormData())
        this.$api.post(urlData, getFormData(this.formValidarToken)).then(() => {
          this.loadBase()
          setTimeout(() => {
            this.validandoDadosTokenNormalizado = false
            this.clearForm()
          }, 3000)
        })
      },
      sendFormTokenFalha() {
        this.validandoDadosTokenFalha = true
        let urlData = `${config.baseUrl}api/shared/formularios/validacao_token/update`
        let getFormData = object =>
          Object.keys(object).reduce((FormData, key) => {
            FormData.append(key, object[key])
            return FormData
          }, new FormData())
        if (
          this.itemMotivoSelecionado == 4 ||
          this.itemMotivoSelecionado == 10 ||
          this.itemMotivoSelecionado == 11
        ) {
          const data = {
            ID_TOKEN: this.formValidarToken.ID_TOKEN,
            TOKEN_FUNCIONANDO: this.itemValidacaoSelecionado,
            MOTIVO: this.itemMotivoSelecionado,
            SUBMOTIVO: 13
          }
          this.$api.post(urlData, getFormData(data)).then(() => {
            this.loadBase()
            setTimeout(() => {
              this.validandoDadosTokenFalha = false
              this.clearForm()
              this.validarToken = false
            }, 3000)
          })
        } else {
          const data = {
            ID_TOKEN: this.formValidarToken.ID_TOKEN,
            TOKEN_FUNCIONANDO: this.itemValidacaoSelecionado,
            MOTIVO: this.itemMotivoSelecionado,
            SUBMOTIVO: this.itemsSubmotivoSelecionado
          }
          this.$api.post(urlData, getFormData(data)).then(() => {
            this.loadBase()
            setTimeout(() => {
              this.validandoDadosTokenFalha = false
              this.clearForm()
              this.validarToken = false
            }, 3000)
          })
        }
      },

      dadosValidacaoToken(item, value1, value2, value3) {
        return (
          (this.formValidarToken.ID_TOKEN = item.ID_TOKEN),
          (this.formValidarToken.ALMOPE = item.ALMOPE),
          (this.formValidarToken.NOME = item.NOME),
          (this.formValidarToken.SUPERIOR1 = item.SUPERIOR1),
          (this.formValidarToken.SUPERIOR2 = item.SUPERIOR2),
          (this.formValidarToken.REGIONAL = item.REGIONAL),
          (this.formValidarToken.AGRUPAMENTO = item.AGRUPAMENTO),
          (this.formValidarToken.STATUS = item.STATUS),
          (this.formValidarToken.SITUACAO = item.SITUACAO),
          (this.formValidarToken.CPF = item.CPF),
          (this.formValidarToken.RH = item.RH),
          (this.formValidarToken.LOGIN_CLARO = item.LOGIN_CLARO),
          (this.formValidarToken.LOGIN_T = item.LOGIN_T),
          (this.formValidarToken.TOKEN_FUNCIONANDO = value1),
          (this.formValidarToken.MOTIVO = value2),
          (this.formValidarToken.SUBMOTIVO = value3)
        )
      },
      loadBase() {
        let urlData = `${config.baseUrl}api/shared/formularios/validacao_token/listar_cadastro_token/${this.usuarioNome}`
        this.$api.get(urlData).then(res => {
          this.base = res.data
        })
      },
      loadValidacaoToken() {
        let urlData = `${config.baseUrl}api/shared/formularios/validacao_token/listar_validacao_token/`
        this.$api.get(urlData).then(res => {
          this.itemsValidacao = res.data
        })
      },
      loadMotivoToken() {
        let urlData = `${config.baseUrl}api/shared/formularios/validacao_token/listar_motivo_token/${this.itemValidacaoSelecionado}`
        this.$api.get(urlData).then(res => {
          this.itemsMotivo = res.data
        })
      },
      loadSubmotivoToken() {
        let urlData = `${config.baseUrl}api/shared/formularios/validacao_token/listar_submotivo_token/${this.itemMotivoSelecionado}`
        this.$api.get(urlData).then(res => {
          this.itemsSubmotivo = res.data
        })
      }
    },
    watch: {
      dialogToken() {
        if (this.dialogToken == true) {
          this.loadValidacaoToken()
          this.loadBase()
        }
      }
    },
    created() {}
  }
</script>

<style scoped></style>
