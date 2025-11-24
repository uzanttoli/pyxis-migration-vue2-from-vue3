<template>
  <v-card elevation="1" class="rounded-xl overflow-auto" max-height="600">
    <v-card-title class="grey--text d-flex justify-space-between">
      Alertas
      <div style="width: 250px">
        <v-text-field
          hide-details
          outlined
          dense
          placeholder="Pesquisar"
          label="Pesquisar"
          v-model="search"
        ></v-text-field>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <div class="my-3 mb-6" style="display: flex; justify-content: center; gap: 5px">
      <ItemsSelector
        :items="produtos"
        colorBorderField="#3333"
        colorTitleField="#343"
        title="Produto"
        v-model="produtoAtual"
        @change="handleChangeProduto"
      />
    </div>
    <v-col>
      <v-row>
        <div class="mx-4 mb-4" v-for="(item, i) in _listPopup" :key="i">
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-card
                width="150"
                hover
                @click="handleOpenEditPopup(item)"
                style="position: relative"
                v-bind="attrs"
                v-on="on"
              >
                <v-chip
                  x-small
                  :color="item.STATUS == 'True' ? 'green' : 'red'"
                  style="position: absolute; z-index: 1; top: 5px; right: 5px"
                  class="white--text"
                >
                  {{ `${item.STATUS == 'True' ? 'Habilitado' : 'Desabilitado'}` }}
                </v-chip>
                <v-img :src="item.ARQUIVO_POPUP" height="150"></v-img>
              </v-card>
            </template>
            <span>{{ item.TITULO }}</span>
          </v-tooltip>
        </div>
      </v-row>
    </v-col>

    <!-- :loading="loadingComponent" -->
    <EditPopupLab
      :openEditPopup="openEditPopup"
      :regionais="regionais"
      :rotas="rotas"
      @update:close="openEditPopup = !openEditPopup"
      :dadosEdit="dadosEdit"
    ></EditPopupLab>
    <v-col>
      <v-skeleton-loader type="card" width="160" v-if="loading"></v-skeleton-loader>
    </v-col>
  </v-card>
</template>

<script>
  import EditPopupLab from './EditPopupLab.vue'
  import { PopupLabService } from '@/data/services/Acoes'

  import ItemsSelector from '@/shared/components/ItemsSelector.vue'
  import Utils from '@/data/services/common/Utils'
  export default {
    components: { EditPopupLab, ItemsSelector },
    props: {
      regionais: {
        type: [Object, Array]
      },
      rotas: {
        type: [Object, Array]
      }
    },
    data: () => ({
      openEditPopup: false,
      listPopup: [],
      dadosEdit: [],
      produtos: [],
      loading: false,
      produtoAtual: null,
      search: null
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      _listPopup() {
        const dados = this.listPopup
        if (!dados) return
        let filtro = dados.filter(dado => {
          return (
            dado?.TITULO.toLowerCase().indexOf(this.search?.toLowerCase()) > -1 ||
            dado?.ID_POPUP.toLowerCase().indexOf(this.search?.toLowerCase()) > -1
          )
        })
        return this.search ? filtro : dados
      }
    },
    methods: {
      handleChangeProduto() {
        this.loadDadosPopup()
      },
      async loadDataService() {
        const produtos = await Utils.getProductAvailable(
          'POPUPLAB',
          this.usuario.filtro,
          this.usuario.almope
        )
        if (produtos.length == 0) {
          this.produtos.push({
            text: this.usuario.produto,
            value: this.usuario.produto
          })
        } else {
          this.produtos = produtos.map(item => {
            return {
              text: item.text,
              value: item.text
            }
          })
        }
      },
      handleOpenEditPopup(item) {
        this.openEditPopup = true
        this.dadosEdit = item
      },
      async loadDadosPopup() {
        try {
          this.loading = true
          const result = await PopupLabService.getListarTodosPopups(
            this.produtoAtual,
            this.usuario.filtro
          )
          this.listPopup = result
          this.loading = false
        } catch (error) {
          console.error('Erro ao carregar dados.', error)
          this.loading = false
        }
      }
    },
    async created() {
      await this.loadDataService()
      await this.loadDadosPopup()
    }
  }
</script>

<style></style>
