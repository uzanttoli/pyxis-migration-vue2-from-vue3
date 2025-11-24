<template>
  <div class="wrapper">
    <section class="chat-area">
      <header>
        <img
          v-if="userSelected.AVATAR_PARA != null"
          :src="imagemPerfil(userSelected.AVATAR_PARA)"
          alt=""
        />
        <img v-else src="../../assets/img/Avatar/padrao.png" alt="" />
        <div class="details">
          <span>{{ formatadedName(userSelected.NOME_PARA) }}</span>
          <p>
            {{ userSelected.NOME_PARA != 'Selecione um usuario!' ? 'Online' : 'Offline' }}
          </p>
        </div>
      </header>
      <div class="chat-box" ref="chatOverflow">
        <span v-for="message in messages" :key="message.id">
          <div
            class="chat outgoing"
            v-if="
              message.almopeSend == usuarioAlmope && message.almopeReceiver === $route.params.id
            "
          >
            <div class="details">
              <p>
                {{ message.text }}
              </p>
            </div>
          </div>
          <div class="chat incoming" v-else-if="message.almopeSend === $route.params.id">
            <img
              v-if="arrayUserActive.AVATAR_PARA != null"
              :src="imagemPerfil(arrayUserActive.AVATAR_PARA)"
              alt=""
            />
            <img v-else src="../../assets/img/Avatar/padrao.png" alt="" />
            <div class="details">
              <p>
                {{ message.text }}
              </p>
            </div>
          </div>
        </span>
      </div>

      <form action="#" class="typing-area">
        <input
          type="text"
          placeholder="Digite uma mensagem..."
          v-model="newMessage.text"
          @change="sendMessage"
        />
        <button @click="sendMessage">
          <i class="fab fa-telegram-plane"></i>
        </button>
      </form>
    </section>
  </div>
</template>

<script>
  import config from '../../../core/config'
  export default {
    props: {
      arrayUserActive: {
        type: [Array, Object],
        require: true
      }
    },
    data: () => ({
      messages: [],
      newMessage: {
        almopeSend: '',
        name: '',
        text: ''
      },
      destinatario: null,
      ws: null,
      usuarios: [],
      userSearchRouter: []
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

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
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
            NOME_PARA: 'Selecione um usuario!'
          }
        }
      }
    },
    mounted() {
      this.initWebSocket()
    },
    methods: {
      loadUserSearchRoute() {
        let urlData = `${config.baseUrl}api/shared/chat/users_list/list_users_json/${this.userRouter}`
        this.$api.get(urlData).then(res => {
          this.userSearchRouter = res.data
        })
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
          `ws://se0001et0612:8080?${this.sessionId /*hash teste*/}/${this.usuarioAlmope}`
        )

        this.ws.onmessage = event => {
          const message = JSON.parse(event.data)
          this.messages.push(message)
        }
      },
      sendMessage(e) {
        e.preventDefault()
        if (this.newMessage.text != '') {
          const message = {
            type: 'private',
            almopeSend: this.newMessage.almopeSend,
            nameSend: this.newMessage.name,
            almopeReceiver: this.$route.params.id,
            text: this.newMessage.text,
            dateHora: this.dateNow
          }

          this.ws.send(JSON.stringify(message))
          this.messages.push(message)
          this.newMessage.text = ''
        }
      }
    },
    created() {
      this.newMessage.almopeSend = this.usuarioAlmope
      this.newMessage.name = this.nome
      this.loadUserSearchRoute()
    },
    watch: {
      messages() {
        this.$nextTick(() => {
          this.$refs.chatOverflow.scrollTop = this.$refs.chatOverflow.scrollHeight
        })
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap"); */
  * {
    /* font-family: "Poppins", sans-serif; */
    text-decoration: none;
  }

  body {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 92vh !important;
    background: #f7f7f7 !important;
    padding: 0 10px !important;
  }
  .wrapper {
    background: #fff;
    max-width: 95vw;
    display: flex;
    width: 100%;
    height: 92vh;
    border-radius: 16px;
    margin-top: 25px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1), 0 32px 64px -48px rgba(0, 0, 0, 0.5);
  }

  /* Chat Area CSS Start */
  .wrapper img {
    object-fit: cover;
    border-radius: 50%;
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

  /* :is(.chat-box)::-webkit-scrollbar {
  width: 10px;
} */
  .chat-area {
    width: 100%;
  }
  .chat-area header {
    display: flex;
    align-items: center;
    padding: 18px 30px;
    border-bottom: 1px solid #f1f1f1;
  }
  .chat-area header .back-icon {
    color: #333;
    font-size: 18px;
  }
  .chat-area header img {
    height: 45px;
    width: 45px;
    margin: 0 15px;
  }
  .chat-area header .details {
    height: 50px;
  }
  .chat-area header .details span {
    font-size: 17px;
    font-weight: 500;
    font-family: 'Poppins', sans-serif;
  }
  .chat-box {
    position: relative;
    height: 70vh;
    overflow-y: auto;
    margin: 0 0 0 15px;
    padding: 10px 30px 20px 30px;
    width: 100%;
    /* background: #f7f7f7; */
    /* box-shadow: inset 0 32px 32px -32px rgb(0 0 0 / 5%),
    inset 0 -32px 32px -32px rgb(0 0 0 / 5%); */
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

  .typing-area {
    padding: 18px 30px;
    display: flex;
    justify-content: space-between;
  }
  .typing-area input {
    height: 45px;
    width: 100%;
    font-size: 16px;
    padding: 0 13px;
    border: 1px solid #e6e6e6;
    outline: none;
    border-radius: 5px 0 0 5px;
  }
  .typing-area button {
    color: #fff;
    width: 55px;
    border: none;
    outline: none;
    background: #333;
    font-size: 19px;
    cursor: pointer;
    opacity: 0.7;
    border-radius: 0 5px 5px 0;
  }
</style>
