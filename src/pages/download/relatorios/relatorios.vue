<template>
  <v-container class="mt-5" fluid>
    <v-card class="pa-4 rounded-xl">
      <v-card-title class="pt-0 ml-n5">
        <div class="d-flex justify-center align-center">
          <v-icon size="24" color="orange">fa-solid fa-folder</v-icon>
          <span class="mr-2">Relatorios</span>
          <v-divider vertical></v-divider>
        </div>
        <v-spacer></v-spacer>
        <v-btn small color="success" @click="gerenciarRelatorio" v-if="isPermission">
          Gerenciar Relatorios
        </v-btn>
      </v-card-title>
      <div class="d-flex" style="gap: 8px">
        <div style="flex: 0 0 25%">
          <v-autocomplete
            outlined
            dense
            placeholder="Produto"
            label="Produto"
            :items="produtoRelatorio"
            v-model="produtoSelecionado"
            no-data-text="Não há produto disponível"
          ></v-autocomplete>
        </div>

        <div style="flex: 1">
          <v-text-field
            placeholder="Pesquisar"
            label="Pesquisar"
            outlined
            dense
            v-model="search"
          ></v-text-field>
        </div>
      </div>
      <v-divider></v-divider>
      <div class="container-relatorios mt-4">
        <div>
          <div class="container-folder">
            <folder
              imgSrc="pasta"
              v-for="(item, i) in filterRelatorio"
              :key="i"
              :title="item.NOME_ARQUIVO_FANTASIA"
              :atualizadoEm="item.ATUALIZADO_EM"
              :isFavorite="item.RELATORIO_FAVORITO"
              @update:dadosFolder="dadosFolder(item)"
            ></folder>
          </div>
          <area-download
            :abrirDialogDownload="abrirDialogDownload"
            :relatorio="relatorioSelecionado"
            @update:close-dialog="abrirDialogDownload = !abrirDialogDownload"
          ></area-download>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
  import folder from './folder.vue'
  import config from '../../../core/config'
  import AreaDownload from './areaDownload.vue'
  import { mapGetters } from 'vuex'
  import Utils from '@/data/services/common/Utils'

  export default {
    components: { folder, AreaDownload },
    data: () => ({
      search: '',
      relatorios: [],
      relatorioSelecionado: [],
      produtoRelatorio: [],
      produtoSelecionado: null,
      abrirDialogDownload: false
    }),
    computed: {
      relatorioPorProduto() {
        return this.relatorios.filter(relatorio => {
          return relatorio.PRODUTO == this.produtoSelecionado
        })
      },
      ...mapGetters({
        usuario: 'usuario'
      }),
      filterRelatorio() {
        let items = []

        items = this.relatorioPorProduto.filter(item => {
          return (
            item.NOME_ARQUIVO_FANTASIA.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.ID == this.search * 1
          )
        })
        return items
      },
      tipoPerfil() {
        return this.usuario?.filtro
      },
      almope() {
        return this.usuario?.almope
      },
      produto() {
        return this.usuario?.produto
      },
      isPermission() {
        const { filtro, criar_relatorio, editar_relatorio } = this.usuario || {}
        return filtro === 'ADMINISTRADOR' || criar_relatorio === 1 || editar_relatorio === 1
      }
    },
    methods: {
      async loadDataService() {
        this.produtoRelatorio = await Utils.getProductAvailable(
          'RELATORIO',
          this.usuario.filtro,
          this.usuario.almope
        )
      },
      gerenciarRelatorio() {
        this.$router.push('/pyxis/downloads/relatorios/gerenciar')
      },
      dadosFolder(item) {
        this.relatorioSelecionado = item
        this.abrirDialogDownload = true
      },
      async loadRelatorios() {
        // this.produtoRelatorio.map(produto => produto.text).includes(this.usuario?.produto)
        if (
          this.produtoRelatorio.length == 0 ||
          !this.produtoRelatorio.map(produto => produto.text).includes(this.usuario?.produto)
        ) {
          this.produtoRelatorio = [
            {
              IdProduto: null,
              text: this.usuario?.produto,
              ORDEM_PRODUTO: 1
            },
            ...this.produtoRelatorio
          ]
        }
        this.produtoSelecionado = this.usuario?.produto
        const urlData = `${config.baseUrl}api/shared/portal_cco/relatorios/listar_relatorios/${this.produto}/${this.tipoPerfil}/${this.almope}`
        try {
          const response = await this.$api.get(urlData)
          this.relatorios = response.data || []
        } catch (error) {
          console.error('Erro ao carregar relatórios:', error)
        }
      }
    },
    async created() {
      await this.loadDataService()
      await this.loadRelatorios()
    }
  }
</script>

<style scoped VTextField>
  body {
    background-color: #ededed !important;
  }

  .campo-filtro {
    display: flex;
  }

  .container-folder {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    /* justify-content: space-around; */
    gap: 30px;
  }

  .relatorios {
    padding: 20px;
    margin-top: 20px;
  }

  .icon {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  i:nth-child(1) {
    font-size: 12px;
  }

  i {
    padding: 5px;
  }

  .folder {
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 5px;
    width: 150px;
    max-width: 200px;
    height: 160px;
  }

  .info-folder {
    display: flex;
    flex-direction: column;
    align-items: center;

    cursor: pointer;
  }

  h4 {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 110px;
  }

  img {
    width: 80px;
  }

  .att {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  p {
    font-size: 10px;
    margin-bottom: -25px;
  }

  fieldset {
    padding: 10px;
    border-color: #f0f0f0;
  }

  legend {
    font-size: 22px;
    padding: 0 5px 0 5px;
    color: #7e7e7e;
  }
</style>
