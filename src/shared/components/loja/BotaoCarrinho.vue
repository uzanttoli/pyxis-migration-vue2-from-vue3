<template>
  <v-fab-transition>
    <v-btn
      class="btn-carrinho"
      color="primary"
      dark
      right
      fab
      @click="$emit('updated:ativar-carrinho')"
    >
      <v-badge color="#94D0EF" :content="quantidade">
        <v-icon>mdi-cart-outline</v-icon>
      </v-badge>
    </v-btn>
  </v-fab-transition>
</template>

<script>
  export default {
    props: {
      quantidade: {
        type: [Number, String],
        default: '0'
      }
    }
  }
</script>

<style scoped>
  .btn-carrinho {
    position: fixed;
    bottom: 100px;
    right: 14px;
    border-radius: 50px;
  }
</style>
