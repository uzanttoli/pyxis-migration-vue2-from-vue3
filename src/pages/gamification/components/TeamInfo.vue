<template>
  <div class="team-info">
    <div class="imagem-avatar" v-if="grupo">
      <img :src="imgTeam(grupo)" />
    </div>
    <div class="team">
      <v-row class="ma-0 pa-0">
        <h1 class="white--text">
          Team Info
          <i class="fa-solid fa-spinner spinner" v-if="teamInfo == ''"></i>
        </h1>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              fab
              v-on="on"
              v-bind="attrs"
              small
              class="ml-2"
              depressed
              @click="$emit('update:rankingMyTeam', { grupo: grupo })"
            >
              <v-icon size="18">fa-solid fa-users</v-icon>
            </v-btn>
          </template>
          <span>Top 100 players team {{ grupo }}</span>
        </v-tooltip>
      </v-row>
      <div class="info-second">
        <p>
          <strong>Membros:</strong>
          {{ teamInfo ? teamInfo.QTD_PLAYER : 'Indisponível' }}
        </p>
        <p>
          <strong>XP:</strong>
          {{ teamInfo ? teamInfo.XP_MEDIO : 'Indisponível' }}
        </p>
        <p>
          <strong>Colocação Semanal:</strong>
          {{ teamInfo ? teamInfo.RANK_SEMANAL : 'Indisponível' }}ª
        </p>
        <p>
          <strong>Colocação Temporada:</strong>
          {{ teamInfo ? teamInfo.RANK_GERAL : 'Indisponível' }}ª
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import config from '../../../core/config'
  export default {
    data: () => ({
      teamInfo: []
    }),
    computed: {
      minhaAnalise() {
        let minhaAnalise = this.$store.getters.minhaAnalise
        return minhaAnalise.length > 0 ? minhaAnalise[0].GRUPO : ''
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      produto() {
        return this.$store.getters.usuario.produto
      },
      grupo() {
        return this.$store.getters.usuario.grupo
      }
    },
    methods: {
      loadTeamInfo() {
        // let urlData = `${config.baseUrl}api/shared/gamification/info/team_info/${this.produto}/${this.grupo}`;
        let urlData = `${config.baseUrl}api/shared/gamification/info/team_info`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produto,
              grupo: this.grupo,
              tipoPerfil: 1,
              prioridade: ''
            }
          })
          .then(res => {
            if (res.data) {
              this.teamInfo = res.data[0]
            }
          })
      },

      imgTeam(img) {
        if (img) {
          let image = require.context('../../../assets/img/team', false, /\.png$/)
          return image('./' + img + '.png')
        }
      }
    },
    created() {
      this.loadTeamInfo()
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300&display=swap"); */
  /* @import url("https://fonts.googleapis.com/css2?family=Orbitron&display=swap"); */
  /* @import url("https://fonts.googleapis.com/css2?family=Changa:wght@200&display=swap"); */
  .team-info {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 1;
  }

  p {
    font-size: 18px;
    color: white;
    padding-left: 5px;
    /* font-family: "Source Sans Pro", sans-serif; */
    font-family: 'Changa', sans-serif;
  }

  .img-btn {
    width: 45px;
  }

  img {
    width: 300px;
    padding: 10px;
  }

  h1 {
    font-family: 'Orbitron', sans-serif;
  }
  .info-second {
    line-height: 60%;
    margin-top: 10px;
    margin-left: 7px;
  }

  .imagem-avatar {
    border: 3px inset gold;
    border-radius: 200px;
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
