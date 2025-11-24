<template>
  <div class="player-info">
    <div class="imagem-avatar" v-if="informacoesPlayer.NOME_AVATAR && informacoesPlayer != ''">
      <v-avatar size="300px">
        <v-img
          v-if="informacoesPlayer != ''"
          height="100%"
          :src="imagemPerfil(informacoesPlayer.NOME_AVATAR)"
        ></v-img>
      </v-avatar>
    </div>
    <div v-else>
      <v-avatar size="300px">
        <v-img height="100%" src="../../../assets/img/Avatar/padrao.png"></v-img>
      </v-avatar>
    </div>
    <div class="player">
      <h1 class="white--text">
        Player Info
        <i class="fa-solid fa-spinner spinner" v-if="informacoesPlayer == ''"></i>
      </h1>
      <div class="info-second">
        <p>
          <strong>Nickname:</strong>
          {{ informacoesPlayer != '' ? informacoesPlayer.USUARIO : 'Indisponivel' }}
        </p>
        <p>
          <strong>Patente:</strong>
          {{ informacoesPlayer != '' ? informacoesPlayer.PATENTE : 'Indisponivel' }}
        </p>
        <p>
          <strong>XP:</strong>
          {{ informacoesPlayer != '' ? informacoesPlayer.XP : 'Indisponivel' }}
        </p>
        <p>
          <strong>Team:</strong>
          {{ informacoesPlayer != '' ? informacoesPlayer.GRUPO : 'Indisponivel' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import config from '../../../core/config'
  export default {
    props: {
      cargoSelect: {
        type: Number
      }
    },
    data: () => ({
      informacoesPlayer: []
    }),
    computed: {
      // myAvatar() {
      //   let myAvatar = this.$store.getters.myAvatar;
      //   return myAvatar ? myAvatar : "";
      // },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      produto() {
        return this.$store.getters.usuario.produto
      },
      numCargo() {
        let cargo = this.$store.getters.usuario.filtro
        if (cargo == 'OPERADOR' || cargo == 'ADMINISTRADOR') {
          return 1
        } else if (cargo == 'SUPERVISOR') {
          return 2
        } else if (cargo == 'COORDENADOR') {
          return 3
        } else if (cargo == 'GERENTE') {
          return 4
        }
        return ''
      },
      considerarCargo() {
        return this.cargoSelect ? this.cargoSelect : this.numCargo
      }
    },
    methods: {
      loadInfo() {
        // let urlData = `${config.baseUrl}api/shared/gamification/info/player/${this.produto}/${this.usuarioAlmope}/${this.considerarCargo}/1`;
        let urlData = `${config.baseUrl}api/shared/gamification/info/player`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produto,
              almope: this.usuarioAlmope,
              tipoPerfil: this.considerarCargo,
              prioridade: 1
            }
          })
          .then(res => {
            if (res.data) {
              this.informacoesPlayer = res.data[0]
            }
          })
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      }
      // loadMyAvatar() {
      //   return this.$store.dispatch("loadMyAvatar", this.usuarioAlmope);
      // },
    },
    watch: {
      cargoSelect() {
        this.loadInfo()
      }
    },
    created() {
      this.loadInfo()
      // this.loadMyAvatar();
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300&display=swap"); */
  /* @import url("https://fonts.googleapis.com/css2?family=Orbitron&display=swap"); */
  /* @import url("https://fonts.googleapis.com/css2?family=Changa:wght@200&display=swap"); */

  .player-info {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 1;
  }

  .player {
    margin-left: 7px;
  }

  h1 {
    font-family: 'Orbitron', sans-serif;
  }

  h2 {
    border-bottom: 1px solid black;
  }

  p {
    font-size: 18px;
    padding-left: 5px;
    color: white;
    /* font-family: "Source Sans Pro", sans-serif; */
    font-family: 'Changa', sans-serif;
  }

  .imagem-avatar {
    /* width: 350px; */
    border-radius: 300px;
    border: 3px inset gold;
  }

  .info-second {
    line-height: 60%;
    margin-top: 10px;
  }

  .spinner {
    color: #fff;
    -webkit-animation: spin 1s linear infinite;
    -moz-animation: spin 1s linear infinite;
    animation: spin 1s linear infinite;
  }

  @-moz-keyframes spin {
    100% {
      -moz-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
