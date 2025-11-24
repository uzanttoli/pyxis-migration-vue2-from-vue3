<template>
  <v-col cols="8" offset="2">
    <v-card class="mx-auto mt-7 mb-5" elevation="">
      <v-row justify="end" class="mx-5 my-4">
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              rounded
              fab
              depressed
              small
              class="my-3"
              to="/pyxis/loja"
            >
              <v-icon>mdi-keyboard-return</v-icon>
            </v-btn>
          </template>
          <span>Voltar</span>
        </v-tooltip>
      </v-row>
      <v-row class="mt-7 px-9 mb-5">
        <v-col cols="12" sm="6">
          <div align="center" justify="center">
            <v-card width="450" elevation="0" height="100">
              <v-img
                max-width="450"
                :src="imagemProduto(produtoCheckout.NOME_ARQUIVO_IMAGEM)"
              ></v-img>
            </v-card>
          </div>
        </v-col>
        <v-divider vertical inset class="mb-5"></v-divider>
        <v-col cols="12" sm="6">
          <v-alert :type="type" :value="alert">{{ text }}</v-alert>
          <v-card-title class="text-h4 font-weight-medium">
            {{ produtoCheckout.NOME_PRODUTO }}
          </v-card-title>
          <v-card-text>
            <v-row align="center" class="mx-0">
              <v-rating
                :value="produtoCheckout.MEDIA_CLASSIFICACAO * 1"
                color="amber"
                dense
                background-color="grey darken-1"
                half-increments
                readonly
                size="14"
              ></v-rating>
            </v-row>
            <div class="my-4 text-subtitle-1 grey--text">
              {{ produtoCheckout.DESCRICAO_PRODUTO }}
            </div>
            <div class="font-weight-black text-h4">
              P$
              {{ produtoCheckout.PRECO == '.00' ? '0,00' : produtoCheckout.PRECO }}
            </div>
            <div>
              <v-chip class="rounded-xr-0">
                Estoque: {{ produtoCheckout.QUANTIDADE_DISPONIVEL }}
              </v-chip>
            </div>
          </v-card-text>
          <v-card-actions>
            <span class="mx-2">Quantidade:</span>
            <v-btn
              outlined
              class="mt-n2 add"
              small
              @click="decrement"
              v-model="productCount"
              :disabled="productCount <= 1"
            >
              <v-icon color="green">mdi-minus</v-icon>
            </v-btn>
            <strong class="mx-2" v-text="productCount"></strong>
            <v-btn
              outlined
              class="mt-n2 add"
              small
              @click="increment"
              :disabled="
                productCount >= produtoCheckout.LIMITE_COMPRA ||
                productCount >= this.produtoCheckout.QUANTIDADE_DISPONIVEL
              "
            >
              <v-icon color="green">mdi-plus</v-icon>
            </v-btn>
          </v-card-actions>
          <v-row class="my-3 ml-3">
            <v-col>
              <v-btn
                block
                color="blue"
                class="white--text"
                :disabled="!this.produtoCheckout.QUANTIDADE_DISPONIVEL > 0"
                @click="saveInserirDadosCarrinho(produtoCheckout)"
              >
                Adicionar ao Carrinho
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                block
                color="success"
                @click="carrinhoCompras = true"
                :disabled="quantidadeMinhasCompras == 0"
              >
                Meu Carrinho
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <div>
        <SlideProdutos :categoria="produtoCheckout.ID_CATEGORIAS" />
      </div>
      <CarrinhoProduto
        :meuCarrinho="carrinhoCompras"
        @updated:close-carrinho="carrinhoCompras = !carrinhoCompras"
      />
      <MeuComentario />
      <Comentarios :comentarios="listarComentarios" />
      <AvaliacaoProduto />
    </v-card>
  </v-col>
</template>

