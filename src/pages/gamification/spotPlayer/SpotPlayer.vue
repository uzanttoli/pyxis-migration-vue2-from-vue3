<template>
  <v-sheet class="image mx-auto">
    <img class="img-fundo" src="../../../assets/portal.jpg" alt="" />

    <div class="fundo">
      <div class="title-player">
        <hr width="500" />

        <img
          style="z-index: 1"
          class="title-player-img"
          src="../../../assets/img/icons/mdi-icons/icons8-game-controller-64.png"
          alt=""
        />

        <h1 class="white--text text-no-wrap">My Player</h1>

        <hr width="500" />
      </div>

      <v-btn style="position: absolute; right: 10px" icon @click="abrirHistoriaGamification = true">
        <v-icon color="white">fa-solid fa-newspaper</v-icon>
      </v-btn>

      <div class="painel">
        <PlayerInfo />

        <TeamInfo @update:rankingMyTeam="myGrupo" />
      </div>

      <div class="title-ranking">
        <hr width="500" />

        <img
          class="title-ranking-img"
          src="../../../assets/img/icons/mdi-icons/icons8-trophy-64.png"
        />

        <h1 class="white--text text-no-wrap">Top Ranking</h1>

        <hr width="500" />
      </div>

      <div class="select-cargo">
        <!-- <pre>{{ filtro() }}</pre> -->

        <div style="width: 290px">
          <v-select
            outlined
            dense
            class="color-placeholder fieldset-custom"
            color="white"
            rounded
            placeholder="Meu cargo"
            :items="filtro"
            item-text="name"
            item-value="value"
            dark
            v-model="cargoSelecionado"
          >
            <template v-slot:selection="data">
              <span class="white--text col-12 text-truncate pa-0 ma-0">{{ data.item.name }}</span>
            </template>
          </v-select>
        </div>

        <div style="width: 290px">
          <v-select
            color="white"
            dark
            class="color-placeholder"
            outlined
            dense
            rounded
            placeholder="Meu agrupamento"
            no-data-text="Não há items disponível"
          ></v-select>
        </div>
      </div>

      <div class="top">
        <TopPlayer :cargoSelect="cargoSelecionado" />

        <TopTeam @update:rankingTopTeam="topGrupo" :cargoSelect="cargoSelecionado" />
      </div>

      <div class="title-ranking mb-8">
        <hr width="500" />

        <img
          class="title-ranking-img"
          src="../../../assets/img/icons/mdi-icons/icons8-trophy-64-ranking.png"
        />

        <h1 class="white--text text-no-wrap">Ranking Teams</h1>

        <hr width="500" />
      </div>
    </div>

    <v-row align="center" justify="center">
      <v-col cols="10">
        <v-row class="pb-3">
          <template v-for="(item, i) in rankinkTeams" :key="i">
            <RankingTeams
              :nomeTime="item.GRUPO"
              :image="item.NOME_IMAGEM"
              :cargoSelect="cargoSelecionado"
              @update:carregou="carregou"
              :nomeTimeCarregou="nomeTimeCarregou"
            />
          </template>
        </v-row>
      </v-col>
    </v-row>

    <cute-reaper :cuteReaperDialog="ativarCuteReaper" @update:close="'/home'"></cute-reaper>

    <conteudo-historia
      :dialogHistoria="abrirHistoriaGamification"
      @closeHistoria="abrirHistoriaGamification = !abrirHistoriaGamification"
      :visualizado="visualizado"
    ></conteudo-historia>

    <ranking-player-team
      :rankingTeam="topRanking"
      :grupoSelecionado="grupoSelecionado"
    ></ranking-player-team>

    <!-- <comunicado-evento-bonus></comunicado-evento-bonus> -->

    <!-- <load-envio-dados :envioDados="baixandoInfor"></load-envio-dados> -->
  </v-sheet>
</template>

