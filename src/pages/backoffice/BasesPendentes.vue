<template>
  <v-row justify="center">
    <div class="alert">
      <servidor-ping></servidor-ping>
    </div>
    <v-col class="mt-3" cols="4" xl="4" md="12" sm="12" v-for="(item, i) in campanha" :key="i">
      <tableDinamica
        :title="item.title"
        :apiUrl="item.api"
        :dadosHeaders="arrHeaders"
        :headersCustom="true"
        @update:reload-base="isReload"
        :isFooter="true"
      ></tableDinamica>
    </v-col>
  </v-row>
</template>

<script>
  import tableDinamica from '../../shared/components/table/table.component.vue'
  import ServidorPing from './servidorPing.vue'
  export default {
    components: { tableDinamica, ServidorPing },
    data: () => ({
      bases: [],
      campanha: [
        { title: 'TV', api: 'api/shared/backoffice/bases/pendentes/TV' },
        { title: 'MTF', api: 'api/shared/backoffice/bases/pendentes/MTF' },
        { title: 'CM', api: 'api/shared/backoffice/bases/pendentes/CM' }
      ]
    }),
    computed: {
      arrHeaders() {
        return [
          { textCustom: '#', column: 'ID' },
          { textCustom: 'NOME_ARQUIVO', column: 'NOME_ARQUIVO' },
          { textCustom: 'Fonte', column: 'MAPA' },
          { textCustom: 'Farol', column: 'ALERTA' }
        ]
      }
    },
    methods: {},
    created() {}
  }
</script>
<style scoped>
  .alert {
    width: 100%;
    margin: 10px 0 -50px 0;
    padding: 20px;
  }
</style>
