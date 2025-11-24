<template>
  <v-dialog v-model="abrirModalFeedback" width="50%" persistent>
    <v-card>
      <v-card-title>
        Solicitar Benção
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('update:close')"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-col>
        <v-row justify="center" align="center">
          <p style="text-align: center; padding: 5px">{{ msg }}</p>
        </v-row>
      </v-col>
      <!-- <pre>{{ dados }}</pre> -->
      <v-col>
        <h2>Dados do Player:</h2>
        <v-row>
          <v-col>
            <v-text-field v-model="dados.ALMOPE_PLAYER" outlined dense disabled></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="dados.NOME" outlined dense disabled></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <div class="upload-foto">
        <v-btn @click="$refs.files.click()" class="me-3 mt-5 rounded-xl" color="primary">
          <v-icon class="d-sm-none">mdi-cloud-upload-outline</v-icon>
          <span class="d-none d-sm-block">
            <v-icon class="mr-2">
              {{ nomeImagem == '' ? 'mdi-attachment-plus' : 'mdi-attachment-check' }}
            </v-icon>
            {{ nomeImagem == '' ? 'Anexar feedback' : nomeImagem }}
          </span>
        </v-btn>
        <v-form>
          <input
            id="limpar-input"
            class="limpar-ao-selecionar-radio"
            ref="files"
            type="file"
            name="entrada"
            accept=".jpeg,.png,.jpg"
            @change="previewImage"
            :hidden="true"
          />
          <p class="text-sm mt-5">Apenas JPG e PNG</p>
        </v-form>
      </div>
      <v-col>
        <v-btn block color="green" class="white--text" @click="submitFiles">Solicitar</v-btn>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  import { MediaDimensions } from '../../../media-dimensions-comment'
  import config from '../../../../core/config.js'
  export default {
    props: {
      abrirModalFeedback: {
        type: Boolean,
        default: false
      },
      dados: {
        type: [Array, Object],
        require: true
      }
    },
    data: () => ({
      imageData: '',
      nomeImagem: '',
      toast: () => {},

      msg: `Sua solicitação será encaminhada ao CENTRO DE CONTROLE OPERACIONAL.
        Necessário incluir evidências do feedback aplicado para que a BENÇÃO seja concedida
            e o seu colaborador retorne ao game.`
    }),
    computed: {
      nameFiles() {
        return this.$refs.files?.files[0].name
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },

    methods: {
      limpar() {
        this.nomeImagem = ''
      },
      async submitFiles() {
        try {
          let formData = new FormData()
          for (let file of this.$refs.files.files) {
            formData.append('files', file)
          }

          let urlData = `${config.baseUrl}api/shared/gamification/gestao_player/upload_feedback/`
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
              this.solicitarBencao()
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
      clearForm() {
        this.imageData = ''
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
      async solicitarBencao() {
        try {
          let data = {
            id: this.dados.ID,
            almopeBencao: this.usuarioAlmope,
            evidenciaBencao: this.$refs.files.files[0].name,
            dataHoraBencao: this.moment().format('YYYY-MM-DD')
          }
          let urlData = `${config.baseUrl}api/shared/gamification/gestao_player/solicitar_bencao`
          let getFormData = object =>
            Object.keys(object).reduce((FormData, key) => {
              FormData.append(key, object[key])
              return FormData
            }, new FormData())
          await this.$api.post(urlData, getFormData(data))
        } catch (error) {
          if (error.response) {
            if (error.response.status === 500) {
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
                title: 'Erro inesperado, favor tentar novamente. COD:' + error.response.status
              })
            }
          }
        }
      }
    },
    watch: {
      abrirModalFeedback() {
        if (this.abrirModalFeedback == true) {
          this.image
        }
      }
    }
  }
</script>

<style scoped>
  .upload-foto {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
