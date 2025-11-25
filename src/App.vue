<template>
  <div id="app">
    <v-app>
      <v-layout align-center justify-center>
        <v-card elevate-on-scroll class="overflow-hidden" height="100%" width="100%" elevation="0">
          <template v-if="token && usuario">
            <app-side-bar></app-side-bar>
            <main-container></main-container>
            <button-fluante
              @update:abrirChatBot="abrirChatBot"
              @update:notasFlutuantes="notasFlutuantes"
              @abrirCalc="openCalculadora = !openCalculadora"
            ></button-fluante>
            <chat-bot :isVisible="isVisible" @update:close-bot="isVisible = !isVisible"></chat-bot>
            <notas-flutuante
              :dialogModal="abrirNotasFlutuante"
              @update:closeNotasFlutuante="abrirNotasFlutuante = !abrirNotasFlutuante"
            ></notas-flutuante>
            <calculadora
              :calculator="openCalculadora"
              @close:calculadora="openCalculadora = !openCalculadora"
            ></calculadora>
            <cadastro-email
              :dialogCadastroEmail="emailRegistered"
              @update:close="emailRegistered = false"
            ></cadastro-email>

            <!-- <PesquisaSatisfacao v-if="pesquisaSatisfacaoHabilitado" /> -->

            <Pesquisa />
            <!-- <AnaliseHumor></AnaliseHumor> -->
            <Solicitacoes />

            <!-- TODO: COMENTADO POR ULLISSES EM 29/05/2025
            <AnaliseDePerfilVue
              :dialogAnalisePerfil="pendenteAnalisePerfil && resultAnalise && isMapeamentoPerfil && responderHoje"
              @closeDialog="resultAnalise = false"
            /> -->
            <v-dialog width="1000" v-model="localStorage2">
              <v-card>
                <v-card-title>Dados do usuário</v-card-title>
                <v-divider></v-divider>
                <v-col v-if="!isPassed">
                  <div class="ma-auto position-relative">
                    <v-text-field
                      dense
                      placeholder="Insira a senha para prosseguir"
                      label="Insira a senha para prosseguir"
                      outlined
                      :type="visibilityPass ? 'text' : 'password'"
                      v-model="passwordPassed"
                      @change="onFinish"
                    >
                      <template v-slot:append>
                        <v-btn
                          icon
                          style="margin-top: -5.2px"
                          @click="visiblePassword"
                          v-if="visibilityPass"
                        >
                          <v-icon>fa-regular fa-eye-slash</v-icon>
                        </v-btn>
                        <v-btn icon v-else style="margin-top: -5.2px" @click="visiblePassword">
                          <v-icon>fa-regular fa-eye</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </div>
                </v-col>
                <v-col v-if="isPassed">
                  <ul>
                    <li class="pa-2">
                      <h4 class="mb-2">Token</h4>
                      {{ token }}
                    </li>
                    <li class="pa-2">
                      <h4>Usuario</h4>
                      <v-data-table
                        :items="dadosUsuario"
                        :headers="getHeadersUsuario"
                        dense
                        hide-default-footer
                        class="text-no-wrap mt-2"
                      ></v-data-table>
                    </li>
                  </ul>
                </v-col>
              </v-card>
            </v-dialog>
            <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="4000">
              <div class="d-flex align-center">
                <span class="mr-3">
                  <v-icon>{{ snackbar.iconLeft }}</v-icon>
                </span>
                <span>{{ snackbar.text }}</span>
                <span class="ml-3">
                  <v-icon>{{ snackbar.iconRight }}</v-icon>
                </span>
              </div>
            </v-snackbar>
          </template>
          <template v-else>
            <app-login></app-login>
          </template>
        </v-card>
      </v-layout>
    </v-app>
  </div>
