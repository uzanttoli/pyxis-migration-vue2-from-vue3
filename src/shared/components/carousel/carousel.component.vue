<template>
  <v-card height="33vh" tile elevation="0" class="rounded-xl">
    <v-carousel show-arrows-on-hover hide-delimiter-background cycle height="33vh">
      <template v-for="(item, i) in imgs">
        <v-carousel-item
          v-if="liberacaoProduto(item.produto, produto) && liberacaoTipoAcesso(item.perfil, perfil)"
          :key="i"
        >
          <div class="profile">
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  class="img-banner"
                  :src="getImgUrl(item.src)"
                  @click="routerPush(item.href)"
                  style="cursor: pointer"
                />
              </template>
              <span>{{ item.href ? 'Clique para conferir!' : 'Home' }}</span>
              <!-- 1757 x 300 -->
            </v-tooltip>
          </div>
        </v-carousel-item>
      </template>
    </v-carousel>
  </v-card>
</template>

<script>
  import validacaoAcesso from '../../../mixins/validacao'
  export default {
    props: {
      items: {
        type: Array,
        require: true
      },
      nameSrc: {
        type: String,
        require: true
      },
      rota: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      dialogCarousel: false,
      imgs: [
        {
          src: 'bannerCampanhaClaro',
          href: 'Utilitarios',
          produto: ['NET'],
          perfil: ['operador', 'administrador']
        },
        { src: 'bannerPrincipal', href: null, produto: null, perfil: null }
      ]
    }),
    mixins: [validacaoAcesso],
    computed: {
      produto() {
        return this.$store.getters.usuario.produto
      },
      perfil() {
        return this.$store.getters.usuario.filtro.toLowerCase()
      }
    },
    methods: {
      routerPush(item) {
        if (!item) return
        this.$router.push({ name: item, query: { id: 70 } })
      },
      imagemBanner(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagens_ganhadores/${img}`
      },
      getImgUrl(imgSelecionada) {
        var img = require.context('../../../assets/img/geral/', false, /\.png$/)
        return img('./' + imgSelecionada + '.png')
      }
    }
  }
</script>

<style scoped>
  .profile {
    width: 100%;
    height: 25em;
  }

  .img-banner {
    /* background-size: 100%; */
    position: relative;
    height: 35vh;
    width: 100vw;
    /* adicionando imagem de fundo */
    background-size: cover;
  }
</style>
