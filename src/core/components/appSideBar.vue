<template>
  <v-card class="rounded-0">
    <v-navigation-drawer
      app
      clipped
      width="300"
      :mini-variant-width="70"
      permanent
      v-model="drawer"
      v-model:mini-variant="mini"
      class="cor-padrao"
      style=""
    >
      <v-list-item class="px-2 mt-2" two-line>
        <v-list-item-avatar
          @click="!mini ? (dialogAccount = true) : undefined"
          style="cursor: pointer"
        >
          <v-img class="logo-avatar" :src="imagemPerfil(myAvatar)" v-if="myAvatar"></v-img>
          <v-img class="logo-avatar" src="../../assets/img/Avatar/padrao.png" v-else></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-capitalize font-weight-medium white--text">
            {{ usuario }}
          </v-list-item-title>
          <v-list-item-subtitle class="caption grey--text text--lighten-2 text-capitalize">
            {{ tipoAcesso }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-btn icon @click.stop="mini = !mini">
          <v-icon color="white">fa-solid fa-angle-left</v-icon>
        </v-btn>
      </v-list-item>
      <div v-if="!mini" class="mt-n3 timeline-container">
        <ul class="pa-2 ml-6 timeline-list">
          <li
            style="display: flex; align-items: center; padding: 2px; justify-content: space-between"
          >
            <img
              height="32"
              :src="getImgHumorUrl(meuHumor)"
              style="border-radius: 1rem"
              :title="meuHumor"
            />
            <span style="font-size: 12px; color: #fff">
              {{ `${meuHumor ? `Estou ${meuHumor}` : 'Meu humor'}` }}
            </span>
            <button class="button-info" @click="abrirPesquisaHumor()"><span>Detalhes</span></button>
            <!-- <button class="button-info ml-1" @click="directionRouteHumor()"><span>Ranking</span></button> -->
          </li>
          <!-- <pre>{{minhaAnalise}}</pre> -->
          <li
            style="display: flex; align-items: center; padding: 2px; justify-content: space-between"
            v-if="minhaAnalise != ''"
          >
            <img
              height="30"
              :src="imgTeam(minhaAnalise[0].GRUPO)"
              style="background-color: white; border-radius: 1rem"
            />
            <span style="font-size: 12px; color: #fff">Analise de perfil</span>
            <button
              class="button-info"
              @click="ativarDialogCaracteristica = !ativarDialogCaracteristica"
            >
              <span>Detalhes</span>
            </button>
          </li>
        </ul>
      </div>
      <v-divider class="mt-2"></v-divider>
      <v-list dense light>
        <div
          :style="
            mini == true
              ? 'background-color: #ffffff41; margin: 5px; border-radius: 10px; display: flex; flex-direction: column; justify-content: center; align-items: center;'
              : ''
          "
        >
          <!-- Menu dinamico -->
          <template v-if="menuItens && menuItens.length">
            <div v-for="item in menuItens" :key="item.tipo === 'simples' ? item.id : item.grupo">
              <!-- Item simples (sem agrupamento) -->
              <v-list-item
                v-if="item.tipo === 'simples'"
                :to="item.route"
                @click="takeNameMenu(item.label)"
                :style="`
                  ${item.route == menuSelecionado.route ? 'background-color: #ffffff41;' : ''}
                  ${!mini ? '' : 'padding: 0px 8px; margin: 2px; border-radius: 6px;'}
                `"
              >
                <v-list-item-icon>
                  <v-icon color="white" size="18">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="white--text font-text">
                  {{ item.label }}
                </v-list-item-title>
              </v-list-item>

              <!-- Item agrupado (com submenu) -->
              <v-menu v-else right offset-x>
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item
                    v-bind="attrs"
                    v-on="on"
                    :style="`
                      ${
                        item.grupo == menuSelecionado.agrupamento
                          ? 'background-color: #ffffff41;'
                          : ''
                      }
                      ${!mini ? '' : 'padding: 0px 8px; margin: 2px; border-radius: 6px;'}
                    `"
                  >
                    <v-list-item-icon>
                      <v-icon
                        :color="
                          item.itens[0].route == menuSelecionado.route ? 'teal accent-2' : 'white'
                        "
                        size="18"
                      >
                        {{ item.itens[0].agrupamentoIcon }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="white--text font-text">
                      {{ item.grupo }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <v-list dense class="cor-padrao-submenu" tile>
                  <v-list-item
                    v-for="subitem in item.itens"
                    :key="subitem.id"
                    :to="subitem.route"
                    @click="takeNameMenu(subitem.label)"
                    style="z-index: 1000"
                  >
                    <v-tooltip right>
                      <template v-slot:activator="{ attrs, on }">
                        <div v-bind="attrs" v-on="on" style="display: flex; align-items: center">
                          <v-list-item-icon>
                            <v-icon color="white" size="20">{{ subitem.icon }}</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title class="white--text font-text">
                            {{ subitem.label }}
                          </v-list-item-title>
                        </div>
                      </template>
                      <span>{{ subitem.label }}</span>
                    </v-tooltip>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </div>
      </v-list>

      <template v-slot:append>
        <!-- Rodapé -->
        <v-divider></v-divider>
        <v-list-item class="text-center">
          <v-tooltip left>
            <template v-slot:activator="{ attrs, on }">
              <v-list-item-icon>
                <v-icon color="white" v-bind="attrs" v-on="on">mdi-counter</v-icon>
              </v-list-item-icon>
            </template>
            <span>Acessos hoje: {{ acessos }}</span>
          </v-tooltip>
          <v-list-item-title class="white--text">Acessos hoje: {{ acessos }}</v-list-item-title>
        </v-list-item>

        <div class="d-flex justify-space-around pb-2">
          <v-btn icon v-if="!mini" to="/pyxis/meu-perfil/">
            <v-icon color="white" size="20">fa-solid fa-gear</v-icon>
          </v-btn>
          <v-btn icon v-if="!mini" to="/pyxis/notification">
            <v-icon color="white" size="20">fa-solid fa-bell</v-icon>
          </v-btn>
          <v-btn icon @click="deslogar()">
            <v-icon color="white" size="20">fa-solid fa-arrow-right-from-bracket</v-icon>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <configuracao @updated:close="dialogAccount = !dialogAccount" :dialogAccount="dialogAccount" />
    <times-gamification></times-gamification>
    <caracteristica-dialog
      :caracteristicaDialog="ativarDialogCaracteristica"
      :perfil="myPerfil"
    ></caracteristica-dialog>
    <AnaliseHumor
      v-model="abrirModalHumor"
      :obj="objPesquisaHumor"
      :possuiHumor="meuHumor"
      @updated:close="abrirModalHumor = !abrirModalHumor"
      @updated:atualizar="atualizarDadosHumor"
    ></AnaliseHumor>
    <!-- <MoodMap></MoodMap> -->
  </v-card>
</template>

<script>
  import config from '../config'

  import validacaoAcesso from '../../mixins/validacao'
  // import MoodMap from '@/pages/pesquisa/humor/MoodMap.vue'
  import MenuService from '@/data/services/menu/MenuService'
  import AnaliseHumor from '@/pages/pesquisa/humor/AnaliseHumor.vue'
  import Configuracao from '../../pages/meuPerfil/configuracaoConta/Configuracao.vue'
  import TimesGamification from '../../pages/meuPerfil/gamification/TimesGamification.vue'
  import CaracteristicaDialog from '../../pages/gamification/components/CaracteristicaTeam.vue'

  import { HumorService } from '@/data/services/Acoes'

  export default {
    components: {
      // MoodMap,
      Configuracao,
      AnaliseHumor,
      TimesGamification,
      caracteristicaDialog: CaracteristicaDialog
    },
    mixins: [validacaoAcesso],
    data: () => ({
      ativarDialogCaracteristica: false,
      listItemActiveCss: 'primary white--text',
      drawer: true,
      dialogAccount: false,
      life: 100,
      dialogExibirHumor: false,
      dialogDesativarData: null,
      menuItens: [],
      mini: true,
      acessos: 0,
      items: [
        { title: 'Home', icon: 'mdi-view-dashboard' },
        { title: 'About', icon: 'mdi-forum' }
      ],
      abrirModalHumor: false,
      objPesquisaHumor: null,
      meuHumor: []
    }),
    mounted() {
      this.loadMyAvatar()

      if (this.filtro != 'INATIVO') {
        this.loadMenu()
      }
    },
    computed: {
      countNotification() {
        let count = this.$store.getters.countNotification // Apos conexao do websocket na app
        return count ? 0 : 0
      },
      myPerfil() {
        return this.minhaAnalise.length > 0 ? this.minhaAnalise && this.minhaAnalise[0].GRUPO : null
      },

      minhaAnalise() {
        return this.$store.getters.minhaAnalise
      },
      produto() {
        let produto = this.$store.getters.usuario.produto
        return produto != null || produto != '' || produto != 'null' ? produto : 'null'
      },
      imgSelecionado() {
        if (this.$store.getters.myHumor) {
          return this.$store.getters.myHumor.HUMOR
        }
        return localStorage.getItem('humor')
      },
      tipoAcesso() {
        let tipo = this.$store.getters.usuario.filtro
        return tipo.toLowerCase()
      },
      regional() {
        let tipo = this.$store.getters.usuario.regional
        return tipo.toLowerCase()
      },
      usuario() {
        let usuario = this.$store.getters.usuario.usuario
        let oneUsuario = usuario.split(' ')
        let nameExhibition = oneUsuario[0]
        return nameExhibition.toLowerCase()
      },
      userName() {
        let nome = this.$store.getters.usuario.nome || ''
        let oneName = nome.split(' ')
        let nameExhibition = oneName[0]
        return nameExhibition.toLowerCase()
      },
      myAvatar() {
        let myAvatar = this.$store.getters.myAvatar
        return myAvatar ? myAvatar : ''
      },
      getAvatarUrl() {
        let myAvatar = this.$store.getters.myAvatar
        if (myAvatar) {
          var avatar = require.context('../../assets/img/Avatar/', false, /\.png$/)
          return avatar('./' + myAvatar + '.png')
        } else {
          return false
        }
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      tokenValidacao() {
        return JSON.parse(localStorage.getItem('registro_acesso')).token_validacao
      },
      menuSelecionado() {
        return this.$store.getters.menuSelecionado
      },
      filtro() {
        return this.$store.getters.usuario.filtro
      }
    },
    methods: {
      directionRouteHumor() {
        this.$router.push('/pyxis/humor/ranking')
      },
      abrirPesquisaHumor() {
        this.abrirModalHumor = true
        this.objPesquisaHumor = { click: 'click-component' }
      },
      async atualizarDadosHumor() {
        await this.loadDadosHumor()
      },
      // loadNewMenu() {
      //   let urlData = `${config.baseUrl}api/shared/pyxis/new_menu/NET`;
      //   this.$api.get(urlData).then((res) => {
      //     this.testeMenu = res.data;
      //   });
      // },
      async loadDadosHumor() {
        let humor = await HumorService.getMeuHumor(this.usuarioAlmope)
        this.meuHumor = humor?.HUMOR.toLowerCase()
      },
      takeNameMenu(menu) {
        this.$store.dispatch('updateMenuAtual', { menu })
      },
      loadAcessPyxis() {
        let urlData = `${config.baseUrl}api/shared/registro_log_pyxis/acessos_pyxis`
        this.$api.get(urlData).then(res => {
          this.acessos = res.data[0].CONTAGEM
        })
      },
      convertPalavra(palavra) {
        if (palavra == 'TUBARÃO') {
          return 'Você faz parte da Team SHARK'
        } else if (palavra == 'GATO') {
          return 'Você faz parte da Team CAT'
        } else if (palavra == 'AGUIA') {
          return 'Você faz parte da Team EAGLE'
        } else {
          return 'Você faz parte da Team WOLF'
        }
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      loadMinhaAnalise() {
        this.$store.dispatch('loadMinhaAnalise', this.usuarioAlmope)
      },
      async loadMenu() {
        const menuItens = await MenuService.getAll()

        // Filtra apenas itens com showInMenu true ou 1
        const menuFiltrado = menuItens.filter(
          item => item.showInMenu === true || item.showInMenu === 1
        )

        // Itens sem agrupamento
        const semAgrupamento = menuFiltrado.filter(item => !item.agrupamento)

        // Agrupa os itens por agrupamento (excluindo os sem agrupamento)
        const agrupados = {}
        menuFiltrado
          .filter(item => item.agrupamento)
          .forEach(item => {
            const grupo = item.agrupamento
            if (!agrupados[grupo]) agrupados[grupo] = []
            agrupados[grupo].push(item)
          })

        // Transforma em array para facilitar o v-for
        this.menuItens = [
          ...semAgrupamento.map(item => ({ tipo: 'simples', ...item })),
          ...Object.keys(agrupados).map(grupo => ({
            tipo: 'agrupado',
            grupo,
            itens: agrupados[grupo]
          }))
        ]
        // return this.$store.dispatch("loadMenu", this.produto);
      },
      loadMyHumor() {
        return this.$store.dispatch('loadMyHumor', this.usuarioAlmope)
      },
      getImgHumorUrl(imgSelecionado) {
        if (!imgSelecionado) {
          imgSelecionado = 'sem-humor'
        }
        var images = require.context('../../assets/img/humor/img-humor-2.0/', false, /\.png$/)
        return images('./' + imgSelecionado + '.png')
      },
      getImgMenu(img) {
        let imagem = require.context('../../assets/img/icons/mdi-icons/', false, /\.png$/)
        return imagem('./' + img + '.png')
      },
      imgTeam(img) {
        if (img) {
          let image = require.context('../../assets/img/team', false, /\.png$/)
          return image('./' + img + '.png')
        }
      },
      getImgUrl(img) {
        let i = require.context('../../assets/img/imgCards/conquistas/', false, /\.png$/)
        return i('./' + img + '.png')
      },
      deslogar() {
        this.$router.push({
          path: '/'
        })
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        localStorage.removeItem('sessionID')
        localStorage.removeItem('ip')
        this.$store.dispatch('deslogar')
      },
      loadMyAvatar() {
        return this.$store.dispatch('loadMyAvatar', this.usuarioAlmope)
      }
    },
    watch: {
      dialogDesativarData() {
        if (this.dialogDesativarData == true) {
          this.dialogAccount = false
        }
      }
    },
    created() {
      this.loadMyHumor()
      this.loadMinhaAnalise()
      this.loadAcessPyxis()
      this.loadDadosHumor()
      // this.loadNewMenu();
    }
  }
</script>
<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Orbitron&display=swap"); */
  /* @import url("https://fonts.googleapis.com/css2?family=Changa:wght@200&display=swap"); */

  ::v-deep ::-webkit-scrollbar {
    /* width: 2px;
  color: white;
  background: transparent; */
  }

  ::v-deep ::-webkit-scrollbar {
    width: 10px;
  }

  ::v-deep ::-webkit-scrollbar-track {
    background: rgb(255, 255, 254);
  }

  ::v-deep ::-webkit-scrollbar-thumb {
    background-color: rgb(143, 14, 143);
    border-radius: 25px;
    border: 3px solid rgb(245, 245, 245);
  }

  .logo-avatar {
    border: 3px inset rgb(255, 255, 255);
  }

  img.preview {
    padding: 7px;
    border: 3px inset gold;
    cursor: pointer;

    /* align-items: center;
  justify-items: center; */
  }

  .v-application .rounded-r-xl {
    border-top-right-radius: 35px !important;
  }

  .v-application .rounded-r-xl {
    border-bottom-right-radius: 35px !important;
  }

  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(122, 6, 122), rgb(16, 204, 218));
  }

  .cor-padrao-submenu {
    background-image: linear-gradient(-30deg, rgb(16, 204, 218), rgb(122, 6, 122));
  }

  .font-text {
    color: #ffffff41;
  }

  #gear-icon {
    animation-duration: 3s;
    animation-name: slidein;
    animation-iteration-count: infinite;
  }

  @keyframes slidein {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .timeline-container {
    position: relative;
  }

  .timeline-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 25px;
    width: 2px;
    height: 90%;
    background: rgba(255, 255, 255, 0.4);
  }

  .timeline-list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 4px;
    position: relative;
    z-index: 1;
  }

  .timeline-list li img {
    margin-right: 8px;
    z-index: 2;
    border-radius: 50%;
    padding: 4px;
  }

  .timeline-list li span {
    font-size: 12px;
    color: #fff;
    flex-grow: 1;
  }

  .button-info {
    background: transparent;
    border: 1px solid white;
    border-radius: 6px;
    padding: 2px 8px;
    font-size: 12px;
    color: white;
    cursor: pointer;
  }
  .button-info:hover {
    background: rgba(48, 47, 47, 0.288);
  }
</style>
