<template>
  <div class="card">
    <v-tooltip top>
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          fab
          dark
          v-bind="attrs"
          v-on="on"
          small
          color="indigo"
          @click="$emit('abrirCalc')"
          class="mx-1"
        >
          <v-icon small>fa-solid fa-calculator</v-icon>
        </v-btn>
      </template>
      <span>Calculadora</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ attrs, on }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          fab
          dark
          small
          color="green"
          class="mx-1"
          @click="abrirBlocoDeNotas = !abrirBlocoDeNotas"
        >
          <v-icon small>fa-solid fa-book</v-icon>
        </v-btn>
      </template>
      <span>Bloco de Notas</span>
    </v-tooltip>
    <v-tooltip top>
      <template v-slot:activator="{ attrs, on }">
        <a href="/pyxis/chat/" target="_blank">
          <v-btn fab dark v-bind="attrs" v-on="on" class="mx-1" small color="orange">
            <v-icon small>fa-solid fa-message</v-icon>
          </v-btn>
        </a>
      </template>
      <span>Chat</span>
    </v-tooltip>
    <bloco-de-notas
      :dialogModal="abrirBlocoDeNotas"
      :usuarioAlmope="usuarioAlmope"
      @closeModal="abrirBlocoDeNotas = !abrirBlocoDeNotas"
      @update:notasFlutuantes="notasFlutuantes"
    ></bloco-de-notas>
  </div>
</template>
<script>
  import blocoDeNotas from '../utilities/blocoDeNotas/blocoDeNotas.component.vue'
  export default {
    components: {
      blocoDeNotas
    },
    data: () => ({
      abrirHistoria: false,
      abrirBlocoDeNotas: false,
      openCalculator: false,
      menuVisible: true,
      direction: 'left',
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      transition: 'slide-y-reverse-transition'
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      openChat() {
        this.$router.push('/pyxis/chat/')
      },
      notasFlutuantes() {
        this.$emit('update:notasFlutuantes')
      }
    },
    watch: {}
  }
</script>
<style scoped>
  .card {
    position: fixed;
    bottom: 10px;
    right: 30px;
    border-radius: 50px;
    z-index: 10;
  }
</style>
