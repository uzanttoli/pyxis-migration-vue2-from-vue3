<template>
  <v-card elevation="1">
    <title-negative-margin
      title="Rotinas CCO"
      icon="mdi-database-clock-outline"
    ></title-negative-margin>
    <v-divider></v-divider>
    <v-data-table
      :headers="headers"
      :items="listRotinas"
      disable-sort
      :loading="loading"
      no-results-text="Não há nada aqui..."
      no-data-text="Não há nada aqui..."
    >
      <template #[`item.STATUS`]="{ item }">
        <v-chip :class="item.STATUS == 1 ? 'success' : 'error'" small>
          {{ item.STATUS == 1 ? 'Ativo' : 'Inativo' }}
        </v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import config from '../../../../core/config'
  export default {
    data: () => ({
      loading: false,
      headers: [
        { text: 'ID', value: 'ID' },
        { text: 'Mapa', value: 'MAPA' },
        { text: 'Local Origem', value: 'LOCAL_ORIGEM' },
        { text: 'Local Destino', value: 'LOCAL_DESTINO' },
        { text: 'Nome Carregamento', value: 'NOME_CARREGAMENTO' },
        { text: 'Tipo', value: 'TIPO' },
        { text: 'Intervalo', value: 'INTERVALO' },
        { text: 'Status', value: 'STATUS' }
      ],
      listRotinas: []
    }),
    methods: {
      loadArquivos() {
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/admin/painel/arquivos_carregamentos`
        this.$api.get(urlData).then(res => {
          this.listRotinas = res.data
          this.loading = false
        })
      }
    },
    created() {
      this.loadArquivos()
    }
  }
</script>

<style></style>
