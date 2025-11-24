<template>
  <div>
    <v-btn class="card" width="50" height="50" @click="scrollToTop()" color="red" fab>
      <v-icon color="white">mdi-arrow-up</v-icon>
    </v-btn>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Coordenador'
      }
    },
    methods: {
      scrollToTop() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    },
    watch: {
      validarScroll() {
        this.scrollToTop()
      }
    }
  }
</script>

<style scoped>
  /* From cssbuttons.io by @Vikikos */
  .card {
    position: fixed;
    bottom: 120px;
    right: 14px;
    border-radius: 10px;
  }
</style>
