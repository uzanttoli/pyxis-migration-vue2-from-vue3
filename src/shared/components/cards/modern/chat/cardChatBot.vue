<template>
  <v-card
    :class="
      itemsExist
        ? 'rounded-t-lg cor-padrao-chatbot overflow-auto card-chat'
        : 'rounded-t-lg  overflow-auto card-chat'
    "
  >
    <v-system-bar dark :color="itemsExist ? 'cor-padrao-chatbot' : 'black'" height="">
      <strong>{{ itemsExist ? 'Claro BR' : 'Sem sinal' }}</strong>
      <v-spacer></v-spacer>
      <v-icon>{{ itemsExist ? 'fa-solid fa-wifi' : 'fa-solid fa-xmark' }}</v-icon>
      <v-icon>{{ itemsExist ? 'fa-solid fa-signal' : 'fa-solid fa-plane-up' }}</v-icon>
      <v-icon>{{ itemsExist ? 'fa-solid fa-battery-full' : 'fa-solid fa-battery-empty' }}</v-icon>
      <span>{{ hours() }}</span>
    </v-system-bar>
    <v-app-bar
      tile
      dense
      :class="itemsExist ? 'cor-padrao-chatbot card-chat' : 'white '"
      elevate-on-scroll
    >
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title>
        <template v-if="isSearch == false">
          <p class="pa-0 ma-0" style="font-size: 13px">
            {{ itemsExist ? messageImportante : 'Chat está indisponivel' }}
          </p>
        </template>
        <template v-else>
          <p class="pa-0 ma-0">
            <span>
              <input
                type="text"
                placeholder="Pesquise aqui"
                v-model="itemFilter"
                @change="itemsFilters()"
              />
            </span>
          </p>
        </template>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon v-if="!isSearch" @click="isSearch = true" :disabled="itemsExist == ''">
        <v-icon>fa-solid fa-magnifying-glass</v-icon>
      </v-btn>
      <v-btn icon v-else @click="isSearch = false" :disabled="itemsExist == ''">
        <v-icon>fa-solid fa-angle-left</v-icon>
      </v-btn>
    </v-app-bar>

    <v-divider></v-divider>
    <v-card
      tile
      :class="itemsExist ? 'cor-padrao-chatbot overflow-auto card-chat' : 'overflow-auto card-chat'"
      max-height="40vh"
    >
      <ul class="conversation">
        <template v-if="itemsFilters() != ''">
          <div style="display: flex; justify-content: center">
            <v-chip small color="#F1F8E9">
              <span>
                {{
                  `${loadingData ? 0 : itemsFilters().length} ${
                    itemsFilters().length > 1
                      ? 'correspondências localizadas'
                      : 'correspondência localizada'
                  }`
                }}
              </span>
            </v-chip>
          </div>
          <li class="message" v-for="(item, i) in itemsFilters()" :key="i">
            <div style="">
              <div style="display: flex; align-items: center">
                <img class="message-image" src="@/assets/img/bot/avatar-profile.png" />
                <div style="display: flex; justify-content: space-between; width: 100%">
                  <strong style="color: #fffffe">Vanessa Dias</strong>
                  <v-icon
                    color="#eee"
                    v-if="isAlert && item[statusMessages] == equalStatusMessages"
                  >
                    mdi-alert-circle
                  </v-icon>
                </div>
              </div>
              <div class="text loading-dots" v-if="loadingData">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div class="text" v-else v-html="isArrayObject ? messageTreated(item) : item"></div>
            </div>
          </li>
        </template>
        <template v-else>
          <li class="message">
            <div>
              <img class="message-image" src="@/assets/img/bot/avatar-profile.png" />
            </div>
            <div class="text">Ops... Nada encontrado!</div>
          </li>
        </template>
      </ul>
    </v-card>
    <v-card :class="itemsExist ? 'cor-padrao-chatbot card-chat' : 'card-chat'" tile elevation="8">
      <div class="input">
        <slot name="button"></slot>
      </div>
    </v-card>
  </v-card>
</template>