</template>
<script>
  // import appBar from "./core/components/appBar";
  // import appLogin from "./core/components/login.vue";
  import config from './core/config'
  import { EventBus } from '@/eventBus'

  import ChatBot from './pages/chatBot/chatBot.vue'
  import Pesquisa from './pages/pesquisa/pesquisa.vue'
  import mainContainer from './core/components/main.vue'
  import appLogin from './core/components/login/login.vue'
  import appSideBar from './core/components/appSideBar.vue'
  import Calculadora from './pages/calculadora/calculadora.vue'
  // import AnaliseHumor from '@/pages/pesquisa/humor/AnaliseHumor.vue'
  import ButtonFluante from './shared/components/buttons/buttonFluante.vue'
  import CadastroEmail from './pages/meuPerfil/dadosCadastrais/cadastroEmail.vue'
  // import PesquisaSatisfacao from './pages/pesquisa/satisfacaoOperacional/pesquisaSatisfacao.vue'
  import notasFlutuante from './shared/components/utilities/blocoDeNotas/blocoDeNotasFlutuante.vue'
  import Solicitacoes from './pages/formularios/tabuladores/almawave/solicitacoesOperador/solicitacoes.vue'

  // import AnaliseDePerfilVue from './pages/operacao/net/analiseDePerfil/AnaliseDePerfil.vue'
  export default {
    name: 'App',
    props: {
      alert: {
        type: Boolean,
        default: false
      }
    },
    components: {
      // appBar,
      appSideBar,
      mainContainer,
      appLogin,
      ButtonFluante,
      ChatBot,
      notasFlutuante,
      CadastroEmail,
      Calculadora,
      // PesquisaSatisfacao,
      Pesquisa,
      Solicitacoes
      // AnaliseHumor
      // AnaliseDePerfilVue,
    },
    data: () => ({
      drawer: false,
      localStorage2: false,
      interval: null,
      openDevelop: true,
      otp: '',
      isPassed: false,
      snackbar: {
        show: false,
        text: '',
        color: 'success',
        iconLeft: null,
        iconRight: null
      },
      visibilityPass: false,
      dialogVisible: false,
      passwordPassed: null,
      passwordPassedExpected: 'adm.cco@acesso_portal#19',
      isVisible: false,
      loading: false,
      abrirNotasFlutuante: false,
      emailRegistered: false,
      openCalculadora: false,
      resultAnalise: false,
      popUpDisponivel: null
    }),
    async mounted() {
      // let data = await this.dataLang()
      // this.$i18n.locale = data ? data : 'Português'
      document.addEventListener('keydown', this.handleKeyDown)
    },
    beforeUpdate() {
      this.loadEmailRegistered()
    },
    beforeUnmount() {
      document.removeEventListener('keydown', this.handleKeyDown)
    },
    computed: {
      getHeadersUsuario() {
        let headers = this.dadosUsuario[0]
        let newHeaders = Object.keys(headers).map(item => {
          return {
            text: item,
            value: item,
            sortable: false,
            class: 'blue-grey lighten-2 white--text'
          }
        })
        return newHeaders
      },
      pendenteAnalisePerfil() {
        let pa = this.$store.getters.usuario.pendente_analise_perfil
        return pa == 1 ? true : false
      },
      minhaAnalise() {
        let minhaAnalise = this.$store.getters.minhaAnalise
        return minhaAnalise ? minhaAnalise : []
      },
      isMapeamentoPerfil() {
        let mp = this.$store.getters.usuario.mapeamento_perfil
        return mp == 1 ? true : false
      },
      responderHoje() {
        let responderHoje = this.$store.getters.responderHoje
        return responderHoje ? true : false
      },
      enviarDados() {
        return this.$store.getters.enviarDados
      },
      token() {
        return this.$store.getters.token
      },
      dadosUsuario() {
        let array = []
        array.push(this.$store.getters.usuario)
        return array
      },
      usuario() {
        return this.$store.getters.usuario.almope
      },
      filtro() {
        let considerar = ['operador', 'bko_ativacao', 'back_office', 'inativo']
        let filtro = this.$store.getters.usuario.filtro?.toLowerCase()
        if (!considerar.includes(filtro)) {
          return true
        }
        return false
      },
      pesquisaSatisfacaoHabilitado() {
        let pesquisa = this.$store.getters.usuario.habilitado_pesq_satisfacao
        return pesquisa == 1 ? true : true //false
      }
    },
    methods: {
      visiblePassword() {
        this.visibilityPass = !this.visibilityPass
      },
      onFinish(rsp) {
        if (rsp == this.passwordPassedExpected) {
          this.isPassed = true
        }
      },
      handleKeyDown(event) {
        if (event.ctrlKey && event.key.toLowerCase() === 'm') {
          event.preventDefault() // Impede o comportamento padrão
          this.localStorage2 = true
        }
      },
      loadMinhaAnalise() {
        this.$store.dispatch('loadMinhaAnalise', this.usuario).then(() => {
          this.resultAnalise = this.minhaAnalise.length > 0 ? false : true
        })
      },
      loadResponderHoje() {
        this.$store.dispatch('loadResponderHoje', this.usuario)
      },
      async loadEmailRegistered() {
        if (this.token && this.usuario) {
          let emailIsRegistered = this.$store.getters.usuario.email
          if (emailIsRegistered != null && emailIsRegistered != 'null') return
          let urlData = `${config.baseUrl}api/shared/user/email_registered/${this.usuario}`
          var res = await this.$api.get(urlData)
          if (res.data == false && this.filtro == true) {
            this.emailRegistered = true
          }
        }
      },
      notasFlutuantes() {
        this.abrirNotasFlutuante = true
      },
      abrirChatBot() {
        this.isVisible = true
      },
      async dataLang() {
        if (this.usuario) {
          try {
            const urlData = `${config.baseUrl}api/shared/languages/languages_selected/${this.usuario}`
            const resultado = await this.$api.get(urlData)
            return resultado.data[0].IDIOMA
          } catch (error) {
            return ''
          }
        } else {
          return ''
        }
      },
      toggleDrawer() {
        this.drawer = !this.drawer
      }
    },
    created() {
      if (this.$store.getters.token) {
        this.loadEmailRegistered()
        this.loadResponderHoje()
        setTimeout(() => {
          this.loadMinhaAnalise()
        }, 2000)
      }

      EventBus.on('snackbar', ({ text, color, iconRight, iconLeft }) => {
        this.snackbar.text = text
        this.snackbar.color = color || 'success'
        this.snackbar.show = true
        this.snackbar.iconLeft = iconLeft
        this.snackbar.iconRight = iconRight
      })
    },
    watch: {}
  }
