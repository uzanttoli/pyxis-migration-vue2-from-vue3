<template>
  <div>
    <v-card color="" class="pa-3 mb-16 rounded-b-xl" outlined>
      <CarrosselProduto :slides="listarBanner" />
      <Categoria :categories="listarCategories" @updated:categories="valor" />
      <v-row justify="end" class="pa-0 ma-0">
        <v-chip color="primary">
          Saldo Disponivel:
          <span class="font-weight-bold text-h6 ml-2 mr-2">
            {{ myCash.QTDE_PYXIS_COIN | formatMoeda }}
          </span>
        </v-chip>
      </v-row>
    </v-card>
    <template v-if="listarProdutosExibicao.length > 0">
      <Produto :produtos="listarProdutosExibicao" />
    </template>
    <template v-else>
      <v-row class="mt-7 mb-5 py-2 grey--text" align="center" justify="center">
        <h2>Não há produtos...</h2>
      </v-row>
    </template>

    <TopComentarios :comentarios="topComentarios" />

    <CarrinhoProduto
      :meuCarrinho="carrinhoCompras"
      @updated:close-carrinho="carrinhoCompras = !carrinhoCompras"
    />

    <BotaoCarrinho
      @updated:ativar-carrinho="carrinhoCompras = true"
      :quantidade="quantidadeMinhasCompras ? quantidadeMinhasCompras : '0'"
    />
  </div>
</template>

<script>
  import config from '../../core/config'

  import Produto from '../../shared/components/loja/ProdutoItem.vue'
  import TopComentarios from '../../shared/components/loja/TopComentarios.vue'
  import CarrosselProduto from '../../shared/components/loja/CarrosselProduto.vue'
  import Categoria from '../../shared/components/loja/CategoriaProduto.vue'
  import CarrinhoProduto from '../../shared/components/loja/CarrinhoProduto.vue'
  import BotaoCarrinho from '../../shared/components/loja/BotaoCarrinho.vue'
  export default {
    components: {
      Produto,
      TopComentarios,
      CarrosselProduto,
      Categoria,
      CarrinhoProduto,
      BotaoCarrinho
    },
    data: () => ({
      categoriaSelecionada: 1,
      carrinhoCompras: false,
      quantidadeCarrinho: 0,
      topComentarios: []
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      tipoPerfil() {
        return this.$store.getters.usuario.filtro
      },
      agrupamento() {
        return this.$store.getters.usuario.agrupamento
      },
      listarCategories() {
        let listarCategories = this.$store.getters.listarCategories
        return listarCategories ? listarCategories : []
      },
      listarBanner() {
        let listarBanner = this.$store.getters.listarBanner
        return listarBanner ? listarBanner : []
      },
      listarProdutosExibicao() {
        let listarProdutosExibicao = this.$store.getters.listarProdutosExibicao
        return listarProdutosExibicao ? listarProdutosExibicao : []
      },
      quantidadeMeuCarrinho() {
        let dados = localStorage.getItem('meu-carrinho')
        let dadosParse = JSON.parse(dados)

        return dadosParse ? dadosParse.length : 0
      },
      quantidadeMinhasCompras() {
        return this.$store.getters.minhasCompras.length
      },
      myCash() {
        let cash = this.$store.getters.myCash[0]
        return cash ? cash : 0.0
      }
    },
    filters: {
      formatMoeda: function (value) {
        if (value) {
          const currency = function (number) {
            return new Intl.NumberFormat('pt-BR', {
              minimumFractionDigits: 2
            }).format(number)
          }
          return currency(value)
        } else {
          return 0.0
        }
      }
    },
    methods: {
      loadMyCash() {
        this.$store.dispatch('loadMyCash', this.usuarioAlmope)
      },
      loadMinhasCompras() {
        this.$store.dispatch('loadMinhasCompras', this.usuarioAlmope)
      },
      loadTopComentarios() {
        let urlData = `${config.baseUrl}api/shared/loja/top_comentarios/${this.tipoPerfil}/${this.agrupamento}`
        this.$api.get(urlData).then(res => {
          this.topComentarios = res.data
        })
      },
      valor(e) {
        return (this.categoriaSelecionada = e)
      },
      loadListarCategories() {
        this.$store.dispatch('loadListarCategories')
      },
      loadListarBanner() {
        this.$store.dispatch('loadListarBanner')
      },
      async loadListarProdutosExibicao() {
        await this.$store.dispatch('loadListarProdutosExibicao', {
          almope: this.usuarioAlmope,
          categoria: this.categoriaSelecionada
        })
      }
    },
    watch: {
      categoriaSelecionada() {
        this.loadListarProdutosExibicao()
      }
    },
    created() {
      this.loadMinhasCompras()
      this.loadTopComentarios()
      this.loadListarCategories()
      this.loadListarBanner()
      this.loadListarProdutosExibicao()
      this.loadMyCash()
    }
  }
</script>

<style></style>
