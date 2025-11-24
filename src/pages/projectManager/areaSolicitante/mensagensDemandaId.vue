<template>
  <v-card class="rounded-lg pa-3 mt-5" :elevation="elevation">
    <slot></slot>
    <v-card-title v-if="title">
      <div style="display: flex; flex-direction: row">
        <i
          class="fa-solid fa-message"
          style="margin-left: -10px; margin-right: 10px; color: #262626ba"
        ></i>
        Mensagens
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-container class="overflow-auto overflow-x-hidden" style="max-height: 500px">
      <v-timeline dense clipped>
        <v-timeline-item fill-dot class="white--text mb-12" color="orange" large left>
          <template v-slot:icon>
            <v-avatar v-if="userSendMessage != 1">
              <v-img :src="imagemPerfil(myAvatar)"></v-img>
            </v-avatar>
            <v-avatar v-else>
              <v-img :src="imagemPerfil('CCO.png')"></v-img>
            </v-avatar>
          </template>
          <v-textarea
            v-model="input"
            hide-details
            flat
            rows="1"
            label="Deixe seu comentário..."
            auto-grow
            solo
            :disabled="isStatusValid"
            @keydown.enter="comment"
            ref="textarea"
            id="campo-msg"
          >
            <template v-slot:append>
              <v-btn
                class="mx-0"
                depressed
                @click="comment"
                fab
                color="blue"
                small
                :disabled="isStatusValid"
              >
                <v-icon color="white" small>fa-solid fa-paper-plane</v-icon>
              </v-btn>
              <v-btn
                class="mx-0 ml-2"
                depressed
                fab
                color="green"
                small
                @click="$emit('update-add-file')"
                :disabled="isStatusValid"
              >
                <v-icon color="white" small>fa-solid fa-paperclip</v-icon>
              </v-btn>
            </template>
          </v-textarea>
        </v-timeline-item>
        <v-slide-x-transition group>
          <v-timeline-item
            v-for="(event, i) in timeline"
            :key="i"
            class="mb-4 mr-5"
            color="pink"
            small
          >
            <template v-slot:icon>
              <v-avatar>
                <img :src="imagemPerfil(event.NOME_AVATAR)" />
              </v-avatar>
            </template>
            <v-row justify="space-between">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  width: 100%;
                "
              >
                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between">
                    <p
                      style="
                        font-weight: 600;
                        font-size: 14px;
                        color: grey;
                        text-transform: capitalize;
                      "
                      :style="event.NOME ? 'color: grey;' : 'color: red'"
                      class="text-capitalize"
                    >
                      {{ event.NOME ? event.NOME.toLowerCase() : 'Nome não identificado' }}
                    </p>
                    <span style="font-size: 12px; font-weight: 500">
                      {{ formatarData(event.DATA_ENVIO) }}
                    </span>
                  </div>
                  <v-textarea
                    :value="event.MSG_TEXT"
                    outlined
                    dense
                    style="width: 350px; background-color: #d5d5d590"
                    hide-details
                    readonly
                    auto-grow
                    row-height="2"
                    class="rounded-bl-xl rounded-r-xl"
                  ></v-textarea>
                  <!-- <p
                    style="
                      font-size: 14px;
                      width: 350px;
                      background-color: #d5d5d590;
                      padding: 10px;
                      border-radius: 0 10px 10px 10px;
                    "
                    v-text="event.MSG_TEXT"
                  ></p> -->
                </div>
              </div>
            </v-row>
          </v-timeline-item>
        </v-slide-x-transition>
      </v-timeline>
    </v-container>
  </v-card>
</template>