<script>
  import PlayerInfo from '../components/PlayerInfo.vue'
  import TeamInfo from '../components/TeamInfo.vue'
  import TopPlayer from '../components/TopPlayer.vue'
  import TopTeam from '../components/TopTeam.vue'
  import RankingTeams from '../components/RankingTeams.vue'
  import CuteReaper from '../personagens/cuteReaper/CuteReaper.vue'
  import rankingPlayerTeam from '../components/rankingPlayerTeam.vue'

  import config from '../../../core/config'
  import conteudo from '../historia/Conteudo.vue'
  // import loadEnvioDados from "../../../shared/components/load/loadhastag.vue";
  // import ComunicadoEventoBonus from "../components/comunicadoEventoBonus.vue";
  export default {
    components: {
      PlayerInfo,
      TeamInfo,
      TopPlayer,
      TopTeam,
      RankingTeams,
      CuteReaper,
      rankingPlayerTeam,
      conteudoHistoria: conteudo
      // loadEnvioDados,
      // ComunicadoEventoBonus,
    },
    data: () => ({
      ativarCuteReaper: false,
      abrirHistoriaGamification: false,
      visualizado: [],
      topRanking: false,
      grupoSelecionado: null,
      cargoSelecionado: null,
      baixandoInfor: false,
      nomeTimeCarregou: false,
      cargosSelect: [
        { name: 'Operador', value: 1 },
        { name: 'Supervisor', value: 2 },
        { name: 'Coordenador', value: 3 },
        { name: 'Gerente', value: 4 }
      ],
      rankinkTeams: [],
      rankingNameTeams: [
        { nameTime: 'GATO', image: 'GATO-COM-FUNDO' },
        { nameTime: 'LOBO', image: 'LOBO-COM-FUNDO' },
        { nameTime: 'AGUIA', image: 'AGUIA-COM-FUNDO' },
        { nameTime: 'TUBARÃO', image: 'TUBARÃO-COM-FUNDO' }
      ]
    }),
    computed: {
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
        return this.cargoSelecionado ? this.cargoSelecionado : this.numCargo
      },
      filtro() {
        let filtro = this.$store.getters.usuario.filtro
        let cargos = this.cargosSelect

        for (let i = 0; i < cargos.length; i++) {
          if (cargos[i].name.toLowerCase() == filtro.toLowerCase()) {
            cargos[i].name = 'Meu cargo'
          }
        }
        return cargos
      }
    },
    methods: {
      customItem() {
        return {
          color: 'red', // Defina a cor do texto do item
          borderColor: 'blue' // Defina a cor da borda
        }
      },
      carregou(e) {
        this.baixandoInfor = e
        this.$emit('updated-load', e)
      },

      myGrupo(e) {
        this.grupoSelecionado = e.grupo
        this.topRanking = !this.topRanking
      },
      topGrupo(e) {
        this.grupoSelecionado = e.grupo
        this.topRanking = !this.topRanking
      },
      existiVisualizacao() {
        let urlData = `${config.baseUrl}api/shared/gamification/historia/visualizar/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.visualizado = res.data[0] ? res.data[0] : []
          this.dialogHistoria = res.data[0]?.LOGIN_VISUALIZACAO ? false : true
        })
      },
      loadPendenteBencao() {
        let urlData = `${config.baseUrl}api/shared/gamification/spot_player/pendente_bencao/${this.usuarioAlmope}`
        this.$api
          .get(urlData)
          .then(res => {
            if (res.data.ALMOPE_PLAYER) {
              this.ativarCuteReaper = true
            }
          })
          .catch(e => {
            if (e) {
              const Toast = this.$swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: toast => {
                  toast.addEventListener('mouseenter', this.$swal.stopTimer)
                  toast.addEventListener('mouseleave', this.$swal.resumeTimer)
                }
              })
              Toast.fire({
                icon: 'error',
                title: e.response.data
              })
            }
          })
      },
      async loadRankingTeams() {
        this.baixandoInfor = true
        this.$emit('updated-load', true)
        let urlData = `${config.baseUrl}api/shared/gamification/info/ranking_teams/${this.produto}/${this.considerarCargo}`
        var res = await this.$api.get(urlData)
        // .then((res) => {
        this.rankinkTeams = res.data
        setTimeout(() => {
          this.nomeTimeCarregou = true
        }, 1000)
        // })
        // .catch((e) => {
        // });
      }
    },
    watch: {
      cargoSelecionado() {
        this.loadRankingTeams()
      }
    },
    created() {
      this.loadPendenteBencao()
      this.existiVisualizacao()
      this.loadRankingTeams()
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Orbitron&display=swap"); */

  .painel {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    z-index: 1;
  }

  hr {
    margin: 5px;
    z-index: 1;
  }
  .linha {
    border-bottom: 3px solid white;
    z-index: 1;
  }

  h1 {
    font-family: 'Orbitron', sans-serif;
    z-index: 1;
  }
  .fundo {
    z-index: 1;
  }

  /* .img-fundo {
  width: 100%;
  height: 100%;
  position: absolute;
  border-bottom-right-radius: 26px;
  border-bottom-left-radius: 26px;
} */

  .top {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
    z-index: 1;
  }

  .title-ranking {
    display: flex;
    flex-direction: row;
    padding: 15px;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .title-ranking-img {
    width: 35px;
    padding: 3px;
    z-index: 1;
  }

  .title-player {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  /* .image {
  background-image: linear-gradient(
    180deg,
    rgb(143, 14, 143),
    rgb(0, 236, 255)
  );
} */

  .select-cargo {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    z-index: 1;
    gap: 10px;
    /* position: fixed; */
    /* margin: 10px 0px 0px 5px; */
  }

  .v-select__selection,
  .v-select__selection--comma,
  .v-select.v-text-field input {
    color: blue !important;
  }

  .v-select::placeholder {
    color: white;
  }

  .img-fundo {
    width: 100%;
    height: 100%;
    position: absolute;
    /* z-index: 0; */
    /* height: 550px; */
    background-size: cover;
    border-bottom-right-radius: 26px;
    border-bottom-left-radius: 26px;
    opacity: 0.95;
    filter: blur(0px);
    z-index: 0;
  }

  .color-placeholder ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #fff !important;
  }

  .fieldset-custom {
    border-color: red;
  }
</style>
