<template>
  <v-row class="mt-2 mb-3">
    <v-col v-for="(item, i) in config" :key="i" cols="6">
      <table-desempenho-geral-component
        :title="item.TITULO"
        :apiUrl="item.ENDPOINT"
        :agrupamentoSelecionado="item.AGRUPAMENTO"
      ></table-desempenho-geral-component>
    </v-col>
  </v-row>
</template>

<script>
  // import config from "../../../../../core/config";
  import tableDesempenhoGeralComponent from '../../../../../shared/components/table/tableDesempenhoGeral.component.vue'
  export default {
    components: { tableDesempenhoGeralComponent },
    props: {},
    data: () => ({
      config: [
        {
          TITULO: 'Desempenho Geral Massivo CE e RJ',
          ENDPOINT: 'api/shared/ocupacao/listar_dados_desempenho',
          AGRUPAMENTO: 'MASSIVO CE E RJ'
        },
        {
          TITULO: 'Desempenho Geral Massivo SP',
          ENDPOINT: 'api/shared/ocupacao/listar_dados_desempenho',
          AGRUPAMENTO: 'MASSIVO SP'
        }
      ]
    }),
    methods: {},
    created() {}
  }
</script>

<style></style>
