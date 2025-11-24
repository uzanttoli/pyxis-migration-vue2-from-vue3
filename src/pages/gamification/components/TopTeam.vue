<template>
  <div class="team-info">
    <div class="imagem-avatar">
      <img v-if="teamInfo != ''" :src="imgTeam(teamInfo.GRUPO)" />
      <div v-else>
        <v-avatar size="300px">
          <img src="../../../assets/img/Avatar/padrao.png" alt="" />
        </v-avatar>
      </div>
    </div>
    <div class="team">
      <v-row class="ma-0 pa-0">
        <h1 class="white--text loader">
          Team Info
          <i class="fa-solid fa-spinner spinner" v-if="teamInfo == ''"></i>
        </h1>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              fab
              v-bind="attrs"
              v-on="on"
              small
              class="ml-2"
              depressed
              @click="
                $emit('update:rankingTopTeam', {
                  grupo: teamInfo != '' ? teamInfo.GRUPO : ''
                })
              "
            >
              <v-icon size="18">fa-solid fa-users</v-icon>
            </v-btn>
          </template>
          <span>Top 100 players team</span>
        </v-tooltip>
      </v-row>
      <div class="info-second">
        <v-tooltip top>
          <template v-slot:activator="{ attrs, on }">
            <p class="info-caracteristica" v-bind="attrs" v-on="on">
              <strong>
                <a
                  style="color: white; display: flex; align-items: center"
                  @click="caracteristicas"
                >
                  Caracteristicas
                  <v-icon class="info-caracteristica-buttton" color="white">
                    mdi-hand-pointing-left
                  </v-icon>
                </a>
              </strong>
            </p>
          </template>
          <span>Abrir Caracteristicas</span>
        </v-tooltip>

        <p>
          <strong>Membros:</strong>
          {{ teamInfo != '' ? teamInfo.QTD_PLAYER : 'Indisponivel' }}
        </p>
        <p>
          <strong>XP:</strong>
          {{ teamInfo != '' ? teamInfo.XP_MEDIO : 'Indisponivel' }}
        </p>
        <p>
          <strong>Colocação Semanal:</strong>
          {{ teamInfo != '' ? teamInfo.RANK_SEMANAL : 'Indisponivel' }}ª
        </p>
        <p>
          <strong>Colocação Temporada:</strong>
          {{ teamInfo != '' ? teamInfo.RANK_GERAL : 'Indisponivel' }}ª
        </p>
      </div>
    </div>
    <CaracteristicaTeam
      :caracteristicaDialog="ativarDialogCaracteristica"
      :perfil="teamInfo.GRUPO"
    />
  </div>
</template>

<script>
  import config from '../../../core/config'
  import CaracteristicaTeam from './CaracteristicaTeam.vue'
  export default {
    components: {
      CaracteristicaTeam
    },
    props: {
      cargoSelect: {
        type: Number
      }
    },
    data: () => ({
      teamInfo: [],
      ativarDialogCaracteristica: false
    }),
    computed: {
      // minhaAnalise() {
      //   let minhaAnalise = this.$store.getters.minhaAnalise;
      //   return minhaAnalise[0] ? minhaAnalise[0].GRUPO : "";
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
          return 1
        }
        return ''
      },
      considerarCargo() {
        return this.cargoSelect ? this.cargoSelect : this.numCargo
      }
    },
    methods: {
      caracteristicas(event) {
        event.preventDefault()
        this.ativarDialogCaracteristica = !this.ativarDialogCaracteristica
      },
      loadTeamInfo() {
        // let urlData = `${config.baseUrl}api/shared/gamification/info/team_info/${this.produto}/LOBO/${this.considerarCargo}/1`;
        let urlData = `${config.baseUrl}api/shared/gamification/info/team_info`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produto,
              grupo: 'LOBO',
              tipoPerfil: this.considerarCargo,
              prioridade: 1
            }
          })
          .then(res => {
            if (res.data) {
              this.teamInfo = res.data[0]
            }
          })
      },
      // loadMinhaAnalise() {
      //   this.$store.dispatch("loadMinhaAnalise", this.usuarioAlmope);
      // },
      imgTeam(img) {
        if (img) {
          let image = require.context('../../../assets/img/team', false, /\.png$/)
          return image('./' + img + '.png')
        }
      }
    },
    watch: {
      cargoSelect() {
        this.loadTeamInfo()
      }
    },
    created() {
      this.loadTeamInfo()
      // this.loadMinhaAnalise();
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

  h1 {
    font-family: 'Orbitron', sans-serif;
  }

  p {
    font-size: 18px;
    padding-left: 5px;
    color: white;
    /* font-family: "Source Sans Pro", sans-serif;; */
    font-family: 'Changa', sans-serif;
  }

  a {
    text-decoration: none;
    color: #00f;
    font-family: 'Changa', sans-serif;
  }

  img {
    width: 300px;
    padding: 10px;
  }

  .info-second {
    line-height: 60%;
    margin-top: 10px;
    margin-left: 7px;
  }

  .imagem-avatar {
    border: 3px inset gold;
    border-radius: 300px;
  }

  .img-btn {
    width: 45px;
  }

  .info-caracteristica-buttton {
    animation: go-back 2s;
  }

  .info-caracteristica {
    margin-bottom: 12px;
    width: 150px;
  }

  @keyframes go-back {
    0% {
      transform: translateX(100px);
    }
    100% {
      transform: translateX(0);
    }
  }

  .img-caracteristicas {
    animation: go-back 2s;
    width: 40px;
  }
  /* From uiverse.io by @mrhyddenn */

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
