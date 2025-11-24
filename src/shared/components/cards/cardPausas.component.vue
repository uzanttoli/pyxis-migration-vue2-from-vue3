<template>
  <v-flex xl6 lg12 md12 sm12 xs12>
    <v-col>
      <card-three-subtitles title="Resumo Pausas">
        <template v-slot:card-value>
          {{ pausasPorCoordenador.TOTAL }}
        </template>
        <template v-slot:subtitle1>
          <v-row>
            <v-col>Alimentação:{{ pausasPorCoordenador.ALIMENTACAO }}</v-col>
            <v-col>Descanso:{{ pausasPorCoordenador.DESCANSO }}</v-col>
            <v-col>Particular:{{ pausasPorCoordenador.PARTICULAR }}</v-col>
            <v-col>Feedback:{{ pausasPorCoordenador.FEEDBACK }}</v-col>
            <v-col>Sistema:{{ pausasPorCoordenador.SISTEMA }}</v-col>
            <v-col>Padrão:{{ pausasPorCoordenador.PADRAO }}</v-col>
            <v-col>Laboral:{{ pausasPorCoordenador.LABORAL }}</v-col>
            <v-col>Treinamento:{{ pausasPorCoordenador.TREINAMENTO }}</v-col>
            <v-col>Saude:{{ pausasPorCoordenador.SAUDE }}</v-col>
            <v-col>Suporte:{{ pausasPorCoordenador.SUPORTE }}</v-col>
          </v-row>
        </template>
      </card-three-subtitles>
    </v-col>
  </v-flex>
</template>

<script>
  import cardThreeSubtitles from './cardThreeSubtitles'
  export default {
    props: {
      usuarioNome: {
        type: String,
        default: null
      }
    },
    components: {
      cardThreeSubtitles
    },
    data: () => ({}),
    computed: {
      // usuarioNome() {
      //   return this.$store.getters.usuario.nome;
      // },
      pausasPorCoordenador() {
        let pausasPorCoordenador = this.$store.getters.pausasPorCoordenador[0]
        return pausasPorCoordenador ? pausasPorCoordenador : []
      }
    },
    methods: {
      loadPausasPorCoordenador() {
        this.$store.dispatch('loadPausasPorCoordenador', this.usuarioNome)
      }
    },
    created() {
      this.loadPausasPorCoordenador()
    }
  }
</script>

<style></style>
