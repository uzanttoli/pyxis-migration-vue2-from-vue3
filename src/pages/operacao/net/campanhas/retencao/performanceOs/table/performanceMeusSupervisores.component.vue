<template>
  <!-- PERFORMANCE PARA COORDENADOR -->
  <div v-if="meusSupervisores != ''">
    <v-card>
      <v-card-title class="ml-1 pl-1">
        <v-card
          :min-width="minWidth"
          max-width="370"
          class="cor-padrao pa-2 ml-n3 rounded-r-xl white--text text-capitalize text-no-wrap"
        >
          {{ title }}
          <v-icon color="white">{{ icon }}</v-icon>
          <template v-if="progressVisible == true">
            <v-progress-circular
              :size="sizeProgress"
              :value="countIntervalProgress"
              :color="corProgress"
            ></v-progress-circular>
          </template>
        </v-card>
        <v-spacer></v-spacer>
        <slot></slot>
      </v-card-title>
      <v-data-table
        no-data-text="Não há informações no momento!"
        loading-text="Carregando...Por favor Aguarde!"
        :loading="loading"
        dense
        :items="meusSupervisores"
        class="text-no-wrap"
        :item-key="colunaChave"
        :headers="getHeaders(this.cargoColaboradorLogado)"
      >
        <template v-slot:item.TOTAL_COLABORADOR="{ item }">
          {{ item.TOTAL_COLABORADOR | percentage }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'TablePerformanceOsMeusSupervisores',
    props: {
      urlActionMeusSupervisores: {
        type: String,
        require: true
      },
      sizeProgress: {
        type: Number,
        default: 15
      },
      progressVisible: {
        type: [String, Boolean],
        default: 'false'
      },
      corProgress: {
        type: String,
        default: 'deep-orange lighten-2'
      },
      countIntervalProgress: {
        type: Number,
        default: 0
      },
      title: {
        type: String,
        default: 'Título'
      },
      icon: {
        type: String,
        default: ''
      },
      minWidth: {
        type: Number,
        default: 300
      }
    },
    data: () => ({
      loading: false,
      base: [],
      colunaChave: 'Coordenador'
    }),
    computed: {
      meusSupervisores() {
        let meusSupervisores = this.$store.getters.performanceOsMeusSupervisores
        let percent = '%'
        meusSupervisores.map(item => {
          if (item['1']) {
            item['1'] = item['1'].concat(percent)
          } else {
            item['1'] = '-'
          }
          if (item['2']) {
            item['2'] = item['2'].concat(percent)
          } else {
            item['2'] = '-'
          }
          if (item['3']) {
            item['3'] = item['3'].concat(percent)
          } else {
            item['3'] = '-'
          }
          if (item['4']) {
            item['4'] = item['4'].concat(percent)
          } else {
            item['4'] = '-'
          }
          if (item['5']) {
            item['5'] = item['5'].concat(percent)
          } else {
            item['5'] = '-'
          }
          if (item['6']) {
            item['6'] = item['6'].concat(percent)
          } else {
            item['6'] = '-'
          }
          if (item['7']) {
            item['7'] = item['7'].concat(percent)
          } else {
            item['7'] = '-'
          }
          if (item['8']) {
            item['8'] = item['8'].concat(percent)
          } else {
            item['8'] = '-'
          }
          if (item['9']) {
            item['9'] = item['9'].concat(percent)
          } else {
            item['9'] = '-'
          }
          if (item['10']) {
            item['10'] = item['10'].concat(percent)
          } else {
            item['10'] = '-'
          }
          if (item['11']) {
            item['11'] = item['11'].concat(percent)
          } else {
            item['11'] = '-'
          }
          if (item['12']) {
            item['12'] = item['12'].concat(percent)
          } else {
            item['12'] = '-'
          }
          if (item['13']) {
            item['13'] = item['13'].concat(percent)
          } else {
            item['13'] = '-'
          }
          if (item['14']) {
            item['14'] = item['14'].concat(percent)
          } else {
            item['14'] = '-'
          }
          if (item['15']) {
            item['15'] = item['15'].concat(percent)
          } else {
            item['15'] = '-'
          }
          if (item['16']) {
            item['16'] = item['16'].concat(percent)
          } else {
            item['16'] = '-'
          }
          if (item['17']) {
            item['17'] = item['17'].concat(percent)
          } else {
            item['17'] = '-'
          }
          if (item['18']) {
            item['18'] = item['18'].concat(percent)
          } else {
            item['18'] = '-'
          }
          if (item['19']) {
            item['19'] = item['19'].concat(percent)
          } else {
            item['19'] = '-'
          }
          if (item['20']) {
            item['20'] = item['20'].concat(percent)
          } else {
            item['20'] = '-'
          }
          if (item['21']) {
            item['21'] = item['21'].concat(percent)
          } else {
            item['21'] = '-'
          }
          if (item['22']) {
            item['22'] = item['22'].concat(percent)
          } else {
            item['22'] = '-'
          }
          if (item['23']) {
            item['23'] = item['23'].concat(percent)
          } else {
            item['23'] = '-'
          }
          if (item['24']) {
            item['24'] = item['24'].concat(percent)
          } else {
            item['24'] = '-'
          }
          if (item['25']) {
            item['25'] = item['25'].concat(percent)
          } else {
            item['25'] = '-'
          }
          if (item['26']) {
            item['26'] = item['26'].concat(percent)
          } else {
            item['26'] = '-'
          }
          if (item['27']) {
            item['27'] = item['27'].concat(percent)
          } else {
            item['27'] = '-'
          }
          if (item['28']) {
            item['28'] = item['28'].concat(percent)
          } else {
            item['28'] = '-'
          }
          if (item['29']) {
            item['29'] = item['29'].concat(percent)
          } else {
            item['29'] = '-'
          }
          if (item['30']) {
            item['30'] = item['30'].concat(percent)
          } else {
            item['30'] = '-'
          }
          if (item['31']) {
            item['31'] = item['31'].concat(percent)
          } else {
            item['31'] = '-'
          }
        })

        return meusSupervisores
      },
      cargoColaboradorLogado() {
        let cargoColaboradorLogado = this.$store.getters.usuario.filtro
        return cargoColaboradorLogado ? cargoColaboradorLogado : '-'
      }
    },
    methods: {
      loadPerformanceOsMeusSupervisores() {
        this.$store.dispatch('loadPerformanceOsMeusSupervisores', this.urlActionMeusSupervisores)
      },
      getHeaders(cargoColaborador = this.cargoColaboradorLogado) {
        //
        let headerCoordenador = {
          text: 'Supervisores',
          align: 'center',
          sortable: false,
          value: 'NOME', //Supervisor
          class: 'grey lighten-2'
        }
        let headerSupervisor = {
          text: 'Operadores',
          align: 'center',
          sortable: false,
          value: 'NOME', // Operador
          class: 'grey lighten-2'
        }
        // dias
        //   let headerPrimaryDay = {
        //     text: "01",
        //     align: "center",
        //     sortable: false,
        //     value: "",
        //     class: "",
        //   };

        let arrHeader = [
          {
            text: 'Consolidado',
            align: 'center',
            sortable: false,
            value: 'TOTAL_COLABORADOR',
            class: 'grey lighten-4'
          },
          {
            text: '01',
            align: 'center',
            sortable: false,
            value: '1',
            class: ''
          },
          {
            text: '02',
            align: 'center',
            sortable: false,
            value: '2',
            class: ''
          },
          {
            text: '03',
            align: 'center',
            sortable: false,
            value: '3',
            class: ''
          },
          {
            text: '04',
            align: 'center',
            sortable: false,
            value: '4',
            class: ''
          },
          {
            text: '05',
            align: 'center',
            sortable: false,
            value: '5',
            class: ''
          },
          {
            text: '06',
            align: 'center',
            sortable: false,
            value: '6',
            class: ''
          },
          {
            text: '07',
            align: 'center',
            sortable: false,
            value: '7',
            class: ''
          },
          {
            text: '08',
            align: 'center',
            sortable: false,
            value: '8',
            class: ''
          },
          {
            text: '09',
            align: 'center',
            sortable: false,
            value: '9',
            class: ''
          },
          {
            text: '10',
            align: 'center',
            sortable: false,
            value: '10',
            class: ''
          },
          {
            text: '11',
            align: 'center',
            sortable: false,
            value: '11',
            class: ''
          },
          {
            text: '12',
            align: 'center',
            sortable: false,
            value: '12',
            class: ''
          },
          {
            text: '13',
            align: 'center',
            sortable: false,
            value: '13',
            class: ''
          },
          {
            text: '14',
            align: 'center',
            sortable: false,
            value: '14',
            class: ''
          },
          {
            text: '15',
            align: 'center',
            sortable: false,
            value: '15',
            class: ''
          },
          {
            text: '16',
            align: 'center',
            sortable: false,
            value: '16',
            class: ''
          },
          {
            text: '17',
            align: 'center',
            sortable: false,
            value: '17',
            class: ''
          },
          {
            text: '18',
            align: 'center',
            sortable: false,
            value: '18',
            class: ''
          },
          {
            text: '19',
            align: 'center',
            sortable: false,
            value: '19',
            class: ''
          },
          {
            text: '20',
            align: 'center',
            sortable: false,
            value: '20',
            class: ''
          },
          {
            text: '21',
            align: 'center',
            sortable: false,
            value: '21',
            class: ''
          },
          {
            text: '22',
            align: 'center',
            sortable: false,
            value: '22',
            class: ''
          },
          {
            text: '23',
            align: 'center',
            sortable: false,
            value: '23',
            class: ''
          },
          {
            text: '24',
            align: 'center',
            sortable: false,
            value: '24',
            class: ''
          },
          {
            text: '25',
            align: 'center',
            sortable: false,
            value: '25',
            class: ''
          },
          {
            text: '26',
            align: 'center',
            sortable: false,
            value: '26',
            class: ''
          },
          {
            text: '27',
            align: 'center',
            sortable: false,
            value: '27',
            class: ''
          },
          {
            text: '28',
            align: 'center',
            sortable: false,
            value: '28',
            class: ''
          },
          {
            text: '29',
            align: 'center',
            sortable: false,
            value: '29',
            class: ''
          },
          {
            text: '30',
            align: 'center',
            sortable: false,
            value: '30',
            class: ''
          },
          {
            text: '31',
            align: 'center',
            sortable: false,
            value: '31',
            class: ''
          }
        ]

        if (cargoColaborador == 'GERENTE') {
          this.colunaChave = 'Supervisor'
          arrHeader.unshift(headerCoordenador)
        } else if (cargoColaborador == 'SUPERVISOR') {
          this.colunaChave = 'Nome'
          arrHeader.unshift(headerSupervisor)
        } else {
          this.colunaChave = 'Nome'
          arrHeader.unshift({
            text: 'Nome',
            align: 'center',
            sortable: true,
            value: '',
            class: ''
          })
        }
        return arrHeader
      }
    },
    created() {
      this.loadPerformanceOsMeusSupervisores()
    }
  }
</script>

<style scoped>
  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }
</style>
