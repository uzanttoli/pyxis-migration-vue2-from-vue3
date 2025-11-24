<template>
  <v-row justify="center">
    <!-- <v-col>
      <progresso-consultas></progresso-consultas>
    </v-col> -->
    <v-col cols="4">
      <DashboardUltimaAtualizacaoComponent />
    </v-col>
    <v-col cols="12">
      <table-acompanhamento-desempenho-consulta></table-acompanhamento-desempenho-consulta>
    </v-col>
    <v-col cols="12">
      <table-carregamento-relatorios></table-carregamento-relatorios>
    </v-col>
    <v-col cols="12">
      <DashboardTableRotinasComponent />
    </v-col>
  </v-row>
</template>

<script>
  // import ProgressoConsultas from "../progressoConsultas.vue";
  import DashboardUltimaAtualizacaoComponent from './DashboardCardUltimaAtualizacao.component.vue'
  import DashboardTableRotinasComponent from './DashboardTableRotinas.component.vue'
  import TableAcompanhamentoDesempenhoConsulta from './TableAcompanhamentoDesempenhoConsulta.vue'
  import TableCarregamentoRelatorios from './TableCarregamentoRelatorios.vue'
  export default {
    components: {
      DashboardUltimaAtualizacaoComponent,
      DashboardTableRotinasComponent,
      TableAcompanhamentoDesempenhoConsulta,
      TableCarregamentoRelatorios
      // ProgressoConsultas,
    }
  }
</script>

<style scoped></style>
