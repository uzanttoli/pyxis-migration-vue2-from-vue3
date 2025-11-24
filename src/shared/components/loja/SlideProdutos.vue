<template>
  <div v-if="listarProdutosSlide != ''">
    <v-sheet class="mx-auto mt-9 px-5 py-3" color="transparent">
      <h3>Itens Semelhantes:</h3>
      <v-slide-group class="pa-4" mandatory show-arrows>
        <v-slide-item
          v-for="(slide, i) in listarProdutosSlide"
          :key="'A' + i"
          v-slot="{ toggle }"
          class="mr-3"
        >
          <v-card
            tile
            @click="toggle"
            elevation="2"
            class="ml-2 mb-2 pa-2"
            height="300"
            width="250"
            flat
            outlined
            :to="{
              name: 'Produto',
              params: { id: slide.ID_PRODUTO },
              hash: `#${slide.NOME_PRODUTO}`
            }"
          >
            <div align="center" justify="center">
              <v-img
                max-height="300"
                max-width="300"
                contain
                :src="imagemProduto(slide.NOME_ARQUIVO_IMAGEM)"
              ></v-img>
            </div>

            <v-card-title class="text-w-rap text-truncate" style="display: block">
              {{ slide.NOME_PRODUTO }}
            </v-card-title>
            <v-card-title
              class="grey--text text-grey-darken-1 caption mt-n6 text-truncate"
              style="display: block"
            >
              {{ slide.DESCRICAO_PRODUTO }}
            </v-card-title>
            <v-card-title class="mt-n4">
              P$ {{ slide.VALOR_RESGATE == '.00' ? '0,00' : slide.VALOR_RESGATE }}
            </v-card-title>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>
  export default {
    props: {
      categoria: {
        type: [Number],
        default: 1
      }
    },
    data: () => ({
      model: null
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      listarProdutosSlide() {
        let listarProdutosExibicao = this.$store.getters.listarProdutosExibicao
        let novaLista = listarProdutosExibicao.filter(
          item => item.ID_PRODUTO != this.$route.params.id
        )
        return novaLista ? novaLista : []
      }
    },
    methods: {
      async loadListarProdutosExibicao() {
        await this.$store.dispatch('loadListarProdutosExibicao', {
          almope: this.usuarioAlmope,
          categoria: this.categoria
        })
      },
      imagemProduto(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_produto/${img}`
      }
    },
    watch: {
      categoria() {
        this.loadListarProdutosExibicao()
      }
    },
    created() {
      this.loadListarProdutosExibicao()
    }
  }
</script>

<style></style>
