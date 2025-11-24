<template>
  <section>
    <v-row class="align-center justify-center mt-5 mb-7 mt-9">
      <v-card
        width="80%"
        class="rounded-t-xl backgroundCard"
        elevation="1"
        min-width="350"
        v-for="(item, i) in publicacoesId"
        :key="i"
        :loading="loadingComentarios && comentariosFazio"
      >
        <v-card-title>
          {{ item.TITULO }} |
          <v-rating
            @input="addRating($event)"
            :value="minhaClassificacao != '' ? minhaClassificacao[0].CLASSIFICACAO * 1 : 0"
            color="yellow darken-3"
            background-color="grey darken-1"
            empty-icon="$ratingFull"
            half-increments
            hover
          ></v-rating>
          <v-menu open-on-hover bottom offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on" icon>
                <v-avatar v-if="reacaoSelecionada" size="25">
                  <img
                    style="width: 100%"
                    :src="getUrlReacoes(reacaoSelecionada['NOME_REACOES'])"
                    alt=""
                  />
                </v-avatar>
                <v-icon v-else>mdi-thumb-up-outline</v-icon>
              </v-btn>
              |
            </template>

            <v-list class="rounded-xl">
              <v-list-item>
                <v-btn
                  icon
                  v-for="(item, i) in reacoes"
                  :key="i"
                  @click="saveReacoes(item.ID_REACOES)"
                >
                  <v-tooltip bottom color="black">
                    <template v-slot:activator="{ attrs, on }">
                      <v-avatar size="30" v-bind="attrs" v-on="on">
                        <img :src="getUrlReacoes(item.NOME_REACOES)" />
                      </v-avatar>
                    </template>
                    <span>{{ item.NOME_REACOES }}</span>
                  </v-tooltip>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-spacer></v-spacer>
          <template v-if="fixarPost === 1">
            <v-tooltip bottom v-if="item.FIX_ARTIGO == 0">
              <template v-slot:activator="{ attrs, on }">
                <v-btn icon v-bind="attrs" v-on="on" @click="saveFixarPost()">
                  <v-icon>mdi-pin</v-icon>
                </v-btn>
              </template>
              <span>Fixar</span>
            </v-tooltip>

            <v-tooltip bottom v-else>
              <template v-slot:activator="{ attrs, on }">
                <v-btn icon v-bind="attrs" v-on="on" @click="saveDesfixarPost()">
                  <v-icon>mdi-pin-off</v-icon>
                </v-btn>
              </template>
              <span>Desfixar</span>
            </v-tooltip>
          </template>

          <v-tooltip bottom v-if="excluirFeed === 1">
            <template v-slot:activator="{ attrs, on }">
              <v-btn icon color="red" v-bind="attrs" v-on="on" @click="setInativoPOST()">
                <v-icon>mdi-delete-empty</v-icon>
              </v-btn>
            </template>
            <span>Excluir</span>
          </v-tooltip>
          <v-tooltip bottom color="black">
            <template v-slot:activator="{ attrs, on }">
              <v-btn icon to="/home" v-bind="attrs" v-on="on">
                <v-icon>mdi-keyboard-return</v-icon>
              </v-btn>
            </template>
            <span>Voltar</span>
          </v-tooltip>
        </v-card-title>
        <v-divider></v-divider>
        <v-list-item>
          <v-menu :close-on-content-click="false" :nudge-width="200" offset-y bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item-avatar
                v-bind="attrs"
                v-on="on"
                height="50"
                width="50"
                v-if="item.NOME_AVATAR"
              >
                <v-img :src="imagemPerfil(item.NOME_AVATAR)" alt=""></v-img>
              </v-list-item-avatar>
              <v-list-item-avatar v-else>
                <v-img src="../../../../assets/img/Avatar/padrao.png"></v-img>
              </v-list-item-avatar>
            </template>
            <BioUser
              :imgAvatar="item.NOME_AVATAR"
              :descricao_bio="item.DESCRICAO_BIO"
              :nomeAutor="item.NOME"
            />
          </v-menu>
          <div>
            <v-list-item-title>
              <span class="font-weight-bold text-wrap">Autor:</span>
              {{ item.NOME }}
              <v-chip
                v-if="item.PERMITIR_COMENTARIOS === 0"
                class="ma-2"
                color="red"
                text-color="white"
                small
              >
                Comentários foram desabilitados
              </v-chip>
              <v-chip v-if="quantidade_reacoes != ''" color="backgroundCard">
                <div v-for="(item, i) in quantidade_reacoes" :key="'ICON' + i">
                  <v-avatar>
                    <img :src="getUrlReacoes(item.NOME_REACOES)" />
                  </v-avatar>
                  <span class="ma-1 caption">
                    {{ item.QTD_REACOES }}
                  </span>
                </div>
              </v-chip>
            </v-list-item-title>
            <v-list-item-subtitle>
              Publicado em:
              {{
                item.DATA_PUBLICACAO.split(' ')[0].split('-').reverse().join('/') +
                ' ' +
                item.DATA_PUBLICACAO.split(' ')[1].slice(0, 8)
              }}
            </v-list-item-subtitle>
          </div>
        </v-list-item>
        <v-divider inset></v-divider>
        <div class="container-publicacao">
          <v-container>
            <v-col>
              <div id="preview" class="content ql-editor" v-html="item.DESCRICAO_ARTIGO"></div>
            </v-col>
          </v-container>
        </div>

        <v-divider></v-divider>

        <v-container fluid v-if="item.PERMITIR_COMENTARIOS === 1">
          <div v-if="comentar == true">
            <v-textarea
              class="rounded-xl"
              label="Comente aqui!"
              auto-grow
              v-model="dadosComentarios.descricao_comentario"
              outlined
              color="#7e2556"
              rows="3"
              row-height="25"
            ></v-textarea>
            <v-row align="center" justify="end" class="pa-2 mr-1">
              <v-btn
                color="primary"
                @click="saveInsertComentarios"
                :disabled="enviandoComentario"
                rounded
              >
                Comentar
              </v-btn>
            </v-row>
          </div>
          <v-row align="center" justify="center" v-else class="pa-2">
            <v-btn rounded color="#7e2556" dark text @click="comentar = true">Comentar</v-btn>
          </v-row>
        </v-container>
        <CommentFeedback
          :id_feedback="id"
          :atualizou="comentou"
          @updated:retorno="comentariosCarregou"
          @update:sem-comentarios="semComentarios"
        />
      </v-card>
    </v-row>
    <v-snackbar v-model="snackbar">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </section>
