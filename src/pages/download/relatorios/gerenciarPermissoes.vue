<template>
  <div class="container-criar-relatorio">
    <div class="section-criar-relatorio" id="section-criar-relatorio">
      <h2 style="color: #575757">
        <v-icon color="green" class="mr-2">fa-solid fa-sliders</v-icon>
        Gerenciar relátorio
      </h2>
      <v-divider></v-divider>
      <v-row>
        <div class="pa-2 mt-3" style="display: flex; justify-content: center; gap: 5px">
          <ItemsSelector
            :items="produtos"
            colorBorderField="#3333"
            colorTitleField="#343"
            title="Produto"
            v-model="produtoAtual"
            @change="handleChangeProduto"
            :loading="loadingComponent"
          />
        </div>
        <v-col cols="12" class="mt-3">
          <v-text-field
            v-model="search"
            label="Pesquisar"
            placeholder="Pesquisar"
            outlined
            dense
            :persistent-placeholder="true"
          ></v-text-field>
          <v-data-table
            :headers="getHeaders"
            :items="dadosBase"
            dense
            :search="search"
            class="text-no-wrap"
            item-key="ID"
            :loading="loading"
            no-results-text="Nada encontrado!"
            no-data-text="Não há informações"
            :footer-props="footerProps"
          >
            <template v-slot:item.ACOES="{ item }">
              <v-btn icon @click="editarDados(item)">
                <v-icon size="19" color="orange">fa-solid fa-pen-to-square</v-icon>
              </v-btn>
            </template>
            <template v-slot:item.STATUS="{ item }">
              <v-icon :color="item.STATUS == 1 ? 'green' : 'red'" size="15">fas fa-circle</v-icon>
            </template>
            <template v-slot:item.LIBERACAO_ALMOPE="{ item }">
              <v-tooltip top v-if="item.LIBERACAO_ALMOPE != '-'">
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    color="green"
                    class="white--text"
                    label
                    small
                    v-bind="attrs"
                    v-on="on"
                    style="margin-right: 2px"
                    v-for="(almope, i) in item.LIBERACAO_ALMOPE.split(',').map(almope =>
                      almope.trim()
                    )"
                    :key="almope"
                    @mouseover="getAlmopesName(item.LIBERACAO_ALMOPE)"
                  >
                    <v-icon size="19" color="white" class="mr-2" v-if="i == 0">
                      fa-solid fa-check
                    </v-icon>
                    <v-divider vertical class="mr-1 ml-1" color="white" v-if="i == 0"></v-divider>
                    {{ almope }}
                  </v-chip>
                </template>
                <span v-html="transformTooltipCache(item.LIBERACAO_ALMOPE)"></span>
              </v-tooltip>
              <span v-else>-</span>
            </template>
            <template v-slot:item.RESTRICAO_ALMOPE="{ item }">
              <v-tooltip top v-if="item.RESTRICAO_ALMOPE != '-'">
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    color="red"
                    class="white--text"
                    label
                    small
                    v-bind="attrs"
                    v-on="on"
                    style="margin-right: 2px"
                    @mouseover="getAlmopesName(item.RESTRICAO_ALMOPE)"
                    v-for="(almope, i) in item.RESTRICAO_ALMOPE.split(',').map(almope =>
                      almope.trim()
                    )"
                    :key="almope"
                  >
                    <v-icon size="19" color="white" class="mr-2" v-if="i == 0">
                      fa-solid fa-ban
                    </v-icon>
                    <v-divider vertical class="mr-1 ml-1" color="white" v-if="i == 0"></v-divider>
                    {{ almope }}
                  </v-chip>
                </template>
                <span v-html="transformTooltipCache(item.RESTRICAO_ALMOPE)"></span>
              </v-tooltip>
              <span v-else>-</span>
            </template>
            <template v-slot:item.PERFIL_LIBERACAO="{ item }">
              <v-chip
                color="blue"
                class="white--text"
                label
                small
                style="margin-right: 2px"
                v-for="perfil in item.PERFIL_LIBERACAO.split(',').map(perfil => perfil.trim())"
                :key="perfil"
              >
                {{ perfil }}
              </v-chip>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </div>
    <ModalEditRelatorio
      :dadosDataTableSelecionado="dadosDataTableSelecionado"
      :modalEdit="modalEdit"
      @update:dadosAtualizados="getRelatorios(produtoAtual)"
      @update:closeEdit="modalEdit = false"
    />
  </div>
