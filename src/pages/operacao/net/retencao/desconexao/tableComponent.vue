<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      class="mx-auto rounded-xl"
      min-width="500"
      type="table-tbody"
    ></v-skeleton-loader>
    <v-data-table
      v-else
      :headers="getHeaders"
      :items="dados"
      class="elevation-1 rounded-xl"
      :footer-props="footerProps"
      :items-per-page="5"
      :search="search"
      multi-sort
    >
      <template v-slot:top>
        <v-toolbar flat class="rounded-t-xl">
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            outlined
            dense
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:item.VERIFICAR="{ item }">
        <v-btn @click="dadosClick(item)" icon small>
          <v-icon size="15" color="success">fa-solid fa-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    props: {
      dados: {
        type: [Array],
        default: () => []
      },
      action: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      search: '',
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      }
    }),
    computed: {
      getHeaders() {
        let data = this.dados[0]
        if (!data) return []
        let headers = Object.keys(data)
          .map(item => {
            return {
              text: item,
              value: item,
              class: '',
              align: 'center'
            }
          })
          .filter(item2 => {
            return item2.text != 'COLUNA'
          })

        if (this.action) {
          headers.push({
            text: 'Verificar',
            value: 'VERIFICAR',
            class: '',
            align: 'center'
          })
        }
        return headers
      }
    },
    methods: {
      dadosClick(item) {
        this.$emit('update:dados-click', item)
      }
    }
  }
</script>

<style></style>
