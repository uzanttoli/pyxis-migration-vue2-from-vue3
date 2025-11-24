<template>
  <v-container>
    <v-card class="pa-2 rounded-xl" :loading="loading">
      <title-negative-margin title="Tratativa de caso" className="rounded-r-xl ml-n6">
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              icon
              color="orange"
              class="mr-2"
              @click="abrirModal = !abrirModal"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon size="18">fa-solid fa-clock</v-icon>
            </v-btn>
          </template>
          <span>Acompanhar agendamento</span>
        </v-tooltip>
      </title-negative-margin>
      <component
        v-if="TabuladorBkoAtivacao"
        :is="TabuladorBkoAtivacao"
        :abrirModal="abrirModal"
        @update:loadData="dataLoading"
      />
    </v-card>
  </v-container>
</template>

<script>
  import router from '@/router'

  const produto = [
    { id: 'a96f7d25-9bae-4ff5-8f30-f84ed249ed04', produto: 'net' },
    { id: 'b8de364e-2718-4fe9-881a-19045f5df0f2', produto: 'claro' }
  ]

  export default {
    components: {},
    data: () => ({
      produtoTabulador: null,
      loading: true,
      acompanharTratativas: [],
      abrirModal: false,
      search: ''
    }),
    computed: {
      TabuladorBkoAtivacao() {
        if (!this.produtoTabulador) return null
        return () => import(`./BackofficeAtivacao.${this.produtoTabulador}.vue`)
      }
    },
    methods: {
      dataLoading(e) {
        this.loading = e
      },
      atualizarProduto(route) {
        const produtoSelecionado = produto.find(item => item.id === route.params.produto)

        if (produtoSelecionado) {
          this.produtoTabulador = produtoSelecionado.produto
        }
      }
    },
    created() {
      this.atualizarProduto(router.currentRoute)

      router.afterEach(to => {
        this.atualizarProduto(to)
      })
    }
  }
</script>

<style></style>