</template>

<script>
  import Utils from '@/data/services/common/Utils'
  import { GerenciarRelatoriosService } from '@/data/services/portalCco'
  import ItemsSelector from '@/shared/components/ItemsSelector.vue'
  import ModalEditRelatorio from './modalEditRelatorio.vue'
  export default {
    name: 'GerenciarPermissoes',
    components: { ItemsSelector, ModalEditRelatorio },
    data: () => ({
      loading: false,
      dadosBase: [],
      search: null,
      produtoAtual: null,
      modalEdit: false,
      produtos: [],
      dadosDataTableSelecionado: [],
      loadingComponent: false,
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      },
      tooltipCache: {}
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      getHeaders() {
        let dados = this.dadosBase && this.dadosBase[0]
        if (dados) {
          let headers = Object.keys(dados).map(key => {
            return {
              text: key,
              value: key,
              align: 'center',
              sortable: false,
              class: 'teal lighten-3'
            }
          })
          headers.unshift({
            text: 'Ações',
            value: 'ACOES',
            align: 'center',
            sortable: false,
            class: 'teal lighten-3'
          })

          return headers
        }

        return []
      }
    },
    methods: {
      transformTooltipCache(liberacaoId) {
        const cacheValue = this.tooltipCache[liberacaoId]
        if (Array.isArray(cacheValue)) {
          return cacheValue.map(dados => dados.nome || dados).join(' ')
        }

        return cacheValue || ''
      },
      async getAlmopesName(liberacaoId) {
        if (this.tooltipCache[liberacaoId]) {
          return
        }
        this.$set(this.tooltipCache, liberacaoId, 'Carregando...')

        try {
          const name = await this.loadGetAlmopes(liberacaoId)
          this.$set(this.tooltipCache, liberacaoId, name)
        } catch (error) {
          this.$set(this.tooltipCache, liberacaoId, 'Error loading data')
        }
      },
      editarDados(item) {
        this.dadosDataTableSelecionado = item
        this.modalEdit = true
      },
      async handleChangeProduto(produto) {
        await this.getRelatorios(produto)
      },
      async getRelatorios(produto) {
        this.loading = true
        const response = await GerenciarRelatoriosService.getRelatorios(produto)
        this.dadosBase = response
        this.loading = false
      },
      async loadDataService() {
        const produtos = await Utils.getProductAvailable(
          'RELATORIO',
          this.usuario.filtro,
          this.usuario.almope
        )
        this.produtos = produtos.map(item => {
          return {
            text: item.text,
            value: item.text
          }
        })
      },
      async loadGetAlmopes(almopesIn) {
        if (!almopesIn) return ''
        const almopes = await Utils.getAlmopes(almopesIn)
        return almopes.map(almope => {
          return `<div>${almope.ALMOPE} - ${almope.NOME} (${almope.FILTRO})</div>`
        })
      }
    },
    async created() {
      await this.loadDataService()
      await this.getRelatorios(this.produtoAtual)
    }
  }
</script>

<style scoped>
  .container-criar-relatorio {
    display: flex;
    place-items: center;
    justify-content: center;
    margin-top: 30px;
    height: 100%;
    border-radius: 15px;
    /* min-width: 500px; */
    /* box-shadow: 0px 5px 10px -3px rgba(0, 0, 0, 0.1); */
  }

  h2 {
    padding: 10px;
  }

  .section-criar-relatorio {
    width: 80.5vw;
    border: 1px solid #949494;
    border-radius: 15px;
    height: 100%;
    padding: 10px;
  }
</style>
