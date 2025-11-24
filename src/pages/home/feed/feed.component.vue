<template>
  <!-- <v-container> -->
  <v-col>
    <v-row class="mr-6 mb-3 justify-space-between">
      <div style="display: flex; align-items: center; gap: 10px" v-if="filtro == 'ADMINISTRADOR'">
        <!-- retirar depois -->
        <v-btn class="py-2" depressed color="error" rounded to="/pyxis/pesquisa-satisfacao/">
          Responder Pesquisa
        </v-btn>
      </div>
      <div v-if="filtro != 'ADMINISTRADOR'"></div>
      <div style="display: flex; align-items: center; gap: 10px">
        <v-text-field
          class="rounded-xl py-2"
          outlined
          dense
          v-model="search"
          append-icon="mdi-magnify"
          label="Procurar"
          single-line
          hide-details
        ></v-text-field>
        <v-btn
          v-if="this.$store.getters.usuario.cargo != 'REPRESENTANTE DE ATENDIMENTO'"
          depressed
          rounded
          class="cor-padrao white--text"
          to="/pyxis/feed/publicar"
        >
          Publicar
        </v-btn>
      </div>
    </v-row>
    <div style="display: flex; flex-wrap: wrap; justify-content: center">
      <card-feed-preview
        v-for="(item, i) in filterFeed"
        :key="i"
        :title="item.TITULO"
        :name="item.NOME"
        :work="item.cargo"
        :avatar="item.NOME_AVATAR"
        :artigo="item.ID_ARTIGO"
        :idWeek="item.TITULO"
        :nota="item.NOTA_CLASSIFICACAO"
        :views="item.QTD_VISUALIZACAO"
        :fixed="item.FIX_ARTIGO == 1 ? true : false"
        :imgCategoria="item.NOME_CATEGORIA"
        @update:reload="reloadFeedFix"
      ></card-feed-preview>
    </div>

    <template v-if="items <= publicacoes.length">
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-row align="center" justify="center" class="pa-3 mb-3 mt-3">
            <v-btn
              depressed
              fab
              x-small
              @click="items += 5"
              v-bind="attrs"
              v-on="on"
              class="cor-padrao"
            >
              <v-icon color="white">fa-solid fa-plus</v-icon>
            </v-btn>
          </v-row>
        </template>
        <span>Carregar mais...</span>
      </v-tooltip>
    </template>
    <div
      style="display: flex; justify-content: center; height: 40vh; align-items: center"
      v-if="publicacoes.length == 0"
    >
      <load-spinner-dot></load-spinner-dot>
    </div>
  </v-col>
  <!-- </v-container> -->
</template>

<script>
  import config from '../../../core/config'
  import LoadSpinnerDot from '../../../shared/components/load/loadSpinnerDot.vue'
  import cardFeedPreview from './cardFeedPreview.vue'
  export default {
    components: { cardFeedPreview, LoadSpinnerDot },
    data: () => ({
      isActive: false,
      inativacaoPost: false,
      rating: 4,
      publicacoes: [],
      search: '',
      items: 5,
      dadosVisualizado: {}
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      filterFeed() {
        let items = []
        items = this.publicacoes.filter(item => {
          return (
            item.TITULO.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.NOME.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          )
        })
        return items
      },
      user() {
        return this.$store.getters.usuario.almope
      },
      produto() {
        return this.$store.getters.usuario.produto
      },
      filtro() {
        return this.$store.getters.usuario.filtro
      },
      produtoValidacao() {
        let cargo = this.filtro
        if (cargo == 'ADMINISTRADOR') {
          return 'NET; ENEL'
        } else {
          return this.produto
        }
      }
    },
    methods: {
      reloadFeedFix() {
        this.$emit('update:reload')
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      async saveInsertVisualizacao(item) {
        this.dadosVisualizado.id_artigo = item
        this.dadosVisualizado.login_visualizacao = this.$store.getters.usuario.almope
        await this.$store.dispatch('saveInsertVisualizacao', this.dadosVisualizado)
      },
      getUrlImg(value) {
        var img = require.context('../../../assets/img/Avatar/', false, /\.png$/)
        return img('./' + value + '.png')
      },
      loadPublicacoes() {
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/publicacoes/${this.items}/${this.user}/${this.produto}`
        this.$api.get(urlData).then(res => {
          this.publicacoes = res.data
          this.$emit('update:loading-feed', false)
        })
      }
    },
    created() {
      this.loadPublicacoes()
    },
    watch: {
      inativacaoPost() {
        if (this.inativacaoPost == true) {
          this.loadPublicacoes()
          setTimeout(() => {
            this.inativacaoPost == false
          }, 1000)
        }
      },
      items() {
        this.loadPublicacoes()
      }
    }
  }
</script>

<style scoped>
  #preview {
    max-width: 1500px;
    white-space: nowrap;
    max-height: 100px;
    overflow: hidden;
    direction: ltr;
  }
  .card {
    --border-radius: 0.75rem;
    --primary-color: #7e2556;
    --secondary-color: #3c3852;
    width: 100%;
    font-family: 'Arial';
    padding: 1rem;
    cursor: pointer;
    border-radius: var(--border-radius);
    /* background: #f1f1f3; */
    box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 3%);
    position: relative;
  }

  .card > * + * {
    margin-top: 1.1em;
  }

  .card .card__content {
    color: var(--secondary-color);
    font-size: 0.86rem;
    max-width: 1500px;
    text-overflow: ellipsis;
  }

  .card .card__title {
    padding: 0;
    font-size: 1.3rem;
    font-weight: bold;
  }

  .card .card__date {
    color: #6e6b80;
    font-size: 0.8rem;
  }

  .card .card__arrow {
    position: absolute;
    /* background: var(--primary-color); */
    padding: 0.4rem;
    border-top-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    bottom: 0;
    right: 0;
    transition: 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card svg {
    transition: 0.2s;
  }

  /* hover */
  .card:hover .card__title {
    text-decoration: underline;
    text-decoration: none;
  }

  .card:hover .card__arrow {
    background: #111;
  }

  .card:hover .card__arrow svg {
    transform: translateX(3px);
  }

  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(143, 14, 143), rgb(0, 236, 255));
    background-size: 200% 200%; /* Aumenta o tamanho do gradiente para cobrir a área */
    transition: background-position 0.5s ease-in-out, background-color 0.5s ease-in-out;
  }

  .cor-padrao:hover {
    background-position: 100% 100%; /* Move o gradiente para criar a transição */
    background-color: rgba(
      68,
      17,
      68,
      0.736
    ); /* Ajuste a opacidade ou defina uma cor mais próxima do segu*/
  }
</style>
