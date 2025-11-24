<template>
  <v-container fluid class="mt-n5">
    <v-card class="rounded-xl" elevation="0">
      <v-col>
        <validation-observer v-slot="{ invalid, validate }" ref="observer">
          <form @submit.prevent="validate().then(submit)">
            <fieldset>
              <legend>
                Dados para tratativa
                <span v-if="dadosNovoCaso != ''">{{ `caso nª: ${dadosNovoCaso.NUM_CASO}` }}</span>
              </legend>
              <div style="display: flex; flex-wrap: wrap">
                <v-col cols="4" class="py-0">
                  <v-text-field
                    filled
                    outlined
                    placeholder="Data da Venda"
                    label="Data da Venda"
                    readonly
                    dense
                    :value="formatarData(dadosNovoCaso.DATA_VENDA_BRUTA)"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-text-field
                    filled
                    outlined
                    placeholder="Login da Venda"
                    label="Login da Venda"
                    readonly
                    dense
                    :value="dadosNovoCaso.LOGIN_VENDA"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-text-field
                    filled
                    outlined
                    placeholder="Contrato"
                    label="Contrato"
                    readonly
                    dense
                    :value="dadosNovoCaso.NUM_CONTRATO"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-text-field
                    filled
                    outlined
                    placeholder="Cidade do Contrato"
                    label="Cidade do Contrato"
                    readonly
                    dense
                    :value="dadosNovoCaso.DSC_MUNICIPIO_BI"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-text-field
                    filled
                    outlined
                    placeholder="Data da Tratativa"
                    label="Data da Tratativa"
                    readonly
                    dense
                    :value="formatarData(dadosNovoCaso.DATA_TRATAMENTO)"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="py-0">
                  <v-text-field
                    filled
                    outlined
                    placeholder="Tipo Ativação"
                    label="Tipo Ativação"
                    readonly
                    dense
                    :value="formatarData(dadosNovoCaso.TIPO_ATIVACAO)"
                  ></v-text-field>
                </v-col>
              </div>
            </fieldset>
            <fieldset>
              <legend>Tratativa</legend>
              <div style="display: flex; flex-wrap: wrap">
                <v-col cols="4" class="py-0">
                  <validation-provider v-slot="{ errors }" rules="required" name="venda ativada">
                    <v-select
                      outlined
                      required
                      placeholder="Venda ativada?"
                      label="Venda ativada?"
                      dense
                      :error-messages="errors"
                      :items="['SIM', 'NAO']"
                      v-model="formCheck.vendaAtivada"
                    ></v-select>
                  </validation-provider>
                </v-col>
                <v-col cols="4" class="py-0" v-if="formCheck.vendaAtivada == 'SIM'">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required|date_format:dd/MM/yyyy"
                    name="data ativacao"
                  >
                    <v-text-field
                      outlined
                      :error-messages="errors"
                      placeholder="Data da Ativação"
                      label="Data da Ativação"
                      dense
                      required
                      v-model="formCheck.dataAtivacao"
                      v-mask="[masks.data]"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="4" class="py-0" v-if="formCheck.vendaAtivada == 'SIM'">
                  <validation-provider v-slot="{ errors }" rules="required" name="msisdn ativado">
                    <v-text-field
                      outlined
                      required
                      :error-messages="errors"
                      placeholder="MSISDN Ativado"
                      label="MSISDN Ativado"
                      dense
                      v-mask="[masks.telefoneBrFixo]"
                      v-model="formCheck.msisdnAtivado"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="4" class="py-0" v-if="formCheck.vendaAtivada == 'SIM'">
                  <validation-provider v-slot="{ errors }" rules="required" name="login ativacao">
                    <v-text-field
                      outlined
                      required
                      :error-messages="errors"
                      placeholder="Login da ativação"
                      label="Login da ativação"
                      dense
                      v-model="formCheck.loginAtivacao"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </div>
            </fieldset>
            <fieldset>
              <legend>Anexar evidências</legend>
              <v-alert border="left" colored-border type="info" style="border: 1px solid #3333">
                Utilize a tecla "
                <strong>PrtScr</strong>
                " - Print Screen e após use o "
                <strong>Ctrl + V</strong>
                " para colar nos campos indicados abaixo.
              </v-alert>
              <div style="display: flex">
                <v-handle-paste-img
                  title="Print NETSMS"
                  nameField="Cole o Print NETSMS do contrato com segmento CM"
                  @update:file-img="handleFile1"
                  :clearImg="clearImgs"
                ></v-handle-paste-img>
                <v-handle-paste-img
                  title="Print OC MK1"
                  nameField="Cole o Print da MK1 da ativação BKO"
                  @update:file-img="handleFile2"
                  :clearImg="clearImgs"
                ></v-handle-paste-img>
              </div>
              <div style="display: flex">
                <v-handle-paste-img
                  title="Print OC CO1 - CM1"
                  nameField="Cole o Print da CO1 – CM1 com os dados da linha"
                  @update:file-img="handleFile3"
                  :clearImg="clearImgs"
                ></v-handle-paste-img>
                <v-handle-paste-img
                  title="Print Mobile"
                  nameField="Cole o Print do Mobile da Aba CONTA mostrando que o cliente é CM e que o contrato é o mesmo que o do NETSMS"
                  @update:file-img="handleFile4"
                  :clearImg="clearImgs"
                ></v-handle-paste-img>
              </div>
            </fieldset>
            <v-col class="mt-2">
              <v-row style="display: flex; justify-content: space-between">
                <div>
                  <v-btn @click="clearForm" color="error" class="mr-2 rounded-r-xl rounded-bl-xl">
                    Limpar
                  </v-btn>
                  <!-- @click="atualizar" -->
                  <v-btn
                    type="submit"
                    color="success"
                    class="mr-2 rounded-r-xl rounded-bl-xl"
                    :disabled="invalid"
                  >
                    Salvar
                  </v-btn>
                  <v-btn
                    color="info"
                    class="rounded-r-xl rounded-bl-xl"
                    @click="loadNovoCaso"
                    :disabled="dadosNovoCaso != ''"
                  >
                    Novo
                  </v-btn>
                </div>
                <div>
                  <v-btn
                    color="orange"
                    class="rounded-r-xl rounded-bl-xl white--text"
                    @click="atualizar(4)"
                    :disabled="dadosNovoCaso == ''"
                  >
                    Mailing Inválido
                  </v-btn>
                </div>
              </v-row>
            </v-col>
          </form>
        </validation-observer>
      </v-col>
      <loading
        textAtualizacao="Atualizando..."
        :showLoading="isSend"
        :uploadPercentage="uploadPercentage"
      ></loading>
      <loadhastag :activeMsg="true" msg="Carregando..." :envioDados="loading"></loadhastag>
    </v-card>
  </v-container>
