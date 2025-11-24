<template>
  <div>
    <v-row>
      <v-flex xl2 lg4 md6 sm6 xs12>
        <v-col v-if="resumoIndicadoresOnlineCoordenador">
          <card-three-subtitles title="ABS" class="mx-auto">
            <template v-slot:card-value>
              {{ resumoIndicadoresOnlineCoordenador.PERCENT_ABS | percentage }}
            </template>
            <template v-slot:subtitle1>
              Faltas: {{ resumoIndicadoresOnlineCoordenador.ABS }} | Escalados:
              {{ resumoIndicadoresOnlineCoordenador.ESCALADOS }}
            </template>
          </card-three-subtitles>
          <!-- <v-card shaped @click="dialogAbsJustified = !dialogAbsJustified">
          </v-card> -->
        </v-col>
      </v-flex>
      <v-flex xl2 lg4 md6 sm6 xs12>
        <v-col v-if="resumoIndicadoresOnlineCoordenador">
          <card-three-subtitles title="INADERÊNCIA">
            <template v-slot:card-value>
              {{ resumoIndicadoresOnlineCoordenador.P_INADERENCIA | percentage }}
            </template>
            <template slot="subtitle1">
              Inad.: {{ resumoIndicadoresOnlineCoordenador.INADERENCIA }} | Aderente:
              {{
                resumoIndicadoresOnlineCoordenador.ESCALADOS -
                resumoIndicadoresOnlineCoordenador.INADERENCIA
              }}
              |
            </template>
            <template slot="subtitle1">
              Antes Hor.:{{ resumoIndicadoresOnlineCoordenador.ANTES }} | Depois Hor.:{{
                resumoIndicadoresOnlineCoordenador.DEPOIS
              }}
            </template>
          </card-three-subtitles>
        </v-col>
      </v-flex>
      <v-flex xl2 lg4 md12 sm12 xs12>
        <v-col v-if="resumoIndicadoresOnlineCoordenador">
          <card-three-subtitles title="TEMPO LOGADO">
            <template v-slot:card-value>
              {{ tempoLogadoPorCoordenador.TEMPO_LOGADO }}
            </template>
            <template v-slot:subtitle1>
              Logados:
              {{ quantidadeOperadoresLogadosCoordenador.USUARIOS_LOGADOS }}
            </template>
          </card-three-subtitles>
        </v-col>
      </v-flex>
      <card-pausas :usuarioNome="usuarioNome"></card-pausas>
    </v-row>
    <abs-justified
      :dialogAbsJustified="dialogAbsJustified"
      @closeDialogAbsJustified="dialogAbsJustified = !dialogAbsJustified"
    ></abs-justified>
  </div>
</template>

<script>
  import absJustified from '../dialogs/absJustificado.component.vue'
  import cardPausas from '@/shared/components/cards/cardPausas.component.vue'
  import cardThreeSubtitles from '@/shared/components/cards/cardThreeSubtitles.vue'
  export default {
    name: 'CardResumoIndicadores',
    components: {
      absJustified,
      cardPausas,
      cardThreeSubtitles
    },
    props: {
      usuarioNome: {
        type: String,
        default: null,
        required: true
      }
    },
    data: () => ({
      dialogAbsJustified: false
    }),
    computed: {
      quantidadeOperadoresLogadosCoordenador() {
        let quantidadeOperadoresLogadosCoordenador =
          this.$store.getters.quantidadeOperadoresLogadosCoordenador[0]
        return quantidadeOperadoresLogadosCoordenador ? quantidadeOperadoresLogadosCoordenador : []
      },
      tempoLogadoPorCoordenador() {
        let tempoLogadoPorCoordenador = this.$store.getters.tempoLogadoPorCoordenador[0]
        return tempoLogadoPorCoordenador ? tempoLogadoPorCoordenador : []
      },
      resumoIndicadoresOnlineCoordenador() {
        let resumoIndicadoresOnlineCoordenador =
          this.$store.getters.resumoIndicadoresOnlineCoordenador[0]
        return resumoIndicadoresOnlineCoordenador ? resumoIndicadoresOnlineCoordenador : []
      }
    },
    methods: {
      loadQuantidadeOperadoresLogadosCoordenador() {
        this.$store.dispatch('loadQuantidadeOperadoresLogadosCoordenador', this.usuarioNome)
      },
      loadTempoLogadoPorCoordenador() {
        this.$store.dispatch('loadTempoLogadoPorCoordenador', this.usuarioNome)
      },
      loadResumoIndicadoresOnlineCoordenador() {
        this.$store.dispatch('loadResumoIndicadoresOnlineCoordenador', this.usuarioNome)
      }
    },
    created() {
      this.loadResumoIndicadoresOnlineCoordenador()
      this.loadTempoLogadoPorCoordenador()
      this.loadQuantidadeOperadoresLogadosCoordenador()
    }
  }
</script>

<style></style>
