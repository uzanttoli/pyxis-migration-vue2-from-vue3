<template>
  <div class="player-info">
    <div class="imagem-avatar" v-if="myAvatar">
      <v-avatar size="300px">
        <v-img height="100%" :src="imagemPerfil(myAvatar)"></v-img>
      </v-avatar>
    </div>
    <div v-else>
      <v-avatar size="300px">
        <img src="../../../assets/img/Avatar/padrao.png" />
      </v-avatar>
    </div>
    <div class="player">
      <h1 class="white--text">
        Player Info
        <i class="fa-solid fa-spinner spinner" v-if="informacoesPlayer == ''"></i>
      </h1>
      <div class="info-second">
        <p>
          <strong class="mr-2">Nickname:</strong>
          <span class="ml-1">{{ $store.getters.usuario.usuario }}</span>
        </p>
        <p>
          <strong>Patente:</strong>
          {{ informacoesPlayer != '' ? informacoesPlayer.PATENTE : 'Indisponível' }}
        </p>
        <p>
          <strong>XP:</strong>
          {{ informacoesPlayer != '' ? informacoesPlayer.XP : 'Indisponível' }}
        </p>
        <p>
          <strong>HP:</strong>
          {{ informacoesPlayer != '' ? informacoesPlayer.HP : 'Indisponível' }}
        </p>
        <p>
          <strong>Colocação Team:</strong>
          {{ informacoesPlayer != '' ? informacoesPlayer.RANK_TEAM : 'Indisponível' }}ª
        </p>
        <p>
          <strong>Colocação Geral:</strong>
          {{ informacoesPlayer != '' ? informacoesPlayer.RANK_GERAL : 'Indisponível' }}ª
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import config from '../../../core/config.js'
  export default {
    data: () => ({
      informacoesPlayer: []
    }),
    computed: {
      myAvatar() {
        let myAvatar = this.$store.getters.myAvatar
        return myAvatar ? myAvatar : ''
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      produto() {
        return this.$store.getters.usuario.produto
      },
      usuarioNome() {
        let usuario = this.$store.getters.usuario.usuario
        let oneUsuario = usuario.split(' ')
        let nameExhibition = oneUsuario[0]
        return nameExhibition.toLowerCase()
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
      }
    },
    methods: {
      loadInfo() {
        let urlData = `${config.baseUrl}api/shared/gamification/info/player`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produto,
              almope: this.usuarioAlmope,
              tipoPerfil: this.numCargo
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
      },
      loadMyAvatar() {
        return this.$store.dispatch('loadMyAvatar', this.usuarioAlmope)
      }
    },
    created() {
      this.loadMyAvatar()
      this.loadInfo()
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Orbitron&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Changa:wght@200&display=swap"); */
  .player-info {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    /* background-image: url("../../../assets/img/team/5198219.png"); */
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
    color: white;
    padding-left: 5px;
    font-family: 'Changa', sans-serif;
  }

  .imagem-avatar {
    border-radius: 300px;
    border: 3px inset gold;
  }

  .info-second {
    line-height: 60%;
    margin-top: 10px;
    width: 100%;
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
