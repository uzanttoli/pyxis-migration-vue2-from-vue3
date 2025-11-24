<template>
  <v-card class="mt-6">
    <v-col class="d-flex" cols="2">
      <v-select
        class="mt-n3"
        :items="listDate"
        append-icon="mdi-magnify"
        label="Data"
        item-text="DATA"
        single-line
        v-model="date"
        hide-details
      ></v-select>
    </v-col>

    <v-data-table
      :headers="getHeaders()"
      dense
      multi-sort
      :items-per-page="20"
      :fixed-header="true"
      class="text-no-wrap"
      :items="base"
      :search="search"
      :loading="loading"
      no-data-text="Não foi encontrado resultados!"
      loading-text="Carregando, por favor aguarde!"
    >
      <template v-slot:header>
        <thead>
          <tr>
            <th colspan="3" class="orange darken-3 white--text text-center rounded-tl-xl">
              Operações
            </th>
            <th colspan="4" class="light-blue darken-4 white--text text-center">
              Relatorios Online
            </th>
            <th colspan="3" class="yellow accent-4 black--text text-center rounded-tr-xl">
              Service To Sales
            </th>
          </tr>
          <tr>
            <th v-for="(item, i) in getHeaders" :key="i">{{ item.text }}</th>
          </tr>
        </thead>
      </template>
      <template v-slot:item.TRATAR_DEMANDAS_QTD="{ item }">
        {{ item.TRATAR_DEMANDAS_QTD }}
        <v-icon :color="farolAcesso(item.TRATAR_DEMANDAS_QTD)" small>mdi-circle</v-icon>
      </template>
      <template v-slot:item.FEEDBACK_QTD="{ item }">
        {{ item.FEEDBACK_QTD }}
        <v-icon :color="farolAcesso(item.FEEDBACK_QTD)" small>mdi-circle</v-icon>
      </template>
      <template v-slot:item.DADOS_ONLINE_QTD="{ item }">
        {{ item.DADOS_ONLINE_QTD }}
        <v-icon :color="farolAcesso(item.DADOS_ONLINE_QTD)" small>mdi-circle</v-icon>
      </template>
      <template v-slot:item.GERENCIAL_QTD="{ item }">
        {{ item.GERENCIAL_QTD }}
        <v-icon :color="farolAcesso(item.GERENCIAL_QTD)" small>mdi-circle</v-icon>
      </template>
      <template v-slot:item.FAROL_QTD="{ item }">
        {{ item.FAROL_QTD }}
        <v-icon :color="farolAcesso(item.FAROL_QTD)" small>mdi-circle</v-icon>
      </template>
      <template v-slot:item.OCUPACAO_QTD="{ item }">
        {{ item.OCUPACAO_QTD }}
        <v-icon :color="farolAcesso(item.OCUPACAO_QTD)" small>mdi-circle</v-icon>
      </template>
      <template v-slot:item.WORKFLOW_QTD="{ item }">
        {{ item.WORKFLOW_QTD }}
        <v-icon :color="farolAcesso(item.WORKFLOW_QTD)" small>mdi-circle</v-icon>
      </template>
      <template v-slot:item.GERENCIAL_S2S_QTD="{ item }">
        {{ item.GERENCIAL_S2S_QTD }}
        <v-icon :color="farolAcesso(item.GERENCIAL_S2S_QTD)" small>mdi-circle</v-icon>
      </template>
      <template v-slot:item.COORDENADOR_S2S_QTD="{ item }">
        {{ item.COORDENADOR_S2S_QTD }}
        <v-icon :color="farolAcesso(item.COORDENADOR_S2S_QTD)" small>mdi-circle</v-icon>
      </template>
      <template v-slot:item.SUPERVISOR_S2S_QTD="{ item }">
        {{ item.SUPERVISOR_S2S_QTD }}
        <v-icon :color="farolAcesso(item.SUPERVISOR_S2S_QTD)" small>mdi-circle</v-icon>
      </template>
      <template v-slot:item.RANGE="{ item }">
        {{ item.RANGE }}
        <v-icon :color="colorScore(item.RANGE)" small>mdi-circle</v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import config from '../../../../core/config.js'
  export default {
    name: 'tabela-controle-acesso',
    data: () => ({
      base: [],
      listDate: [],
      date: 'CONSOLIDADO',
      loading: false,
      search: ''
    }),
    methods: {
      colorScore(num) {
        if (num <= 2) {
          return 'green'
        } else if (num >= 3 && num <= 5) {
          return 'orange'
        } else if (num >= 6) {
          return 'red'
        } else {
          return 'grey'
        }
      },
      farolAcesso(num) {
        if (num > 4) {
          return 'green'
        } else if (num == 4) {
          return 'orange'
        } else if (num < 4) {
          return 'red'
        } else {
          return 'grey'
        }
      },
      loadList() {
        let urlBase = `${config.baseUrl}api/shared/registro_log_pyxis/list_day/`
        this.$api.get(urlBase).then(res => {
          this.listDate = res.data
        })
      },
      loadBase() {
        this.loading = true

        let params = ''

        if (this.date == 'CONSOLIDADO') {
          params = '1'
        } else {
          params = '2'
        }

        let urlBase = `${config.baseUrl}api/shared/registro_log_pyxis/acesso_pages/${params}/${this.date}`
        this.$api.get(urlBase).then(res => {
          this.base = res.data
          this.loading = false
        })
      },
      getHeaders() {
        let arrHeaders = [
          {
            text: 'Tratar Demandas',
            class: 'orange lighten-3 white--text',
            align: 'center',
            value: 'TRATAR_DEMANDAS_QTD'
          },
          {
            text: 'Feedback',
            class: 'orange lighten-3 white--text',
            align: 'center',
            value: 'FEEDBACK_QTD'
          },
          {
            text: 'Dados Online',
            class: 'orange lighten-3 white--text',
            align: 'center',
            value: 'DADOS_ONLINE_QTD'
          },
          {
            text: 'Gerencial',
            class: 'light-blue darken-2 white--text',
            align: 'center',
            value: 'GERENCIAL_QTD'
          },
          {
            text: 'Farol',
            class: 'light-blue darken-2 white--text',
            align: 'center',
            value: 'FAROL_QTD'
          },
          {
            text: 'Ocupação',
            class: 'light-blue darken-2 white--text',
            align: 'center',
            value: 'OCUPACAO_QTD'
          },
          {
            text: 'Workflow',
            class: 'light-blue darken-2 white--text',
            align: 'center',
            value: 'WORKFLOW_QTD'
          },
          {
            text: 'Gerencial',
            class: 'yellow accent-3 black--text',
            align: 'center',
            value: 'GERENCIAL_S2S_QTD'
          },
          {
            text: 'Coordenador',
            class: 'yellow accent-3 black--text',
            align: 'center',
            value: 'COORDENADOR_S2S_QTD'
          },
          {
            text: 'Supervisor',
            class: 'yellow accent-3 black--text',
            align: 'center',
            value: 'SUPERVISOR_S2S_QTD'
          },
          {
            text: 'Range Score',
            class: 'blue-grey darken-2 white--text',
            align: 'center',
            value: 'RANGE'
          },
          {
            text: 'Almope',
            class: 'blue-grey darken-3 white--text',
            align: 'center',
            value: 'ALMOPE'
          },
          {
            text: 'Nome',
            class: 'blue-grey darken-3 white--text',
            align: 'center',
            value: 'NOME'
          },
          {
            text: 'Superior1',
            class: 'blue-grey darken-3 white--text',
            align: 'center',
            value: 'SUPERIOR1'
          },
          {
            text: 'Superior2',
            class: 'blue-grey darken-3 white--text',
            align: 'center',
            value: 'SUPERIOR2'
          },
          {
            text: 'Regional',
            class: 'blue-grey darken-3 white--text',
            align: 'center',
            value: 'REGIONAL'
          },
          {
            text: 'Cargo',
            class: 'blue-grey darken-3 white--text',
            align: 'center',
            value: 'CARGO'
          }
        ]
        return arrHeaders
      }
    },
    watch: {
      date() {
        this.loadBase()
      }
    },
    created() {
      this.loadBase()
      this.loadList()
    }
  }
</script>

<style></style>
