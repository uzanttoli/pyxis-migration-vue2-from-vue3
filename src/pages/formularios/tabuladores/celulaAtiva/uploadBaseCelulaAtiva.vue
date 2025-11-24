<template>
  <!-- v-model="openUploadBase" -->
  <v-dialog
    :model-value="openUploadBase"
    @update:modelValue="val => $emit('update:openUploadBase', val)"
    width="600"
    persistent
  >
    <div>
      <v-card elevation="1" class="rounded-xl">
        <v-card-title>
          <div style="display: flex; justify-content: space-between; width: 100%">
            Atualizar mailing
            <v-btn icon @click="$emit('updated-close')">
              <v-icon>fas fa-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 80%;
            margin: 20px;
          "
        >
          <div class="container-input" style="" @click="handleOpenInput">
            <div class="input-file" style="">
              <div class="file-csv" style="">
                <template v-if="!send">
                  <v-icon size="35" class="mb-2">fa-solid fa-file-csv</v-icon>
                  <span style="color: #333; font-size: 14px">
                    Selecione o CSV para a importação
                  </span>
                  <span v-if="!!fileInfo">
                    <v-icon color="green" size="15">fa-solid fa-file-circle-check</v-icon>
                    Arquivo anexado: {{ name }}
                  </span>
                </template>
                <div style="display: flex; color: #757575" class="text-h3 font-italic" v-else>
                  <p class="pa-0 ma-0">
                    {{ uploadPercentage }}
                  </p>
                  %
                </div>
              </div>
            </div>
          </div>
        </div>
        <v-row class="ma-0 pa-0 mr-3 mt-n2" justify="end">
          <v-btn class="ma-2" color="success" @click="sendFile" :disabled="!fileInfo">
            Enviar arquivo
          </v-btn>
        </v-row>
      </v-card>
      <input
        type="file"
        ref="inputFile"
        style="display: none"
        accept=".csv"
        @change="handleFileInfo"
      />
    </div>
  </v-dialog>
</template>

<script>
  import axios from 'axios'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    props: {
      openUploadBase: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      fileInfo: null,
      name: null,
      uploadPercentage: 0,
      send: false,
      url: 'http://10.64.175.49:4300/receptivo/index.php/api/arquivos/upload_arquivo/'
    }),
    computed: {},
    mixins: [alerts],
    methods: {
      handleOpenInput() {
        this.$refs.inputFile.click()
      },
      handleFileInfo(event) {
        this.fileInfo = event.target.files[0]
        this.name = event.target.files[0].name
      },
      async sendFile() {
        this.send = true
        let file = new File([this.fileInfo], 'BASE_MAILING.csv', {
          type: this.fileInfo.type
        })
        const formData = new FormData()
        formData.append('arquivo', file)

        let urlUpload = `${this.url}BULK_MAILING_TABULADORES/BULK_CELULA_ATIVA`
        await axios.post(urlUpload, formData, {
          onUploadProgress: progressEvent => {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            this.uploadPercentage = percentage
          }
        })
        this.toast('Mailing atualizado com sucesso!', 'top-right', false, 2000, 'success')
        this.$emit('updated-close')
        this.send = false
        this.fileInfo = null
        this.name = null
      }
    }
  }
</script>

<style scoped>
  .container-input {
    width: 100%;
    height: 200px;
    border: 1px solid #7676dd;
    border-radius: 20px;
    padding: 10px;
    cursor: pointer;
  }

  .input-file {
    display: flex;
    border: 1px dotted #7676dd;
    border-radius: 20px;
    height: 100%;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
  }

  .input-file:hover {
    background-color: #ebebeb33;
  }

  .file-csv {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
