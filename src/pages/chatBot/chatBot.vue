<template>
  <div class="container-chatbot" v-if="isVisible">
    <div class="content-chatbot">
      <div class="title-chat">
        <div class="dados-bot">
          <img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460" alt="avatar" />
          <div class="info-bot">
            <p>EUZIN</p>
            <span class="status">
              <p>Status</p>
              <i class="fa-solid fa-circle"></i>
            </span>
          </div>
        </div>
        <div class="button-close">
          <v-btn icon @click="$emit('update:close-bot')">
            <v-icon>fas fa-close</v-icon>
          </v-btn>
        </div>
      </div>
      <v-divider class="ma-2"></v-divider>
      <div class="main" ref="chatMessages">
        <span v-for="(message, i) in messages" :key="i">
          <div class="msg-out" v-if="message.role == 'bot'">
            <span>{{ message.role }}</span>
            <div>
              <p v-html="message.text"></p>
            </div>
            <v-divider></v-divider>
          </div>
          <div class="msg-in" v-else>
            <span>{{ message.role }}</span>
            <div>
              <p v-html="message.text"></p>
            </div>
          </div>
        </span>
        <div v-if="loading" class="loading-wave">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
      <div class="interacao">
        <input placeholder="Digite sua mensagem" @keyup.enter="sendMessage" v-model="messageText" />
      </div>
    </div>
  </div>
</template>

<script>
  import responses from './responses'
  export default {
    props: {
      isVisible: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      messages: [],
      options: [],
      messageText: null,
      loading: false
    }),
    methods: {
      semAcento(string) {
        const acentos = [
          'a',
          'á',
          'à',
          'ã',
          'â',
          'ä',
          'e',
          'é',
          'è',
          'ê',
          'ë',
          'i',
          'í',
          'ì',
          'î',
          'ï',
          'o',
          'ó',
          'ò',
          'õ',
          'ô',
          'ö',
          'u',
          'ú',
          'ù',
          'û',
          'ü',
          'c',
          'ç'
        ]
        const semAcento = [
          'a',
          'a',
          'a',
          'a',
          'a',
          'a',
          'e',
          'e',
          'e',
          'e',
          'e',
          'i',
          'i',
          'i',
          'i',
          'i',
          'o',
          'o',
          'o',
          'o',
          'o',
          'o',
          'u',
          'u',
          'u',
          'u',
          'u',
          'c',
          'c'
        ]

        for (let i = 0; i < acentos.length; i++) {
          const acento = new RegExp(acentos[i], 'g')
          string = string.replace(acento, semAcento[i])
        }

        return string
      },
      async sendMessage() {
        let data = {
          text: this.messageText,
          role: '4602597'
        }

        this.loading = true

        this.messages.push(data)
        await this.simulateBotResponse()
        this.messageText = null
        this.loading = false
        this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight
      },
      async simulateBotResponse() {
        if (this.messageText.trim() === '') return
        await new Promise(resolve => setTimeout(resolve, 1500))

        const userMessage = this.semAcento(this.messageText.toLocaleLowerCase())

        let matchedResponses = responses.filter(response => {
          let res = response.question.toLocaleLowerCase()
          return res.includes(userMessage)
        })

        const randomResponseIndex = Math.floor(Math.random() * matchedResponses.length)

        if (matchedResponses.length > 0) {
          this.messages.push({
            text: matchedResponses[randomResponseIndex].answer,
            role: 'bot'
          })
        } else {
          this.messages.push({
            text: 'Desculpe, não entendi essa pergunta.',
            role: 'bot'
          })
        }
      }
    }
  }
</script>

<style scoped>
  .container-chatbot {
    position: fixed;
    bottom: 70px;
    right: 14px;
  }

  .content-chatbot {
    background-color: #ffffff;
    width: 350px;
    max-width: 350px;
    padding: 12px;
    border-radius: 20px;
    box-shadow: 0px 13px 28px -10px rgba(0, 0, 0, 0.398);
  }

  .title-chat {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title-chat img {
    width: 60px;
    border-radius: 20px;
    margin-right: 7px;
  }

  .dados-bot {
    display: flex;
    align-items: center;
  }

  p {
    padding: 0;
    margin: 0;
  }

  .status {
    display: flex;
    align-items: center;
  }

  .status i {
    font-size: 10px;
    margin-left: 5px;
    color: rgb(6, 237, 6);
  }

  .main {
    background-image: url('../../assets/img/bot/avatar-bot-profile.png');
    background-size: cover;
    background-position: center;
    height: 400px;
    max-height: 400px;
    border-radius: 10px;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  .main .msg-out {
    background-color: #8f0e8f;
    color: white;
    border-radius: 10px;
    margin: 5px;
    padding: 5px;
    margin-left: 10px;
    max-width: calc(100% - 130px);
  }

  .msg-out span,
  .msg-in span {
    font-weight: 600;
  }

  .main .msg-in {
    background-color: #8f0e8f;
    color: white;
    border-radius: 10px;
    margin: 5px;
    padding: 5px;
    margin-left: auto;
    max-width: calc(100% - 130px);
  }

  .interacao {
    margin-top: 7px;
  }

  input {
    width: 100%;
    padding: 7px;
    border: 1px solid #000000;
    border-radius: 4px;
  }

  .loading-wave {
    display: flex;
    align-items: center;
  }

  .dot {
    width: 10px;
    height: 10px;
    background-color: #333;
    border-radius: 50%;
    margin: 25px 5px;
    animation: waveAnimation 1s ease-in-out infinite;
  }

  @keyframes waveAnimation {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
</style>
