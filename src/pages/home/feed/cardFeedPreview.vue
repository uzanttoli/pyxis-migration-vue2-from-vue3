<template>
  <div class="card-container">
    <v-menu absolute offset-y style="max-width: 600px">
      <template v-slot:activator="{ attrs, on }">
        <div class="card-feed" v-bind="attrs" v-on="on">
          <div class="card-dados">
            <div class="card-head">
              <i
                v-if="fixed"
                style="margin-right: 10px; color: red"
                class="fa-solid fa-thumbtack"
              ></i>
              <h4>{{ title }}</h4>
              <!-- <button>...</button> -->
            </div>

            <div class="info-usuario">
              <img v-if="avatar" :src="imagemPerfil(avatar)" alt="imagem-perfil" />
              <img v-else src="../../../assets/img/Avatar/padrao.png" />
              <div class="info_">
                <p class="nome">{{ name }}</p>
                <p class="cargo">{{ work }}</p>
              </div>
            </div>
          </div>

          <div class="conteudo">
            <img :src="imagemCategoria(imgCategoria)" />
          </div>
          <div class="interacoes">
            <div class="text-center">
              <v-rating
                :value="nota * 1"
                color="orange"
                background-color="grey"
                small
                half-increments
                readonly
              ></v-rating>
            </div>
            <div style="display: flex; align-items: center">
              <i class="fa-solid fa-eye"></i>
              <p style="margin: 0px; padding: 0px; font-size: 12px">
                {{ views }}
              </p>
            </div>
          </div>
        </div>
      </template>
      <v-list dense>
        <v-list-item v-for="(item, index) in items" :key="index" @click="execAcao(item.acao)">
          <i :class="`fa-solid ${item.icon}`" class="mr-2"></i>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import config from '../../../core/config'
  import alerts from '../../../mixins/alerts.mixins'
  export default {
    props: {
      title: {
        type: String,
        default: 'Titulo'
      },
      name: {
        type: String,
        default: 'Titulo'
      },
      work: {
        type: String,
        default: 'Titulo'
      },
      avatar: {
        type: String
      },
      idWeek: {
        type: [String, Number],
        require: true
      },
      artigo: {
        type: [String, Number]
      },
      nota: {
        type: [String, Number]
      },
      views: {
        type: [String, Number]
      },
      fixed: {
        type: Boolean,
        default: false
      },
      imgCategoria: {
        type: String,
        require: true
      }
    },
    mixins: [alerts],
    data: () => ({
      items: [
        { title: 'Visualizar', acao: 'visualizar', icon: 'fa-eye' },
        { title: 'Fixar', acao: 'fixar', icon: 'fa-thumbtack' }
      ]
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      async saveInsertVisualizacao() {
        let data = {
          id_artigo: this.artigo,
          login_visualizacao: this.$store.getters.usuario.almope
        }
        await this.$store.dispatch('saveInsertVisualizacao', data)
      },
      execAcao(item) {
        if (item == 'visualizar') {
          this.visualizar()
        } else {
          this.fixar()
        }
      },
      listAcao() {
        return {
          visualizar: this.visualizar(),
          fixar: this.fixar()
        }
      },
      async fixar() {
        try {
          let data = {
            almope: this.usuarioAlmope,
            idArtigo: this.artigo
          }
          let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/favoritar_artigo/`
          await this.$api.post(urlData, data)
          this.toast('Artigo fixado com sucesso!', 'bottom-right', false, 3000, 'success')
          this.$emit('update:reload')
        } catch (error) {
          if (error.response.status === 406) {
            this.toast('O artigo já encontra-se fixado!', 'bottom-right', false, 3000, 'error')
          }
        }
      },
      visualizar() {
        this.saveInsertVisualizacao()
        this.$router.push({
          name: 'FeedNoticias',
          params: { id: this.idWeek },
          query: { artigo: this.artigo }
        })
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      imagemCategoria(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/wiki_categoria/${img}`
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Karla:wght@200;700&display=swap"); */
  .card-container {
    display: flex;
    justify-content: space-around;
    margin: 10px;
    border-radius: 10px;
    box-shadow: 8px 7px 7px -3px rgba(0, 0, 0, 0.1), 0px 10px 10px -3px rgba(0, 0, 0, 0.1);
  }

  .card-feed {
    width: 303.8px;
    max-height: 279.55px;
    padding: 7px;

    border: 1px solid #dcdcdc;
    border-radius: 10px;
  }

  .card-dados {
    display: flex;
    flex-direction: column;
  }

  /* .card-dados img {
  width: 37.61px;
  height: 37.61px;
} */

  .card-head {
    display: flex;
    flex-direction: row;
    align-items: center;
    /* justify-content: space-between; */
  }
  .card-head h4 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #6b6969;
  }

  .card-head button {
    margin-left: 10px;
  }
  .info_ {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .info-usuario {
    display: flex;
    margin-bottom: 5px;
  }

  .info-usuario div {
    display: flex;
    flex-direction: column;
  }
  .info-usuario div p {
    padding: 0px;
    margin: 0px;
  }

  .nome {
    font-family: 'Karla', sans-serif;
    font-size: 15px;
    font-weight: 700;
  }

  .cargo {
    font-family: 'Karla', sans-serif;
    font-size: 15px;
    font-weight: 500;
  }
  .info-usuario img {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    margin-right: 5px;
  }

  .conteudo {
    max-height: 155px;
    max-width: 303.8px;
  }

  .conteudo img {
    width: 100%;
    height: 150px;
    border-radius: 10px;
  }

  .interacoes {
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  i {
    font-size: 12px;
    margin-right: 3px;
  }
</style>