</template>

<script>
  import BioUser from '../../../meuPerfil/bio/bio.component.vue'
  import CommentFeedback from './comment/CommentFeedId.component.vue'
  import config from '../../../../core/config'
  export default {
    components: { CommentFeedback, BioUser },
    data: () => ({
      dadosReacoes: {},
      quantidade_reacoes: [],
      reacoes: [],
      minhaClassificacao: [],
      reacaoSelecionada: null,
      snackbar: false,
      text: 'Necessário escrever algo para comentar!',
      comentar: false,
      comentou: false,
      enviandoComentario: false,
      rating: 0,
      loadingComentarios: true,
      comentariosFazio: true,
      publicacoesId: [],
      dadosComentarios: {
        descricao_comentario: ''
      },
      dadosClassificacao: {
        classificacao: ''
      }
    }),
    computed: {
      id() {
        return this.$route.query.artigo
      },
      excluirFeed() {
        return this.$store.getters.usuario.excluir_post_feed
      },
      fixarPost() {
        return this.$store.getters.usuario.fixar_artigo_feed
      },
      date() {
        let date = new Date()
        let data = date.getDate().toString()
        let dataF = data.length == 1 ? '0' + data : data
        let mes = (date.getMonth() + 1).toString()
        let mesF = mes.length == 1 ? '0' + mes : mes
        let ano = date.getFullYear()

        let hora = date.getHours()
        let minutos = date.getMinutes()
        let segundos = date.getSeconds()

        return `${dataF}/${mesF}/${ano} ${hora}:${minutos}:${segundos}`
      }
    },
    methods: {
      semComentarios(e) {
        this.comentariosFazio = e
      },
      comentariosCarregou(e) {
        this.loadingComentarios = e
      },
      async saveFixarPost() {
        let data = {
          id_artigo: this.$route.query.artigo,
          fix_post: 1
        }
        await this.$store.dispatch('saveFixarPost', data)
      },
      async saveDesfixarPost() {
        let data = {
          id_artigo: this.$route.query.artigo,
          fix_post: 0
        }
        await this.$store.dispatch('saveDesfixarPost', data)
      },
      addRating(value) {
        if (this.minhaClassificacao == '') {
          this.dadosClassificacao.login_classificacao = this.$store.getters.usuario.almope
          this.dadosClassificacao.classificacao = value
          this.dadosClassificacao.id_artigo = this.$route.query.artigo
          this.$store.dispatch('saveInsertClassificacao', this.dadosClassificacao).then(() => {
            setTimeout(() => {
              this.loadClassificacao()
            }, 1000)
          })
        } else {
          this.dadosClassificacao.login_classificacao = this.$store.getters.usuario.almope
          this.dadosClassificacao.classificacao = value
          this.dadosClassificacao.id_artigo = this.$route.query.artigo
          this.$store.dispatch('saveUpdateClassificacao', this.dadosClassificacao).then(() => {
            setTimeout(() => {
              this.loadClassificacao()
            }, 1000)
          })
        }
      },
      async setInativoPOST() {
        let data = {
          status: 0,
          id_artigo: this.$route.query.artigo,
          user: this.$store.getters.usuario.almope,
          data_inativacao: this.date
        }
        await this.$store.dispatch('setInativoPOST', data)
        this.$emit('update:inativado')
        this.$router.push('/home')
      },

      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      getUrlReacoes(value) {
        var reacao = require.context('../../../../assets/img/reacoesFeed/', false, /\.png$/)
        return reacao('./' + value + '.png')
      },
      loadClassificacao() {
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/classificacao/${this.$route.query.artigo}/${this.$store.getters.usuario.almope}`
        this.$api.get(urlData).then(res => {
          if (res) {
            this.minhaClassificacao = res.data
          } else {
            this.minhaClassificacao = 0
          }
        })
      },
      loadPublicacoesId() {
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/publicacoes_id/${this.$route.query.artigo}`
        this.$api.get(urlData).then(res => {
          this.publicacoesId = res.data
        })
      },
      loadQtdReacoes() {
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/quantidade_reacoes/${this.$route.query.artigo}`
        this.$api.get(urlData).then(res => {
          this.quantidade_reacoes = res.data
        })
      },
      saveReacoes(value) {
        if (this.reacaoSelecionada == null) {
          this.dadosReacoes.id_reacoes = value
          this.dadosReacoes.id_artigo = this.$route.query.artigo
          this.dadosReacoes.criado_por = this.$store.getters.usuario.almope
          this.$store.dispatch('saveInsertReacoes', this.dadosReacoes).then(() => {
            setTimeout(() => {
              this.reacao()
              this.loadQtdReacoes()
            }, 1000)
          })
        } else {
          this.dadosReacoes.id_reacoes = value
          this.dadosReacoes.id_artigo = this.$route.query.artigo
          this.dadosReacoes.criado_por = this.$store.getters.usuario.almope
          this.$store.dispatch('saveUpdateReacoes', this.dadosReacoes).then(() => {
            setTimeout(() => {
              this.reacao()
              this.loadQtdReacoes()
            }, 1000)
          })
        }
      },
      saveInsertComentarios() {
        if (this.dadosComentarios.descricao_comentario == '') {
          this.snackbar = true
        } else {
          this.enviandoComentario = true
          this.dadosComentarios.login_comentario = this.$store.getters.usuario.almope
          this.dadosComentarios.artigo = this.id
          this.$store.dispatch('saveInsertComentarios', this.dadosComentarios).then(() => {
            this.comentou = true
            this.dadosComentarios.descricao_comentario = ''
            setTimeout(() => {
              this.comentou = false
              this.enviandoComentario = false
            }, 1000)
          })
        }
      },
      loadReacoes() {
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/reacoes`
        this.$api.get(urlData).then(res => {
          this.reacoes = res.data
        })
      },
      reacao() {
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/existi_reacoes/${this.$route.query.artigo}/${this.$store.getters.usuario.almope}`
        this.$api.get(urlData).then(res => {
          this.reacaoSelecionada = res.data[0]
        })
      }
    },
    watch: {},
    created() {
      this.loadQtdReacoes()
      this.loadPublicacoesId()
      this.loadReacoes()
      this.reacao()
      this.loadClassificacao()
    }
  }
</script>

<style scoped>
  #editor {
    height: 250px;
  }
  #editor .quill-editor {
    height: 100%;
  }
  #editor .quill-editor .ql-container {
    height: 60%;
  }

  #preview {
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #preview h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  #preview img {
    width: 50px;
  }
</style>
