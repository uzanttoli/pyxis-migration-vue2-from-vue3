<template>
  <v-card>
    <title-negative-margin
      title="Fatura Digital/Optin"
      className="rounded-r-xl"
    ></title-negative-margin>
    <validation-observer v-slot="{ invalid, validate }" ref="observer">
      <form @submit.prevent="validate().then(submit)">
        <v-col>
          <v-row>
            <v-col cols="3" class="mb-n4">
              <validation-provider
                v-slot="{ errors }"
                rules="required|min:9|max:12"
                name="protocolo"
              >
                <v-text-field
                  label="Protocolo"
                  outlined
                  dense
                  required
                  :error-messages="errors"
                  v-model="formFatura.protocolo"
                  v-mask="['#########', '##########', '############']"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="mb-n4">
              <validation-provider v-slot="{ errors }" rules="required" name="DX atendimento">
                <v-select
                  label="DX Atendimento"
                  no-data-text="DX's indisponiveis"
                  :items="dxAtendimento"
                  :error-messages="errors"
                  item-text="OPTION_FIELD"
                  required
                  v-model="formFatura.dxAtendimento"
                  outlined
                  dense
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="mb-n4">
              <validation-provider v-slot="{ errors }" rules="required" name="motivo contato">
                <v-select
                  label="Motivo de Contato"
                  no-data-text="Motivos indisponiveis"
                  :items="motivoContato"
                  :error-messages="errors"
                  required
                  item-text="OPTION_FIELD"
                  v-model="formFatura.motivoContato"
                  outlined
                  dense
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="mb-n4">
              <validation-provider v-slot="{ errors }" rules="required" name="submotivo contato">
                <v-select
                  label="SubMotivo de Contato"
                  no-data-text="Submotivos indisponiveis"
                  :items="subMotivoContato"
                  item-text="OPTION_FIELD"
                  :error-messages="errors"
                  required
                  v-model="formFatura.subMotivoContato"
                  outlined
                  dense
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="mb-n4">
              <validation-provider v-slot="{ errors }" rules="required" name="solicitação">
                <v-select
                  label="Solicitação"
                  no-data-text="Motivos indisponiveis"
                  :items="listaTipoSolicitacao"
                  item-text="text"
                  :error-messages="errors"
                  required
                  v-model="formFatura.tipoSolicitacao"
                  outlined
                  dense
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="mb-n4">
              <validation-provider v-slot="{ errors }" name="titular" rules="required">
                <v-select
                  label="Titular?"
                  no-data-text="Opções indisponiveis"
                  :items="titular"
                  required
                  :error-messages="errors"
                  item-text="OPTION_FIELD"
                  v-model="formFatura.titular"
                  outlined
                  dense
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="mb-n4">
              <validation-provider
                v-slot="{ errors }"
                name="instalação"
                rules="required|numeric|max:15"
              >
                <v-text-field
                  label="Instalação"
                  :error-messages="errors"
                  placeholder="Somente numeros"
                  v-model="formFatura.instalacao"
                  outlined
                  dense
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="mb-n4">
              <validation-provider v-slot="{ errors }" rules="required" name="aceitou oferta?">
                <v-select
                  label="Aceitou?"
                  no-data-text="Opções indisponiveis"
                  :items="aceitouFaturaDigital"
                  item-text="OPTION_FIELD"
                  v-model="formFatura.aceitouFaturaDigital"
                  :error-messages="errors"
                  outlined
                  required
                  dense
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col v-if="formFatura.aceitouFaturaDigital == 'NÃO'" cols="3" class="mb-n4">
              <validation-provider v-slot="{ errors }" name="motivo não aceite" rules="required">
                <v-select
                  label="Motivo não aceite!"
                  no-data-text="Opções indisponiveis"
                  :items="naoAceitou"
                  item-text="OPTION_FIELD"
                  v-model="formFatura.motivoNaoAceite"
                  outlined
                  required
                  :error-messages="errors"
                  dense
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3">
              <validation-provider v-slot="{ errors }" name="Ligação nova" rules="required">
                <v-select
                  label="Ligação nova"
                  no-data-text="Opções indisponiveis"
                  :items="simNao"
                  :error-messages="errors"
                  dense
                  v-model="formFatura.ligacaoNova"
                  outlined
                  required
                ></v-select>
              </validation-provider>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="mt-n7">
          <v-btn type="submit" color="success" :disabled="invalid" :loading="salvando">
            Salvar
          </v-btn>
          <v-btn color="error" @click="clearForm()" class="ml-2">Limpar</v-btn>
        </v-col>
      </form>
    </validation-observer>
  </v-card>