<script>
  import SlideProdutos from './SlideProdutos.vue'
  import CarrinhoProduto from './CarrinhoProduto.vue'
  import Comentarios from './ComentariosProduto.vue'
  import MeuComentario from './MeuComentario.vue'
  import AvaliacaoProduto from './AvaliacaoProduto.vue'

  import config from '../../../core/config'
  export default {
    components: {
      SlideProdutos,
      CarrinhoProduto,
      Comentarios,
      MeuComentario,
      AvaliacaoProduto
    },
    data: () => ({
      selectedProducts: [],
      productCount: 1,
      carrinho: [],
      carrinhoCompras: false,
      alert: false,
      text: '',
      type: 'success',
      itemAdicionado: false,
      isValid: []
    }),
    computed: {
      produtoCheckout() {
        let produtoCheckout = this.$store.getters.produtoCheckout
        return produtoCheckout ? produtoCheckout : []
      },
      listarComentarios() {
        let listarComentarios = this.$store.getters.listarComentarios
        return listarComentarios ? listarComentarios : []
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      rota() {
        return this.$route.params.id
      },
      quantidadeMinhasCompras() {
        return this.$store.getters.minhasCompras.length
      },
      minhasCompras() {
        return this.$store.getters.minhasCompras
      }
    },
    mounted() {},
    methods: {
      async loadMinhasCompras() {
        await this.$store.dispatch('loadMinhasCompras', this.usuarioAlmope)
      },
      async saveInserirDadosCarrinho(produto) {
        await this.excedeuLimiteCompra()
        await this.loadMinhasCompras()
        if (this.existiProdutoCarrinho()) {
          this.alert = true
          this.text = 'O produto já está no carrinho!'
          this.type = 'warning'
          setTimeout(() => {
            this.alert = false
            this.text = ''
          }, 5000)
        } else {
          let limiteCompra = this.isValid[0]?.LIMITE_DISPONIVEL
          let qtdMinhasCompra = this.productCount
          if (qtdMinhasCompra > limiteCompra) {
            this.alert = true
            this.type = 'warning'
            this.text = `Você excedeu o limite de compra. Seu limite disponivel é de ${limiteCompra}.`
            setTimeout(() => {
              this.alert = false
              this.text = ``
            }, 5000)
            return
          } else {
            this.text = 'Produto adicionado ao carrinho'
            this.alert = true
            this.type = 'success'
            let data = {
              idProduto: this.$route.params.id,
              nomeImagem: produto.NOME_ARQUIVO_IMAGEM,
              nomeProduto: produto.NOME_PRODUTO,
              preco: produto.PRECO,
              quantidade: this.productCount,
              usuarioCompra: this.usuarioAlmope
            }
            this.$store.dispatch('saveInserirDadosCarrinho', data)
            setTimeout(() => {
              this.text = ''
              this.loadMinhasCompras()

              this.alert = false
            }, 3500)
          }
        }
      },
      existiProdutoCarrinho() {
        let carrinho = this.minhasCompras
        let nome = []
        for (let i = 0; i < carrinho.length; i++) {
          nome.push(carrinho[i].NOME_PRODUTO)
        }
        let nomeProduto = this.produtoCheckout.NOME_PRODUTO
        if (nome.indexOf(nomeProduto) > -1) {
          return true
        } else {
          return false
        }
      },
      async excedeuLimiteCompra() {
        let urlData = `${config.baseUrl}api/shared/loja/excedeu_limite/${this.usuarioAlmope}/${this.rota}`
        var res = await this.$api.get(urlData)
        if (res.data[0]) {
          if (res.data[0].LIBERACAO_COMPRA == 0) {
            this.alert = true
            this.type = 'warning'
            this.text = `Você excedeu o limite de compra.`
          }
          this.isValid = res.data
          this.alert = false
          this.text = ``
        }
      },
      loadListarComentarios() {
        this.$store.dispatch('loadListarComentarios', this.rota)
      },

      async loadProdutoCheckout() {
        await this.$store.dispatch('loadProdutoCheckout', this.$route.params.id)
      },
      /**
       * @param {object} product
       *
       */
      increment(value) {
        this.selectedProducts.push({ ...value })
        this.productCount++
      },
      decrement() {
        this.productCount--
      },
      imagemProduto(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_produto/${img}`
      }
    },
    watch: {
      rota() {
        this.loadProdutoCheckout()
        this.loadListarComentarios()
        this.excedeuLimiteCompra()
      }
    },
    created() {
      this.loadMinhasCompras()
      this.loadListarComentarios()
      this.loadProdutoCheckout()
      this.excedeuLimiteCompra()
    }
  }
</script>

<style></style>
