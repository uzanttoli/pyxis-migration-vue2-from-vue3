<template>
  <v-dialog v-model="_rankingTeam" width="550">
    <v-card tile>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">RANK</th>
              <th class="text-left">PLAYER</th>
              <th class="text-center">TIER SCORE</th>
            </tr>
          </thead>
        </template>
      </v-simple-table>
    </v-card>
    <v-card tile elevation="0" max-height="400" class="overflow-auto card-body">
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr v-for="(item, index) in dados" :key="index" class="text-center">
              <td align="center">
                <img class="img-rank" :src="classRanking(index + 1)" v-if="index < 3" />
                <span class="black--text text-patentes" v-else>{{ index + 1 + 'ª' }}</span>
              </td>
              <td>
                <v-row align="center" style="margin-left: 45px">
                  <div v-if="item.NOME_AVATAR">
                    <v-avatar size="50px" class="mr-2">
                      <v-img height="100%" :src="imagemPerfil(item.NOME_AVATAR)"></v-img>
                    </v-avatar>
                  </div>
                  <div v-else>
                    <v-avatar size="50px" class="mr-2">
                      <v-img height="100%" src="../../../assets/img/Avatar/padrao.png"></v-img>
                    </v-avatar>
                  </div>
                  <div class="text-player">
                    <p style="text-transform: capitalize">{{ item.NOME }}</p>
                  </div>
                </v-row>
              </td>
              <td align="center">
                <div class="table-score">
                  <img
                    class="img-patentes"
                    alt="imagem patente"
                    :src="imgPatentes(item.IMAGEM_PATENTE)"
                  />
                  <div class="text-patentes">
                    <p>{{ item.PATENTE }}</p>
                    <p>{{ item.XP }}</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-card tile v-if="meuRanking">
      <v-simple-table class="body-table">
        <template v-slot:default>
          <tbody>
            <tr>
              <td align="center">
                <span class="text-patentes">
                  {{ meuRanking ? meuRanking.RANK_TEAM + 'ª' : 'Indisponivel' }}
                </span>
              </td>
              <td align="center">
                <v-row align="center" justify="center">
                  <div v-if="meuRanking.NOME_AVATAR">
                    <v-avatar size="50px" class="mr-2">
                      <v-img height="100%" :src="imagemPerfil(meuRanking.NOME_AVATAR)"></v-img>
                    </v-avatar>
                  </div>
                  <div v-else>
                    <v-avatar size="50px" class="mr-2">
                      <v-img height="100%" src="../../../assets/img/Avatar/padrao.png"></v-img>
                    </v-avatar>
                  </div>
                  <div class="text-player" style="text-transform: capitalize">
                    <p>{{ meuRanking ? meuRanking.NOME : 'Indisponivel' }}</p>
                  </div>
                </v-row>
              </td>
              <td align="center">
                <div class="table-score">
                  <img
                    class="img-patentes"
                    alt="imagem patente"
                    :src="imgPatentes(meuRanking.IMAGEM_PATENTE)"
                  />
                  <div class="text-patentes">
                    <p>
                      {{ meuRanking ? meuRanking.PATENTE : 'Indisponivel' }}
                    </p>
                    <p>{{ meuRanking ? meuRanking.XP : 'Indisponivel' }}</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../../core/config.js'
  export default {
    props: {
      rankingTeam: {
        type: Boolean,
        default: false
      },
      grupoSelecionado: {
        type: String,
        require: true
      }
    },
    data: () => ({
      dados: [],
      meuRanking: []
    }),
    computed: {
      produto() {
        return this.$store.getters.usuario.produto
      },
      _rankingTeam: {
        get() {
          return this.rankingTeam
        },
        set(newValue) {
          return newValue
        }
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      loadRankingPlayer() {
        let urlData = `${config.baseUrl}api/shared/gamification/spot_player/ranking_player_team/${this.produto}/${this.grupoSelecionado}`
        this.$api.get(urlData).then(res => {
          this.dados = res?.data
        })
      },
      loadMeuRankingPlayer() {
        let urlData = `${config.baseUrl}api/shared/gamification/spot_player/meu_ranking_player/${this.produto}/${this.grupoSelecionado}/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          if (res) {
            this.meuRanking = res.data[0]
          }
        })
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      imgPatentes(value) {
        let img = require.context('../../../assets/img/patentes', false, /\.png$/)
        return img('./' + value + '.png')
      },
      classRanking(index) {
        let img = require.context('../../../assets/img/team/medalhas', false, /\.png$/)
        if (index == 1) {
          return img('./ouro.png')
        } else if (index == 2) {
          return img('./prata.png')
        } else if (index == 3) {
          return img('./bronze.png')
        }
      }
    },
    watch: {
      rankingTeam: function (newVal) {
        if (newVal == true) {
          this.loadRankingPlayer()
          this.loadMeuRankingPlayer()
        }
      }
    },
    created() {
      this.loadRankingPlayer()
      this.loadMeuRankingPlayer()
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz&display=swap"); */
  /* @import url("https://fonts.googleapis.com/css2?family=Changa:wght@200&display=swap"); */
  .title {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
  }

  .body-table {
    width: 100%;
    background: rgba(65, 64, 116, 1);
    color: white;
  }
  .body-table:hover {
    width: 100%;
    background: rgba(65, 64, 116, 1);
    color: rgb(10, 10, 10);
  }
  .img-patentes {
    width: 40px;
  }

  .img-rank {
    width: 2.2rem;
  }

  .text-player {
    display: flex;
    flex-direction: column;
    line-height: 5px;
    margin-left: 5px;
    margin-top: 10px;
  }

  .table-score {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .text-patentes {
    display: flex;
    flex-direction: column;
    line-height: 5px;
    margin-left: 5px;
    margin-top: 10px;
  }

  td {
    /* font-family: "Yanone Kaffeesatz", sans-serif; */
    font-family: 'Changa', sans-serif;
  }

  p {
    font-size: 14px;
    font-weight: bold;
  }
  .card-body::-webkit-scrollbar {
    width: 10px; /* width of the entire scrollbar */
  }

  .card-body::-webkit-scrollbar-track {
    background: rgb(255, 255, 254); /* color of the tracking area */
  }

  .card-body::-webkit-scrollbar-thumb {
    background-color: #4d618b; /* color of the scroll thumb */
    border-radius: 25px; /* roundness of the scroll thumb */
    border: 3px solid rgb(245, 245, 245); /* creates padding around scroll thumb */
  }
</style>
