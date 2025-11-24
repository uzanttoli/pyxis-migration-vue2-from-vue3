<template>
  <v-card elevation="2" tile class="mt-7 mx-auto rounded-0">
    <transition name="fade">
      <v-alert type="success" tile dark dense elevation="4" :value="alert">
        Banner Cadastrado com sucesso!
      </v-alert>
    </transition>
    <v-card-title>
      Cadastrar Banner
      <v-spacer></v-spacer>
    </v-card-title>
    <div class="px-6">
      <v-chip class="font-weight-medium mr-2">
        Tamanho necessário
        <strong class="ml-1">1757 x 300</strong>
      </v-chip>
      <v-tooltip right>
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            :href="downloadModelo('ModeloBannerPyxis.png')"
            color="green"
            rounded
            fab
            x-small
          >
            <v-icon color="white">fas fa-download</v-icon>
          </v-btn>
        </template>
        <span>Baixar Modelo</span>
      </v-tooltip>
    </div>
    <div>
      <div class="file-upload-form">
        <label for="selecao-arquivo-banner">Selecionar um arquivo de imagem &#187;</label>
        <input
          id="selecao-arquivo-banner"
          type="file"
          ref="files"
          @change="previewImageBanner"
          accept="image/*"
          v-on:change="handleFilesUpload()"
        />
      </div>
      <v-sheet width="100%" height="100%">
        <div class="image-preview-banner" v-if="imageDataBanner.length > 0">
          <img class="preview-banner" :src="imageDataBanner" />
        </div>
      </v-sheet>
    </div>
    <div class="pa-3" align="end">
      <v-btn color="success" @click="saveInserirBanner" :disabled="!this.imagemIsValid()">
        Salvar
      </v-btn>
    </div>
  </v-card>
</template>

<script>
  import { MediaDimensions } from '../../../pages/media-dimensions-comment'
  import config from '../../../core/config.js'
  export default {
    data: () => ({
      imageDataBanner: '',
      tamanho: [],
      dados: [],
      alert: false,
      msgError: ''
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      downloadModelo(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_banner/${img}`
      },
      previewImageBanner: function (event) {
        var input = event.target
        this.tamanho = []
        new MediaDimensions.getImageDimensionsFromFile(input.files[0]).then(res => {
          this.tamanho.push({ largura: res.width, altura: res.height })
        })
        if (input.files && input.files[0]) {
          var reader = new FileReader()
          reader.onload = e => {
            this.imageDataBanner = e.target.result
          }
          reader.readAsDataURL(input.files[0])
        }
      },
      clearForm() {
        this.imageDataBanner = ''
        this.tamanho = []
      },
      imagemIsValid() {
        let dimensao = this.tamanho
        let largura = dimensao[0]?.largura ?? 0
        let altura = dimensao[0]?.altura ?? 0

        if (largura === 1757 && altura === 300) {
          return true
        } else {
          return false
        }
      },
      async saveInserirBanner() {
        this.alert = true
        this.dados.imagemBanner = this.nameFiles()
        this.dados.usuarioCadastro = this.usuarioAlmope

        await this.$store.dispatch('saveInserirBanner', this.dados)
        await this.submitFiles()
        setTimeout(() => {
          this.alert = false
        }, 2000)
        this.clearForm()
      },
      nameFiles() {
        let name = this.$refs.files.files
        return name[0].name
      },
      submitFiles() {
        let formData = new FormData()

        for (let file of this.$refs.files.files) {
          formData.append('files', file)
        }
        let urlData = `${config.baseUrl}api/shared/loja/upload_img_banner`
        urlData = this.replaceUrlMultiParamSeparator(urlData)
        this.$api.post(urlData, formData, {
          headers: {
            'Content-Type': false
          }
        })
      },
      handleFilesUpload() {
        this.files = []
        let uploadedFiles = this.$refs.files.files
        if (this.$refs.files) {
          this.files.push(uploadedFiles[0].name)
        }
      }
    },
    watch: {
      imageDataBanner() {
        this.imagemIsValid()
      }
    }
  }
</script>

<style scoped>
  .file-upload-form,
  .image-preview-banner {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 20px;
  }
  img.preview-banner {
    width: 100%;
    height: 300px;
    background-color: white;
    border: 1px solid #ddd;
    padding: 5px;
  }

  input[type='file'] {
    display: none;
  }

  /* Aparência que terá o seletor de arquivo */
  label {
    background-color: #591b3d;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    margin: 10px;
    padding: 6px 20px;
  }
</style>
