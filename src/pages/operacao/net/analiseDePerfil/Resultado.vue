<template>
  <v-dialog width="900" v-model="resultadoQuestionario" persistent>
    <div class="card">
      <v-col>
        <div class="img">
          <v-avatar rounded size="190" class="image-preview me-6">
            <img class="preview" :src="imgTeam(imagem)" />
          </v-avatar>
        </div>
      </v-col>
      <div class="messages">
        <v-btn icon @click="$emit('updated:close')" class="button">
          <v-icon>fa-solid fa-xmark</v-icon>
        </v-btn>
        <h1 class="messages-title" v-html="mensagens.TITLE"></h1>
        <p class="messages-subtitle">{{ mensagens.MESSAGE1 }}</p>
        <p class="messages-subtitle">{{ mensagens.MESSAGE2 }}</p>
      </div>
    </div>
    <load-envio-dados :envioDados="baixandoInfor"></load-envio-dados>
  </v-dialog>
</template>

<script>
  import loadEnvioDados from '../../../../shared/components/load/loadHastag.vue'
  export default {
    components: {
      loadEnvioDados
    },
    props: {
      resultadoQuestionario: {
        type: Boolean,
        default: false
      },
      imagem: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      baixandoInfor: true
    }),
    computed: {
      mensagens() {
        let mensagens = this.$store.getters.mensagens
        return mensagens ? mensagens : []
      },
      // grupoPerfil() {
      //   let result = this.$store.getters.grupoPerfil;
      //   return result ? result.GRUPO : [];
      // },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      // async loadGrupoPerfil() {
      //   await this.$store
      //     .dispatch("loadGrupoPerfil", this.usuarioAlmope)
      //     .then(() => {
      //       setTimeout(() => {
      //         this.loadMensagens();
      //       }, 500);
      //     });
      // },

      imgTeam(img) {
        if (img) {
          let image = require.context('../../../../assets/img/team', false, /\.png$/)
          return image('./' + img + '.png')
        }
      },
      loadMensagens() {
        this.$store.dispatch('loadMensagens', this.imagem).then(() => {
          setTimeout(() => {
            this.baixandoInfor = false
          }, 1000)
        })
      }
    },
    watch: {
      resultadoQuestionario() {
        if (this.resultadoQuestionario == true) {
          // this.loadGrupoPerfil();
          this.loadMensagens()
        }
      }
    },
    created() {
      // this.loadGrupoPerfil();
      // this.loadMensagens();
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Silkscreen:wght@700&display=swap"); */
  img.preview {
    padding: 9px;
    margin-left: 20px;
    align-items: center;
    justify-items: center;
  }

  .img {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .messages {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 19px;
    position: relative;

    color: rgb(231, 231, 231);
  }

  .messages-title {
    border-bottom: 1px solid rgb(100, 100, 100);
    font-family: 'Silkscreen', cursive;
    white-space: nowrap;
    margin: 10px;
  }
  .messages-subtitle {
    color: rgb(231, 231, 231);
    font-family: 'Silkscreen', cursive;
    font-size: 15px;
    font-weight: bold;
  }

  /*  */

  .card {
    background: #e2a624;
    position: relative;
    display: flex;
    place-content: center;
    place-items: center;
    overflow: hidden;
    border-radius: 20px;
  }

  .card h2 {
    z-index: 1;
    color: white;
    font-size: 2em;
  }

  .card::before {
    content: '';
    position: absolute;
    width: 900px;
    background-image: linear-gradient(180deg, rgb(0, 183, 255), rgb(255, 48, 255));
    height: 130%;
    animation: rotBGimg 3s linear infinite;
    transition: all 0.2s linear;
  }

  @keyframes rotBGimg {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .card::after {
    content: '';
    background: #d2d5d8;
    inset: 5px;
    border-radius: 15px;
  }

  .button {
    position: absolute;
    top: 5px;
    right: 5px;
    /* background: red;
  display: flex;
  flex-direction: row;
  justify-content: flex-end; */
  }
</style>
