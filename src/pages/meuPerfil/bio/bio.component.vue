<template>
  <v-card elevation="4" width="350">
    <v-list>
      <v-list-item>
        <v-list-item-avatar height="60" width="60" v-if="imgAvatar">
          <v-img :src="imagemPerfil(imgAvatar)"></v-img>
        </v-list-item-avatar>
        <v-list-item-avatar height="60" width="60" v-else>
          <v-img src="../../../assets/img/Avatar/padrao.png"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            {{ nomeAutor }}
            <!-- <v-img
              width="15"
              src="../../../assets/img/icons/mdi-icons/icons8-administrador-24.png"
            ></v-img> -->
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <v-list-item v-if="descricao_bio != 'null'" id="text-body" class="text-wrap">
        {{ descricao_bio }}
      </v-list-item>
    </v-list>

    <v-card-actions>
      <v-btn color="primary" text @click="menu = false" block disabled>mais...</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    props: {
      nomeAvatar: {
        type: String
      },
      imgAvatar: {
        type: String
      },
      nomeAutor: {
        type: String
      },
      descricao_bio: {
        type: String
      },
      cargo: {
        type: String
      }
    },
    data: () => ({
      fav: false
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      getUrlImg(value) {
        var img = require.context('../../../assets/img/Avatar/', false, /\.png$/)
        return img('./' + value + '.png')
      },
      loadMyAvatar() {
        return this.$store.dispatch('loadMyAvatar', this.usuarioAlmope)
      }
    },
    created() {
      this.loadMyAvatar()
    }
  }
</script>

<style scoped>
  /* From uiverse.io by @alexruix */
  /*Magic card*/
  .card {
    width: 190px;
    background: #ffffff;
    overflow: visible;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 60px;
  }

  .card-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2em;
    padding: 0 1rem;
  }

  .card-img-src {
    --size: 100px;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    transform: translateY(-38%);
    position: relative;
  }

  /*Text*/

  #text-body {
    font-size: 0.8em;
    align-items: center;
    text-align: center;
    color: #6f6d78;
    font-weight: 300;
    font-style: italic;
  }
</style>
