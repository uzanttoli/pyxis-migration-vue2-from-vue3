<template>
  <v-card elevation="1" tile>
    <v-card-title class="grey lighten-4">
      Dados da solicitação
      <v-chip class="ml-2" color="info" v-if="solicitacaoSelecionada != ''" small>
        {{ textSlaSolicitacao }}
      </v-chip>
    </v-card-title>
    <div class="pa-2">
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <v-row class="mx-2 mt-2" style="gap: 10px">
            <v-col class="pa-0 ma-0">
              <validation-provider
                v-slot="{ errors }"
                name="titulo da solicitacao"
                rules="required"
              >
                <v-text-field
                  label="Titulo da Solicitação"
                  placeholder="Titulo da Solicitação"
                  outlined
                  dense
                  required
                  filled
                  v-model="formSolicitacao.TITULO_SOLICITACAO"
                  :error-messages="errors"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="operacao" rules="required">
                <v-autocomplete
                  label="Produto"
                  placeholder="Produto"
                  hide-no-data
                  outlined
                  dense
                  filled
                  required
                  :items="produtos"
                  item-text="PRODUTO"
                  v-model="formSolicitacao.PRODUTO_SOLICITACAO"
                  :error-messages="errors"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="agrupamentos" rules="required">
                <v-autocomplete
                  label="Agrupamento"
                  placeholder="Agrupamento"
                  hide-no-data
                  outlined
                  dense
                  filled
                  :items="listAgrupamentos"
                  item-text="AGRUPAMENTO"
                  v-model="formSolicitacao.AGRUPAMENTO_SOLICITACAO"
                  multiple
                  :error-messages="errors"
                >
                  <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0" small>
                      <span>{{ item.AGRUPAMENTO }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text text-caption">
                      (+{{ formSolicitacao.AGRUPAMENTO_SOLICITACAO.length - 1 }}
                      outros)
                    </span>
                  </template>
                </v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="mx-2 mt-2" style="gap: 10px">
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="tipo da solicitacao" rules="required">
                <v-autocomplete
                  label="Tipo da solicitação"
                  placeholder="Tipo da solicitação"
                  hide-no-data
                  outlined
                  dense
                  filled
                  :items="tipoSolicitacao"
                  item-text="TIPO_SOLICITACAO"
                  item-value="TIPO_SOLICITACAO"
                  required
                  v-model="formSolicitacao.TIPO_SOLICITACAO"
                  :error-messages="errors"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="motivo solicitacao" rules="required">
                <v-autocomplete
                  label="Motivo da solicitação"
                  placeholder="Motivo da solicitação"
                  hide-no-data
                  outlined
                  dense
                  filled
                  required
                  :items="listMotivoSolicitacao"
                  item-text="MOTIVO_SOLICITACAO"
                  item-value="MOTIVO_SOLICITACAO"
                  v-model="formSolicitacao.MOTIVO_SOLICITACAO"
                  :error-messages="errors"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="mx-2 mt-2" style="gap: 10px">
            <v-col class="pa-0 ma-0">
              <validation-provider
                v-slot="{ errors }"
                name="detalhamento da solicitacao"
                rules="required"
              >
                <v-textarea
                  label="Detalhamento da solicitação"
                  placeholder="Detalhe sua solicitação aqui"
                  outlined
                  :error-messages="errors"
                  rows="3"
                  :counter="1000"
                  maxlength="1000"
                  auto-grow
                  v-model="formSolicitacao.DETALHE_SOLICITACAO"
                ></v-textarea>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="mx-2 mt-2">
            <v-col class="pa-0 ma-0">
              <input-file @update-files="filesInputEvent" :isSendFile="isSendFile"></input-file>
            </v-col>
          </v-row>
          <v-row class="mx-2 mb-1" justify="end">
            <v-btn color="error" @click="clearForm" class="mr-2" depressed>Limpar</v-btn>
            <v-btn type="submit" :disabled="invalid" depressed color="success" :loading="isSend">
              Salvar
            </v-btn>
          </v-row>
        </form>
      </validation-observer>
    </div>
    <loading
      textAtualizacao="Salvando..."
      :showLoading="isSend"
      :uploadPercentage="uploadPercentage"
    ></loading>
  </v-card>
</template>

<script>
  import sha256 from 'crypto-js/sha256'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import InputFile from '../inputFile.vue'
  import config from '../../../core/config'
  import axios from 'axios'
  import Loading from '../../download/relatorios/loading.vue'
  import alerts from '../../../mixins/alerts.mixins'
  import acoes from '../../../mixins/projectManager/acoes'
  export default {
    components: {
      ValidationObserver,
      ValidationProvider,
      InputFile,
      Loading
    },
    data: () => ({
      formSolicitacao: {
        TITULO_SOLICITACAO: null,
        PRODUTO_SOLICITACAO: null,
        DETALHE_SOLICITACAO: null,
        MOTIVO_SOLICITACAO: null,
        TIPO_SOLICITACAO: null,
        AGRUPAMENTO_SOLICITACAO: null,
        STATUS_SOLICITACAO: 1
      },
      produtos: [],
      agrupamentos: [],
      tipoSolicitacao: [],
      files: [],
      loading: false,
      isSendFile: false,
      isSend: false,
      uploadPercentage: 0
    }),
    mixins: [alerts, acoes],
    computed: {
      t() {
        return sha256(this.generateHashName())
      },
      listAgrupamentos() {
        let agrupamentos = this.agrupamentos
        if (agrupamentos) {
          return agrupamentos.filter(agrupamento => {
            return agrupamento.PRODUTO_PORTAL == this.formSolicitacao.PRODUTO_SOLICITACAO
          })
        }
        return []
      },
      listMotivoSolicitacao() {
        let solicitacoes = this.tipoSolicitacao
        if (solicitacoes) {
          return solicitacoes.filter(solicitacao => {
            return solicitacao.TIPO_SOLICITACAO == this.formSolicitacao.TIPO_SOLICITACAO
          })
        }
        return []
      },
      solicitacaoSelecionada() {
        let tiposSolicitacoes = this.tipoSolicitacao
        if (tiposSolicitacoes) {
          return tiposSolicitacoes.filter(el => {
            return el.MOTIVO_SOLICITACAO == this.formSolicitacao.MOTIVO_SOLICITACAO
          })
        }
        return []
      },
      textSlaSolicitacao() {
        let solicitacao = this.solicitacaoSelecionada
        if (solicitacao) {
          if (solicitacao[0].TIPO_SLA == 'HORAS') {
            return `Esta solicitação tem um prazo de ${this.converterHora(solicitacao[0].SLA)} ${
              solicitacao[0].TIPO_SLA
            }`
          } else {
            return `Esta solicitação tem um prazo de ${solicitacao[0].SLA} ${solicitacao[0].TIPO_SLA}`
          }
        }
        return false
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      idUnico() {
        return this.generateHash()
      },
      nomeArquivoUnico() {
        return this.generateHashName()
      }
    },
    methods: {
      async executarAcoes() {
        try {
          let data = {
            NUM_SOLIC_HASH: this.hashGenerateBase64(this.idUnico),
            TIPO_NOTIFICACAO: 1
          }

          let isNotification = this.$route.query.notificationUser
          await this.cadastrarNotificacao(data, isNotification)
          await this.atualizarUltimasInformacoes(data)
        } catch (error) {
          console.error(error)
        }
      },
      generateHashName() {
        const date = new Date()
        return this.usuarioAlmope + date.getTime().toString()
      },
      generateHash() {
        const date = new Date()
        let max = 22
        return Math.random(date.getTime()) * Math.random(max)
      },
      hashGenerateBase64(hash) {
        const binString = btoa(hash)
        return binString.slice(0, 25)
      },
      clearForm() {
        let newForm = Object.assign({}, this.formSolicitacao)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formSolicitacao = newForm
        this.$refs.observer.reset()
        this.isSendFile = true
        setTimeout(() => {
          this.isSendFile = false
        }, 1500)
      },
      textToUpperCase(string) {
        if (!string) return
        return string.toUpperCase()
      },
      converterHora(string) {
        if (!string) return
        let horas = (string / 86400) * 24

        return `${horas}`
      },
      async attachmentUpload() {
        const formData = new FormData()
        let data = {
          NOME_ANEXO: this.nomeArquivoUnico,
          NUM_SOLIC_HASH: this.hashGenerateBase64(this.idUnico)
        }

        if (this.files.length != 0) {
          for (let i = 0; i < this.files.length; i++) {
            formData.append('arquivos[]', this.files[i])
          }

          let urlUpload = `http://10.64.175.49:4300/receptivo/index.php/api/generics/upload_arquivos/project_manager/arquivos_temp/arquivos_zip/${this.nomeArquivoUnico}`

          try {
            await axios.post(urlUpload, formData, {
              onUploadProgress: progressEvent => {
                const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                this.uploadPercentage = percentage
              },
              timeout: 37000 //37 segundos
            })

            let urlDataAnexo = `${config.baseUrl}api/shared/project_manager/solicitacao/cadastrar_anexo`
            await this.$api.post(urlDataAnexo, data)
          } catch (error) {
            if (axios.isCancel(error)) {
              this.toast(
                'Não foi possivel enviar o arquivo, tempo de espera foi muito longo. Por favor tente novamente!',
                'bottom',
                false,
                2000,
                'warning'
              )
            } else {
              // console.error("Erro ao enviar arquivo:", error);
              this.toast('Erro ao enviar arquivo:' + error, 'bottom', false, 2000, 'error')
            }
          }
        }
      },
      async submit() {
        try {
          this.isSend = true
          let isValid = await this.$refs.observer.validate()
          if (isValid) {
            await this.attachmentUpload()
            this.formSolicitacao.TIPO_SLA_PADRAO = this.solicitacaoSelecionada[0]?.TIPO_SLA
            this.formSolicitacao.SLA_PADRAO = this.solicitacaoSelecionada[0]?.SLA
            this.formSolicitacao.USUARIO_SOLICITACAO = this.usuarioAlmope
            this.formSolicitacao.TITULO_SOLICITACAO = this.textToUpperCase(
              this.formSolicitacao.TITULO_SOLICITACAO
            )
            this.formSolicitacao.DETALHE_SOLICITACAO = this.textToUpperCase(
              this.formSolicitacao.DETALHE_SOLICITACAO
            )
            this.formSolicitacao.NUM_SOLIC_HASH = this.hashGenerateBase64(this.idUnico)
            this.formSolicitacao.PRIORIDADE = this.solicitacaoSelecionada[0]?.PRIORIDADE

            let urlData = `${config.baseUrl}api/shared/project_manager/solicitacao/cadastrar`
            await this.$api.post(urlData, this.formSolicitacao)

            this.executarAcoes()
            this.isSend = false
            this.toast('Solicitação enviada com sucesso!', 'bottom', false, 2000, 'success')
            this.clearForm()
            this.$router.push('/pyxis/project-manager/area-do-solicitante/')
          }
        } catch (e) {
          this.isSend = false
          this.toast(
            'Não foi possivel enviar sua solicitação. Tente novamente.',
            'bottom',
            false,
            2000,
            'error'
          )
        }
      },
      filesInputEvent(e) {
        this.files = e
      },
      loadProdutos() {
        let urlData = `${config.baseUrl}api/shared/pyxis/produtos/`
        this.$api.get(urlData).then(res => {
          this.produtos = res.data
        })
      },
      loadAgrupamentos() {
        let urlData = `${config.baseUrl}api/shared/pyxis/agrupamentos/`
        this.$api.get(urlData).then(res => {
          this.agrupamentos = res.data
        })
      },
      loadTipoSolicitacao() {
        let urlData = `${config.baseUrl}api/shared/project_manager/solicitacao/tipo/`
        this.$api.get(urlData).then(res => {
          this.tipoSolicitacao = res.data
        })
      }
    },
    created() {
      this.loadProdutos()
      this.loadAgrupamentos()
      this.loadTipoSolicitacao()
    }
  }
</script>

<style></style>
