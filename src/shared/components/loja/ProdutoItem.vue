<template>
  <v-row justify="center" class="space px-16 mb-5">
    <v-col v-for="(produto, i) in produtos" :key="i">
      <v-card
        elevation="2"
        class="mx-auto rounded-xl pa-2"
        max-width="300"
        color=""
        flat
        outlined
        :to="{
          name: 'Produto',
          params: { id: produto.ID_PRODUTO },
          hash: `#${produto.NOME_PRODUTO}`
        }"
      >
        <div align="center" justify="center">
          <v-img
            max-height="300"
            max-width="300"
            contain
            :src="imagemProduto(produto.NOME_ARQUIVO_IMAGEM)"
          ></v-img>
        </div>

        <v-card-title class="text-w-rap text-truncate" style="display: block">
          {{ produto.NOME_PRODUTO }}
        </v-card-title>
        <v-card-title
          class="grey--text text-grey-darken-1 caption mt-n6 text-truncate"
          style="display: block"
        >
          {{ produto.DESCRICAO_PRODUTO }}
        </v-card-title>
        <v-card-title class="mt-n4">
          P$ {{ produto.VALOR_RESGATE == '.00' ? '0,00' : produto.VALOR_RESGATE }}
        </v-card-title>

        <v-card-actions class="mx-3 mt-n4">
          <v-spacer></v-spacer>
          <v-btn fab class="mx-1 mt-n3" dark small color="primary">
            <v-icon>mdi-shopping</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      produtos: {
        type: Array
      }
    },
    data: () => ({
      selectedProducts: [],
      productCount: 0
    }),
    methods: {
      /**
       * @param {object} product
       *
       */
      increment(value) {
        this.selectedProducts.push({ ...value })
        this.productCount += 1
      },
      decrement() {
        this.productCount--
      },
      imagemProduto(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_produto/${img}`
      }
    }
  }
</script>

<style></style>
