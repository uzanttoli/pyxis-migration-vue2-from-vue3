<template>
  <div>
    <div class="banner">
      <div class="upload-banner" @click="openFileInput" v-if="!imageData">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24">
            <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
            <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fill=""
                d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              ></path>
            </g>
          </svg>
        </div>
        <div class="text">
          <span>Atualizar imagem do banner</span>
        </div>
      </div>
      <div v-if="imageData" class="upload-img" @click="openFileInput">
        <div>
          <p>Imagem selecionada, para mudar clique novamente!</p>
        </div>
        <img :src="imageData" />
      </div>
      <div class="py-2" style="display: flex; width: 100%; justify-content: end">
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
    </div>
    <input
      type="file"
      style="display: none"
      ref="inputFileArquive"
      name="arquivo"
      accept=".png, .jpg, .jpeg"
      @change="onFileChange"
    />
    <div style="display: flex; justify-content: end; margin-top: 20px">
      <v-btn
        color="success"
        class="rounded-r-xl rounded-bl-xl"
        @click="alterarBanner"
        :disabled="!this.formularioIsValid()"
      >
        Salvar
      </v-btn>
    </div>
  </div>
</template>

<script>
  import config from '../../../../core/config'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    props: {
      imagemProps: {
        type: String,
        default: ''
      },
      nameImage: {
        type: String,
        default: ''
      },
      numeroBilhete: {
        type: Number,
        default: null,
        require: true
      },
      numeroConcurso: {
        type: Number,
        default: null,
        require: true
      }
    },
    data: () => ({
      imageData: null,
      file: null,
      fileName: null,
      arquivoUpload: null
    }),
    mixins: [alerts],
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      formularioIsValid() {
        return this.numeroBilhete && this.numeroConcurso && this.arquivoUpload
      },
      limparDadosEnvio() {
        this.imageData = null
        this.file = null
        this.fileName = null
        this.arquivoUpload = null
        this.$emit('update:limparDados')
      },
      async alterarBanner() {
        try {
          // Enviando arquivo
          const formData = new FormData()
          formData.append('imagem', this.arquivoUpload)
          let urlUpload = `${config.baseUrl}api/shared/loteria/configuracao/upload_arquivo/${this.nameImage}`
          await this.$api
            .post(urlUpload, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            .then(() => {
              // Atualizando nome do arquivo na tabela
              let data = {
                imagemBanner: this.fileName,
                bilhetes: this.numeroBilhete
              }
              let urlData = `${config.baseUrl}api/shared/loteria/configuracao/atualizar_nome_arquivo/`
              this.$api.post(urlData, data).then(() => {
                this.toast('Banner atualizado com sucesso!', 'bottom-right', false, 3500, 'success')
                this.limparDadosEnvio()
              })
            })
        } catch (e) {
          this.toast('Banner não foi atualizado. Erro:' + e, 'bottom-right', false, 3500, 'success')
        }
      },
      generateHashName() {
        const date = new Date()
        return date.getTime().toString()
      },
      downloadModelo(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_banner/${img}`
      },
      onFileChange(e) {
        let file = e.target.files[0]
        this.file = file

        const arquivo = file.name.split('.')
        const nomeArquivo = arquivo[0]
        const nomeUri = nomeArquivo.replaceAll(' ', '_')
        const hashNome = this.generateHashName()
        const newFileName = `${nomeUri}-${this.usuarioAlmope}${hashNome}`

        const extensao = file.name.split('.').pop()

        const novoArquivo = new File([file], `${newFileName}.${extensao}`, {
          type: file.type
        })
        this.arquivoUpload = novoArquivo
        this.fileName = `${novoArquivo.name}`
        var reader = new FileReader()
        reader.onload = e => {
          this.imageData = e.target.result
        }

        reader.readAsDataURL(novoArquivo)
      },
      openFileInput() {
        this.$refs.inputFileArquive.click()
      },
      bannerAtual(img) {
        if (img) {
          return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_loteria/${img}`
        }
      }
    }
  }
</script>

<style scoped>
  .banner {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  .banner-selecionado {
    width: 45vw;
    display: flex;
  }

  .banner-selecionado > div {
    position: absolute;
    display: flex;
    align-items: center;
    border: 1px solid white;
    background: white;
    padding: 4px;
    margin: 4px;
    opacity: 0;
    transition: opacity 0.4s ease;
    /* visibility: hidden; */
  }
  .banner-selecionado div p {
    color: rgb(101, 99, 99);
    margin: 0;
    font-weight: bold;
  }
  .banner-selecionado:hover > div {
    /* visibility: visible; */
    opacity: 1;
  }

  .banner-selecionado img {
    width: 100%;
    height: 300px;
    align-items: center;
    border-radius: 10px;
  }

  .upload-banner {
    width: 99vw;
    height: 120px;
    padding: 30px;
    border: 2px dashed #cacaca;
    border-radius: 10px;
    /* margin: 10px; */

    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
  }
  .icon svg {
    height: 50px;
    fill: rgba(75, 85, 99, 1);
  }

  .text {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .text span {
    font-weight: 400;
    color: rgba(75, 85, 99, 1);
  }

  h2 {
    font-family: 'Syne', sans-serif;
  }

  .upload-img {
    width: 99vw;
    padding: 8px;
    border: 2px dashed #cacaca;
    border-radius: 10px;
    cursor: pointer;
  }

  .upload-img img {
    width: 100%;
    height: 200px;
  }

  .upload-img > div {
    position: absolute;
    display: flex;
    align-items: center;
    border: 1px solid white;
    background: white;
    padding: 4px;
    margin: 4px;
    /* visibility: hidden; */
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .upload-img div p {
    color: rgb(101, 99, 99);
    margin: 0;
    font-weight: bold;
  }
  .upload-img:hover > div {
    /* visibility: visible; */
    opacity: 1;
  }
</style>
