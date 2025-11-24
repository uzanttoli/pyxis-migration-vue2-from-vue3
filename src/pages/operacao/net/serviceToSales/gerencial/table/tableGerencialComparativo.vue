<template>
  <v-card elevation="0">
    <!-- <title-negative-margin
      :title="title"
      :icon="titleIcon"
    ></title-negative-margin> -->
    <!-- <v-card-title class="text-center">{{ title }}</v-card-title> -->
    <v-data-table
      dense
      :fixed-header="true"
      :item-key="colunaChave"
      :items="base"
      :headers="getHeaders(tipo)"
      no-data-text="Não há dados de vendas no momento!"
      loading-text="Carregando...Por favor aguarde!"
      hide-default-footer
      class="text-center"
    >
      <template v-slot:header>
        <thead>
          <tr>
            <th
              class="text-center"
              v-for="(item, i) in getHeaderSuperior(tipo)"
              :key="'B' + i"
              :colspan="item.colspan"
              :class="item.class"
            >
              {{ item.text }}
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:item.PERC_CONVERSAO="{ item }">
        {{ item.PERC_CONVERSAO | convertPercent }}
      </template>
      <template v-slot:item.PERC_CONVERSAO_D0_X_D1="{ item }">
        {{ item.PERC_CONVERSAO_D0_X_D1 | convertPercent }}
      </template>
    </v-data-table>
    <v-overlay :value="carregando">
      <v-progress-circular indeterminate size="100" value="Carregando">
        Carregando
      </v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
  import config from '../../../../../core/config'
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      titleIcon: {
        type: String,
        default: ''
      },
      endpoint: {
        type: String,
        require: true
      },
      tipo: {
        type: String
      }
    },
    data: () => ({
      base: [],
      colunaChave: '',
      carregando: false
    }),
    computed: {
      dataReferencia() {
        let base = this.base
        if (base != '') {
          return base[0].DATA_FILTRO.split('-').reverse().join('/')
        }
        return ''
      }
    },
    filters: {
      convertPercent(value) {
        return (value * 100).toFixed(2).concat('%')
      }
    },
    methods: {
      getHeaderSuperior(tipo = 'maior-venda') {
        let headerMaiorVenda = [
          {
            text: `Data referência: ${this.dataReferencia}`,
            colspan: 4,
            class: 'blue darken-3 white--text'
          }
        ]

        let headerDiaAnterior = [
          {
            text: 'D-1',
            colspan: 3,
            class: 'blue darken-3 white--text'
          }
        ]

        let headerDiaAtual = [
          {
            text: 'D-0',
            colspan: 3,
            class: 'blue darken-3 white--text'
          }
        ]

        let comparativoDiaAtualComAnterior = [
          {
            text: 'D-0 X D-1',
            colspan: 2,
            class: 'orange darken-4 white--text'
          }
        ]

        let comparativoDiaAtualComDiaMaiorVenda = [
          {
            text: 'D-0 X Referência',
            colspan: 2,
            class: 'orange darken-4 white--text'
          }
        ]

        if (tipo == 'maior-venda') {
          return headerMaiorVenda
        } else if (tipo == 'dia-anterior') {
          return headerDiaAnterior
        } else if (tipo == 'dia-atual') {
          return headerDiaAtual
        } else if (tipo == 'comparativo-dia-atual-com-anterior') {
          return comparativoDiaAtualComAnterior
        } else if (tipo == 'comparativo-dia-atual-com-dia-maior-venda') {
          return comparativoDiaAtualComDiaMaiorVenda
        }
      },
      getHeaders(tipo = 'maior-venda') {
        let headerMaiorVenda = [
          {
            text: 'Intervalo',
            value: 'INTERVALO',
            align: 'center',
            sortable: false
          },
          {
            text: 'Atendidas',
            value: 'ATENDIDAS',
            align: 'center',
            sortable: false
          },
          {
            text: 'Vendas',
            value: 'VENDA_BRUTA',
            align: 'center',
            sortable: false
          },
          {
            text: '(%) Conversão',
            value: 'PERC_CONVERSAO',
            align: 'center',
            sortable: false
          }
        ]

        let headerDiaAnterior = [
          {
            text: 'Aten.',
            value: 'ATENDIDAS',
            align: 'center',
            sortable: false
          },
          {
            text: 'Vendas',
            value: 'VENDA_BRUTA',
            align: 'center',
            sortable: false
          },
          {
            text: '(%) Conversão',
            value: 'PERC_CONVERSAO',
            align: 'center',
            sortable: false
          }
        ]

        let headerDiaAtual = [
          {
            text: 'Aten.',
            value: 'ATENDIDAS',
            align: 'center',
            sortable: false
          },
          {
            text: 'Vendas',
            value: 'VENDA_BRUTA',
            align: 'center',
            sortable: false
          },
          {
            text: '(%) Conversão',
            value: 'PERC_CONVERSAO',
            align: 'center',
            sortable: false
          }
        ]

        let comparativoDiaAtualComAnterior = [
          {
            text: 'Vendas',
            value: 'VENDAS_D0_X_D1',
            align: 'center',
            sortable: false
          },
          {
            text: '(%) Conversão',
            value: 'PERC_CONVERSAO_D0_X_D1',
            align: 'center',
            sortable: false
          }
        ]

        let comparativoDiaAtualComDiaMaiorVenda = [
          {
            text: 'Vendas',
            value: 'VENDAS_D0_X_D1',
            align: 'center',
            sortable: false
          },
          {
            text: '(%) Conversão',
            value: 'PERC_CONVERSAO_D0_X_D1',
            align: 'center',
            sortable: false
          }
        ]

        if (tipo == 'maior-venda') {
          return headerMaiorVenda
        } else if (tipo == 'dia-anterior') {
          return headerDiaAnterior
        } else if (tipo == 'dia-atual') {
          return headerDiaAtual
        } else if (tipo == 'comparativo-dia-atual-com-anterior') {
          return comparativoDiaAtualComAnterior
        } else if (tipo == 'comparativo-dia-atual-com-dia-maior-venda') {
          return comparativoDiaAtualComDiaMaiorVenda
        }
      },

      async loadBase() {
        this.carregando = true
        let urlData = `${config.baseUrl}${this.endpoint}`
        var res = await this.$api.get(urlData)
        this.base = res.data
        this.carregando = false
      }
    },
    created() {
      this.loadBase()
    }
  }
</script>

<style></style>
