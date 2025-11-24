<template>
  <v-container fluid>
    <v-card min-height="100" class="rounded-xl">
      <v-card-title>🎲 Painel de acompanhamento</v-card-title>
      <v-card-subtitle>Selecione um relatório no menu abaixo</v-card-subtitle>
      <!-- <v-divider></v-divider> -->
      <div class="mt-n6">
        <MenuListTop :itemsMenu="itemsMenu" v-model="selecionado"></MenuListTop>
      </div>
    </v-card>
    <v-col class="mt-4 ma-0 pa-0">
      <component :is="selecionado"></component>
    </v-col>
  </v-container>
</template>

<script>
  import MenuListTop from '@/shared/components/MenuListTop.vue'
  import Farol from './Farol.vue'
  export default {
    components: { MenuListTop, Farol },
    data: () => ({
      selecionado: null,
      itemsMenu: [
        {
          relatorio: 'Relatórios',
          subItem: [
            {
              text: 'Farol',
              value: 'Farol'
            }
          ]
        }
      ]
    }),
    methods: {}
  }
</script>

<style scoped></style>
