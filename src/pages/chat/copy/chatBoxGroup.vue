<template>
  <v-card class="rounded-lg mt-6" elevation="8" height="92vh" v-if="userRouter">
    <div class="header">
      <v-badge
        bordered
        bottom
        :color="arrayUserActive.online_receiver == 1 ? 'green' : 'red'"
        dot
        offset-x="15"
        offset-y="10"
      >
        <v-avatar size="60">
          <img
            class="header-img"
            v-if="userSelected.name_avatar != null"
            :src="imagemPerfil(userSelected.name_avatar)"
            alt=""
          />
          <img v-else class="header-img" src="../../assets/img/Avatar/padrao.png" />
        </v-avatar>
      </v-badge>

      <v-card-title style="width: 100%">
        <span class="my-name">
          {{
            $route.query.type_chat == 'private'
              ? formatadedName(userSelected.name_receiver)
              : 'Grupo: ' + userSelected.group_name
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn small rounded color="error" disabled>reportar usuário</v-btn>
      </v-card-title>
    </div>
    <div class="chat-box" ref="chatOverflow">
      <!-- <pre>{{ arrayUserActive }}</pre> -->
      <!-- <pre>{{ validUserInListRecent }}</pre> -->
      <!-- <pre>{{ dateNow }}</pre> -->
      <!-- <pre>{{messages}}</pre> -->
      <notifications position="top right" />
      <span v-for="message in messages" :key="message.id">
        <div
          class="chat outgoing"
          v-if="
            message.type == 'private'
              ? message.almope_send == usuarioAlmope && message.almope_receiver === $route.params.id
              : message.almope_send == usuarioAlmope
          "
        >
          <div class="details">
            <p>
              <span class="mr-4">
                {{ message.msg_visible == 1 ? message.msg_text : 'Mensagem foi excluída' }}
              </span>
              <v-menu offset-y v-if="message.msg_visible == 1">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" absolute icon style="right: 30px" class="mt-n1">
                    <v-icon color="white">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item v-for="(item, i) in listActionBtn" :key="i" v-show="item.status">
                    <v-list-item-title
                      @click="actionButton(message.msg_key, item.action)"
                      style="cursor: pointer"
                    >
                      {{ item.title }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </p>
          </div>
        </div>
        <div
          class="chat incoming"
          v-else-if="
            message.type == 'private'
              ? message.almope_send === $route.params.id
              : message.almope_receiver == $route.params.id
          "
        >
          <img
            v-if="userSelected.name_avatar != null"
            :src="imagemPerfil(userSelected.name_avatar)"
            alt=""
          />
          <img v-else src="../../assets/img/Avatar/padrao.png" alt="" />
          <div class="details">
            <p>
              <span>
                {{ message.msg_visible == 1 ? message.msg_text : 'Mensagem foi excluída.' }}
              </span>
            </p>
          </div>
        </div>
      </span>
    </div>
    <div v-if="showEmojiPicker" class="picker">
      <picker class="picker" @select="handleEmojiSelect" />
    </div>
    <div class="input">
      <v-alert
        v-if="isMessage"
        class="ml-3 mr-11"
        style="margin-bottom: 5px"
        transition="scale-transition"
        border="right"
        :type="typeAlert"
        elevation="1"
        dense
      >
        {{ textAlert }}
      </v-alert>
      <v-text-field
        class="mx-3"
        placeholder="Digite uma mensagem..."
        v-model="newMessage.msg_text"
        @keyup.enter="validateSend"
        outlined
        dense
        :prepend-inner-icon="showEmojiPicker ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-face-grin'"
        @click:prepend-inner="handleIconClick"
      ></v-text-field>
      <!-- append-outer-icon="fab fa-telegram-plane" -->
    </div>
  </v-card>
  <div class="container-img-not-chat" v-else>
    <div class="content-img-not-chat">
      <img src="../../assets/img/geral/groupDisscussion.png" />
      <p>Fique a vontade para conversar com quem você quiser!</p>
    </div>
  </div>
</template>

<script>
  import config from '../../../core/config'
  import { Picker } from 'emoji-mart-vue'
  import notificationSound from '../../assets/notification/notificationSound.mp3'
  export default {
    props: {
      arrayUserActive: {
        type: [Array, Object],
        require: true
      }
    },
    components: { Picker },
    data: () => ({
      showEmojiPicker: false,
      isMessage: false,
      typeAlert: null,
      textAlert: null,
      messages: [],
      newMessage: {
        almope_send: '',
        name_send: '',
        msg_text: ''
      },
      destinatario: null,
      ws: null,
      usuarios: [],
      userSearchRouter: [],
      listActionBtn: [
        { title: 'Excluir', action: 'messageDeleted', status: 1 },
        { title: 'Editar', action: 'messageEdit', status: 0 }
      ],
      messageDelete: []
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      nome() {
        return this.$store.getters.usuario.nome
      },
      sessionId() {
        return this.$store.getters.usuario.sessao_id
      },
      dateNow() {
        let date = new Date()
        let day = date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate()
        let month =
          (date.getMonth() + 1).toString().length === 1
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1
        let year = date.getFullYear().toString()

        let hours =
          date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours()
        let minutes =
          date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes()
        let seconds =
          date.getSeconds().toString().length === 1 ? '0' + date.getSeconds() : date.getSeconds()
        let milleSeconds =
          date.getMilliseconds().toString() === 1
            ? '0' + date.getMilliseconds()
            : date.getMilliseconds()

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milleSeconds}`
      },
      userRouter() {
        return this.$route.params.id
      },
      userSelected() {
        if (this.arrayUserActive != '' || this.userSearchRouter != '') {
          if (this.arrayUserActive == '') {
            return this.userSearchRouter
          } else {
            return this.arrayUserActive
          }
        } else {
          return {
            almope_receiver: null,
            name_receiver: null,
            job_receiver: null,
            name_avatar: null,
            type_send: null,
            online_receiver: null
          }
        }
      },
      listUsersRecent() {
        let list = this.$store.getters.listUsersRecent
        return list ? list : []
      },
      validUserInListRecent() {
        let listRecent = this.listUsersRecent
        let inChat = this.userRouter

        const existing = listRecent.some(objeto => {
          return objeto.almope_receiver == inChat
        })

        return existing
      }
    },
    mounted() {
      this.initWebSocket()
    },
    methods: {
      updateVisualized() {
        if (this.userRouter && this.usuarioAlmope) {
          let urlData = `${config.baseUrl}api/mysql/chat/messages/update_messages_read/${this.usuarioAlmope}/${this.userRouter}`
          this.$api
            .get(urlData)
            .then(() => {})
            .catch(e => {
              console.error(e)
            })
        }
      },
      async actionButton(key, action) {
        const messageAction = {
          type: action,
          msg_key: key,
          almope_send: this.newMessage.almope_send,
          name_send: this.newMessage.name_send,
          almope_receiver: this.$route.params.id,
          date_send: this.dateNow
        }

        this.ws.send(JSON.stringify(messageAction))
        setTimeout(() => {
          this.loadMessages()
        }, 1000)
      },
      audio() {
        new Notification('Título da Notificação', {
          body: 'Conteúdo da notificação'
        })

        if (Notification.permission !== 'granted') {
          Notification.requestPermission()
        }
        const audio = new Audio(notificationSound)
        audio.play()
      },
      loadDataUserRouter() {
        let urlData = `${config.baseUrl}api/mysql/chat/contact/users/${this.userRouter}/${this.usuarioAlmope}`
        this.$api.get(urlData).then(result => {
          this.userSearchRouter = result.data[0]
        })
      },
      handleEmojiSelect(emoji) {
        // Faça algo com o emoji selecionado
        this.newMessage.msg_text += emoji.native
      },
      handleIconClick() {
        this.showEmojiPicker = !this.showEmojiPicker
      },
      async loadMessages() {
        if (this.userRouter == this.usuarioAlmope) {
          return this.$router.push('/pyxis/chat/')
        } else {
          let urlData = `${config.baseUrl}api/mysql/chat/messages/list_messages/${this.usuarioAlmope}/${this.userRouter}`
          var result = await this.$api.get(urlData)
          this.messages = result.data
        }
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      formatadedName(value) {
        if (!value) return

        let nameSplit = value.split(' ')
        let name = []
        for (let i = 0; i < nameSplit.length; i++) {
          let primeiroNome = nameSplit[i][0]
          name.push(primeiroNome + nameSplit[i].toLowerCase().slice(1))
        }
        return name.join().replaceAll(',', ' ')
      },
      initWebSocket() {
        this.ws = new WebSocket(
          `ws://10.48.16.104:8080?${this.sessionId /*hash unico para troca de mensagem*/}/${
            this.usuarioAlmope
          }`
        )
        // this.ws = new WebSocket(`ws://se0001et0612:8080?${this.sessionId /*hash unico para troca de mensagem*/}/${this.usuarioAlmope}`);

        // Abertura de conexao com ws
        this.ws.onopen = () => {
          this.isMessage = true
          this.textAlert = `Você está online!`
          this.typeAlert = 'success'
          setTimeout(() => {
            this.isMessage = false
          }, 3000)
        }

        // Canal onde passa todas as mensagens
        this.ws.onmessage = event => {
          let myAlmope = JSON.parse(event.data).almope_receiver
          let almopeSend = JSON.parse(event.data).almope_send
          let name_send = JSON.parse(event.data).name_send
          let messageType = JSON.parse(event.data).type_delete
          let keyMessage = JSON.parse(event.data).msg_key

          if (messageType == 'messageDeleted' && myAlmope == this.usuarioAlmope) {
            this.deleteMessage(keyMessage)
          } else if (messageType == 'messageEdit' && myAlmope == this.usuarioAlmope) {
            this.editMessage(keyMessage)
          } else {
            const message = JSON.parse(event.data)
            this.messages.push(message)

            // Atualiza a visualização quando o usuario estiver na conversa e recebe uma msg
            if (myAlmope == this.userRouter) {
              this.updateVisualized()
            }

            // Validação se o usuario da pesquisa ou da conversa presente ja esta na lista de recente
            if (myAlmope == this.usuarioAlmope) {
              this.audio()
              if (this.validUserInListRecent) {
                return
              } else {
                this.loadListUsersRecent()
              }
            }
            // Notifica o usuario quando o mesmo nao esta na conversa
            if (myAlmope == this.usuarioAlmope && almopeSend != this.userRouter) {
              // this.audio();
              let title = `${this.formatadedName(name_send)} enviou uma mensagem.`
              document.title = `Nova mensagem de ${this.formatadedName(name_send)}...`
              // Atualiza lista de usuarios assim que ele recebe alguma mensagem
              this.$emit('update:received-message', { title })
              return this.showNotification(title, 'Nova notificação!', 5000)
            }
          }
        }

        // Conexao fechada
        this.ws.onclose = () => {
          document.title = `Chat Desconectado`
          this.isMessage = true
          this.textAlert = `O servidor está indisponivel no momento. As mensagens serão entregues, mas será necessário o recarregamento da página!
              `
          this.typeAlert = 'error'
        }

        // Conexao encerrada por algum erro
        this.ws.onerror = () => {
          // const message = JSON.parse(event.data);
          // Lógica para tratar os erros do WebSocket
          this.isMessage = true
          this.textAlert =
            'O servidor está indisponivel no momento. As mensagens serão entregues, mas será necessário o recarregamento da página!'
          this.typeAlert = 'error'
          document.title = `Chat indisponivel`
        }
      },
      loadListUsersRecent() {
        this.$store.dispatch('loadListUsersRecent', this.usuarioAlmope)
      },
      deleteMessage(key) {
        let urlData = `${config.baseUrl}api/mysql/chat/messages/delete_message/${key}`
        this.$api.get(urlData).then(() => {
          this.loadMessages()
        })
      },
      editMessage(key) {
        console.log(key)
      },
      validateSend() {
        if (this.$route.query.type_chat == 'private') {
          this.sendMessage()
        } else {
          this.sendMessageGroup()
        }
      },
      sendMessageGroup() {
        let key = this.token()

        if (this.newMessage.msg_text != '') {
          const message = {
            type: this.$route.query.type_chat,
            almope_send: this.newMessage.almope_send,
            name_send: this.newMessage.name_send,
            group_id: this.$route.params.id,
            msg_text: this.newMessage.msg_text,
            msg_visible: '1',
            msg_read: '0',
            msg_important: '0',
            date_send: this.dateNow,
            msg_key: key
          }

          this.$api
            .post('api/mysql/chat/messages/send_messages_group', message)
            .then(() => {})
            .catch(error => {
              console.error(error)
              // Lide com erros, se necessário
            })

          this.ws.send(JSON.stringify(message))
          this.messages.push(message)
          this.newMessage.msg_text = ''
        } else {
          this.textAlert = 'Digite uma mensagem para continuar...'
          this.typeAlert = 'warning'
          this.isMessage = true

          setTimeout(() => {
            this.isMessage = false
            this.textAlert = null
            this.typeAlert = null
          }, 3500)
        }
      },
      sendMessage() {
        // let typeChat = this.userSelected.type_send;
        let key = this.token()
        if (this.newMessage.msg_text != '') {
          const message = {
            type: this.$route.query.type_chat,
            almope_send: this.newMessage.almope_send,
            name_send: this.newMessage.name_send,
            almope_receiver: this.$route.params.id,
            name_receiver: this.userSelected.NOME_PARA,
            msg_text: this.newMessage.msg_text,
            msg_visible: '1',
            msg_read: '0',
            msg_important: '0',
            date_send: this.dateNow,
            msg_key: key
          }

          this.$api
            .post('api/mysql/chat/messages/send_messages', message)
            .then(() => {
              if (this.validUserInListRecent) {
                return
              } else {
                this.loadListUsersRecent()
              }
            })
            .catch(error => {
              console.error(error)
              // Lide com erros, se necessário
            })

          this.ws.send(JSON.stringify(message))
          this.messages.push(message)
          this.newMessage.msg_text = ''
        } else {
          this.textAlert = 'Digite uma mensagem para continuar...'
          this.typeAlert = 'warning'
          this.isMessage = true

          setTimeout(() => {
            this.isMessage = false
            this.textAlert = null
            this.typeAlert = null
          }, 3500)
        }
      },
      showNotification(title, text, duration = 3000) {
        this.$notify({
          title: title,
          text: text,
          duration: duration // Tempo padrao em milissegundos (3 segundos)
        })
      },
      token() {
        let tokenValidacao = {
          iss: this.newMessage.msg_text.slice(0, 20) + 'almavivadobrasil.net',
          iat: new Date().toLocaleString(),
          exp: new Date().setMinutes(60).toLocaleString()
        }

        tokenValidacao = JSON.stringify(tokenValidacao)
        tokenValidacao = Buffer.from(tokenValidacao).toString('base64')

        return tokenValidacao
      }
    },
    created() {
      this.newMessage.almope_send = this.usuarioAlmope
      this.newMessage.name_send = this.nome
      this.loadMessages()
      this.loadDataUserRouter()

      if (this.messages.length > 0) {
        this.$nextTick(() => {
          this.$refs.chatOverflow.scrollTop = this.$refs.chatOverflow.scrollHeight
        })
      }
      this.token()
      this.updateVisualized()
    },
    watch: {
      messages() {
        if (this.messages.length > 0) {
          this.$nextTick(() => {
            this.$refs.chatOverflow.scrollTop = this.$refs.chatOverflow.scrollHeight
          })
        }
      },
      userRouter() {
        this.loadMessages()
        this.updateVisualized()
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap"); */

  .header {
    display: flex;
    flex-direction: row;
    padding: 10px 10px 10px 20px;
    border-bottom: 1px solid #e6e6e6;
    align-items: center;
  }
  .header .header-img {
    height: 55px;
    border-radius: 50%;
  }
  .my-name {
    font-family: 'Poppins', sans-serif;
  }

  .chat-area {
    height: 83%;
  }

  .chat-box::-webkit-scrollbar {
    width: 10px; /* width of the entire scrollbar */
  }

  .chat-box::-webkit-scrollbar-track {
    background: rgb(255, 255, 254); /* color of the tracking area */
  }

  .chat-box::-webkit-scrollbar-thumb {
    background-color: rgb(143, 14, 143); /* color of the scroll thumb */
    border-radius: 25px; /* roundness of the scroll thumb */
    border: 3px solid rgb(245, 245, 245); /* creates padding around scroll thumb */
  }
  .chat-box {
    position: relative;
    height: 70vh;
    overflow-y: auto;
    margin: 0 0 0 15px;
    padding: 10px 30px 20px 30px;
    /* width: 100%; */
  }
  .chat-box .text {
    position: absolute;
    top: 45%;
    left: 50%;
    width: calc(100% - 50px);
    text-align: center;
    transform: translate(-50%, -50%);
  }
  .chat-box .chat {
    margin: 15px 0;
  }
  .chat-box .chat p {
    word-wrap: break-word;
    padding: 8px 16px;
    box-shadow: 0 0 32px rgb(0 0 0 / 8%), 0rem 16px 16px -16px rgb(0 0 0 / 10%);
  }
  .chat-box .outgoing {
    display: flex;
  }
  .details {
    display: flex;
    align-items: center;
  }
  .chat-box .outgoing .details {
    margin-left: auto;
    max-width: calc(100% - 130px);
  }
  .outgoing .details p {
    background: #333;
    color: #fff;
    border-radius: 18px 18px 0 18px;
  }
  .chat-box .incoming {
    display: flex;
    align-items: flex-end;
  }
  .chat-box .incoming img {
    height: 35px;
    width: 35px;
    border-radius: 50%;
  }
  .chat-box .incoming .details {
    margin-right: auto;
    margin-left: 10px;
    max-width: calc(100% - 130px);
  }

  .incoming .details p {
    background: #17bcce;
    color: #fff;
    border-radius: 18px 18px 18px 0;
  }
  .picker {
    position: absolute;
    bottom: 35px;
    left: 7px;
  }

  .input {
    position: absolute;
    width: 100%;
    bottom: -5px;
  }

  .container-img-not-chat {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 92vh;
  }

  .content-img-not-chat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
  }

  .container-img-not-chat .content-img-not-chat img {
    height: 90%;
  }
</style>
