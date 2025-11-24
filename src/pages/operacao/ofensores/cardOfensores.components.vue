<template>
  <v-sheet elevation="0">
    <v-card min-height="273" elevation="1">
      <title-negative-margin :title="normalizeTitle(title)"></title-negative-margin>
      <v-data-table
        dense
        :headers="colunas"
        :items="itemsDados"
        hide-default-footer
        no-data-text="Não há ofensores no momento"
        class="text-no-wrap"
      >
        <template v-slot:item.PERC_INDICADOR="{ item }">
          {{ item.PERC_INDICADOR | percentage(item.PERC_INDICADOR) }}
        </template>
      </v-data-table>
    </v-card>
  </v-sheet>
</template>

<script>
  export default {
    name: 'card-ofensores-component',
    props: {
      title: {
        type: String,
        default: ''
      },
      colunas: {
        type: [Array, Object]
      },
      itemsDados: {
        type: [Array, Object]
      }
    },
    data: () => ({}),
    computed: {},
    methods: {
      normalizeTitle(text) {
        if (!text) return
        return text.toLowerCase()
      }
    },
    created() {}
  }
</script>

<style></style>