<script>
  export default {
    props: {
      messageImportante: {
        type: String,
        default: 'Mensagem indisponivel'
      },
      items: {
        type: Array,
        require: true
      },
      loadingData: {
        type: Boolean,
        default: false
      },
      isArrayObject: {
        type: Boolean,
        default: false
      },
      isAlert: {
        type: Boolean,
        default: false
      },
      statusMessages: {
        type: String,
        require: true
      },
      equalStatusMessages: {
        type: String,
        require: true
      },
      desconsiderar: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      isSearch: false,
      itemFilter: null,
      drawer: false
    }),
    computed: {
      itemsExist() {
        if (this.items?.length > 0) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      messageTreated(item) {
        let message = ''
        for (let key in item) {
          message +=
            item[key] != this.desconsiderar
              ? `<strong style="font-size: 11px;">${this.formatedText(
                  key
                )}: </strong><span style="font-size: 11px;">${item[key]}</span><br>`
              : ''
        }
        return message
      },
      formatedText(string) {
        let text = string.split(' ') || string.split('_')

        if (text.length > 1) {
          const [pri, sec] = text

          let textFormatade = `${
            pri[0] + pri.slice(1).toLowerCase() + ' ' + sec[0] + sec.slice(1).toLowerCase()
          }`
          return textFormatade
        } else {
          let textNotArray = text[0]
          let textFormatade = textNotArray[0] + textNotArray.slice(1).toLowerCase()
          return textFormatade
        }
      },
      itemsFilters() {
        let dados = this.items
        if (this.isArrayObject) {
          if (this.itemFilter == null || this.itemFilter == '') {
            return dados
          } else {
            const valorProcurado = this.itemFilter.toLowerCase()

            return dados.filter(item => {
              const valores = Object.values(item)
              return valores.some(valor => {
                return String(valor).toLowerCase().includes(valorProcurado)
              })
            })
          }
        } else {
          if (this.itemFilter == null || this.itemFilter == '') {
            return dados
          } else {
            return dados.filter(item => {
              const filtro = this.itemFilter
              const regex = new RegExp(filtro, 'i')
              const match = item.match(regex)

              if (match) {
                return match[0]
              }
            })
          }
        }
      },
      showItem(item) {
        let delay = 0
        const letters = item.split('')

        return letters
          .map(letter => {
            delay += 60
            return `<span style="animation-delay: ${delay}ms">${letter}</span>`
          })
          .join('')
      },
      hours() {
        let date = new Date()
        let hours = date.getHours().toString()
        let hoursF = hours.length === 1 ? '0' + hours : hours
        let minutes = date.getMinutes().toString()
        let minutesF = minutes.length === 1 ? '0' + minutes : minutes

        return `${hoursF}:${minutesF}`
      }
    },
    created() {
      this.itemsFilters()
    }
  }
</script>

<style scoped>
  .cor-padrao-chatbot {
    background-image: linear-gradient(260deg, #f2784d, #f29849);
  }

  .conversation {
    list-style: none;
    margin: 0;
    padding: 8px;
  }

  .message {
    display: flex;
    align-items: flex-start;
    margin: 10px;
  }

  .sender {
    font-weight: bold;
    margin-right: 5px;
  }

  .text {
    background-color: #eee;
    border-radius: 5px;
    padding: 10px;
    margin-right: 10px;
    margin-left: 60px;
    margin-top: -5px;
    position: relative;
    max-width: 100%;
  }

  .text::before {
    content: '';
    position: absolute;
    top: 0px;
    width: 25px;
    left: -15px;
    border-top: 15px solid #eee;
    border-left: 15px solid transparent;
  }

  .message-image {
    width: 45px;
    height: 45px;
    margin-left: -5px;
    margin-right: 10px;
    border-radius: 50%;
  }

  .card-chat::-webkit-scrollbar {
    width: 10px;
  }

  .card-chat::-webkit-scrollbar-track {
    background: #fffffe;
  }

  .card-chat::-webkit-scrollbar-thumb {
    background-color: #f29849;
    border-radius: 25px;
    border: 3px solid rgb(245, 245, 245);
  }

  .input {
    /* position: absolute; */
    bottom: 0px;
    padding: 10px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
  }

  .loading-dots {
    display: flex;
    justify-content: center;
    /* align-items: center; */
  }

  .loading-dots span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin: 0 4px;
    background-color: #ccc;
    animation: loading-dots 1s infinite ease-in-out;
  }

  .loading-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loading-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes loading-dots {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }

  input {
    border: 2px solid rgb(106, 105, 105);
    border-radius: 20px;
    padding-left: 10px;
  }

  input:focus {
    outline: none;
  }

  ::placeholder {
    font-size: 16px;
  }
</style>
