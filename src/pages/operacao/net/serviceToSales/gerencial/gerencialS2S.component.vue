<template>
  <v-card class="mx-auto pa-4" elevation="0">
    <v-col>
      <card-app-bar
        customClass="rounded-xl"
        :minHeight="100"
        style="margin-top: 10px"
        styleCustom="display: flex; height: 110px; padding: 25px; align-items:center; color: #fafafa;"
      >
        <template v-slot:title>
          <h3>
            <v-icon color="white" class="mr-3" size="25">fa-solid fa-chart-line</v-icon>
            Gerencial de Vendas
          </h3>
        </template>

        <template v-slot:imagem>
          <img
            src="@/assets/img/geral/03-index-bf-sem-fundo.png"
            style="position: absolute; height: 155px; bottom: 0px; right: 20px"
          />
        </template>

        <template v-slot:info>
          <div
            style="display: flex; gap: 6px; padding: 10px 20px; margin-top: -35px; flex-wrap: wrap"
          >
            <ItemsSelector
              :items="produtos"
              v-model="produtoSelecionado"
              title="Produto"
              :loading="infoCardLoading"
            />

            <ItemsSelector :items="agrupamentos" v-model="agrupamentoAtual" title="Agrupamento" />
          </div>
        </template>
      </card-app-bar>

      <v-card class="rounded-lg cor-padrao" elevation="0">
        <v-col>
          <div class="scroll-cards">
            <template
              v-for="(item, i) in vendasOnlineGerencialFilters == ''
                ? vendasOnlineGerencial
                : vendasOnlineGerencialFilters"
              :key="i"
            >
              <v-col>
                <card-dash
                  :id="i"
                  @update:validateVisible="cardInfoValid"
                  style="min-width: 10vw"
                  :title="item.COLUNA"
                  :valor="item.VALOR"
                  :iconFa="item.MDI_ICON"
                  :buttonIsVisible="item.OCULTAR"
                ></card-dash>
              </v-col>
            </template>
          </div>
        </v-col>

        <v-col>
          <div class="container-table">
            <v-col v-for="(item, i) in config" :key="i">
              <component
                :is="item.COMPONENT"
                :key="i"
                :title="item.TITULO"
                :actionUrl="item.ENDPOINT"
                :titleIcon="item.ICONE_TITULO"
                :numSuperior="item.NUM_SUPERIOR"
                :agrupamento="agrupamentoAtual"
                :produto="produtoSelecionado"
                @update:loading="isLoading"
              ></component>
            </v-col>
          </div>
        </v-col>
      </v-card>
    </v-col>
  </v-card>
</template>

<script>
  import config from '@/core/config'

  import CardDash from '@/shared/components/cards/modern/cardDash.vue'
  import cardAppBar from '@/shared/components/cards/modern/cardAppBar.vue'

  import tabelaVendasOnline from './table/tableGerencialS2S.component.vue'

  import ItemsSelector from '@/shared/components/ItemsSelector.vue'

  import Utils from '@/data/services/common/Utils'
  import { ConfigService } from '@/data/services/serviceToSales'
  export default {
    components: {
      tabelaVendasOnline,
      cardAppBar,
      CardDash,
      ItemsSelector
    },
    data() {
      return {
        nomeComponent: 'GERENCIAL_S2S',
        infoCardLoading: false,
        loadingHash: true,
        produtoSelecionado: null,
        config: [],
        produtos: [],
        agrupamentos: [],
        configComparativo: [],
        vendasOnlineGerencial: [],
        vendasOnlineGerencialFilters: [],
        agrupamentoAtual: 'NET - N1 TOTAL + SUL 2 + SP 3'
      }
    },
    computed: {
      // config() {
      //   return this.$store.getters.configService
      // },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async loadDataService() {
        try {
          const meuProduto = this.usuario.produto

          const produto = await Utils.getProductAvailable(
            'GERENCIAL_S2S',
            this.usuario.filtro,
            this.usuario.almope
          )

          this.produtoSelecionado = produto.length > 0 ? produto[0].text : meuProduto
          this.produtos = produto.map(item => {
            return {
              text: item.text,
              value: item.text
            }
          })
          if (produto.length === 0) {
            this.produtos = [
              {
                text: meuProduto,
                value: meuProduto
              }
            ]
          }
        } catch (e) {
          console.error('Erro ao carregar produto')
        }
      },
      async loadAgrupamentosComponent() {
        let urlData = `${config.baseUrl}api/shared/config/agrupamentos_componente`
        const res = await this.$api.get(urlData, {
          params: {
            produto: this.produtoSelecionado,
            component: 'GERENCIAL_S2S'
          }
        })
        this.agrupamentos = res.data.map(item => {
          return {
            text: item.AGRUPAMENTO,
            value: item.VALOR_AGRUPAMENTO
          }
        })
      },
      isLoading(e) {
        this.loadingHash = this.infoCardLoading || e
      },
      cardInfoValid(e) {
        let dados = this.vendasOnlineGerencial
        if (e.visible === false) {
          let i = dados.filter(dado => {
            return dado.COLUNA != e.title
          })
          this.vendasOnlineGerencialFilters = i
        } else {
          this.vendasOnlineGerencialFilters = []
        }
      },
      async loadVendasOnlineGerencial() {
        this.infoCardLoading = true
        let urlData = `${config.baseUrl}api/shared/televendas/vendas_online_gerencial/`
        const res = await this.$api.get(urlData, {
          params: {
            produto: this.produtoSelecionado,
            agrupamento: this.agrupamentoAtual
          }
        })
        this.vendasOnlineGerencial = res.data
        this.infoCardLoading = false
        this.loadingHash = false
      },
      async loadConfigService() {
        const result = await ConfigService.getConfigComponent()
        this.config = result
      }
    },
    async created() {
      await this.loadDataService()
      await this.loadAgrupamentosComponent()

      this.loadConfigService()
      await this.loadVendasOnlineGerencial()
    },
    watch: {
      agrupamentoAtual() {
        this.loadVendasOnlineGerencial()
      },
      produtoSelecionado: async function (newVal, oldVal) {
        if (newVal != oldVal) {
          await this.loadAgrupamentosComponent()
        }
      }
    }
  }
</script>

<style scoped>
  .card__body2 {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 16px;
  }

  .scroll-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    flex-direction: row;
    background-color: #fff;
    border-radius: 30px;
    margin: 0 10px;
    padding: 10px;
    box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.25);
    max-height: 400px;
    overflow: auto;
  }

  .scroll-cards::-webkit-scrollbar {
    width: 10px;
  }

  .scroll-cards::-webkit-scrollbar-track {
    background: rgb(255, 255, 254);
  }

  .scroll-cards::-webkit-scrollbar-thumb {
    background-color: rgb(143, 14, 143);
    /* border-radius: 25px; */
    border: 3px solid rgb(245, 245, 245);
  }
</style>
