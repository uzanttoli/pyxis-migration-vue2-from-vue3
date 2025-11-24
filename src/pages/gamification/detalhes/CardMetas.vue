<template>
  <div class="card-metas">
    <v-col v-for="(item, i) in indicadores" :key="i">
      <div class="card-indicador">
        <v-card
          class="rounded-xl card-resumo"
          elevation="2"
          :color="item.cor"
          min-height="100"
          min-width="300"
        >
          <v-icon
            style="
              position: absolute;
              right: 10px;
              top: 10px;
              opacity: 0.8;
              color: rgb(1, 177, 238);
            "
            size="30"
          >
            fa-solid fa-award
          </v-icon>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline item-title">
                {{ item.INDICADOR }}
              </div>
              <v-list-item-subtitle class="item-subtitle">
                Meta: {{ item.META }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </div>
    </v-col>
  </div>
</template>

<script>
  // import config from "../../../core/config.js";
  export default {
    props: {
      // agrupamentoConsulta: {
      //   type: [String],
      //   default: null,
      // },
      // turnoConsulta: {
      //   type: String,
      //   default: null,
      // },
      // almopeConsulta: {
      //   type: [String, Number],
      //   default: null,
      // },
      indicadores: {
        type: [Array, Object]
      }
    },
    data: () => ({
      // indicadores: [],
    }),
    computed: {
      // agrupamento() {
      //   return this.$store.getters.usuario.agrupamento;
      // },
      // turno() {
      //   return this.$store.getters.turno
      //     ? this.$store.getters.turno.TURNO
      //     : "MANHA";
      //   // return "MANHA"
      // },
      // usuarioAlmope() {
      //   return this.almopeConsulta ? this.almopeConsulta : this.$store.getters.usuario.almope;
      // },
      // almope() {
      //   return this.almopeConsulta ? this.almopeConsulta : this.usuarioAlmope;
      // },
    },
    mounted() {},
    methods: {
      // loadTurno() {
      //   this.$store.dispatch("loadTurno", this.almope);
      // },
      convertPercent(indicador, meta) {
        if (indicador == 'TMT' || indicador == 'PARTICULAR') {
          return meta
        } else {
          return (meta * 100).toFixed(2).concat('%')
        }
      }
      // loadMetaIndicadores(agrupamento, turno) {
      //   let urlData = `${config.baseUrl}api/shared/gamification/detalhes/metas_indicador/${agrupamento}/${turno}`;
      //   this.$api.get(urlData).then((res) => {
      //     this.indicadores = res.data;
      //   });
      // },
    },
    watch: {
      // agrupamentoConsulta() {
      //   this.loadMetaIndicadores(this.agrupamentoConsulta, this.turnoConsulta);
      // },
    },
    created() {
      // this.loadTurno();
      // setTimeout(() => {
      //   if (this.agrupamentoConsulta && this.almopeConsulta) {
      //     this.loadMetaIndicadores(this.agrupamentoConsulta, this.turno);
      //   } else {
      //     this.loadMetaIndicadores(this.agrupamento, this.turno);
      //   }
      // }, 1500);
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Orbitron&display=swap"); */
  .card-indicador {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .card-metas {
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    margin-left: 2px;
    height: 393px;
    overflow: auto;
  }
  .card-resumo {
    display: flex;
    flex-direction: row;
    justify-content: center !important;
  }
  .item-title {
    display: flex;
    align-content: center !important;
    justify-content: center !important;
    font-size: 18px !important;
    color: grey;
    font-family: 'Orbitron', sans-serif !important;
    font-weight: 700;
  }
  .item-progress {
    display: flex;
    align-content: center !important;
    justify-content: center !important;
    font-size: 13px !important;
    color: grey;
    margin-bottom: -10px;
  }
  .img-target {
    width: 40px;
    position: absolute;
    right: 5px;
    top: 3px;
  }
  .item-subtitle {
    display: flex;
    align-content: center !important;
    justify-content: center !important;
    color: grey;
    font-weight: 700;
    font-family: 'Orbitron', sans-serif !important;
  }

  .img-grafico {
    display: flex;
    flex-direction: column;
    width: 50px;
  }
</style>
