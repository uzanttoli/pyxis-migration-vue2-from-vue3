<template>
  <v-card elevation="0">
    <v-card-title>Dados Atuais</v-card-title>
    <div style="display: flex; justify-content: space-between">
      <div style="width: 500px">
        <v-text-field
          v-model="search"
          outlined
          dense
          placeholder="Pesquisar"
          label="Pesquisar"
        ></v-text-field>
      </div>
      <show-columns-table
        :columns="getHeaders"
        @update:columns="columnsConsider"
      ></show-columns-table>
    </div>
    <v-alert border="left" colored-border type="info" elevation="2" width="99.9%">
      Altere os dados de forma pontual.
      <br />
      <h3>Instruções:</h3>
      <ul>
        <li>Com os dados alterados, pressione "ENTER" na linha da mudança;</li>
        <li>As mudanças devem ser feitas linha a linha.</li>
      </ul>
    </v-alert>
    <v-data-table
      :headers="editionTable ? columnsEdition : getHeaders"
      no-data-text="Não há informações"
      :items="dados"
      :search="search"
    >
      <template v-for="(header, index) in getHeaders" v-slot:[`item.${header.value}`]="{ item }">
        <template v-if="header.value !== 'ID' && header.value !== 'DATA_ATUALIZACAO'">
          <v-text-field
            auto-grow
            :key="index"
            v-model="item[header.value]"
            @change="updateDataEdit(item)"
          ></v-text-field>
        </template>
        <template v-else>
          <span :key="index">{{ item[header.value] }}</span>
        </template>
      </template>
    </v-data-table>
    <loadhastag
      :activeMsg="true"
      msg="Atualizando... por favor aguarde!"
      :envioDados="loading"
    ></loadhastag>
  </v-card>
</template>

<script>
  import config from '../core/config'
  import showColumnsTable from '../pages/smartSales/editar/showColumnsTable.vue'
  import alerts from '../mixins/alerts.mixins'
  import loadhastag from '../shared/components/load/loadHastag.vue'
  export default {
    components: { showColumnsTable, loadhastag },
    data: () => ({
      headers: [],
      dados: [],
      search: '',
      editionTable: false,
      columnsEdition: [],
      loading: false
    }),
    mixins: [alerts],
    computed: {
      getHeaders() {
        let dados = this.dados[0]
        if (!dados) return
        let headers = Object.keys(dados).map((dado, index) => {
          return {
            index: index,
            text: dado,
            value: dado,
            sortable: false,
            align: 'center',
            icon: 'mdi-arrow-up'
          }
        })

        return headers
      }
    },
    methods: {
      columnsConsider(e) {
        this.editionTable = e.edition
        this.columnsEdition = e.array
      },
      async updateDataEdit(i) {
        try {
          this.loading = true
          let urlData = `${config.baseUrl}api/shared/smartsales/configuracao/atualizar_dados_smartsales/`
          await this.$api.post(urlData, i)
          this.loading = false
          this.toast('Dados atualizados com sucesso!', 'bottom-right', false, 2000, 'success')
        } catch (e) {
          this.loading = false
          this.toast(
            'Não foi possivel concluir está solicitação.',
            'bottom-right',
            false,
            2000,
            'error'
          )
        }
      },
      async loadDadosTabela() {
        let urlData = `${config.baseUrl}api/shared/smartsales/configuracao/dados_tabela`
        var res = await this.$api.get(urlData)
        this.dados = res.data
      }
    },
    created() {
      this.loadDadosTabela()
    }
  }
</script>

<style scoped>
  .title-container {
    display: flex;
    align-items: center;
  }
</style>
