<template>
  <div>
    <v-btn
      class="card"
      width="50"
      height="50"
      color="primary"
      fab
      @click="abrirBlocoDeNotas = !abrirBlocoDeNotas"
    >
      <v-icon color="white">mdi-notebook-heart</v-icon>
    </v-btn>
    <bloco-de-notas
      :dialogModal="abrirBlocoDeNotas"
      :usuarioAlmope="usuarioAlmope"
      @closeModal="abrirBlocoDeNotas = !abrirBlocoDeNotas"
    ></bloco-de-notas>
  </div>
</template>

<script>
  import blocoDeNotas from '../utilities/blocoDeNotas/blocoDeNotas.component.vue'
  export default {
    components: { blocoDeNotas },
    props: {},
    data: () => ({
      abrirBlocoDeNotas: false
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {},
    watch: {}
  }
</script>

<style scoped>
  .card {
    position: fixed;
    bottom: 75px;
    right: 14px;
    border-radius: 50px;
  }
</style>
