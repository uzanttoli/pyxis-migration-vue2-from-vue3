<template>
  <v-expansion-panels v-model="panel" multiple class="pa-4">
    <v-expansion-panel>
      <v-expansion-panel-header>
        <v-toolbar-title>Rotas</v-toolbar-title>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-data-table
          v-model="selected"
          :search="search"
          :headers="headers"
          :items="data"
          show-select
          class="ma-4 striped"
          :footer-props="footerProps"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-text-field v-model="search" label="Buscar"></v-text-field>
              <v-spacer></v-spacer>
              <v-btn color="success" dark @click="openAddDialog">
                <span>Adicionar</span>
              </v-btn>
              <adicionar-rota
                v-model="dialog"
                :rota="editedItem"
                @create:rota="save"
                @update:rota="update"
              />

              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5">Deletar Rota?</v-card-title>
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
              <a :href="item.route">{{ item.label }}</a>
            </div>
          </template>

          <template v-slot:item.icon="{ item }">
            <v-icon>{{ item.icon }}</v-icon>
          </template>

          <template v-slot:item.showInMenu="{ item }">
            <v-icon :color="item.showInMenu ? 'green' : 'red'">mdi mdi-monitor-dashboard</v-icon>
          </template>

          <template v-slot:item.actions="{ item }">
            <div>
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
              <v-icon @click="openPermissionsDialog(item)" color="purple" title="Permissões">
                mdi-security
              </v-icon>
            </div>
          </template>

          <template v-slot:no-data>
            <v-alert type="info" class="mt-3" :value="true">Não há rotas cadastradas!</v-alert>
            <v-btn color="primary" @click="initialize">Resetar</v-btn>
          </template>
        </v-data-table>

        <detalhes-rota-dialog
          v-if="dialogPermission"
          v-model="dialogPermission"
          :rota="editedItem"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
  import adicionarRota from './adicionarRota.vue'
  import detalhesRotaDialog from './detalhes/detalhesRota.vue'
  import MenuItemRotaService from '@/data/services/menu/MenuItemRotaService'
  import footerProps from '@/utils/DatatableFooterProps'

  export default {
    name: 'Rotas',
    components: { adicionarRota, detalhesRotaDialog },
    data() {
      return {
        dialog: false,
        dialogDelete: false,
        dialogPermission: false,
        search: '',
        panel: [0],
        headers: [
          { text: 'Agrupamento', value: 'agrupamentoLabel', align: 'center' },
          { text: 'Descrição', align: 'start', value: 'label' },
          { text: 'Rota', value: 'route', align: 'left' },
          { text: 'Ícone', value: 'icon', align: 'center', sortable: false },
          { text: 'Exibir no Menu', value: 'showInMenu', align: 'center' },
          { text: 'Ordem', value: 'rowOrder', align: 'left' },
          { text: 'Actions', value: 'actions', align: 'end', sortable: false }
        ],
        data: [],
        selected: [],
        footerProps: footerProps,
        editedIndex: -1,
        editedItem: {
          id: null,
          label: '',
          icon: '',
          route: '',
          agrupamentoId: null,
          agrupamentoLabel: '',
          showInMenu: true,
          rowOrder: null,
          status: false
        },
        defaultItem: {
          label: '',
          icon: '',
          rowOrder: -1
        }
      }
    },
    methods: {
      async initialize() {
        const resp = await MenuItemRotaService.getAll()
        this.data = resp
      },
      editItem(item) {
        this.editedIndex = this.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      openPermissionsDialog(item) {
        this.editedIndex = this.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogPermission = true
      },
      deleteItem(item) {
        this.editedIndex = this.data.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      async deleteItemConfirm() {
        await MenuItemRotaService.delete(this.editedItem.id)
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
      async toggleStatus(item) {
        await MenuItemRotaService.ToggleStatus(item.id)
        await this.initialize()
      },
      async save(data) {
        await MenuItemRotaService.create(data)
        this.initialize()
        this.close()
      },
      async update(data) {
        await MenuItemRotaService.update(data.id, data)
        this.close()
      },
      close() {
        this.dialog = false
        this.editedItem = null
        this.initialize()
      },
      openAddDialog() {
        this.editedItem = null
        this.dialog = true
      }
    },
    async mounted() {
      await this.initialize()
    }
  }
</script>
