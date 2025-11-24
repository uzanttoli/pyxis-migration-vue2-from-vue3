<template>
  <v-card>
    <title-negative-margin
      title="Report Erro Solar"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-col>
      <ValidationObserver ref="reportErroSolar" v-slot="{ invalid }">
        <form ref="reportErroSolar" @submit.prevent="submit">
          <v-row>
            <v-col cols="4" class="mb-n5">
              <v-text-field
                outlined
                dense
                placeholder="Seu Login Do Solar"
                label="Seu Login Do Solar"
                :value="login"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="4" class="mb-n5">
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|min:14|max:14"
                name="Contrato"
              >
                <v-text-field
                  v-mask="[masks.contratoComCodCidade]"
                  placeholder="Contrato"
                  label="Contrato"
                  dense
                  outlined
                  :error-messages="errors"
                  v-model="formReport.contrato"
                  required
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col cols="4" class="mb-n5">
              <ValidationProvider v-slot="{ errors }" rules="required" name="Erro em qual jorndada">
                <v-select
                  required
                  placeholder="Erro em qual jornada?"
                  label="Erro em qual jornada?"
                  dense
                  outlined
                  v-model="formReport.erroJornada"
                  :error-messages="errors"
                  :items="items"
                  item-text="NOME_CAMPO"
                  item-value="NOME_CAMPO"
                  no-data-text="Não há items"
                ></v-select>
              </ValidationProvider>
            </v-col>

            <v-col cols="4" v-if="formReport.erroJornada == 'RENTABILIDADE'" class="mb-n5">
              <validation-provider v-slot="{ errors }" name="tipo solicitação" rules="required">
                <v-select
                  outlined
                  dense
                  :error-messages="errors"
                  label="Tipo solicitação"
                  placeholder="Tipo solicitação"
                  no-data-text="Não há itens"
                  :items="itemsJson[0]['itemsQualTipoSolicitacao']"
                  v-model="formReport.tipoSolicitacao"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="4" v-if="formReport.tipoSolicitacao" class="mb-n5">
              <validation-provider v-slot="{ errors }" name="Apresentou erro" rules="required">
                <v-select
                  outlined
                  dense
                  :error-messages="errors"
                  label="Apresentou erro"
                  placeholder="Apresentou erro"
                  no-data-text="Não há itens"
                  :items="['SIM', 'NÃO']"
                  v-model="formReport.apresentouErro"
                ></v-select>
              </validation-provider>
            </v-col>

            <v-col cols="4" class="mb-n5" v-if="formReport.apresentouErro == 'SIM'">
              <ValidationProvider v-slot="{ errors }" rules="required" name="Descrição do erro">
                <v-select
                  required
                  placeholder="Descrição do erro"
                  label="Descrição do erro"
                  dense
                  outlined
                  v-model="formReport.descricaoErroJornada"
                  :items="itemsDescricaoErro"
                  item-text="VALOR_CAMPO"
                  item-value="VALOR_CAMPO"
                  :error-messages="errors"
                  no-data-text="Não há items"
                ></v-select>
              </ValidationProvider>
            </v-col>
            <v-col
              cols="12"
              class="mb-n5"
              v-if="formReport.apresentouErro == 'SIM' || formReport.apresentouErro == null"
            >
              <ValidationProvider
                v-slot="{ errors }"
                rules="required|max:100"
                name="Descrição breve"
              >
                <v-textarea
                  :error-messages="errors"
                  required
                  rows="2"
                  counter="100"
                  maxlength="100"
                  v-model="formReport.descricaoBreveErro"
                  placeholder="Descrição breve do erro"
                  label="Descrição breve do erro"
                  outlined
                ></v-textarea>
              </ValidationProvider>
            </v-col>
            <v-col
              cols="12"
              v-if="formReport.apresentouErro == 'SIM' || formReport.apresentouErro == null"
            >
              <v-handle-paste-img
                title="Print Erro (Caso necessário)"
                nameField="Pressione a tecla Print e cole a imagem aqui!"
                @update:file-img="handleFile"
                :clearImg="clearImgs"
              ></v-handle-paste-img>
            </v-col>
          </v-row>
          <div
            style="padding: 5px; margin-top: -15px; display: flex; justify-content: end; gap: 5px"
          >
            <v-btn color="error" @click="clearForm">Limpar</v-btn>
            <v-btn :disabled="invalid" color="success" type="submit" :loading="loading">
              Cadastrar
            </v-btn>
          </div>
        </form>
      </ValidationObserver>
    </v-col>
  </v-card>
