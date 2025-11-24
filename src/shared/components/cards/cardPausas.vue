<template>
  <card-three-subtitles title="Resumo Pausas" v-if="pausasPorSupervisor" maxLargura="800">
    <template v-slot:card-value>
      {{ pausasPorSupervisor.TOTAL }}
    </template>
    <template v-slot:subtitle1>
      <v-row>
        <v-col>Alimentação:{{ pausasPorSupervisor.ALIMENTACAO }}</v-col>
        <v-col>Descanso:{{ pausasPorSupervisor.DESCANSO }}</v-col>
        <v-col>Particular:{{ pausasPorSupervisor.PARTICULAR }}</v-col>
        <v-col>Feedback:{{ pausasPorSupervisor.FEEDBACK }}</v-col>
        <v-col>Sistema:{{ pausasPorSupervisor.SISTEMA }}</v-col>
        <v-col>Padrão:{{ pausasPorSupervisor.PADRAO }}</v-col>
        <v-col>Laboral:{{ pausasPorSupervisor.LABORAL }}</v-col>
        <v-col>Treinamento:{{ pausasPorSupervisor.TREINAMENTO }}</v-col>
        <v-col>Saude:{{ pausasPorSupervisor.SAUDE }}</v-col>
        <v-col>Suporte:{{ pausasPorSupervisor.SUPORTE }}</v-col>
      </v-row>
    </template>
  </card-three-subtitles>
</template>

<script>
  import cardThreeSubtitles from './cardThreeSubtitles'
  export default {
    components: {
      cardThreeSubtitles
    },
    data: () => ({
      pausasPorSupervisorDefault: {
        TOTAL: 0,
        TREINAMENTO: 0,
        PARTICULAR: 0,
        ALIMENTACAO: 0,
        DESCANSO: 0,
        PADRAO: 0,
        SISTEMA: 0,
        FEEDBACK: 0,
        SAUDE: 0,
        LABORAL: 0,
        SUPORTE: 0
      }
    }),
    computed: {
      usuarioNome() {
        return this.$store.getters.usuario.nome
      },
      pausasPorSupervisor() {
        return this.$store.getters.pausasPorSupervisor
          ? this.$store.getters.pausasPorSupervisor[0]
          : this.pausasPorSupervisorDefault
      }
    },
    methods: {
      loadPausasPorSupervisor() {
        return this.$store.dispatch('loadPausasPorSupervisor', this.usuarioNome)
      }
    },
    created() {
      this.loadPausasPorSupervisor()
    }
  }
</script>

<style></style>
