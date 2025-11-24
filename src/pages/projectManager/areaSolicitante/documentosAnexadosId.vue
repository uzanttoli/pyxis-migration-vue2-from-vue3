<template>
  <v-card class="rounded-lg pa-3 mt-5" elevation="1">
    <v-card-title>
      <i
        class="fa-solid fa-paperclip"
        style="margin-left: -10px; margin-right: 10px; color: #262626ba"
      ></i>
      {{ title }}
    </v-card-title>
    <v-divider></v-divider>
    <v-data-table
      hide-default-footer
      :headers="headers"
      no-data-text="Nada anexado ainda!"
      :items="items"
      dense
    >
      <template v-slot:item.NOME_ANEXO="{ item }">
        <span style="color: #0000ff">{{ item.NOME_ANEXO }}.zip</span>
      </template>
      <template v-slot:item.ACOES="{ item }">
        <v-btn
          icon
          color="success"
          @click="
            linkDownload(
              'http://10.64.175.49:4300/receptivo/index.php/api/generics/download/project_manager/arquivos_zip/' +
                item.NOME_ANEXO +
                '.zip'
            )
          "
          target="_blank"
        >
          <v-icon>fa-solid fa-cloud-arrow-down</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.DATA_CRIACAO="{ item }">
        {{ formatarData(item.DATA_CRIACAO) }}
      </template>
      <template v-slot:item.USUARIO_UP="{ item }">
        <span>
          <v-chip
            :color="usuarioAlmope == item.NOME_ANEXO.slice(0, 7) ? 'green' : 'orange'"
            small
            class="white--text"
          >
            {{ userAddFile(usuarioAlmope, item.NOME_ANEXO) }}
          </v-chip>
        </span>
      </template>
    </v-data-table>
    <input-file
      :isTextBottom="false"
      class="mt-2"
      @update-files="handleFileAttachement"
      :isSendFile="isSendFile"
      :isAttachment="isAttachment"
    ></input-file>
    <v-row class="pa-2" justify="end">
      <v-btn
        depressed
        small
        color="success"
        class="white--text"
        @click="handleClick()"
        :disabled="files == ''"
      >
        Salvar
      </v-btn>
    </v-row>
    <loading
      textAtualizacao="Salvando..."
      :showLoading="isSend"
      :uploadPercentage="uploadPercentage"
    ></loading>
  </v-card>
</template>

<script>
  import axios from 'axios'
  import inputFile from '../inputFile.vue'
  import config from '../../../core/config'
  import loading from '../../download/relatorios/loading.vue'
  import acoes from '../../../mixins/projectManager/acoes'
  export default {
    props: {
      isAttachment: {
        type: Boolean,
        default: true
      },
      idHash: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: 'Documentos anexados'
      }
    },
    components: { inputFile, loading },
    data: () => ({
      headers: [
        { text: 'Usúario', value: 'USUARIO_UP', align: 'center' },
        { text: 'Nome do arquivo', value: 'NOME_ANEXO', align: 'center' },
        { text: 'Gravado em', value: 'DATA_CRIACAO', align: 'center' },
        { text: 'Ações', value: 'ACOES', align: 'cente' }
      ],
      items: [],
      files: [],
      uploadPercentage: 0,
      isSend: false,
      isSendFile: false
    }),
    mixins: [acoes],
    computed: {
      nomeArquivoUnico() {
        return this.generateHashName()
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      idUnico() {
        return this.generateHash()
      }
    },
    methods: {
      userAddFile(userLog, userFile) {
        let fileUser = userFile?.slice(0, 7) * 1
        let adm = [4602597, 4637725, 4172639]
        if (!fileUser) return
        if (adm.includes(fileUser)) {
          if (userLog == fileUser) {
            return 'Anexado por você'
          } else {
            return 'Anexo pelo Analista'
          }
        } else if (userLog == fileUser) {
          return `Anexado por você`
        }
        return `Anexado por ${fileUser}`
      },
      async executarAcoes() {
        let data = {
          NUM_SOLIC_HASH: this.idHash,
          TIPO_NOTIFICACAO: 8
        }
        let isNotification = this.$route.query.notificationUser
        this.cadastrarNotificacao(data, isNotification)
      },
      hashGenerateBase64(hash) {
        const binString = btoa(hash)
        return binString.slice(0, 25)
      },
      generateHashName() {
        const date = new Date()
        return this.usuarioAlmope + date.getTime().toString()
      },
      clearFile() {
        this.isSendFile = true
        setTimeout(() => {
          this.isSendFile = false
        }, 1500)
      },
      async handleClick() {
        try {
          this.isSend = true
          let formData = new FormData()
          let data = {
            NOME_ANEXO: this.nomeArquivoUnico,
            NUM_SOLIC_HASH: this.idHash
          }
          let urlDataAnexo = `${config.baseUrl}api/shared/project_manager/solicitacao/cadastrar_anexo`
          await this.$api.post(urlDataAnexo, data)

          for (let i = 0; i < this.files.length; i++) {
            formData.append('arquivos[]', this.files[i])
          }

          let urlUpload = `http://10.64.175.49:4300/receptivo/index.php/api/generics/upload_arquivos/project_manager/arquivos_temp/arquivos_zip/${this.nomeArquivoUnico}`
          await axios.post(urlUpload, formData, {
            onUploadProgress: progressEvent => {
              const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              this.uploadPercentage = percentage
            }
          })
          this.isSend = false
          this.executarAcoes()
          this.clearFile()
          this.loadDadosAnexo()
        } catch (error) {
          this.isSend = false
        }
      },
      handleFileAttachement(e) {
        this.files = e
      },
      link(nomeArquivo) {
        return `http://10.64.175.49:4300/receptivo/index.php/api/generics/download/project_manager/arquivos_zip/${nomeArquivo}.zip`
      },
      async linkDownload(arquivo) {
        const response = await axios.get(arquivo, {
          responseType: 'blob',
          onDownloadProgress: progressEvent => {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            this.uploadPercentage = percentage
          }
        })
        const blob = new Blob([response.data])
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = arquivo.split('/').pop()
        link.click()

        window.URL.revokeObjectURL(url)
      },
      loadDadosAnexo() {
        let urlData = `${config.baseUrl}api/shared/project_manager/solicitacao/list_anexo_id/${this.$route.params.id}`
        this.$api.get(urlData).then(res => {
          this.items = res.data
        })
      },
      formatarData(value) {
        this.moment.locale('pt-br')
        return this.moment(value).fromNow()
      }
    },
    created() {
      this.loadDadosAnexo()
    }
  }
</script>

<style></style>
