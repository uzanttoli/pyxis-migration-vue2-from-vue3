<template>
  <v-row align="center" justify="center">
    <v-col>
      <v-card elevation="1" class="rounded-xl">
        <title-negative-margin title="Acompanhamento SLA">
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
        <v-data-table
          :headers="getHeaders()"
          dense
          :search="search"
          no-data-text="Não há informações"
          no-results-text="Nada encontrado!"
          loading-text="Carregando... Por favor aguarde!"
          :items="base"
          :loading="loading"
          :footer-props="footerProps"
        ></v-data-table>
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
        loading: false,
        base: [],
        footerProps: {
          itemsPerPageText: 'Itens por página:',
          pageText: '{0}-{1} de {2}',
          perPageText: 'Itens por página:'
        }
      }
    },
    computed: {
      nameTratado() {
        this.moment.locale('pt-br')
        let data = this.moment().format('DDMMYYYY_HHmm')
        return `${this.produto}_PYXIS_ACOMPANHAMENTO_SLA_${data}`
      }
    },
    methods: {
      loadBase() {
        if (!this.produto) return
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/backoffice/gerencial/acompanhamento_sla/${this.produto}`
        this.$api.get(urlData).then(res => {
          this.base = res.data
          this.loading = false
        })
      },
      dias(numDay) {
        let date = new Date()
        const monthNames = [
          'Janeiro',
          'Feveiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro'
        ]

        function validationDate(value, subDay) {
          let hoje = new Date(value)
          hoje.setDate(hoje.getDate() - subDay)
          return hoje
        }
        let day = validationDate(date, numDay)
        let dayFormate = day.toLocaleString().slice(0, 3)

        let month = monthNames[day.getMonth()]
        return `${dayFormate}${month}`
      },
      getHeaders() {
        let headers = [
          {
            text: 'Agrupamento',
            align: 'center',
            class: 'grey lighten-2',
            value: 'SEGMENTO'
          },
          {
            text: 'Campanha',
            align: 'center',
            class: 'grey lighten-2',
            value: 'CAMPANHA'
          },
          {
            text: 'Fora do Prazo',
            align: 'center',
            class: 'grey lighten-2',
            value: 'FORA_PRAZO'
          },
          {
            text: this.dias(0),
            align: 'center',
            class: 'grey lighten-5',
            value: 'HOJE'
          },
          {
            text: this.dias(-1),
            align: 'center',
            class: 'grey lighten-5',
            value: 'D_M1'
          },

          {
            text: this.dias(-2),
            align: 'center',
            class: 'grey lighten-5',
            value: 'D_M2'
          },
          {
            text: this.dias(-3),
            align: 'center',
            class: 'grey lighten-5',
            value: 'D_M3'
          },
          {
            text: 'Total',
            align: 'center',
            class: 'grey lighten-5',
            value: 'TOTAL'
          },
          {
            text: 'Projeção NS',
            align: 'center',
            class: 'grey lighten-5',
            value: 'NS'
          },
          {
            text: 'TMT',
            align: 'center',
            class: 'grey lighten-5',
            value: 'TMT'
          }
        ]
        return headers
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

<style></style>
