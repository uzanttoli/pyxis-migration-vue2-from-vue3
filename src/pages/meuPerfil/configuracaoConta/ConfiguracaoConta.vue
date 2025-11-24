<template>
  <v-card flat class="pa-3 mt-2">
    <v-card-text>
      <v-row justify="center">
        <v-avatar rounded size="120" class="me-6" v-if="myAvatar">
          <v-img :src="imagemPerfil(myAvatar)"></v-img>
        </v-avatar>
        <v-avatar rounded size="120" class="me-6" v-else>
          <v-img src="../../../assets/img/Avatar/padrao.png"></v-img>
        </v-avatar>
        <v-icon v-if="imageData.length > 0" class="mr-2 ml-n3">mdi-arrow-right-thick</v-icon>
        <v-avatar rounded size="120" class="image-preview me-6" v-if="imageData.length > 0">
          <img class="preview" :src="imageData" />
        </v-avatar>
      </v-row>
      <v-row justify="center">
        <div>
          <v-btn @click="$refs.files.click()" class="me-3 mt-5 rounded-xl" color="primary">
            <span>
              <v-icon class="mr-2">
                {{ nomeImagem == '' ? 'mdi-attachment-plus' : 'mdi-attachment-check' }}
              </v-icon>
              {{ nomeImagem == '' ? 'Anexar Imagem' : nomeImagem }}
            </span>
          </v-btn>
          <v-form>
            <input
              id="limpar-input"
              class="limpar-ao-selecionar-radio"
              ref="files"
              type="file"
              accept=".jpeg,.png,.jpg"
              @change="previewImage"
              :hidden="true"
            />
            <p class="text-sm mt-5 text-center">Apenas JPG, JPEG ou PNG</p>
          </v-form>
        </div>
      </v-row>
    </v-card-text>
    <v-col cols="12">
      <v-btn color="success" class="mt-4 me-3" @click="submitFiles()" block small>Salvar</v-btn>
    </v-col>
  </v-card>
</template>

<script>
  import config from '../../../core/config.js'
  import { MediaDimensions } from '../../../pages/media-dimensions-comment'
  export default {
    data: () => ({
      mini: true,
      imageData: '',
      tamanho: [],
      fotoEnviada: false,
      nomeImagem: ''
    }),
    computed: {
      myAvatar() {
        let myAvatar = this.$store.getters.myAvatar
        return myAvatar ? myAvatar : ''
      },
      nameFiles() {
        let name = this.$refs.files.files
        return name[0].name
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      clearForm() {
        this.imageData = ''
      },
      loadMyAvatar() {
        return this.$store.dispatch('loadMyAvatar', this.usuarioAlmope)
      },
      previewImage: function (event) {
        var input = event.target
        this.tamanho = []
        this.nomeImagem = this.$refs.files.files[0].name
        new MediaDimensions.getImageDimensionsFromFile(input.files[0]).then(res => {
          this.tamanho.push({ largura: res.width, altura: res.height })
        })
        if (input.files && input.files[0]) {
          var reader = new FileReader()
          reader.onload = e => {
            this.imageData = e.target.result
          }
          reader.readAsDataURL(input.files[0])
        }
      },
      imagemIsValid() {
        let dimensao = this.tamanho
        let largura = dimensao[0]?.largura ?? 0
        let altura = dimensao[0]?.altura ?? 0
        if (largura === 512 && altura === 512) {
          return true
        } else {
          return false
        }
      },
      async updateFotoPerfil() {
        if (this.myAvatar == '') {
          await this.$store.dispatch('inserirFotoPerfil', {
            almope: this.$store.getters.usuario.almope,
            nomeArquivoImagem: this.nameFiles,
            selectAvatar: 0,
            avatar: 1
          })
          // await this.submitFiles();
          await this.loadMyAvatar()
          this.clearForm()
          this.fotoEnviada = true
          setTimeout(() => {
            document.location.reload(true)
            this.fotoEnviada = false
          }, 3500)
        } else {
          await this.$store.dispatch('updateFotoPerfil', {
            ALMOPE: this.$store.getters.usuario.almope,
            nomeArquivoImagem: this.nameFiles,
            selectAvatar: 0
          })
          // await this.submitFiles();
          await this.loadMyAvatar()
          this.clearForm()
          this.fotoEnviada = true
          setTimeout(() => {
            document.location.reload(true)
            this.fotoEnviada = false
          }, 3500)
        }
      },
      async submitFiles() {
        try {
          let formData = new FormData()
          for (let file of this.$refs.files.files) {
            formData.append('files', file)
          }
          let urlData = `${config.baseUrl}api/shared/pyxis/upload_img_perfil`
          urlData = this.replaceUrlMultiParamSeparator(urlData)
          await this.$api
            .post(urlData, formData, {
              headers: {
                'Content-Type': false
              }
            })
            .then(res => {
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
                title: res.data
              })
              this.imageData = ''
              this.updateFotoPerfil()
            })
        } catch (error) {
          if (error.response) {
            if (error.response.status === 406) {
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
                title: error.response.data
              })
            } else if (error.response.status === 404) {
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
                icon: 'warning',
                title: error.response.data
              })
            }
          }
        }
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      getImgMenu(img) {
        let imagem = require.context('../../../assets/img/icons/mdi-icons/', false, /\.png$/)
        return imagem('./' + img + '.png')
      }
    }
  }
</script>

<style scoped>
  .file-upload-form,
  .image-preview {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 20px;
  }
  img.preview {
    width: 130px;
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

  /*
  Enter and leave animations can use different
  durations and timing functions.
*/
  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }
</style>
