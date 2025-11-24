<template>
  <section>
    <v-col class="mt-n8">
      <v-card
        class="pa-4 rounded-xl transition-opacity blue-grey lighten-5"
        elevation="2"
        :class="{ 'card-scrolled': isScrolled }"
        @mouseover="hovering = true"
        @mouseleave="hovering = false"
      >
        <v-card-title class="mt-n4 ml-n3">Gerenciar visões por produto</v-card-title>
        <v-card-subtitle class="ml-n3">
          Alterando o produto, as visões abaixo serão recarregadas!
        </v-card-subtitle>
        <v-row>
          <v-col>
            <v-autocomplete
              placeholder="Selecione o produto"
              label="Selecione o produto"
              dense
              no-data-text="Produto não carregado"
              class="rounded-1"
              :items="produtos"
              v-model="produtoSelecionado"
              outlined
            ></v-autocomplete>
          </v-col>
          <v-col>
            <DatePicker style="margin-top: -10px" v-model="dataFiltrada" />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <CardInf :produto="produtoSelecionado" :base="dadosCard" :loading="isLoadingCard" />
    <v-col>
      <v-card elevation="1" class="rounded-xl">
        <v-tabs
          v-model="tab"
          grow
          background-color="light-blue lighten-1 text--white"
          center-active
          dark
        >
          <v-tab
            v-for="(tab, i) in tabs"
            :key="i"
            class="rounded-tr-xl rounded-t-xl"
            @change="getDadosIntra()"
          >
            <!-- active-class="deep-purple lighten-1 white--text" -->
            <span class="font-weight-medium">{{ tab.label }}</span>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="tab in tabs" :key="tab.label">
            <component
              :is="tab.component"
              :produto="produtoSelecionado"
              :data="dataFiltrada"
              :base="dadosIntra"
              :isLoading="loading"
            ></component>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-col>
  </section>
</template>

<script>
  import Utils from '@/data/services/common/Utils'
  import CardInf from './cards/CardInf.component.vue'
  import PainelProdutividade from './painel/PainelProdutividade.vue'
  import PainelIntraDay from './painel/PainelIntraDay.vue'
  import PainelIntraHora from './painel/PainelIntraHora.vue'
  import DatePicker from '@/shared/components/DatePicker/DatePicker.vue'

  import ResumoTratativaService from '@/data/services/bko/serviceToSales/gerencial/ResumoTratativa'
  export default {
    components: {
      CardInf,
      PainelProdutividade,
      PainelIntraDay,
      PainelIntraHora,
      DatePicker
    },
    data: () => ({
      produtos: [],
      tabs: [
        { label: 'Dados Online/Historico', component: 'painel-produtividade' },
        { label: 'Intra Hora', component: 'painel-intra-hora' },
        { label: 'Intra day', component: 'painel-intra-day' }
      ],
      tab: null,
      produtoSelecionado: null,
      dataFiltrada: null,
      isScrolled: false,
      hovering: false,
      dadosIntra: [],
      dadosCard: [],
      loading: false,
      isLoadingCard: false
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      label() {
        return this.tabs[this.tab]?.label
      },
      dataAtual() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-MM-DD')
      }
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
    },
    beforeUnmount() {
      window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      async getDadosProdutividadeCard() {
        try {
          await this.$nextTick()
          this.isLoadingCard = true
          const result = await ResumoTratativaService.getDadosProdutividadeCard(
            this.produtoSelecionado,
            this.dataFiltrada ?? this.dataAtual
          )
          this.dadosCard = result
          this.isLoadingCard = false
        } catch (error) {
          console.error(error)
          this.isLoadingCard = false
        }
      },
      async getDadosIntra() {
        try {
          this.loading = true
          await this.$nextTick()
          if (['Intra Hora', 'Intra day'].includes(this.tabs[this.tab].label)) {
            const result = await ResumoTratativaService.getDadosIntra(
              this.produtoSelecionado,
              this.tabs[this.tab].label,
              this.dataFiltrada
            )
            this.dadosIntra = result
            this.loading = false
          }
        } catch (error) {
          console.error(error)
          throw error
        }
      },
      handleScroll() {
        this.isScrolled = window.scrollY > 150
      },
      async loadDataService() {
        try {
          this.produtos = await Utils.getProductAvailable(
            'BKO_VENDAS',
            this.usuario.filtro,
            this.usuario.almope
          )

          if (
            this.produtos.length == 0 ||
            !this.produtos.map(produto => produto.text).includes(this.usuario?.produto)
          ) {
            this.produtoRelatorio = [
              {
                IdProduto: null,
                text: this.usuario?.produto,
                ORDEM_PRODUTO: 1
              },
              ...this.produtos
            ]
          }
          this.produtoSelecionado = this.usuario?.produto
          this.produtos.push({
            IdProduto: null,
            text: this.usuario?.produto,
            ORDEM_PRODUTO: 1
          })
        } catch (error) {
          console.error(error)
          throw error
        }
      }
    },
    async created() {
      await this.loadDataService()
      await this.getDadosIntra()
      await this.getDadosProdutividadeCard()
    },
    watch: {
      dataFiltrada: async function (newVal, oldVal) {
        if (oldVal !== null) {
          if (oldVal != newVal) {
            await this.getDadosIntra()
            await this.getDadosProdutividadeCard()
          }
        }
      },
      produtoSelecionado: async function (newVal, oldVal) {
        if (oldVal !== null) {
          if (newVal !== oldVal) {
            await this.getDadosIntra()
            await this.getDadosProdutividadeCard()
          }
        }
      }
    }
  }
</script>

<style scoped>
  .card-scrolled {
    opacity: 0;
  }

  .card-scrolled:hover {
    opacity: 1 !important;
  }

  .transition-opacity {
    transition: opacity 0.3s ease;
  }

  .v-tab.v-tab--active {
    border-bottom: 3px solid #7e57c2;
    /* ou qualquer cor que desejar */
  }

  /deep/ .v-tabs-slider {
    background-color: #7e57c2 !important;
  }
</style>