</template>

<script>
  import config from '../../../../core/config'

  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  export default {
    components: { ValidationObserver, ValidationProvider },
    props: {
      dialogFaturaDigital: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      opcoes: [],
      simNao: ['SIM', 'NAO'],
      salvando: false,
      listaTipoSolicitacao: [{ text: 'FATURA DIGITAL' }, { text: 'OPTIN' }],
      formFatura: {
        dxAtendimento: '',
        motivoContato: '',
        titular: '',
        aceitouFaturaDigital: '',
        instalacao: '',
        motivoNaoAceite: '',
        tipoSolicitacao: '',
        subMotivoContato: '',
        protocolo: '',
        ligacaoNova: ''
      }
    }),
    computed: {
      dxAtendimento() {
        let opcoes = this.opcoes.filter(e => e.TABULATION_FIELD == 'DX ATENDIMENTO')
        return opcoes
      },
      motivoContato() {
        let opcoes = this.opcoes.filter(e => e.TABULATION_FIELD == 'MOTIVO DE CONTATO')
        return opcoes
      },
      titular() {
        let opcoes = this.opcoes.filter(e => e.TABULATION_FIELD == 'TITULAR')
        return opcoes
      },
      aceitouFaturaDigital() {
        let opcoes = this.opcoes.filter(e => e.TABULATION_FIELD == 'CLIENTE ACEITOU FATURA DIGITAL')
        return opcoes
      },
      naoAceitou() {
        let opcoes = this.opcoes.filter(e => e.TABULATION_FIELD == 'SE NÃO, QUAL MOTIVO?')
        return opcoes
      },
      subMotivoContato() {
        let opcoes = this.opcoes.filter(e => e.TABULATION_FIELD == 'SUBMOTIVO DE CONTATO')
        return opcoes
      }
    },
    methods: {
      clearForm() {
        let newForm = Object.assign({}, this.formFatura)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formFatura = newForm
        this.$refs.observer.reset()
      },
      async submit() {
        try {
          this.salvando = true
          let data = {
            almope: this.$store.getters.usuario.almope,
            dxAtendimento: this.formFatura.dxAtendimento,
            motivoContato: this.formFatura.motivoContato,
            titular: this.formFatura.titular == 'SIM' ? 1 : 0,
            instalacao: this.formFatura.instalacao,
            aceitouFaturaDigital: this.formFatura.aceitouFaturaDigital == 'SIM' ? 1 : 0,
            motivoNaoAceite: this.formFatura.motivoNaoAceite
              ? this.formFatura.motivoNaoAceite
              : null,
            tipoSolicitacao: this.formFatura.tipoSolicitacao,
            subMotivoContato: this.formFatura.subMotivoContato,
            protocolo: this.formFatura.protocolo
          }
          let urlData = `${config.baseUrl}api/shared/formularios/fatura_digital/fatura_digital`
          const getFormData = object =>
            Object.keys(object).reduce((FormData, key) => {
              FormData.append(key, object[key])
              return FormData
            }, new FormData())
          await this.$api.post(urlData, getFormData(data))
          const Toast = this.$swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: toast => {
              toast.addEventListener('mouseenter', this.$swal.stopTimer)
              toast.addEventListener('mouseleave', this.$swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'success',
            title: 'Tabulação cadastrada com sucesso!'
          })
          this.clearForm()
          this.salvando = false
        } catch (error) {
          const Toast = this.$swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: toast => {
              toast.addEventListener('mouseenter', this.$swal.stopTimer)
              toast.addEventListener('mouseleave', this.$swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'error',
            title: 'Não foi possível enviar, tente novamente!'
          })
        }
      },
      loadOpcoes() {
        let urlData = `${config.baseUrl}api/shared/formularios/fatura_digital/opcoes_enel`
        this.$api.get(urlData).then(res => {
          this.opcoes = res.data
        })
      }
    },
    created() {
      this.loadOpcoes()
    }
  }
</script>

<style></style>