<script>
  import config from '../../../core/config'
  import acoes from '../../../mixins/projectManager/acoes'
  export default {
    components: {},
    props: {
      infoList: {
        type: [Array, Object]
      },
      elevation: {
        type: Number,
        default: 1
      },
      title: {
        type: Boolean,
        default: true
      },
      idHash: {
        type: String,
        default: null
      },
      userSendMessage: {
        type: Number,
        default: null
      }
    },
    data: () => ({
      messages: [],
      formatting: [],
      textView: '',
      input: null,
      nonce: 0
    }),
    mixins: [acoes],
    computed: {
      textStyle() {
        let style = {}
        if (this.formatting.includes('font-italic')) {
          style['font-style'] = 'italic'
        }
        if (this.formatting.includes('font-weight-bold')) {
          style['font-weight'] = 'bold'
        }
        if (this.formatting.includes('text-decoration-underline')) {
          style['text-decoration'] = 'underline'
        }
        return style
      },
      formattedText() {
        let formatted = this.input
        if (this.formatting.includes('font-italic')) {
          formatted = '<i>' + formatted + '</i>'
        }
        if (this.formatting.includes('font-weight-bold')) {
          formatted = '<b>' + formatted + '</b>'
        }
        if (this.formatting.includes('font-decoration-underline')) {
          formatted = '<u>' + formatted + '</u>'
        }
        return formatted
      },
      timeline() {
        return this.messages.slice().reverse()
      },
      myAvatar() {
        let myAvatar = this.$store.getters.myAvatar
        return myAvatar ? myAvatar : ''
      },
      usuarioAlmope() {
        return this.userSendMessage ?? this.$store.getters.usuario.almope //validar se não apresentou erro
      },
      nomeUsuario() {
        return this.$store.getters.usuario.nome
      },
      isStatusValid() {
        return this.infoList.STATUS_SOLICITACAO == 'CANCELADOS' ||
          this.infoList.STATUS_SOLICITACAO == 'FINALIZADOS' ||
          this.infoList.ID_STATUS == 5 ||
          this.infoList.ID_STATUS == 7
          ? true
          : false
      }
    },
    mounted() {
      this.loadMyAvatar()
    },
    methods: {
      loadMyAvatar() {
        return this.$store.dispatch('loadMyAvatar', this.usuarioAlmope)
      },
      imgChatRef() {
        this.$refs.arquivoChat.click()
      },
      applyFormatting(format) {
        let textArea = this.$refs.textarea
        let startPos = textArea.$refs.input.selectionStart // onde inicia a seleção
        let endPos = textArea.$refs.input.selectionEnd // onde finaliza a seleção

        let selectedText = this.input.substring(startPos, endPos) // pega onde está marcado
        let newText = this.input.substring(0, startPos)
        newText += `<${format}>${selectedText}</${format}>`
        newText += this.input.substring(endPos)

        this.textView = newText
      },
      async executarAcoes() {
        let data = {
          NUM_SOLIC_HASH: this.idHash ?? this.infoList.NUM_SOLIC_HASH,
          TIPO_NOTIFICACAO: 9
        }
        let isNotification = this.$route.query.notificationUser
        await this.cadastrarNotificacao(data, isNotification)
      },
      async loadListInteracao() {
        let urlData = `${config.baseUrl}api/shared/project_manager/solicitacao/listar_interacoes_id/${this.$route.params.id}`
        let res = await this.$api.get(urlData)
        this.messages = res.data
      },
      formatarData(value) {
        this.moment.locale('pt-br')
        return this.moment(value).fromNow()
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      async comment() {
        // let campo = document.getElementById("campo-msg");

        try {
          // campo.addEventListener("keyup", async (event) => {
          //   if (event.key === "Enter" && event.shiftKey) return;

          //   if (event.key === "Enter") {
          //     if (!this.input) return;
          if (!this.input) return
          const time = new Date()
          const nome =
            this.userSendMessage === 1 ? 'Centro de Controle Operacional' : this.nomeUsuario
          const nomeAvatar = this.userSendMessage === 1 ? 'CCO.png' : this.myAvatar
          const data = {
            NUM_SOLICITACAO: this.$route.params.id,
            ALMOPE_TEXT: this.usuarioAlmope,
            NOME: nome,
            NOME_AVATAR: nomeAvatar,
            MSG_TEXT: this.input,
            DATA_ENVIO: time
          }

          await this.messages.push(data)

          const urlData = `${config.baseUrl}api/shared/project_manager/solicitacao/inserir_interacao`
          await this.$api.post(urlData, data)
          this.executarAcoes()
          this.input = null
          // }
          // });
        } catch (e) {
          console.error('Message not sent!', e)
        }
      }
    },
    created() {
      this.loadListInteracao()
    }
  }
</script>

<style scoped>
  p {
    padding: 0;
    margin: 0;
  }

  .font-italic-active {
    font-style: italic;
  }
  .font-weight-bold-active {
    font-weight: bold;
  }
  .text-decoration-underline-active {
    text-decoration: underline;
  }

  .card {
    max-width: 600px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-radius: 0.5rem;
    background: #606c88;
    background: -webkit-linear-gradient(to right, #3f4c6b, #606c88);
    background: linear-gradient(to right top, #3f4c6b, #606c88);
    padding: 1rem;
    color: rgb(107, 114, 128);
    /* box-shadow: 0px 87px 78px -39px rgba(0, 0, 0, 0.4); */
  }
</style>
