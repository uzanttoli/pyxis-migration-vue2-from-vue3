<template>
  <!-- v-model="meuCarrinho" -->
  <v-dialog
    width="400"
    persistent
    :model-value="meuCarrinho"
    @update:modelValue="val => $emit('update:meuCarrinho', val)"
  >
    <v-card tile>
      <title-negative-margin title="Meu Carrinho">
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              rounded
              depressed
              fab
              small
              @click="$emit('updated:close-carrinho')"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Fechar</span>
        </v-tooltip>
      </title-negative-margin>
    </v-card>
    <v-card class="mx-auto overflow-auto" height="350" tile v-if="minhasCompras != ''">
      <v-alert :type="type" :value="alert">
        {{ text }}
      </v-alert>

      <v-list-item three-line v-for="(produto, i) in minhasCompras" :key="i">
        <v-list-item-avatar tile size="80" color="grey">
          <v-img :src="link(produto.NOME_IMAGEM)"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <div class="text-overline">ID do produto: {{ produto.ID_PRODUTO }}</div>
          <v-list-item-title
            class="text-h5"
            :class="classProdutoIndisponivel(produto.ID_PRODUTO, produto.QUANTIDADE)"
          >
            {{ produto.NOME_PRODUTO }}
          </v-list-item-title>
          <v-list-item-subtitle>
            Quantidade: {{ produto.QUANTIDADE }} | P$ {{ produto.PRECO }}
          </v-list-item-subtitle>
          <v-divider></v-divider>
        </v-list-item-content>
        <v-tooltip right>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              rounded
              fab
              small
              @click="deleteItem(produto.ID_CARRINHO)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Excluir</span>
        </v-tooltip>
      </v-list-item>
    </v-card>
    <v-card v-else height="450" tile>
      <div justify="center" class="text-center">
        <div>Não há nada por aqui!</div>
      </div>
    </v-card>
    <v-card tile class="rounded-b-xl">
      <v-alert text outlined color="deep-orange" icon="mdi-store-alert" v-if="indisponivel">
        Há um produto no carrinho onde a quantidade solicitada não está mais disponivel.
      </v-alert>
      <v-card-text class="py-2 text-end">
        <h3>Valor final: P$ {{ valorFinal() }}</h3>
      </v-card-text>
      <v-btn
        block
        tile
        color="green"
        class="white--text"
        :disabled="minhasCompras == '' || indisponivel"
        @click="finalizarCompra"
      >
        Finalizar Compra
      </v-btn>
    </v-card>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-dialog>
</template>

<script>
  import config from '../../../core/config'
  export default {
    props: {
      meuCarrinho: {
        type: Boolean,
        default: false
      },
      adicionouCarrinho: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      overlay: false,
      dados: [],
      text: '',
      type: 'error',
      alert: false,
      validacao: [],
      finalizarIsValid: false,
      produtoIndisponivel: [],
      indisponivel: false
    }),
    mounted() {},
    computed: {
      myCash() {
        let cash = this.$store.getters.myCash[0]
        return cash ? cash : 0.0
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      minhasCompras() {
        return this.$store.getters.minhasCompras
      },
      idProdutosCarrinho() {
        let idProduto = []
        let produto = this.minhasCompras
        for (let i = 0; i < produto.length; i++) {
          idProduto.push(produto[i].ID_PRODUTO)
        }
        return idProduto
      }
    },
    methods: {
      classProdutoIndisponivel(id, quantidadeCompra) {
        let produtosIndisponiveis = this.produtoIndisponivel
        let validacao = produtosIndisponiveis.filter(
          item => item.ID_PRODUTO == id && item.QUANTIDADE_DISPONIVEL < quantidadeCompra
        )
        if (validacao.length > 0) {
          return (this.indisponivel = true), 'red--text text-decoration-line-through'
        }
      },
      async quantidadeDisponivelValido() {
        let urlData = `${config.baseUrl}api/shared/loja/consulta_produtos/${this.idProdutosCarrinho}`
        await this.$api.get(urlData).then(res => {
          this.produtoIndisponivel = res.data
        })
      },
      loadMinhasCompras() {
        this.$store.dispatch('loadMinhasCompras', this.usuarioAlmope)
      },
      async limparCarrinho() {
        let urlData = `${config.baseUrl}api/shared/loja/limpar_carrinho/${this.usuarioAlmope}`
        await this.$api.delete(urlData)
      },
      async deleteItem(value) {
        this.text = 'Produto retirado do carrinho!'
        this.alert = true
        this.type = 'warning'
        let urlData = `${config.baseUrl}api/shared/loja/carrinho/${value}`
        await this.$api.delete(urlData)
        this.loadMinhasCompras()
        setTimeout(() => {
          this.text = ''
          this.alert = false
          this.indisponivel = false
        }, 3000)
      },

      async finalizarCompra() {
        if (this.cashIsInvalid()) {
          this.text = 'Saldo indisponivel'
          this.alert = true
          this.type = 'error'
          setTimeout(() => {
            this.text = ''
            this.alert = false
          }, 2000)
        } else {
          this.overlay = true
          this.text = 'Compra realizada com sucesso!'
          this.alert = true
          this.type = 'success'
          let minhasCompras = this.minhasCompras
          for (let i = 0; i < minhasCompras.length; i++) {
            await this.$store.dispatch('cadastrarVendaBanco', minhasCompras[i])
          }
          await this.loadProdutoCheckout()
          await this.limparCarrinho()
          setTimeout(() => {
            this.$emit('updated:close-carrinho')
            this.overlay = false
            this.text = ''
            this.alert = false
          }, 2000)
        }
      },
      async loadProdutoCheckout() {
        await this.$store.dispatch('loadProdutoCheckout', this.$route.params.id)
      },
      cashIsInvalid() {
        let coins = this.myCash.QTDE_PYXIS_COIN
        if (coins == null || coins == '' || coins == undefined) {
          return true
        } else {
          let valorProduto = this.valorFinal()
          return parseInt(valorProduto) > parseInt(coins)
        }
      },
      loadMyCash() {
        this.$store.dispatch('loadMyCash', this.$store.getters.usuario.almope)
      },
      valorFinal() {
        let minhasCompras = this.minhasCompras
        let precoProdutos = []
        for (let i = 0; i < minhasCompras.length; i++) {
          precoProdutos.push(parseFloat(minhasCompras[i].PRECO) * minhasCompras[i].QUANTIDADE)
        }
        let valorFinal = precoProdutos.reduce((t, n) => n + t, 0)

        return valorFinal
      },

      link(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_produto/${img}`
      }
    },
    watch: {
      meuCarrinho() {
        if (this.meuCarrinho == true) {
          this.loadMinhasCompras()
          this.valorFinal()
          this.loadMyCash()
          this.quantidadeDisponivelValido()
        }
      }
    },
    created() {}
  }
</script>

<style></style>
