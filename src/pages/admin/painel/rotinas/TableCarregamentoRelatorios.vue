<template>
  <v-card elevation="1">
    <title-negative-margin
      title="Relatórios Carregados"
      icon="mdi-database-refresh-outline"
    ></title-negative-margin>
    <v-data-table
      no-data-text="Não há dados para serem carregados!"
      :headers="header"
      :items="relatoriosCarregados"
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
      relatoriosCarregados: [],
      header: [
        {
          text: 'ID',
          value: 'ID',
          align: 'center'
        },
        {
          text: 'ID Relatorios',
          value: 'ID_RELATORIO',
          align: 'center'
        },
        {
          text: 'Data/Hora Inicio',
          value: 'DATA_HORA_INICIO',
          align: 'center'
        },
        {
          text: 'Data/Hora Fim',
          value: 'DATA_HORA_FIM',
          align: 'center'
        },
        {
          text: 'Parametro DE',
          value: 'PARAMENTRO_DE',
          align: 'center'
        },
        {
          text: 'Parametro ATE',
          value: 'PARAMENTRO_ATE',
          align: 'center'
        },
        {
          text: 'Duração',
          value: 'DURACAO',
          align: 'center'
        },
        {
          text: 'NameHost',
          value: 'NAME_HOST',
          align: 'center'
        },
        {
          text: 'Local Origem',
          value: 'LOCAL_ORIGEM',
          align: 'center'
        },
        {
          text: 'Local Destino',
          value: 'LOCAL_DESTINO',
          align: 'center'
        },
        {
          text: 'Nome Arquivo',
          value: 'NOME_ARQUIVO',
          align: 'center'
        },
        {
          text: 'Novo Nome Arquivo',
          value: 'NOVO_NOME_ARQUIVO',
          align: 'center'
        },
        {
          text: 'Mapa',
          value: 'MAPA',
          align: 'center'
        },
        {
          text: 'Nome Carregamento',
          value: 'NOME_CARREGAMENTO',
          align: 'center'
        },
        {
          text: 'Tipo',
          value: 'TIPO',
          align: 'center'
        },
        {
          text: 'Intervalo',
          value: 'INTERVALO',
          align: 'center'
        },
        {
          text: 'Status',
          value: 'STATUS',
          align: 'center'
        }
      ]
    }),
    computed: {
      perfil() {
        return this.$store.getters.usuario.filtro
      }
    },
    methods: {
      async loadCarregamentoRelatorios() {
        try {
          let urlData = `${config.baseUrl}api/shared/admin/avaliacoes_pnc/carregamento_relatorios/${this.perfil}`
          var res = await this.$api.get(urlData)
          this.relatoriosCarregados = res.data
        } catch (error) {
          console.error(error)
        }
      }
    },
    created() {
      this.loadCarregamentoRelatorios()
    }
  }
</script>

<style></style>
