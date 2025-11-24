<template>
  <!-- v-model="dialog" -->
  <v-dialog
    width="2100"
    persistent
    :model-value="dialog"
    @update:modelValue="val => $emit('update:dialog', val)"
  >
    <v-card class="rounded-xl">
      <v-row class="ma-0 pa-0">
        <v-col cols="6">
          <v-card elevation="0">
            <div style="display: flex; justify-content: space-between; align-items: center">
              <v-card-title>
                <span>
                  <i class="fa-solid fa-sliders mr-2" style="color: green"></i>
                  Gerenciar utilitários
                </span>
              </v-card-title>
              <div style="width: 350px">
                <v-text-field
                  hide-details=""
                  outlined
                  dense
                  placeholder="Pesquisar"
                  label="Pesquisar"
                  v-model="search"
                ></v-text-field>
              </div>
            </div>
            <v-card-subtitle class="mt-n4">
              Após as mudanças, basta clicar em finalizar
            </v-card-subtitle>
            <v-divider></v-divider>
            <v-col>
              <v-data-table
                dense
                class="text-no-wrap"
                item-key="ID"
                no-data-text="Não há informações"
                no-results-text="Nada encontrado :("
                :items="utilitariosEdit"
                :headers="getHeaders"
                :search="search"
                :item-class="getClass"
                hide-default-footer
                @click:row="editarInfo"
                :items-per-page="10"
                @page-count="pageCount = $event"
                v-model:page="page"
              >
                <template v-slot:item.EDITAR="{ item }">
                  <v-btn icon @click="editarInfo(item)">
                    <v-icon>fa-solid fa-pen-to-square</v-icon>
                  </v-btn>
                </template>
                <template v-slot:item.STATUS="{ item }">
                  <v-icon size="15" :color="item.STATUS == 1 ? 'green' : 'red'">
                    fa-solid fa-circle
                  </v-icon>
                </template>
              </v-data-table>
              <v-pagination
                v-model="page"
                :length="pageCount"
                circle
                color="teal lighten-2"
              ></v-pagination>
            </v-col>
          </v-card>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="6">
          <v-card elevation="0">
            <div style="display: flex; justify-content: space-between; align-items: center">
              <v-card-title style="width: 100%">
                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100% !important;
                  "
                >
                  <div>
                    <span>
                      <i class="fa-solid fa-pen-to-square mr-2" style="color: red"></i>
                      Editar
                      <span style="font-style: italic; color: #bdbdbd" v-if="itemSelecionado != ''">
                        (Você está editando {{ itemSelecionado.TIPO_GRUPO }}:
                        {{ itemSelecionado.TITLE }})
                      </span>
                    </span>
                  </div>
                  <div>
                    <v-btn icon @click="$emit('updated:close')">
                      <v-icon>fas fa-close</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-card-title>
            </div>
            <v-card-subtitle class="mt-n4">
              Após as mudanças, basta clicar em finalizar
            </v-card-subtitle>
            <v-divider></v-divider>
            <!-- <v-col>
              <v-card-title>Criar utilitários</v-card-title>
              <CriarUtilitario />
            </v-col> -->
            <v-col>
              <EditarUtilitarios :items="itemSelecionado" @update:reload="loadDataUtilitarios()" />
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script>
  import { UtilitariosService } from '@/data/services/tabuladores'
  import EditarUtilitarios from './EditarUtilitarios.vue'
  export default {
    components: { EditarUtilitarios },
    props: {
      dialog: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      utilitariosEdit: [],
      itemSelecionado: [],
      page: 1,
      pageCount: 0,
      search: null
    }),
    computed: {
      getHeaders() {
        let headers = [
          {
            text: 'EDITAR',
            value: 'EDITAR',
            class: 'teal lighten-2 white--text',
            align: 'center',
            sortable: false
          },
          {
            text: 'ID',
            value: 'ID',
            class: 'teal lighten-2 white--text',
            align: 'center',
            sortable: false
          },
          {
            text: 'Nome',
            value: 'TITLE',
            class: 'teal lighten-2 white--text',
            align: 'center',
            sortable: false
          },
          {
            text: 'Grupo',
            value: 'TIPO_GRUPO',
            class: 'teal lighten-2 white--text',
            align: 'center',
            sortable: false
          },
          {
            text: 'Status',
            value: 'STATUS',
            class: 'teal lighten-2 white--text',
            align: 'center',
            sortable: false
          }
        ]

        return headers
      }
    },
    methods: {
      getClass(item) {
        if (item.ID === this.itemSelecionado.ID) return 'red lighten-5 font-weight-bold'
      },
      editarInfo(item) {
        this.itemSelecionado = item
      },
      async loadDataUtilitarios() {
        const res = await UtilitariosService.listarUtilitarios()
        this.utilitariosEdit = res
      }
    },
    // async created() {
    //   await this.loadDataUtilitarios()
    // },
    watch: {
      dialog() {
        if (this.dialog) {
          this.loadDataUtilitarios()
        }
      }
      // dialog: function(newVal) {
      //   if (newVal) {
      //     this.loadData()
      //   }
      // }
    }
  }
</script>
