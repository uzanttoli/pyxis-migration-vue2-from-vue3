<template>
  <section class="mt-7">
    <v-card class="pa-3 rounded-t-xl" color="grey lighten-5">
      <v-row justify="end" class="mx-3 py-3">
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              depressed
              rounded
              fab
              small
              color="primary"
              v-bind="attrs"
              v-on="on"
              to="/pyxis/loja"
            >
              <v-icon>mdi-keyboard-return</v-icon>
            </v-btn>
          </template>
          <span>Voltar para loja</span>
        </v-tooltip>
      </v-row>
      <CardGroup />
      <v-row>
        <TableProdutosCadastrados />
      </v-row>
      <v-row>
        <BannerCadastrados />
      </v-row>
    </v-card>
  </section>
</template>

<script>
  import TableProdutosCadastrados from './TableProdutosCadastrados.vue'
  import BannerCadastrados from './BannerCadastrados.vue'
  import CardGroup from './CardGroup.vue'
  export default {
    components: {
      TableProdutosCadastrados,
      BannerCadastrados,
      CardGroup
    },
    data: () => ({})
  }
</script>

<style></style>
