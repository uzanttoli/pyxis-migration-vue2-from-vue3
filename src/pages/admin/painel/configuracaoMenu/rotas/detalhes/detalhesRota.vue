<template>
  <v-dialog v-model="dialog" max-width="1200px">
    <v-card class="mt-2" elevation="1">
      <v-card-title class="align-start">
        <span>Permissões de Rota</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <legend class="mt-5">
          <v-icon class="mr-2" color="purple">mdi-routes</v-icon>
          {{ rota.agrupamentoLabel }} /
          <strong>{{ rota.label }}</strong>
        </legend>

        <v-tabs v-model="tab" grow color="primary">
          <v-tab>
            <v-icon color="purple" class="mr-2">mdi-security</v-icon>
            Permissões
          </v-tab>
          <v-tab>
            <v-icon color="red" class="mr-2">mdi-account-cancel</v-icon>
            Bloqueios
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>
            <form @submit.prevent="submitForm">
              <v-row class="mt-5 mb-5 pl-5">
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="formPermission.produto"
                    :disabled="isLoading"
                    :items="listaProdutos"
                    :loading="isLoading"
                    no-data-text="Nenhum produto encontrado"
                    chips
                    multiple
                    deletable-chips
                    color="blue-grey lighten-2"
                    label="Produtos"
                    clearable
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index === 0" small>{{ item }}</v-chip>
                      <span v-if="index === 1" class="grey--text text-caption">
                        (+{{ formPermission.produto.length - 1 }}
                        outros)
                      </span>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="formPermission.filtro"
                    :disabled="isLoading"
                    :items="listaFiltros"
                    :loading="isLoading"
                    no-data-text="Nenhum filtro encontrado"
                    chips
                    multiple
                    deletable-chips
                    color="blue-grey lighten-2"
                    label="Filtros"
                    item-text="name"
                    item-value="name"
                    clearable
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index === 0" small>{{ item }}</v-chip>
                      <span v-if="index === 1" class="grey--text text-caption">
                        (+{{ formPermission.filtro.length - 1 }}
                        outros)
                      </span>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="formPermission.agrupamento"
                    :disabled="isLoading"
                    :items="listaAgrupamentos"
                    :loading="isLoading"
                    no-data-text="Nenhum agrupamento encontrado"
                    chips
                    multiple
                    color="blue-grey lighten-2"
                    label="Agrupamentos"
                    item-text="name"
                    item-value="name"
                    clearable
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index === 0" small>{{ item }}</v-chip>
                      <span v-if="index === 1" class="grey--text text-caption">
                        (+{{ formPermission.agrupamento.length - 1 }}
                        outros)
                      </span>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-autocomplete
                    v-model="formPermission.regional"
                    :disabled="isLoading"
                    :items="listaRegionais"
                    :loading="isLoading"
                    no-data-text="Nenhuma regional encontrada"
                    chips
                    multiple
                    deletable-chips
                    color="blue-grey lighten-2"
                    label="Regionais"
                    item-text="name"
                    item-value="name"
                    clearable
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index === 0" small>{{ item }}</v-chip>
                      <span v-if="index === 1" class="grey--text text-caption">
                        (+{{ formPermission.regional.length - 1 }}
                        outros)
                      </span>
                    </template>
                  </v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Almope"
                    v-model="formPermission.almope"
                    :loading="isLoading"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateRangeText"
                        label="Período"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="dates" range @change="dateMenu = false"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row class="justify-end mt-4 pr-5">
                <v-btn outlined color="primary" text type="submit">Salvar</v-btn>
              </v-row>
              <v-row>
                <v-col>
                  <v-data-table
                    :search="searchPermission"
                    :headers="headers"
                    :items="listaPermissoes"
                    :loading="isLoading"
                    class="ma-4 striped"
                    :footer-props="footerProps"
                  >
                    <template v-slot:top>
                      <v-toolbar flat>
                        <v-text-field v-model="searchPermission" label="Buscar"></v-text-field>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                      <v-icon @click="deleteItem(item)" color="red">mdi-delete</v-icon>
                    </template>

                    <template v-slot:item.inicio="{ item }">
                      {{ formatDate(item.inicio) }}
                    </template>
                    <template v-slot:item.fim="{ item }">
                      {{ formatDate(item.fim) }}
                    </template>

                    <template v-slot:no-data>
                      <v-alert type="info" class="mt-3" :value="true">
                        Não há permissões cadastradas!
                      </v-alert>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </form>
          </v-tab-item>
          <v-tab-item>
            <form @submit.prevent="submitFormExclusao">
              <v-row class="mt-5 mb-5 pl-5">
                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    label="Almope"
                    v-model="formExclusao.almope"
                    :loading="isLoading"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="justify-end mt-4 pr-5">
                <v-btn outlined color="primary" text type="submit">Salvar</v-btn>
              </v-row>
              <v-row>
                <v-col>
                  <v-data-table
                    :search="searchExclude"
                    :headers="headersExclusoes"
                    :items="exclusoes"
                    :loading="isLoading"
                    class="ma-4 striped"
                    :footer-props="footerProps"
                  >
                    <template v-slot:top>
                      <v-toolbar flat>
                        <v-text-field v-model="searchExclude" label="Buscar"></v-text-field>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                    </template>
                    <template v-slot:item.actions="{ item }">
                      <v-icon @click="deleteExclusao(item)" color="red">mdi-delete</v-icon>
                    </template>

                    <template v-slot:no-data>
                      <v-alert type="info" class="mt-3" :value="true">
                        Não há exclusões cadastradas!
                      </v-alert>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </form>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">Deletar Permissão?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDeleteExclusao" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">Remover da Exclusão?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDeleteExclusao">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="deleteExclusaoConfirm">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script>
  import PerfilAcessoService from '@/data/services/acessoPerfil/PerfilAcessoService'
  import RegionalAlvoService from '@/data/services/regional/RegionalAlvoService'
  import MenuItemPermissoesService from '@/data/services/menu/MenuItemPermissoesService'
  import MenuExclusoesService from '@/data/services/menu/MenuItemExclusoesService'
  import footerProps from '@/utils/DatatableFooterProps'

  export default {
    name: 'DetalhesRotaDialog',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      rota: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        isLoading: false,
        dateMenu: false,
        dialogDelete: false,
        dialogDeleteExclusao: false,
        editedIndex: -1,
        editedItem: null,
        searchPermission: '',
        searchExclude: '',
        tab: 0,
        tabs: [],
        formExclusao: {
          almope: null,
          MenuItemRotasId: this.rota.id
        },
        formPermission: {
          menuItemRotasId: this.rota.id,
          agrupamento: null,
          produto: null,
          filtro: null,
          regional: null,
          almope: null,
          inicio: null,
          fim: null
        },
        headers: [
          { text: 'Produto', align: 'start', value: 'produto' },
          { text: 'Filtro', align: 'start', value: 'filtro' },
          { text: 'Agrupamento', align: 'start', value: 'agrupamento' },
          { text: 'Regional', align: 'start', value: 'regional' },
          { text: 'Almope', align: 'start', value: 'almope' },
          { text: 'Início', align: 'start', value: 'inicio' },
          { text: 'Fim', align: 'start', value: 'fim' },
          { text: 'Actions', value: 'actions', align: 'end', sortable: false }
        ],
        headersExclusoes: [
          { text: 'Almope', align: 'start', value: 'AlmopesExcluidos' },
          { text: 'Nome', align: 'start', value: 'nome' },
          { text: 'Regional', align: 'start', value: 'regional' },
          { text: 'Superior 1', align: 'start', value: 'superior1' },
          { text: 'Superior 2', align: 'start', value: 'superior2' },
          { text: 'Superior 3', align: 'start', value: 'superior3' },
          { text: 'Actions', value: 'actions', align: 'end', sortable: false }
        ],
        dates: [],
        exclusoes: [],
        footerProps: footerProps,
        listaPermissoes: [],
        listaProdutos: [],
        listaAgrupamentos: [],
        listaFiltros: [],
        listaRegionais: []
      }
    },
    methods: {
      async submitForm() {
        this.formPermission.inicio = this.dates[0]
        this.formPermission.fim = this.dates[1]

        const resp = await MenuItemPermissoesService.create(this.formPermission)
        this.initializeData()
        return resp
      },
      async initializeData() {
        this.resetForm()
        const agrupamentos = await RegionalAlvoService.getAll()
        this.listaRegionais = agrupamentos.map(agr => agr.regional)
        const menuPermissoes = await MenuItemPermissoesService.getById(this.rota.id)
        this.listaPermissoes = menuPermissoes

        const exclusoesResp = await MenuExclusoesService.getByRotaId(this.rota.id)
        this.exclusoes = exclusoesResp
      },
      formatDate(date) {
        if (!date) return ''
        return new Date(date).toLocaleDateString('pt-BR')
      },
      deleteItem(item) {
        this.editedIndex = this.listaPermissoes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      async deleteItemConfirm() {
        await MenuItemPermissoesService.delete(this.editedItem.id)
        await this.initializeData()
        this.closeDelete()
      },
      closeDelete() {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      // EXCLUSÃO
      async submitFormExclusao() {
        this.formExclusao.AlmopesExcluidos = this.formExclusao.almope
        const resp = await MenuExclusoesService.create(this.formExclusao)
        this.initializeData()
        return resp
      },
      deleteExclusao(item) {
        this.editedIndex = this.exclusoes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDeleteExclusao = true
      },
      async deleteExclusaoConfirm() {
        await MenuExclusoesService.delete(this.editedItem.id)
        await this.initializeData()
        this.closeDeleteExclusao()
      },
      closeDeleteExclusao() {
        this.dialogDeleteExclusao = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      resetForm() {
        this.formPermission = {
          menuItemRotasId: this.rota.id,
          agrupamento: null,
          produto: null,
          filtro: null,
          regional: null,
          almope: null,
          inicio: null,
          fim: null
        }
      }
    },
    computed: {
      dateRangeText() {
        if (!this.dates || this.dates.length === 0) return ''
        const format = d => (d ? new Date(d).toLocaleDateString('pt-BR') : '')
        if (this.dates.length === 2) {
          return `${format(this.dates[0])} ~ ${format(this.dates[1])}`
        }
        return format(this.dates[0])
      },
      produtosCadastrados() {
        // Retorna produtos únicos já cadastrados em listaPermissoes
        const produtos = this.listaPermissoes.map(p => p.produto).filter(p => !!p)
        return [...new Set(produtos)].map(produto => ({ produto }))
      },
      produtosDisponiveis() {
        const cadastrados = this.listaPermissoes
          .map(p => (p.produto ? String(p.produto).trim() : ''))
          .filter(p => !!p)
        return this.listaProdutos.filter(prod => !cadastrados.includes(String(prod).trim()))
      },
      filtrosDisponiveis() {
        const cadastrados = this.listaPermissoes
          .map(p => (p.filtro ? String(p.filtro).trim() : ''))
          .filter(p => !!p)
        return this.listaFiltros.filter(filtro => !cadastrados.includes(String(filtro.name).trim()))
      },
      agrupamentosDisponiveis() {
        const cadastrados = this.listaPermissoes
          .map(p => (p.agrupamento ? String(p.agrupamento).trim() : ''))
          .filter(p => !!p)
        return this.listaAgrupamentos.filter(
          agrup => !cadastrados.includes(String(agrup.name).trim())
        )
      },
      regionaisDisponiveis() {
        const cadastrados = this.listaPermissoes
          .map(p => (p.regional ? String(p.regional).trim() : ''))
          .filter(p => !!p)
        return this.listaRegionais.filter(reg => !cadastrados.includes(String(reg.name).trim()))
      },

      dialog: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      },
      isEditMode() {
        return !!this.rota
      }
    },
    watch: {
      dialog(val) {
        if (val) {
          if (this.isEditMode) {
            this.form = { ...this.rota }
          } else {
            this.resetForm()
          }
        }
      }
    },
    async mounted() {
      this.isLoading = true
      this.filteredIcons = this.icons

      this.initializeData()

      const acessoPerfil = await PerfilAcessoService.getAll()
      this.listaAgrupamentos = acessoPerfil.agrupamentos
      this.listaFiltros = acessoPerfil.filtros
      this.listaProdutos = acessoPerfil.produtos
      //this.listaRegionais = acessoPerfil.regionais;

      this.isLoading = false
    }
  }
</script>

<style>
  .striped tbody tr:nth-of-type(even) {
    background-color: rgba(236, 237, 237);
  }

  .striped tbody tr:nth-of-type(odd) {
    background-color: rgb(250, 250, 250);
  }

  .striped .v-data-table-header {
    background-color: rgba(182, 183, 187);
    color: white;
  }

  .striped .v-data-footer {
    background-color: rgb(250, 250, 250);
  }

  .striped .theme--light.v-data-table thead tr th {
    color: white;
  }
</style>
