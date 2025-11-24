<template>
  <section>
    <v-row class="pa-0 ma-0">
      <v-col cols="6" class="pa-0 ma-0">
        <controle-perfil></controle-perfil>
      </v-col>
      <v-col cols="6" class="pa-0 ma-0">
        <criacao-perfil></criacao-perfil>
      </v-col>
    </v-row>
    <table-users></table-users>
  </section>
</template>

<script>
  import ControlePerfil from './ControlePerfil.vue'
  import CriacaoPerfil from './CriacaoPerfil.vue'
  import TableUsers from './table/TableUsers.vue'
  export default {
    components: { TableUsers, ControlePerfil, CriacaoPerfil }
  }
</script>

<style></style>
