<template>
  <v-expansion-panels v-model="panel" multiple class="pa-4">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <v-toolbar-title>Agrupamentos</v-toolbar-title>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-data-table
          :search="search"
          :headers="headers"
          :items="data"
          class="ma-4"
          :footer-props="footerProps"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-text-field v-model="search" label="Buscar"></v-text-field>
              <v-spacer></v-spacer>
              <v-btn color="success" dark @click="openAddAgrupamento()">
                <span>Adicionar</span>
              </v-btn>
              <adicionar-agrupamento
                v-model="dialog"
                :agrupamento="editedItem"
                @create:agrupamento="save"
                @update:agrupamento="update"
              />

              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5">Deletar Agrupamento?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>

          <template v-slot:item.label="{ item }">
            <div>
              {{ item.label }}
            </div>
          </template>

          <template v-slot:item.icon="{ item }">
            <v-icon>{{ item.icon }}</v-icon>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon class="mr-2" @click="editItem(item)" color="info" title="Editar">
              mdi-pencil
            </v-icon>
            <v-icon
              @click="toggleStatus(item)"
              :color="item.status ? 'green' : 'red'"
              title="Desativar"
            >
              mdi-power-standby
            </v-icon>
            <v-icon @click="deleteItem(item)" color="red" title="Remover">mdi-delete</v-icon>
          </template>

          <template v-slot:no-data>
            <v-alert type="info" class="mt-3" :value="true">
              Não há agrupamentos cadastrados!
            </v-alert>
            <v-btn color="primary" @click="initialize">Resetar</v-btn>
          </template>
        </v-data-table>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
  import adicionarAgrupamento from './adicionarAgrupamento.vue'
  import MenuItemAgrupamentoService from '@/data/services/menu/MenuItemAgrupamentoService'

  export default {
    name: 'Agrupamentos',
    components: { adicionarAgrupamento },
    data() {
      return {
        dialog: false,
        search: '',
        panel: [0],
        headers: [
          { text: 'Descrição', align: 'start', value: 'label' },
          { text: 'Ícone', value: 'icon', align: 'center', sortable: false },
          { text: 'Ordem', value: 'rowOrder', align: 'center', sortable: true },
          { text: 'Actions', value: 'actions', align: 'end', sortable: false }
        ],
        data: [],
        footerProps: {
          itemsPerPageText: 'Itens por página:',
          pageText: '{0}-{1} de {2}',
          perPageText: 'Itens por página:'
        },
        dialogDelete: false,
        editedIndex: -1,
        editedItem: null,
        defaultItem: {
          label: '',
          icon: '',
          rowOrder: -1
        }
      }
    },
    methods: {
      async initialize() {
        const resp = await MenuItemAgrupamentoService.getAll()
        this.data = resp
      },
      openAddAgrupamento() {
        this.editedIndex = null
        this.editedItem = null
        this.dialog = true
      },
      editItem(item) {
        this.editedIndex = this.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem(item) {
        this.editedIndex = this.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      async toggleStatus(item) {
        await MenuItemAgrupamentoService.ToggleStatus(item.id)
        await this.initialize()
      },
      async deleteItemConfirm() {
        await MenuItemAgrupamentoService.delete(this.editedItem.id)
        await this.initialize()
        this.closeDelete()
      },
      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      async save(data) {
        await MenuItemAgrupamentoService.create(data)
        this.initialize()
        this.close()
      },
      async update(data) {
        await MenuItemAgrupamentoService.update(data.id, data)
        this.close()
      },
      close() {
        this.dialog = false
        this.initialize()
      }
    },
    async mounted() {
      await this.initialize()
    }
  }
</script>