</template>

<script>
  import VHandlePasteImg from '../../../../../../shared/components/vuetifyComponents/VHandlePasteImg.vue'
  import config from '../../../../../../core/config'
  import axios from 'axios'

  import loadhastag from '../../../../../../shared/components/load/loadHastag.vue'
  import Loading from '../../../../../download/relatorios/loading.vue'
  import alerts from '../../../../../../mixins/alerts.mixins'
  import masks from '../../../../../../shared/masks/masks'

  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  // import CentralBottom from "./centralBottom.vue";
  export default {
    components: {
      VHandlePasteImg,
      Loading,
      loadhastag,
      ValidationObserver,
      ValidationProvider
    },
    data: () => ({
      imageData: null,
      fileImg: null,
      nameFileImg: null,
      formCheck: {
        dataAtivacao: null,
        msisdnAtivado: null,
        loginAtivacao: null,
        vendaAtivada: null,
        statusCheck: 3,
        img1: null,
        img2: null,
        img3: null,
        img4: null
      },
      isSend: false,
      uploadPercentage: 0,
      clearImgs: false,
      loading: false,
      dadosNovoCaso: [],
      tiles: [
        {
          img: 'keep.png',
          title: 'Download das evidências',
          href: '/pyxis/service-to-sales/checkout-vendas-pend-atv/download-evidencias'
        }
      ]
    }),
    mixins: [alerts],
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      masks() {
        return masks
      },
      nameArquive() {
        if (!this.dadosNovoCaso) return
        return `${this.dadosNovoCaso.NUM_CASO}_${this.dadosNovoCaso.DSC_MUNICIPIO_BI?.split(
          ' '
        ).join('_')}_${
          this.dadosNovoCaso.NUM_CONTRATO
        }_${this.dadosNovoCaso.DATA_VENDA_BRUTA?.split('/').join('')}`
        // .reverse()
      },
      filtro() {
        return this.$store.getters.usuario.filtro
      }
    },
    methods: {
      formatarData(string) {
        if (!string) return
        return string.split('-').reverse().join('/')
      },
      formIsValid() {
        return (
          this.dadosNovoCaso.NUM_CASO &&
          this.formCheck.dataAtivacao &&
          this.formCheck.msisdnAtivado &&
          this.formCheck.loginAtivacao &&
          (this.formCheck.img1 || this.formCheck.img2 || this.formCheck.img3 || this.formCheck.img4)
        )
      },
      handleFile1(e) {
        this.formCheck.img1 = e
      },
      handleFile2(e) {
        this.formCheck.img2 = e
      },
      handleFile3(e) {
        this.formCheck.img3 = e
      },
      handleFile4(e) {
        this.formCheck.img4 = e
      },
      loadNovoCaso() {
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/service_to_sales/validacao_venda/novo_caso`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuarioAlmope,
              tabulador: 1
            }
          })
          .then(res => {
            this.dadosNovoCaso = res.data[0]
            this.loading = false
          })
          .catch(function (e) {
            this.loading = false
            console.error(e)
          })
      },
      salvarDados(statusCheck) {
        this.formCheck.idCaso = this.dadosNovoCaso.NUM_CASO
        this.formCheck.statusCheck = statusCheck
        this.formCheck.tabulador = 1
        let urlData = `${config.baseUrl}api/shared/service_to_sales/validacao_venda/finalizar_caso`
        this.$api
          .post(urlData, this.formCheck)
          .then(() => {
            this.toast('Tratativa realizada com sucesso!', 'top-right', false, 2000, 'success')
            this.clearForm()
            this.dadosNovoCaso = ''
          })
          .catch(() => {
            this.toast(
              'Ops! Não conseguimos finalizar sua tratativa, por favor verifique os dados e tente novamente.',
              'top-right',
              false,
              2000,
              'error'
            )
          })
      },
      async submit(statusCheck = 3) {
        try {
          if (this.dadosNovoCaso?.NUM_CASO) {
            if (this.formCheck.vendaAtivada == 'SIM') {
              if (
                this.formCheck.img1 ||
                this.formCheck.img2 ||
                this.formCheck.img3 ||
                this.formCheck.img4
              ) {
                this.isSend = true
                const formData = new FormData()

                formData.append('images[]', this.formCheck.img1)
                formData.append('images[]', this.formCheck.img2)
                formData.append('images[]', this.formCheck.img3)
                formData.append('images[]', this.formCheck.img4)

                let urlUpload = `http://10.64.175.49:4300/receptivo/index.php/api/checkout_vendas_pend_atv/imagem/upload/${this.nameArquive}`
                await axios
                  .post(urlUpload, formData, {
                    onUploadProgress: progressEvent => {
                      const percentage = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                      )
                      this.uploadPercentage = percentage
                    }
                  })
                  .then(() => {
                    this.salvarDados(statusCheck)
                  })

                this.isSend = false
              } else {
                this.toast('Necessário no minimo uma evidência!', 'top-right', false, 2000, 'info')
              }
            } else {
              if (this.dadosNovoCaso?.NUM_CASO) {
                this.salvarDados(statusCheck)
              }
            }
          }
        } catch (e) {
          console.error(e)
        }
      },
      clearForm() {
        let newForm = Object.assign({}, this.formCheck)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formCheck = newForm
        this.clearImgs = true
        this.$refs.observer.reset()
        setTimeout(() => {
          this.clearImgs = false
        }, 1500)
      }
    }
  }
</script>

<style scoped>
  fieldset {
    padding: 10px;
    border: 1px solid #3333;
  }
  legend {
    padding: 5px;
    font-size: 20px;
  }
</style>
