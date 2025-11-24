<template>
  <v-card elevation="0" class="mt-5">
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
    <v-data-table
      :headers="editionTable ? columnsEdition : getHeaders"
      no-data-text="Não há informações"
      :items="dados"
      :search="search"
      dense
    >
      <template v-slot:item.ACOES="{ item }">
        <v-btn icon small @click="actionButton(item, 'edit')">
          <v-icon small color="blue">fa-solid fa-pen-to-square</v-icon>
        </v-btn>
        <v-btn icon small @click="actionButton(item, 'delete')">
          <v-icon small color="red">fa-solid fa-trash</v-icon>
        </v-btn>
      </template>
      <!-- <template v-for="(header, index) in getHeaders" v-slot:[`item.${header.value}`]="{ item }">
      <span :key="index">{{ item[header.value] }}</span>
    </template> -->
    </v-data-table>
    <loadhastag
      :activeMsg="true"
      msg="Atualizando... por favor aguarde!"
      :envioDados="loading"
    ></loadhastag>
    <modal-edit
      :openEdit="openEdit"
      :itemsFields="getHeaders"
      :dataFields="dadosEdit"
      @updated:close="openEdit = !openEdit"
      @update:atualizar-dados="atualizarDados"
    ></modal-edit>
  </v-card>
</template>

<script>
  import config from '../../../core/config'
  import showColumnsTable from './showColumnsTable.vue'
  import alerts from '../../../mixins/alerts.mixins'
  import loadhastag from '../../../shared/components/load/loadHastag.vue'
  import ModalEdit from './modalEdit.vue'
  export default {
    components: { showColumnsTable, loadhastag, ModalEdit },
    data: () => ({
      headers: [],
      dados: [],
      search: '',
      editionTable: false,
      columnsEdition: [],
      loading: false,
      openEdit: false,
      dadosEdit: []
    }),
    mixins: [alerts],
    computed: {
      getHeaders() {
        let dados = this.dados[0]
        let arrDados = { ACOES: null, ...dados }

        if (!dados) return
        let headers = Object.keys(arrDados).map((dado, index) => {
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
      atualizarDados() {
        this.loadDadosTabela()
      },
      columnsConsider(e) {
        this.editionTable = e.edition
        this.columnsEdition = e.array
      },
      async deleteProduct(id) {
        let urlData = `${config.baseUrl}api/shared/smartsales/configuracao/delete_product/${id}`
        await this.$api.delete(urlData)
        this.dados = this.dados.filter(item => {
          //evitar recarregamento dos dados
          return item.ID != id
        })
      },
      actionButton(object, action) {
        if (action == 'edit') {
          this.openEdit = true
          this.dadosEdit = object
        } else if (action == 'delete') {
          this.swalConfirmation(() => {
            this.deleteProduct(object.ID)
          })
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
