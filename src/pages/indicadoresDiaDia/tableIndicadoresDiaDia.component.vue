<template>
  <section class="indicadores-dia-dia" v-if="resultadoDiaDia != ''">
    <v-sheet>
      <title-negative-margin :title="title" icon="fa-solid fa-chart-simple"></title-negative-margin>
      <v-data-table
        :headers="headers"
        :items="resultadoDiaDia"
        multi-sort
        class="elevation-1 text-no-wrap"
        dense
        :item-class="getClass"
        no-data-text="Não há informações no momento!"
      >
        <template #item.DATA="{ item }">{{ item.DATA.split('-').reverse().join('/') }}</template>
        <template #item.RECHAMADAS="{ item }">
          {{ item.RECHAMADAS | percentage(item.RECHAMADAS) }}
        </template>
        <template #item.RECHAMADAS_24="{ item }">
          {{ item.RECHAMADAS_24 | percentage(item.RECHAMADAS_24) }}
        </template>
        <template #item.RECHAMADAS_48="{ item }">
          {{ item.RECHAMADAS_48 | percentage(item.RECHAMADAS_48) }}
        </template>
        <template #item.SHORTCALL="{ item }">
          {{ item.SHORTCALL | percentage(item.SHORTCALL) }}
        </template>
        <template #item.TX_OCUPACAO="{ item }">
          {{ item.TX_OCUPACAO | percentage(item.TX_OCUPACAO) }}
        </template>
        <template #item.DESCONEXOES="{ item }">
          {{ item.DESCONEXOES | percentage(item.DESCONEXOES) }}
        </template>
        <template #item.TRANSFERENCIAS_NORMAIS="{ item }">
          {{ item.TRANSFERENCIAS_NORMAIS | percentage(item.TRANSFERENCIAS_NORMAIS) }}
        </template>
        <template #item.TRANSFERENCIAS_INTERNAS="{ item }">
          {{ item.TRANSFERENCIAS_INTERNAS | percentage(item.TRANSFERENCIAS_INTERNAS) }}
        </template>
        <template #item.TRANSFERENCIAS_PESQUISA="{ item }">
          {{ item.TRANSFERENCIAS_PESQUISA | percentage(item.TRANSFERENCIAS_PESQUISA) }}
        </template>
      </v-data-table>
    </v-sheet>
  </section>
</template>

<script>
  export default {
    name: 'indicadores-dia-dia',
    props: {
      title: {
        type: String,
        default: 'Indicadores Dia Dia'
      }
    },
    data: () => ({
      headers: [
        { text: 'Data Trabalho', value: 'DATA', align: 'center' },
        { text: 'Atendidas', value: 'ATENDIDAS', align: 'center' },
        { text: 'Identificadas', value: 'IDENTIFICADAS', align: 'center' },
        { text: 'TMT', value: 'TMT', align: 'center' },
        { text: 'Rechamadas %', value: 'RECHAMADAS', align: 'center' },
        { text: 'Logado', value: 'LOGADO_CHE', align: 'center' },
        { text: 'Jackin com HE', value: 'JACKIN_CHE', align: 'center' },
        { text: 'Logado sem HE', value: 'LOGADO_SHE', align: 'center' },
        { text: 'Jackin sem HE', value: 'JACKIN_SHE', align: 'center' },
        { text: 'NR 17', value: 'NR17', align: 'center' },
        { text: 'Ocupação', value: 'TX_OCUPACAO', align: 'center' },
        { text: 'Short Call', value: 'SHORTCALL', align: 'center' },
        { text: 'Rechamadas 24h', value: 'RECHAMADAS_24', align: 'center' },
        { text: 'Rechamadas 48h', value: 'RECHAMADAS_48', align: 'center' },
        { text: 'Rechamadas 72h', value: 'RECHAMADAS_72', align: 'center' },
        { text: 'Desconexão', value: 'DESCONEXOES', align: 'center' },
        {
          text: 'Transferencias Normais',
          value: 'TRANSFERENCIAS_NORMAIS',
          align: 'center'
        },
        {
          text: 'Transferencias Internas',
          value: 'TRANSFERENCIAS_INTERNAS',
          align: 'center'
        },
        {
          text: 'Transf Pesquisa',
          value: 'TRANSFERENCIAS_PESQUISA',
          align: 'center'
        },
        { text: 'Pausas', value: 'PAUSAS', align: 'center' },
        { text: 'Padrão', value: 'PADRAO', align: 'center' },
        { text: 'Lanche', value: 'LANCHE', align: 'center' },
        { text: 'Particular', value: 'PARTICULAR', align: 'center' },
        { text: 'Descanso', value: 'DESCANSO', align: 'center' },
        { text: 'Sistema', value: 'SISTEMA', align: 'center' },
        { text: 'Treinamento', value: 'TREINAMENTO', align: 'center' },
        { text: 'Saude', value: 'SAUDE', align: 'center' },
        { text: 'Feedback', value: 'FEEDBACK', align: 'center' },
        { text: 'Suporte', value: 'SUPORTE', align: 'center' },
        { text: 'Laboral', value: 'LABORAL', align: 'center' },
        { text: 'Demais Pausas', value: 'DEMAIS_PAUSAS', align: 'center' }
      ]
    }),
    computed: {
      usuarioNome() {
        return this.$store.getters.usuario.nome
      },
      resultadoDiaDia() {
        return this.$store.getters.resultadoDiaDia
      }
    },
    methods: {
      getClass(item) {
        if (item.DATA === 'CONSOLIDADO') return 'teal lighten-5 font-weight-bold'
      },
      loadResultadoDiaDia() {
        return this.$store.dispatch('loadResultadoDiaDia', this.usuarioNome)
      }
    },
    created() {
      this.loadResultadoDiaDia()
    }
  }
</script>

<style scoped></style>