</template>

<script>
  import { ValidationProvider, ValidationObserver } from 'vee-validate'
  import masks from '../../../../shared/masks/masks'

  import config from '../../../../core/config'
  import alerts from '../../../../mixins/alerts.mixins'
  import VHandlePasteImg from '../../../../shared/components/vuetifyComponents/VHandlePasteImg.vue'

  import axios from 'axios'
  import itemsJson from './items.json'
  export default {
    components: { ValidationProvider, ValidationObserver, VHandlePasteImg },
    data: () => ({
      formReport: {
        contrato: null,
        erroJornada: null,
        descricaoErroJornada: null,
        descricaoBreveErro: null,
        tipoSolicitacao: null,
        apresentouErro: null
      },
      items: [],
      login: null,
      loading: false,
      imageEvidencia: null,
      uploadPercentage: 0,
      clearImgs: false
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
      itemsJson() {
        return itemsJson
      },
      itemsDescricaoErro() {
        let items = []
        items = this.items.filter(item => {
          return item.NOME_CAMPO == this.formReport.erroJornada
        })
        return items
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      nomeArquivoUnico() {
        return this.generateHashName()
      }
    },
    methods: {
      generateHashName() {
        const date = new Date()
        return this.usuarioAlmope + date.getTime().toString()
      },
      async salvarImagem() {
        let formData = new FormData()

        formData.append('arquivos[]', this.imageEvidencia)
        let urlUpload = `http://10.64.175.49:4300/receptivo/index.php/api/generics/upload_arquivos/report_solar/arquivos_temp/arquivos_zip/${this.nomeArquivoUnico}`
        await axios.post(urlUpload, formData, {
          onUploadProgress: progressEvent => {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            this.uploadPercentage = percentage
          }
        })
      },
      handleFile(e) {
        this.imageEvidencia = e
      },
      loadDadosLogin() {
        let urlData = `${config.baseUrl}api/shared/formularios/report_erro_solar/login/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.login = res?.data[0]?.LOGIN
        })
      },
      async submit() {
        try {
          this.loading = true
          let valid = await this.$refs.reportErroSolar.validate()
          if (valid) {
            this.imageEvidencia ? await this.salvarImagem() : false //caso precise uppar imagem como evidencia
            this.formReport.almopeUsuario = this.usuarioAlmope
            this.formReport.loginSolar = this.login
            this.formReport.nomeEvidencia = this.imageEvidencia ? this.nomeArquivoUnico : null //caso precise uppar imagem como evidencia
            let urlData = `${config.baseUrl}api/shared/formularios/report_erro_solar/erro_solar`
            await this.$api.post(urlData, this.formReport)
            this.toast('Erro reportado com sucesso!', 'top-right', false, 2000, 'success')
            this.clearForm()
            this.loading = false
          }
        } catch (e) {
          this.toast(
            'Erro não foi reportado, favor tente novamente!',
            'top-right',
            false,
            3500,
            'error'
          )
          this.loading = false
        }
      },
      clearForm() {
        this.clearImgs = true
        let newForm = Object.assign({}, this.formReport)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })

        this.formReport = newForm
        this.$refs.reportErroSolar.reset()
        setTimeout(() => {
          this.clearImgs = false
        }, 1500)
        this.imageEvidencia = null
      },
      loadListItemsFilter() {
        let urlData = `${config.baseUrl}api/shared/formularios/report_erro_solar/list_filter_err_solar`
        this.$api.get(urlData).then(res => {
          this.items = res.data
        })
      }
    },
    created() {
      this.loadListItemsFilter()
      this.loadDadosLogin()
    }
  }
</script>

<style scoped>
  .form {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
