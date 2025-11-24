<template>
  <v-col class="mt-n3 pr-4">
    <v-card class="mx-auto rounded-xl" style="min-width: 400px">
      <!-- <pre>{{ almopeConsulta }}</pre> -->
      <p class="text-h5 pa-0 py-2 ma-0 grey--text ml-5">
        <i class="fa-solid fa-list-check"></i>
        Meu histórico (Últimas 15 atualizações)
      </p>
      <v-card
        height="375"
        min-height="325"
        tile
        class="overflow-auto rounded-bl-xl card-overflow"
        elevation="0"
        id="card-historico"
      >
        <v-card-text class="py-0">
          <v-timeline
            align-top
            dense
            class="timeline"
            v-for="(item, i) in historico"
            :key="i"
            style="z-index: 0"
          >
            <v-timeline-item :color="item.COR" small :icon="item.ICONE" fill-dot>
              <v-row class="pt-1">
                <v-col cols="3">
                  <strong class="text-no-wrap text-time">{{ item.TIPO }}</strong>
                  <br />
                  <span class="text-no-wrap text-time">{{ item.DATA }}</span>
                </v-col>
              </v-row>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
      <v-img class="img" src="../../../assets/img/icons/mdi-icons/game.png"></v-img>
    </v-card>
  </v-col>
</template>

<script>
  // import config from "../../../core/config.js";
  export default {
    props: {
      almopeConsulta: {
        type: [String, Number],
        default: null
      },
      historico: {
        type: [Array, Object]
      }
    },
    data: () => ({
      // historico: [],
    }),
    computed: {
      // usuarioAlmope() {
      //   return this.$store.getters.usuario.almope;
      // },
    },
    methods: {
      // loadHistorico(almope) {
      //   let urlData = `${config.baseUrl}api/shared/gamification/detalhes/meu_historico/${almope}`;
      //   this.$api.get(urlData).then((res) => {
      //     this.historico = res.data;
      //   });
      // },
    },
    watch: {
      // almopeConsulta() {
      //   this.loadHistorico(this.almopeConsulta);
      // },
    },
    created() {
      // if (this.almopeConsulta) this.loadHistorico(this.almopeConsulta);
      // else this.loadHistorico(this.usuarioAlmope);
    }
  }
</script>

<style scoped>
  .img {
    position: absolute;
    top: 50px;
    right: 10px;
    background-size: cover;
    width: 20rem;
  }

  .timeline {
    width: 250px;
    z-index: 10;
  }

  .text-time {
    z-index: 1;
  }

  @media screen and (max-width: 1440px) {
    .img {
      position: absolute;
      z-index: 0;
      top: 100px;
      right: 10px;
      width: 20rem;
      opacity: 0.3;
    }
  }
  @media screen and (max-width: 768px) {
    .img {
      position: absolute;
      z-index: 0;
      top: 50px;
      right: 10px;
      width: 14rem;
      opacity: 0.3;
    }
  }

  .card-overflow::-webkit-scrollbar {
    width: 10px; /* width of the entire scrollbar */
  }

  .card-overflow::-webkit-scrollbar-track {
    background: rgb(255, 255, 254); /* color of the tracking area */
  }

  .card-overflow::-webkit-scrollbar-thumb {
    background-color: #4d618b; /* color of the scroll thumb */
    border-radius: 25px; /* roundness of the scroll thumb */
    border: 3px solid rgb(245, 245, 245); /* creates padding around scroll thumb */
  }
</style>
