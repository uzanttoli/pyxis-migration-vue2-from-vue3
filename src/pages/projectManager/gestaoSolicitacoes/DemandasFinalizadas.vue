<template>
  <v-col>
    <div style="display: flex; align-items: center; justify-content: space-between">
      <v-card-title>Demandas finalizadas</v-card-title>
      <div style="width: 350px">
        <v-text-field
          placeholder="Pesquisar"
          label="Pesquisar"
          dense
          outlined
          hide-details=""
          v-model="search"
        ></v-text-field>
      </div>
    </div>

    <v-data-table
      :headers="getHeaders"
      dense
      :search="search"
      :item-class="getClass"
      :loading="loading"
      loading-text="Carregando..."
      :items="dados"
      no-data-text="Não há informações"
      no-results-text="Nada encontrado :("
      :items-per-page="10"
      item-key="ID"
      hide-default-footer
      @page-count="pageCount = $event"
      v-model:page="page"
      @click:row="demanda"
    >
      <template v-slot:item.STATUS_GESTAO_SOLIC="{ item }">
        <v-chip v-if="item.STATUS_GESTAO_SOLIC == 'FINALIZADOS'" color="success" label small>
          {{ item.STATUS_GESTAO_SOLIC }}
        </v-chip>
        <v-chip v-if="item.STATUS_GESTAO_SOLIC == 'CANCELADOS'" color="error" label small>
          {{ item.STATUS_GESTAO_SOLIC }}
        </v-chip>
      </template>
      <template v-slot:item.ACAO>
        <v-icon size="18">fa-solid fa-eye</v-icon>
      </template>
      <template v-slot:item.SLA_FINAL="{ item }">
        <span>{{ item.SLA_FINAL | dataFormated }}</span>
      </template>
      <template v-slot:item.DATA_SOLICITACAO="{ item }">
        <span>{{ item.DATA_SOLICITACAO | dataFormated }}</span>
      </template>
    </v-data-table>
    <v-pagination
      v-model="page"
      circle
      color="teal lighten-2"
      :total-visible="10"
      :length="pageCount"
    ></v-pagination>
  </v-col>
</template>

<script>
  import config from '@/core/config'
  export default {
    data: () => ({
      dados: [],
      page: 1,
      pageCount: 5,
      search: null,
      loading: false,
      demandaSelecionado: null
    }),
    computed: {
      getHeaders() {
        let dados = this.dados[0]
        if (!dados) return
        let headers = Object.keys(dados).map(item => {
          return {
            text: item,
            value: item,
            sortable: false,
            align: 'center',
            class: 'teal lighten-2 white--text'
          }
        })
        headers.unshift({
          text: 'EXIBIR',
          value: 'ACAO',
          sortable: false,
          align: 'center',
          class: 'teal lighten-2 white--text'
        })

        return headers
      }
    },
    filters: {
      dataFormated(item) {
        if (!item) return
        let data = item.split(' ')[0]
        return data.split('-').reverse().join('-')
      }
    },
    methods: {
      getClass(item) {
        if (item.NUM_SOLICITACAO === this.demandaSelecionado) return 'red lighten-5'
      },
      demanda(item) {
        const routeData = this.$router.resolve({
          name: 'TratativaProjectManager',
          params: { id: item.NUM_SOLICITACAO },
          query: { notificationUser: true }
        })

        window.open(routeData.href, '_blank')
      },
      loadDadosSolicitacoesFinalizadas() {
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/project_manager/gestao/solic_finalizadas/`
        this.$api.get(urlData).then(res => {
          this.dados = res.data
          this.dados.forEach(this.replaceNulls)
          this.loading = false
        })
      },
      replaceNulls(obj) {
        for (let key in obj) {
          if (obj[key] === null) {
            obj[key] = '-'
          }
        }
      }
    },
    created() {
      this.loadDadosSolicitacoesFinalizadas()
    }
  }
</script>

<style></style>
