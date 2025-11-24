<template>
  <v-row>
    <v-col>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="campanhas"
        :loading="isLoading"
        :footer-props="footerProps"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field v-model="search" label="Buscar"></v-text-field>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-row>
            <v-icon class="mr-2" @click="editarCampanha(item)" color="info" title="Editar">
              mdi-pencil
            </v-icon>
            <v-icon @click="deletarCampanha(item)" color="red" title="Remover">mdi-delete</v-icon>
          </v-row>
        </template>

        <template v-slot:item.campanha="{ item }">
          <span class="no-wrap-column">{{ item.campanha }}</span>
        </template>

        <template v-slot:item.tipoCampanha="{ item }">
          <span class="no-wrap-column">{{ item.tipoCampanha }}</span>
        </template>

        <template v-slot:item.operacao="{ item }">
          <span class="no-wrap-column">{{ item.operacao }}</span>
        </template>

        <template v-slot:item.produtoOrg="{ item }">
          <span class="no-wrap-column">{{ item.produtoOrg }}</span>
        </template>

        <template v-slot:item.produtoPortal="{ item }">
          <span class="no-wrap-column">{{ item.produtoPortal }}</span>
        </template>

        <template v-slot:item.produtoMis="{ item }">
          <span class="no-wrap-column">{{ item.produtoMis }}</span>
        </template>

        <template v-slot:item.agrupamento="{ item }">
          <span class="no-wrap-column">{{ item.agrupamento }}</span>
        </template>

        <template v-slot:item.segmento="{ item }">
          <span class="no-wrap-column">{{ item.segmento }}</span>
        </template>
        <template v-slot:item.habilitadoCampanha="{ item }">
          <v-icon small :color="item.habilitadoCampanha ? 'green' : 'red'">mdi-circle</v-icon>
        </template>
        <template v-slot:item.habilitadoPortal="{ item }">
          <v-icon small :color="item.habilitadoPortal ? 'green' : 'red'">mdi-circle</v-icon>
        </template>
        <template v-slot:item.habilitadoMapeamento="{ item }">
          <v-icon small :color="item.habilitadoMapeamento ? 'green' : 'red'">mdi-circle</v-icon>
        </template>
        <template v-slot:item.habilitadoWorkflow="{ item }">
          <v-icon small :color="item.habilitadoWorkflow ? 'green' : 'red'">mdi-circle</v-icon>
        </template>
        <template v-slot:item.habilitadoSegmento="{ item }">
          <v-icon small :color="item.habilitadoSegmento ? 'green' : 'red'">mdi-circle</v-icon>
        </template>
        <template v-slot:item.habilitadoPesqSatisfacao="{ item }">
          <v-icon small :color="item.habilitadoPesqSatisfacao ? 'green' : 'red'">mdi-circle</v-icon>
        </template>
        <template v-slot:item.habilitadoWorkflowBko="{ item }">
          <v-icon small :color="item.habilitadoWorkflowBko ? 'green' : 'red'">mdi-circle</v-icon>
        </template>
      </v-data-table>
      <v-dialog v-model="showForm" max-width="900px">
        <v-card>
          <v-col>
            <adicionar-campanha
              v-if="showForm"
              :edit-item="editItem"
              :is-edit-mode="isEditMode"
              @saved="onSaved"
              @cancel="onCancel"
            />
          </v-col>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
  import footerProps from '@/utils/DatatableFooterProps'
  import adicionarCampanha from './adicionarCampanha.vue'
  import configuracaoCampanha from '@/data/services/configuracaoCampanha/ConfiguracaoCampanhaService'

  export default {
    components: { adicionarCampanha },
    props: {
      campanhas: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        isLoading: false,
        search: '',
        showForm: false,
        isEditMode: false,
        editItem: null,
        headers: [
          { text: 'Actions', value: 'actions', align: 'center', sortable: false },
          { text: 'ID', align: 'right', value: 'id' },
          { text: 'Campanha', align: 'left', value: 'campanha', class: 'text-no-wrap' },
          { text: 'Tipo Campanha', align: 'center', value: 'tipoCampanha', class: 'text-no-wrap' },
          { text: 'Produto Org', align: 'center', value: 'produtoOrg' },
          { text: 'Produto Portal', align: 'center', value: 'produtoPortal' },
          { text: 'Produto Mis', align: 'center', value: 'produtoMis' },
          { text: 'Operação', align: 'start', value: 'operacao' },
          { text: 'Agrupamento', align: 'start', value: 'agrupamento', class: 'text-no-wrap' },
          { text: 'Segmento', align: 'start', value: 'segmento', class: 'text-no-wrap' },
          { text: 'Skill', align: 'start', value: 'skill' },
          { text: 'Habilitado Campanha', align: 'start', value: 'habilitadoCampanha' },
          { text: 'Habilitado Portal', align: 'start', value: 'habilitadoPortal' },
          { text: 'Habilitado Mapeamento', align: 'start', value: 'habilitadoMapeamento' },
          { text: 'Habilitado Workflow', align: 'start', value: 'habilitadoWorkflow' },
          { text: 'Habilitado Segmento', align: 'start', value: 'habilitadoSegmento' },
          { text: 'Habilitado Pesq Satisfacao', align: 'start', value: 'habilitadoPesqSatisfacao' },
          { text: 'Habilitado Workflow BKO', align: 'start', value: 'habilitadoWorkflowBko' }
        ],
        items: [],
        footerProps: footerProps
      }
    },
    methods: {
      editarCampanha(item) {
        this.editItem = { ...item }
        this.isEditMode = true
        this.showForm = true
      },
      async deletarCampanha(item) {
        if (confirm('Deseja realmente excluir esta campanha?')) {
          this.isLoading = true
          await configuracaoCampanha.delete(item.id)
          this.$emit('refresh')
          this.isLoading = false
        }
      },
      onSaved() {
        this.showForm = false
        this.editItem = null
        this.isEditMode = false
        this.$emit('refresh')
      },
      onCancel() {
        this.showForm = false
        this.editItem = null
        this.isEditMode = false
      }
    }
  }
</script>

<style scoped>
  .no-wrap-column {
    white-space: nowrap !important;
  }
</style>
