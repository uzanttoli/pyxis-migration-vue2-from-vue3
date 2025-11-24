<template>
  <v-col>
    <!-- v-model="dialogCake" -->
    <v-dialog
      transition="dialog-bottom-transition"
      max-width="780"
      :model-value="dialogCake"
      @update:modelValue="val => $emit('update:dialogCake', val)"
    >
      <template>
        <v-card>
          <v-card-text>
            <div class="text-h2 text-center">
              <v-img
                style="position: relative"
                src="../../../assets/img/gif/animation_640_l6gthgho.gif"
              ></v-img>
              <span class="text-capitalize">Feliz Aniversário!</span>
            </div>
            <div class="text-capitalize text-center">
              {{ messagem }}
            </div>
          </v-card-text>
        </v-card>
      </template>
    </v-dialog>
  </v-col>
</template>

<script>
  import config from '../../../core/config.js'
  export default {
    props: {
      dialogCake: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      input: '',
      messagem: '',
      id: ''
    }),
    computed: {
      nome() {
        let completo = this.$store.getters.usuario.nome
        let primeiro = completo.split(' ')
        let nomeExibicao = primeiro[0]
        return nomeExibicao.toLowerCase()
      },
      isSetMessage() {
        let messages = this.messages
        return messages ? messages : []
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      loadMessages() {
        let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/get_list_message`
        this.$api.get(urlData).then(res => {
          // Gera numero aleatorio entre 0 e 15;
          let index = parseInt(Math.random() * 15)
          // Seta valor em data
          this.id = res.data[index].ID
          this.messagem = res.data[index].MENSAGEM.replace('#NOME#', this.nome)
          setTimeout(() => {
            this.insertMessage()
          }, 2000)
        })
      },
      loadMessagesUser() {
        let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/get_message_user/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          if (res.data.length > 0) {
            this.id = res.data[0].ID
            this.messagem = res.data[0].MENSAGEM.replace('#NOME#', this.nome)
          } else {
            this.loadMessages()
          }
        })
      },
      insertMessage() {
        let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/message`
        let getFormdata = object =>
          Object.keys(object).reduce((Formdata, key) => {
            Formdata.append(key, object[key])
            return Formdata
          }, new FormData())
        this.$api.post(
          urlData,
          getFormdata({
            idMensagem: this.id,
            loginMensagem: this.usuarioAlmope
          })
        )
      }
    },
    watch: {},
    created() {
      if (this.$store.getters.usuario.almope != null) {
        this.loadMessagesUser()
      }
    }
  }
</script>

<style scoped>
  .class-dialog {
    width: 300px;
  }
</style>
