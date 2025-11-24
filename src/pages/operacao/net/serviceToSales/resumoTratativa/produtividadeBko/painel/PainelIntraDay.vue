<template>
  <v-container fluid>
    <v-col cols="12">
      <v-card class="mt-2 rounded-xl" elevation="2">
        <v-card-title>
          <span v-if="isLoading" class="mr-2">
            <v-progress-circular indeterminate size="25" color="primary"></v-progress-circular>
          </span>
          Acompanhamento Dia
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
          :no-data-text="'Não há dados no momento!'"
          loading-text="Carregando..."
        ></v-data-table>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
  export default {
    components: {},
    props: {
      base: {
        type: [Array, Object],
        default: () => []
      },
      data: {
        type: [Date, String],
        default: () => new Date()
      },
      isLoading: {
        type: Boolean,
        default: false
      },
      produto: {
        type: String,
        default: ''
      }
    },
    data: vm => ({
      loading: false,
      nomeBase: `${vm.produto + '_BKO_PYXIS_TRATAMENTO_INTRA_DAY_' + vm.data.split('-').join('')}`,
      title: 'Dados intra day',
      search: null,
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      }
    }),
    computed: {
      headers() {
        let hoje = new Date()
        let dataSelecionada = this.data

        let [, mes, dia] = hoje.toISOString().split('T')[0].split('-')
        let [anoSelecionado, mesSelecionado] = dataSelecionada.split('-')

        let ultDiaMes = new Date(anoSelecionado, mesSelecionado, 0)
        let getUltDiaMes = ultDiaMes.toISOString().split('T')[0].split('-')

        let [, , diaUlt] = getUltDiaMes

        let arrheaders = [
          {
            text: 'Almope',
            value: 'Almope',
            align: 'center',
            class: 'grey lighten-3'
          },
          {
            text: 'Nome',
            value: 'Nome',
            align: 'center',
            class: 'grey lighten-3'
          },
          {
            text: 'Total',
            value: 'Total',
            sortable: true,
            align: 'center',
            class: 'grey lighten-3'
          }
        ]

        let index = mes == mesSelecionado ? dia : diaUlt
        for (let i = 1; i <= index; i++) {
          let valor = i.toString().length == 1 ? '0' + i.toString() : i.toString()
          arrheaders.push({
            text: 'Dia ' + i + 'ª',
            value: valor,
            align: 'center',
            sortable: false,
            class: i % 2 ? 'grey lighten-3' : ''
          })
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
        } else {
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
