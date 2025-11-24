<template>
  <v-row>
    <v-col>
      <v-card elevation="1" class="rounded-xl">
        <title-negative-margin title="Vencimento Próximas Horas" :minWidth="350">
          <template v-slot:button>
            <download-excel :data="base" :name="nameTratado" :worksheet="nameTratado">
              <v-btn fab x-small class="mr-1" elevation="1">
                <v-icon class="blue--text">fa-solid fa-file-arrow-down</v-icon>
              </v-btn>
            </download-excel>
          </template>
          <v-col cols="2" class="my-0 py-0">
            <v-text-field
              dense
              outlined
              class="rounded-bl-xl rounded-r-xl"
              v-model="search"
              placeholder="Procure aqui..."
              label="Pesquisa rápida"
            ></v-text-field>
          </v-col>
        </title-negative-margin>
        <div id="alert"></div>
        <v-data-table
          :headers="headers"
          dense
          :search="search"
          no-results-text="Nada encontrado!"
          no-data-text="Não há nada por aqui..."
          loading-text="Carregando... Por favor aguarde!"
          :loading="loading"
          :items="base"
          :footer-props="footerProps"
        >
          <template v-slot:item="{ item, index }">
            <tr
              :class="index % 2 === 0 ? 'white' : 'grey lighten-4'"
              class="text-center custom-row"
            >
              <td>{{ item.AGRUPAMENTO }}</td>
              <td>{{ item.CR_TRATANDO }}</td>
              <td>{{ item.OC_POR_CR }}</td>
              <td>{{ item.FP }}</td>
              <td>{{ item.FP_HOJE }}</td>
              <td :class="item['00:30'] > 0 ? 'piscar' : ''">
                {{ item['00:30'] }}
              </td>
              <td :class="item['01:00'] > 0 ? 'piscar' : ''">
                {{ item['01:00'] }}
              </td>
              <td :class="item['02:00'] > 0 ? 'piscar' : ''">
                {{ item['02:00'] }}
              </td>
              <td>{{ item['03:00'] }}</td>
              <td>{{ item['04:00'] }}</td>
              <td>{{ item['05:00'] }}</td>
              <td>{{ item['06:00'] }}</td>
              <td>{{ item['08:00'] }}</td>
              <td>{{ item['16:00'] }}</td>
              <td>{{ item['24:00'] }}</td>
              <td>{{ item.TOTAL }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import config from '../../../../core/config'
  export default {
    props: {
      produto: {
        type: String,
        default: 'COMBO BKO'
      }
    },
    data() {
      return {
        search: '',
        footerProps: {
          itemsPerPageText: 'Itens por página:',
          pageText: '{0}-{1} de {2}',
          perPageText: 'Itens por página:'
        },
        iconUp: 'fa-solid fa-caret-up',
        iconDown: 'fa-solid fa-caret-down',
        iconZero: 'fa-solid fa-minus',
        loading: false,
        base: [],
        headers: [
          {
            text: 'Agrupamento',
            align: 'center',
            value: 'AGRUPAMENTO',
            class: 'grey lighten-2'
          },
          {
            text: 'Agentes Tratando',
            align: 'center',
            value: 'CR_TRATANDO',
            class: 'grey lighten-2'
          },
          {
            text: 'OC Por Agente',
            align: 'center',
            value: 'OC_POR_CR',
            class: 'grey lighten-2'
          },
          {
            text: 'Fora do Prazo',
            align: 'center',
            value: 'FP',
            class: 'grey lighten-2'
          },
          {
            text: 'Fora do Prazo - Hoje',
            align: 'center',
            value: 'FP_HOJE',
            class: 'grey lighten-2'
          },
          {
            text: '+30 min',
            align: 'center',
            value: '00:30',
            class: 'grey lighten-4'
          },
          {
            text: '+1 hora',
            align: 'center',
            value: '01:00',
            class: 'grey lighten-4'
          },
          {
            text: '+2 horas',
            align: 'center',
            value: '02:00',
            class: 'grey lighten-4'
          },
          {
            text: '+3 horas',
            align: 'center',
            value: '03:00',
            class: 'grey lighten-4'
          },
          {
            text: '+4 horas',
            align: 'center',
            value: '04:00',
            class: 'grey lighten-4'
          },
          {
            text: '+5 horas',
            align: 'center',
            value: '05:00',
            class: 'grey lighten-4'
          },
          {
            text: '+6 horas',
            align: 'center',
            value: '06:00',
            class: 'grey lighten-4'
          },
          {
            text: '+8 horas',
            align: 'center',
            value: '08:00',
            class: 'grey lighten-4'
          },
          {
            text: '+16 horas',
            align: 'center',
            value: '16:00',
            class: 'grey lighten-4'
          },
          {
            text: '+24 horas',
            align: 'center',
            value: '24:00',
            class: 'grey lighten-4'
          },
          {
            text: 'Total',
            align: 'center',
            value: 'TOTAL',
            class: 'grey lighten-5'
          }
        ]
      }
    },
    computed: {
      isCaseWinningHours() {
        let dados = this.base

        let r = dados.map(dado => {
          if (dado['00:30'] == 5) {
            return true
          } else {
            return false
          }
        })

        return r
      },
      nameTratado() {
        this.moment.locale('pt-br')
        let data = this.moment().format('DDMMYYYY_HHmm')
        return `${this.produto}_PYXIS_AGING_PROX_HORAS_${data}_BKO`
      }
    },

    methods: {
      createdAlert() {
        let meuElement = document.getElementById('alert')
        meuElement.innerHTML = ''
        for (let i = 0; i < this.base.length; i++) {
          if (this.base[i]['00:30'] > 0 || this.base[i]['01:00'] > 0 || this.base[i]['02:00'] > 0) {
            meuElement.innerHTML = `
          <div style="padding: 10px; margin:5px 0px 10px; border-radius: 25px; background-color: #ff000096; color:white">
            <h3 type="warning">
              <i class="fa-solid fa-triangle-exclamation"></i>
              Atenção: Há casos vencendo nas próximas ${
                this.base[i]['02:00'] > 0
                  ? '2 horas'
                  : this.base[i]['01:00'] > 0
                  ? '1 hora'
                  : this.base[i]['00:30'] > 0
                  ? '00:30 min'
                  : ''
              }.
            </h3>
          </div>`
          }
        }
      },
      loadBase() {
        if (!this.produto) return
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/backoffice/gerencial/aging_proximas_horas/${this.produto}`
        this.$api.get(urlData).then(res => {
          let dadosBase = res.data
          this.base = dadosBase
          this.createdAlert()
          this.loading = false
        })
      }
    },
    created() {
      this.loadBase()
    },
    watch: {
      produto: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadBase()
        }
      }
    }
  }
</script>

<style scoped>
  .white {
    background-color: white;
  }
  .grey {
    background-color: #f5f5f5;
  }

  .piscar {
    animation: piscar 1s 3;
  }

  @keyframes piscar {
    50% {
      opacity: 15;
      background: #ff000096;
      color: white;
      text-shadow: 0px 0px 10px red;
    }
  }
</style>
