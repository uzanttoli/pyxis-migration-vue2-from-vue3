<template>
  <div>
    <MenuFilaComponent :filaConfig="dadosFila" :produtoSelecionado="$router.params.produto" />
  </div>
</template>

<script>
  import produto from '@/pages/serviceToSales/backoffice/produto.json'
  import dadosFilaExemplo from '@/pages/serviceToSales/backoffice/fila.json'
  import MenuFilaComponent from '@/shared/components/MenuFila/Index.vue'
  export default {
    components: { MenuFilaComponent },
    data: () => ({
      produto: produto,
      dadosFila: dadosFilaExemplo
    }),
    computed: {
      myProduct() {
        return this.$store.getters.usuario.produto
      },
      route() {
        return this.$router.params.produto
      }
    }
  }
</script>

<style></style>
