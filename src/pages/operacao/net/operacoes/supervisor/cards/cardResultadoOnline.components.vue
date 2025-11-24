<template>
  <div>
    <v-col cols="2" v-if="resumoIndicadores[0]">
      <card-three-subtitles title="ABS">
        <template v-slot:card-value>
          Total:{{ resumoIndicadores[0].PERCENT_ABS | percentage }}
        </template>
        <template v-slot:subtitle1>
          Faltas: {{ resumoIndicadores[0].ABS }} | Escalados:
          {{ resumoIndicadores[0].ESCALADOS }}
        </template>
      </card-three-subtitles>
    </v-col>

    <v-col cols="2" v-if="resumoIndicadores[0]">
      <card-three-subtitles title="INADERÊNCIA">
        <template v-slot:card-value>
          Total:{{ resumoIndicadores[0].P_INADERENCIA | percentage }}
        </template>
        <template slot="subtitle1">
          Inad.: {{ resumoIndicadores[0].INADERENCIA }} | Aderente:
          {{ resumoIndicadores[0].ESCALADOS - resumoIndicadores[0].INADERENCIA }}
          |
        </template>
        <template slot="subtitle1">
          Antes Horário:{{ resumoIndicadores[0].ANTES }} | Depois Horário:
          {{ resumoIndicadores[0].DEPOIS }}
        </template>
      </card-three-subtitles>
    </v-col>

    <v-col cols="2" v-if="resumoIndicadores[0]">
      <card-three-subtitles title="TEMPO LOGADO">
        <template v-slot:card-value>Total:{{ resumoIndicadores[0].LOGADO }}</template>
        <template v-slot:subtitle1></template>
      </card-three-subtitles>
    </v-col>
  </div>
</template>

<script>
  import cardThreeSubtitles from '../../../shared/components/cards/cardThreeSubtitles'
  export default {
    name: 'card-resultado-online',
    components: {
      cardThreeSubtitles
    },
    computed: {
      usuarioNome() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.nome
      },
      resumoIndicadores() {
        return this.$store.getters.resumoIndicadores
      }
    },
    methods: {
      loadResumoIndicadores() {
        return this.$store.dispatch('loadResumoIndicadores', this.usuarioNome)
      }
    },
    created() {
      this.loadResumoIndicadores()
    }
  }
</script>

<style></style>
