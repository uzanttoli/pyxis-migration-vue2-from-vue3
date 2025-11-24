<template>
  <v-container class="justify-space-around ma-0 pa-0">
    <v-card style="font-family: 'Lucida Console'">
      <v-card-title class="justify-center">
        <v-icon>mdi-pin</v-icon>
        Post Fixado
      </v-card-title>
    </v-card>
    <v-divider></v-divider>
    <v-card-text elevation="0" class="overflow-auto overflow-x-hidden" width="100%" height="100%">
      <v-row>
        <v-col>
          <v-row
            v-for="(item, i) in publicacoes_fixadas"
            :key="i"
            align="center"
            justify="center"
            class="mt-2 pa-2"
            @click="saveInsertVisualizacao(item.ID_ARTIGO)"
          >
            <v-list-item>
              <v-card
                @update:inativado="inativacaoPost"
                class="card"
                :to="{
                  name: 'FeedNoticias',
                  params: { id: item.TITULO },
                  query: { artigo: item.ID_ARTIGO }
                }"
              >
                <v-row>
                  <v-list-item-avatar color="grey" v-if="item.NOME_AVATAR" size="30">
                    <v-img :src="imagemPerfil(item.NOME_AVATAR)"></v-img>
                    <!-- <v-img :src="getUrlImg(item.NOME_AVATAR)"></v-img> -->
                  </v-list-item-avatar>
                  <v-list-item-avatar v-else>
                    <v-img src="../../../../../assets/img/Avatar/padrao.png"></v-img>
                  </v-list-item-avatar>
                  <h6 class="mt-3">
                    {{ item.NOME }}
                    <v-chip small style="font-size: 9px" class="ml-2">
                      <v-icon small class="mr-2">mdi-briefcase</v-icon>
                      {{ item.cargo }}
                    </v-chip>
                    <v-spacer></v-spacer>
                  </h6>
                  <v-icon>mdi-pin</v-icon>
                  <v-spacer></v-spacer>
                </v-row>
                <v-divider></v-divider>
                <h5 class="card__title">
                  {{ item.TITULO }}
                </h5>
              </v-card>
            </v-list-item>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-container>
</template>

<script>
  import config from '../../../../../core/config'
  export default {
    data: () => ({
      isActive: false,
      inativacaoPost: false,
      rating: 4,
      publicacoes_fixadas: [],
      search: '',
      items: 5,
      dadosVisualizado: {}
    }),
    computed: {
      user() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      async saveInsertVisualizacao(item) {
        this.dadosVisualizado.id_artigo = item
        this.dadosVisualizado.login_visualizacao = this.$store.getters.usuario.almope
        await this.$store.dispatch('saveInsertVisualizacao', this.dadosVisualizado)
      },
      getUrlImg(value) {
        var img = require.context('../../../../../assets/img/Avatar/', false, /\.png$/)
        return img('./' + value + '.png')
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      loadPublicacoesFixadas() {
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/publicacoes_fixadas/${this.user}`
        this.$api.get(urlData).then(res => {
          this.publicacoes_fixadas = res.data
        })
      }
    },
    created() {
      this.loadPublicacoesFixadas()
    },
    watch: {
      inativacaoPost() {
        if (this.inativacaoPost == true) {
          this.loadPublicacoesFixadas()
          setTimeout(() => {
            this.inativacaoPost == false
          }, 1000)
        }
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
    height: 15%;
    font-family: 'Arial';
    padding: 1rem;
    cursor: pointer;
    border-radius: var(--border-radius);
    background: #f1f1f3;
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
    font-size: 0.9rem;
    font-weight: bold;
  }

  .card .card__date {
    color: #6e6b80;
    font-size: 0.8rem;
  }

  .card .card__arrow {
    position: absolute;
    background: var(--primary-color);
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
    color: var(--primary-color);
    text-decoration: underline;
  }

  .card:hover .card__arrow {
    background: #111;
  }

  .card:hover .card__arrow svg {
    transform: translateX(3px);
  }
</style>
