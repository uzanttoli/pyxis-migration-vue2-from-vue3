<template>
  <v-dialog v-model="openSolicitacoes" width="550">
    <v-card class="rounded-md">
      <v-card-title style="display: flex; justify-content: space-between; align-items: center">
        <div style="display: flex; align-items: center">
          <v-img
            height="35"
            width="35"
            src="../../../../../assets/img/geral/logo_wave_blue.png"
            class="mr-2 ml-n2"
          ></v-img>
          <v-divider vertical></v-divider>
          <span class="ml-2">Portal Almawave - Confirmação de dados</span>
        </div>
        <div>
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-btn icon @click="openSolicitacoes = false" v-on="on" v-bind="attrs">
                <v-icon>fas fa-close</v-icon>
              </v-btn>
            </template>
            <span>Fechar</span>
          </v-tooltip>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-alert type="info" elevation="0" outlined class="ma-2">
        Por favor, insira seu login e senha para acessar o portal Almawave (solicitações). Essa
        medida ajudará a reduzir o tempo necessário para abrir solicitações relacionadas a problemas
        com a VDI.
      </v-alert>
      <v-col>
        <v-row>
          <v-col>
            <validation-observer v-slot="{ invalid, validate }" ref="observer">
              <form @submit.prevent="validate().then(submit)">
                <v-row>
                  <v-col cols="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Email"
                      rules="required"
                    >
                      <v-text-field
                        placeholder="Informe seu email corporativo"
                        label="Informe seu email corporativo"
                        outlined
                        autofocus
                        dense
                        v-model="form.email"
                        :error-messages="errors"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" class="mt-n6">
                    <validation-provider v-slot="{ errors }" name="senha" rules="required">
                      <v-text-field
                        :type="visibilityPass ? 'text' : 'password'"
                        outlined
                        dense
                        placeholder="Informe sua senha de acesso"
                        label="Informe sua senha de acesso"
                        :error-messages="errors"
                        v-model="form.senha"
                      >
                        <template v-slot:append>
                          <v-btn
                            icon
                            style="margin-top: -5.2px"
                            @click="visiblePassword"
                            v-if="visibilityPass"
                          >
                            <v-icon>fa-regular fa-eye-slash</v-icon>
                          </v-btn>
                          <v-btn icon v-else style="margin-top: -5.2px" @click="visiblePassword">
                            <v-icon>fa-regular fa-eye</v-icon>
                          </v-btn>
                        </template>
                      </v-text-field>
                    </validation-provider>
                  </v-col>
                </v-row>
                <div style="display: flex; justify-content: end">
                  <v-btn
                    type="submit"
                    :disabled="invalid"
                    color="cyan accent-4"
                    class="white--text"
                  >
                    Salvar
                  </v-btn>
                </div>
              </form>
            </validation-observer>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../../../../core/config'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'

  // Validator.extend('email_valid', {
  //   getMessage: field =>
  //     `${field} deve conter o dominio almavivadobrasil.com.br ou almavivaexperience.com.br`,
  //   //   validate: (value) => /^[a-zA-Z]+$/.test(value),
  //   // validate: (value) => new RegExp(`^[\\w\\.-]+@${"almavivadobrasil.com.br"}$${"almavivaexpecience.com.br"}$`, "i").test(value),
  //   validate: value =>
  //     new RegExp(`^[\\w\\.-]+@(almavivadobrasil.com.br|almavivaexperience.com.br)$`, 'i').test(
  //       value
  //     )
  // })

  export default {
    components: { ValidationObserver, ValidationProvider },
    data: () => ({
      openSolicitacoes: false,
      visibilityPass: false,
      regionaisLiberadas: [
        'supervisao - net com bo ocorrência',
        'supervisao - net combo retenção',
        'supervisao net - abcdm ara',
        'supervisao - net combo nivel 1',
        'supervisao net mtf s2s ma bb',
        'supervisao net retencao ma cg',
        'supervisao net mtf ara s2s',
        'supervisao net - 1º nivel ma cg',
        'supervisao net combo ativacao',
        'supervisao net mtf ret bb',
        'supervisao - net bko ara',
        'net retencao ma cg',
        'supervisao net 1º nivel ma',
        'supervisao claro tv ret sl',
        'supervisao claro tv retencao pos pago mcz',
        'supervisao claro n1 tv pos pago jf',
        'supervisao claro tv n1 ara'
      ],
      form: {
        email: null,
        senha: null
      }
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async submit() {
        this.form.usuario = this.usuario.almope
        this.form.id = this.usuario.id
        let urlData = `${config.baseUrl}api/shared/automacoes/credenciais/cadastrar`
        await this.$api.post(urlData, this.form)
        this.openSolicitacoes = false
      },
      loadExisteCadastro() {
        if (this.regionaisLiberadas.includes(this.usuario.regional.toLowerCase())) {
          let urlData = `${config.baseUrl}api/shared/automacoes/credenciais/cadastro_valido`
          this.$api
            .get(urlData, {
              params: {
                id: this.usuario.id
              }
            })
            .then(res => {
              this.openSolicitacoes = res.data ?? false

              //   if (res.data) { //   evitar recarregamento de dados
              //     let dadosUser = JSON.parse(localStorage.getItem("usuario"));
              //     dadosUser.automacoes = res.data;
              //     localStorage.setItem("usuario", JSON.stringify(dadosUser));
              //   }
            })
        }
      },
      visiblePassword() {
        this.visibilityPass = !this.visibilityPass
      }
    },
    created() {
      this.loadExisteCadastro()
    }
  }
</script>

<style></style>
