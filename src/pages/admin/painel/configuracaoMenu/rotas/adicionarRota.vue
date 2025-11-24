<template>
  <v-dialog v-model="dialog" max-width="1200px">
    <v-card class="mt-2" elevation="1">
      <v-card-title class="align-start">
        <span>Menu - {{ isEditMode ? 'Editar' : 'Criar' }} Rota</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <form @submit.prevent="submitForm">
          <v-row class="mt-5 pl-5">
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                outlined
                dense
                label="Insira uma descrição"
                v-model="form.label"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-autocomplete
                v-model="form.agrupamentoId"
                :items="agrupamentos"
                no-data-text="Nenhum agrupamento encontrado"
                chips
                outlined
                dense
                deletable-chips
                color="blue-grey lighten-2"
                label="Agrupamento"
                item-value="id"
                item-text="label"
              />
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-text-field
                outlined
                dense
                label="Rota"
                v-model="form.route"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-text-field
                type="number"
                outlined
                dense
                label="Ordem"
                v-model="form.rowOrder"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="6">
              <v-text-field
                outlined
                dense
                label="Busque um ícone..."
                id="icon-search"
                v-model="iconSearch"
                @input="filterIcons"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="6">
              <v-switch v-model="form.showInMenu" label="Visível no Menu?" inset class="ml-8" />
            </v-col>

            <v-row class="justify-end mt-4 pr-5">
              <v-btn color="blue darken-1" text type="submit">
                {{ isEditMode ? 'Atualizar' : 'Salvar' }}
              </v-btn>
            </v-row>
          </v-row>

          <v-row>
            <v-col cols="12">
              <div class="icon-grid">
                <div
                  v-for="icon in filteredIcons"
                  :key="icon"
                  class="icon-item"
                  :class="{ selected: form.icon === icon }"
                  @click="selectIcon(icon)"
                >
                  <i :class="icon" class="icon-preview"></i>
                  <span class="icon-name">{{ icon }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import { icons } from '../icons'
  import MenuItemAgrupamentoService from '@/data/services/menu/MenuItemAgrupamentoService'
  import PerfilAcessoService from '@/data/services/acessoPerfil/PerfilAcessoService'

  export default {
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
        form: {
          label: '',
          icon: '',
          route: '',
          agrupamento: null,
          rowOrder: null,
          showInMenu: true
        },
        agrupamentos: [],
        iconSearch: '',
        icons: icons,
        filteredIcons: []
      }
    },
    methods: {
      filterIcons() {
        const search = this.iconSearch.toLowerCase()
        this.filteredIcons = this.icons.filter(icon => icon.toLowerCase().includes(search))
      },
      selectIcon(icon) {
        this.form.icon = icon
      },
      submitForm() {
        if (this.isEditMode) {
          this.$emit('update:rota', this.form)
        } else {
          this.$emit('create:rota', this.form)
        }
      },
      resetForm() {
        this.form = {
          label: '',
          icon: '',
          route: '',
          agrupamento: null,
          rowOrder: null,
          showInMenu: true
        }
        this.formPermission = {
          agrupamento: '',
          produto: '',
          filtro: '',
          regional: '',
          almope: ''
        }
        this.iconSearch = ''
        this.filteredIcons = this.icons
      }
    },
    computed: {
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
      this.agrupamentos = await MenuItemAgrupamentoService.getAll()
      const acessoPerfil = await PerfilAcessoService.getAll()
      this.listaAgrupamentos = acessoPerfil.agrupamentos
      this.listaFiltros = acessoPerfil.filtros
      this.listaProdutos = acessoPerfil.produtos
      this.listaRegionais = acessoPerfil.regionais
      this.isLoading = false
    }
  }
</script>

<style>
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
    margin-top: 10px;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
    text-align: center;
  }

  .icon-item.selected {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
    transform: scale(1.1);
  }

  .icon-item:hover {
    background-color: #86bffc;
  }

  .icon-preview {
    font-size: 24px;
    margin-bottom: 5px;
  }

  .icon-name {
    font-size: 12px;
    color: #555;
    word-break: break-word;
  }

  .icon-item.selected .icon-name {
    color: white;
  }
</style>
