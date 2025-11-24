<template>
  <v-container fluid>
    <v-col cols="12">
      <v-card class="mt-2 rounded-xl" elevation="2">
        <v-card-title>
          <span v-if="isLoading" class="mr-2">
            <v-progress-circular indeterminate size="25" color="primary"></v-progress-circular>
          </span>
          Acompanhamento Hora Hora
          <download-excel :data="base" :name="nomeBase" :worksheet="nomeBase" class="ml-2">
            <v-btn fab x-small class="mr-1" elevation="1">
              <v-icon class="blue--text">fa-solid fa-file-arrow-down</v-icon>
            </v-btn>
          </download-excel>
        </v-card-title>
        <v-col cols="3" class="pa-0">
          <v-text-field
            outlined
            dense
            class="mx-2"
            placeholder="Pesquisar"
            label="Pesquisar"
            v-model="search"
          ></v-text-field>
        </v-col>
        <v-data-table
          :headers="headers"
          :items="base"
          :footer-props="footerProps"
          :loading="isLoading"
          dense
          :search="search"
          class="text-no-wrap"
          :item-class="getClass"
          :no-data-text="'Não há dados no momento!'"
          loading-text="Carregando..."
        >
          <template v-slot:body="{ items }">
            <tbody class="text-center">
              <tr v-for="(item, i) in items" :key="i">
                <td>{{ item.Almope }}</td>
                <td>{{ item.Nome }}</td>
                <td>{{ item.Total }}</td>
                <td
                  v-for="i in 17"
                  :key="i"
                  :class="classTable(item[(i + 6).toString().padStart(2, '0')])"
                >
                  {{ item[(i + 6).toString().padStart(2, '0')] }}
                </td>
              </tr>
              <tr v-if="base == ''">
                <td colspan="21" class="grey--text">Não há informações</td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
  export default {
    props: {
      base: {
        type: [Array, Object],
        default: () => []
      },
      isLoading: {
        type: Boolean,
        default: false
      },
      data: {
        type: [Date, String],
        default: () => new Date()
      },
      produto: {
        type: String,
        default: ''
      }
    },
    data: vm => ({
      loading: false,
      title: '',
      search: null,
      nomeBase: `${vm.produto + '_BKO_PYXIS_TRATAMENTO_INTRA_HORA_' + vm.data.split('-').join('')}`,
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      }
    }),
    computed: {
      headers() {
        let arrheaders = [
          {
            text: 'Almope',
            value: 'Almope',
            align: 'center',
            sortable: false,
            class: 'grey lighten-3'
          },
          {
            text: 'Nome',
            value: 'Nome',
            align: 'center',
            sortable: false,
            class: 'grey lighten-3'
          },
          {
            text: 'Total',
            value: 'total',
            align: 'center',
            sortable: false,
            class: 'grey lighten-3'
          }
        ]

        for (let i = 0; i <= 31; i++) {
          if (i >= 7 && i <= 23) {
            let text = i.toString().length == 1 ? '0' + i + ':00' : i + ':00'
            let valor = i.toString().length == 1 ? '0' + i.toString() : i.toString()
            arrheaders.push({
              text: text,
              value: valor,
              align: 'center',
              sortable: false,
              class: i % 2 ? 'grey lighten-3' : ''
            })
          }
        }
        return arrheaders
      }
    },
    methods: {
      classTable(value) {
        if (!value) return
        if (value < 4) {
          return 'orange darken-3 white--text'
        } else if (value == 4) {
          return 'cyan accent-4 white--text'
        } else if (value > 4) {
          return 'light-blue darken-4 white--text'
        }
      },
      getClass(item) {
        if (item.ALMOPE_TRATAMENTO_FECHAMENTO === 'TOTAL')
          return 'blue-grey lighten-5 font-weight-bold'
      }
    }
  }
</script>

<style></style>
