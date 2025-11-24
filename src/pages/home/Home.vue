<template>
  <div>
    <CarouselComponent class="mt-2" :items="arrayImg"></CarouselComponent>
    <div style="display: grid; grid-template-columns: 3fr 400px; box-sizing: border-box">
      <div>
        <feed
          @update:loading-feed="watchLoadingFeed"
          @update:reload="reloadFeedFix"
          @update:open-search="openSearch = true"
        ></feed>
      </div>
      <div style="border-left: 1px solid rgb(167, 167, 167); margin: 10px 0 10px 0">
        <h3 style="padding: 10px; color: grey">Artigos Fixados</h3>
        <div style="display: flex; flex-direction: column; width: 500px">
          <card-artigos-fixados
            v-for="(item, i) in meusArtigos"
            :key="i"
            :title="item.TITULO"
            :imgCategoria="item.NOME_CATEGORIA"
            :artigo="item.ID_ARTIGO_FIX"
            :data="item.DATA_ARTIGO_FIX"
            @update:reload="reloadFeedFix"
          ></card-artigos-fixados>
        </div>
      </div>
    </div>
    <DialogCake :dialogCake="isBirthday" />
    <PesquisaSatisfacao v-if="openSearch" @update:close-search="openSearch = !openSearch" />
    <v-dialog v-model="alertIsValid" width="550">
      <v-card width="550">
        <v-img
          src="http://10.64.175.49:4300/receptivo/index.php/api/arquivos/get_arquivo_2/informativos_pyxis/informativo_tnps.png"
        ></v-img>
      </v-card>
    </v-dialog>
    <melhoria-operacional-component
      :dialogMelhoria="showDialogMelhoria"
      @update:close="closeDialog"
    ></melhoria-operacional-component>
    <historia v-if="campanha.produto == 'ENEL'"></historia>
    <div id="dado"></div>
  </div>
</template>
<script>
  import moment from 'moment'
  import config from '../../core/config.js'
  import feed from './feed/feed.component.vue'
  import Historia from '../gamification/historia/Historia.vue'
  import CardArtigosFixados from './feed/cardArtigosFixados.vue'
  import DialogCake from '../../shared/components/dialogs/CakeMessage.component.vue'
  import modalSatisfacao from '../pesquisa/satisfacaoOperacional/modalSatisfacao.vue'
  import CarouselComponent from '../../shared/components/carousel/carousel.component.vue'

  import MelhoriaOperacionalComponent from '../operacao/net/operacoes/supervisor/formularioSupervisor/melhoriaOperacional.component.vue'
  export default {
    name: 'Home',
    components: {
      feed,
      DialogCake,
      CarouselComponent,
      MelhoriaOperacionalComponent,
      CardArtigosFixados,
      Historia,
      PesquisaSatisfacao: modalSatisfacao
    },
    data: () => ({
      fab: true,
      visualized: false,
      openSearch: false,
      loading: true,
      abrirModal: true,
      arrayImg: [],
      text: '',
      encryptedText: '',
      arrayCript: [],
      meusArtigos: [],
      showDialogMelhoria: false,
      notificationTitle: 'Título da notificação',
      notificationBody: 'Corpo da notificação',
      notificationIcon: 'caminho-para-o-ícone-da-notificação'
    }),
    computed: {
      isBirthday() {
        //Data de Nascimento + Ano atual
        let date = new Date()
        let day = date.getDate().toString()
        let dayF = day.length == 1 ? '0' + day : day
        let month = (date.getMonth() + 1).toString()
        let monthF = month.length == 1 ? '0' + month : month
        let year = date.getFullYear()

        //Info da data dia
        let dataNascimento = this.$store.getters.usuario.nascimento
        let nascimento = (dataNascimento && dataNascimento.split('-')) || ['', '']
        let MonthNas = nascimento[1]
        let dayNas = nascimento[2]
        let yearNas = year

        // Diferença entre nas e data dia
        let nascimentoF = moment(yearNas + '-' + MonthNas + '-' + dayNas)
        let dayMonth = year + '-' + monthF + '-' + dayF
        let Mday = moment(dayMonth)
        let duration = moment.duration(Mday.diff(nascimentoF))
        let days = duration.asDays()

        return days == 0 ? true : false
      },
      campanha() {
        let campanha = this.$store.getters.usuario
        return campanha
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      alertIsValid() {
        let agrupamento = ['NET COMBO N1 TOTAL', 'NET COMBO RETENÇÃO', 'NET COMBO']

        let meuAgrupamento = this.$store.getters.usuario.agrupamento
        let meuCargo = this.$store.getters.usuario.filtro
        let validacao = agrupamento.includes(meuAgrupamento) && meuCargo == 'OPERADOR'
        return validacao
      },
      hashGerado() {
        return this.$store.getters.senhaValidacaoVenda
      }
    },
    methods: {
      reloadFeedFix() {
        this.loadMeusArtigos()
      },
      loadMeusArtigos() {
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/meus_artigos/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.meusArtigos = res.data
        })
      },
      enviarNotificacao() {
        if ('Notification' in window) {
          Notification.requestPermission().then(
            function (permission) {
              if (permission === 'granted') {
                var notification = new Notification(this.notificationTitle, {
                  body: this.notificationBody,
                  icon: this.notificationIcon
                })

                notification.onclick = function (event) {
                  event.preventDefault() // evita que a página atual seja aberta
                  window.open(this.notificationLink) // abre a página especificada no link da notificação
                }.bind(this)
              }
            }.bind(this)
          )
        }
      },
      closeDialog() {
        this.showDialogMelhoria = false
      },
      loadImgWinner() {
        let urlData = `${config.baseUrl}api/shared/gamification/ganhadores/img`
        this.$api.get(urlData).then(res => {
          this.arrayImg = res.data
        })
      },
      watchLoadingFeed(event) {
        this.loading = event
      },
      loadMessagesUser() {
        let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/get_message_user/${this.$store.getters.usuario.almope}`
        this.$api.get(urlData).then(res => {
          if (res.data.length > 0) {
            this.visualized = false
          } else {
            this.visualized = true
          }
        })
      }
    },
    created() {
      this.loadMeusArtigos()
      this.loadImgWinner()
      this.loadMessagesUser()

      if (this.hashGerado && this.hashGerado.senha) {
        this.$swal.fire({
          title: `Senha gerada: ${this.hashGerado.senha}`,
          text: 'Anote sua senha, pois ela não será exibida novamente. Caso precise de uma nova senha, faça login na Pyxis.',
          icon: 'info',
          showConfirmButton: true,
          confirmButtonText: 'Fechar'
        })
      }
    }
  }
</script>
<style scoped>
  #imgS2s {
    position: absolute;
    left: 40%;
    top: 250px;
  }
  input[type='file'] {
    display: none;
  }
</style>