</script>
<style lang="scss">
  body,
  html {
    min-height: 100%;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    // background: red !important;
  }

  body::-webkit-scrollbar {
    width: 10px;
  }

  body::-webkit-scrollbar-track {
    background: rgb(255, 255, 254);
  }

  body::-webkit-scrollbar-thumb {
    background-color: rgb(143, 14, 143);
    border-radius: 25px;
    border: 3px solid rgb(245, 245, 245);
  }

  .custom-fieldset {
    padding: 15px;
    border: 1px solid #3333;
    border-radius: 10px;
    margin-bottom: 15px;
  }

  legend {
    padding: 0 10px;
    font-size: 18.5px;
  }

  .text-danger {
    color: #f44336;
  }
  .text-white {
    color: #fff;
  }
  .text-black {
    color: #000;
  }

  .border-dashed {
    border-style: dashed;
  }

  .border-solid {
    border-style: solid;
  }

  .bg-white {
    background-color: #fff;
  }

  ::-webkit-scrollbar {
    height: 8px; /* Altura para scroll horizontal */
    width: 8px; /* Largura para scroll vertical */
  }

  /* Estilo para o trilho da barra de rolagem */
  ::-webkit-scrollbar-track {
    background: #e2e8f0; /* Cor do trilho */
  }

  /* Estilo para o "polegar" da barra de rolagem */
  ::-webkit-scrollbar-thumb {
    background: #a0aec0; /* Cor do polegar */
    border-radius: 16px; /* Bordas arredondadas */
  }

  /* Adicionando suporte para navegadores que respeitam scrollbar-color */
  .scrollbar-custom {
    scrollbar-color: #a0aec0 #e2e8f0; /* Cor do polegar e do trilho */
    scrollbar-width: thin; /* Define uma largura fina */
  }
</style>
