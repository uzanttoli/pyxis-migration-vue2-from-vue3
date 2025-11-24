<template>
  <v-sheet class="image mx-auto">
    <img src="../../../assets/portal.jpg" alt="" />
    <v-col cols="12">
      <v-card class="mx-auto rounded-xl card-inf-meta transparent">
        <v-col>
          <v-row style="display: flex; justify-content: space-between; margin-top: 10px">
            <v-col>
              <v-card
                class="pa-2 rounded-xl mx-5"
                style="box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.15)"
              >
                <p class="text-h5 pa-0 ma-0 mb-n4 grey--text ml-5">
                  <i class="fa-solid fa-crosshairs"></i>
                  Metas diárias
                </p>
                <CardMetas
                  :agrupamentoConsulta="agrupamentoConsulta"
                  :turnoConsulta="turnoConsulta"
                  :almopeConsulta="almopeConsulta"
                  :indicadores="indicadores"
                />
              </v-card>
            </v-col>
            <v-col>
              <Historico :historico="historico" />
            </v-col>
          </v-row>
          <v-col cols="12">
            <TableHistoricoHpXp
              :cargoConsulta="cargoConsulta"
              :almopeConsulta="almopeConsulta"
              :produtoConsulta="produtoConsulta"
              :openViewDetalhesTable="openViewDetalhes"
              :indicadores="indicadores"
            />
          </v-col>
        </v-col>
      </v-card>
    </v-col>
  </v-sheet>
</template>

<script>
  import Historico from './Historico.vue'
  import CardMetas from './CardMetas.vue'
  import TableHistoricoHpXp from './TableHistoricoHpXp.vue'

  import config from '../../../core/config'
  export default {
    components: { CardMetas, Historico, TableHistoricoHpXp },
    props: {
      almopeConsulta: {
        type: [String, Number],
        default: null
      },
      turnoConsulta: {
        type: String,
        default: null
      },
      agrupamentoConsulta: {
        type: String,
        default: null
      },
      produtoConsulta: {
        type: String,
        default: null
      },
      cargoConsulta: {
        type: String,
        default: null
      },
      openViewDetalhes: {
        type: Boolean
      }
    },
    data: () => ({
      indicadores: [],
      historico: []
    }),
    computed: {
      agrupamento() {
        return this.$store.getters.usuario.agrupamento
      },
      // turno() {
      //   return this.$store.getters.turno
      //     ? this.$store.getters.turno.TURNO
      //     : "MANHA";
      // },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      almope() {
        return this.almopeConsulta ? this.almopeConsulta : this.usuarioAlmope
      }
    },
    methods: {
      // loadTurno() {
      //   this.$store.dispatch("loadTurno", this.almope);
      // },
      loadHistorico(almope) {
        let urlData = `${config.baseUrl}api/shared/gamification/detalhes/meu_historico/${almope}`
        this.$api.get(urlData).then(res => {
          this.historico = res.data
        })
      },
      loadMetaIndicadores(almope, agrupamento) {
        this.$emit('updated-load', true)
        let urlData = `${config.baseUrl}api/shared/gamification/detalhes/metas_indicador/`
        this.$api
          .get(urlData, {
            params: {
              almope,
              agrupamento
            }
          })
          .then(res => {
            this.indicadores = res.data
            this.$emit('updated-load', false)
          })
      }
    },
    watch: {
      agrupamentoConsulta() {
        this.loadMetaIndicadores(this.almope, this.agrupamentoConsulta)
      },
      almopeConsulta() {
        this.loadHistorico(this.almope)
      }
    },
    created() {
      // this.loadTurno();
      this.loadHistorico(this.almope)
      // if (this.almopeConsulta) this.loadHistorico(this.almopeConsulta);
      // else this.loadHistorico(this.usuarioAlmope);

      setTimeout(() => {
        if (this.agrupamentoConsulta && this.almopeConsulta) {
          this.loadMetaIndicadores(this.almope, this.agrupamentoConsulta)
        } else {
          this.loadMetaIndicadores(this.almope, this.agrupamento)
        }
      }, 1500)
    }
  }
</script>

<style scoped>
  .card-inf-meta {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }

  img {
    width: 100%;
    height: 100%;
    position: absolute;
    /* z-index: 0; */
    /* height: 550px; */
    border-bottom-right-radius: 26px;
    border-bottom-left-radius: 26px;
    background-size: cover;
  }

  .card-scroll::-webkit-scrollbar {
    width: 10px;
  }

  .card-scroll::-webkit-scrollbar-track {
    background: rgb(255, 255, 254);
  }

  .card-scroll::-webkit-scrollbar-thumb {
    background-color: rgb(143, 14, 143);
    border-radius: 25px;
    border: 3px solid rgb(245, 245, 245);
  }
</style>
