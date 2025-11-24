<template>
  <v-row>
    <v-col>
      <v-card elevation="1" class="rounded-xl">
        <title-negative-margin title="Taxa Ocupação Mês">
          <template v-slot:button>
            <download-excel :data="base" :name="nameTratado" :worksheet="nameTratado">
              <v-btn fab x-small class="mr-1" elevation="1">
                <v-icon class="blue--text">fa-solid fa-file-arrow-down</v-icon>
              </v-btn>
            </download-excel>
          </template>
          <v-spacer></v-spacer>
          <v-col cols="2" class="mb-n14">
            <v-text-field
              dense
              outlined
              class="rounded-bl-xl rounded-r-xl"
              v-model="search"
              placeholder="Procure aqui..."
              label="Pesquisa rápida"
            ></v-text-field>
          </v-col>
          <month @update:date="dateSelected" class="mb-n14"></month>
        </title-negative-margin>
        <v-data-table
          :headers="headers"
          dense
          :search="search"
          :items="base"
          :loading="loading"
          no-results-text="Nada encontrado!"
          loading-text="Carregando... Por favor aguarde!"
          no-data-text="Não há nada por aqui!"
          :footer-props="footerProps"
        >
          <template v-slot:item.TX_OCUPACAO="{ item }">
            {{ item.TX_OCUPACAO | percentual }}
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import config from '../../../../core/config'
  import month from '../datePicker/month.vue'
  export default {
    components: { month },
    props: {
      produto: {
        type: String,
        default: 'COMBO BKO'
      }
    },
    data: () => ({
      search: '',
      loading: false,
      base: [],
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      },
      headers: [
        {
          text: 'Almope',
          align: 'center',
          value: 'ALMOPE',
          class: 'grey lighten-2'
        },
        {
          text: 'Nome',
          align: 'center',
          value: 'NOME',
          class: 'grey lighten-2'
        },
        {
          text: 'Dias Trabalhados',
          align: 'center',
          value: 'DIAS_TRABALHADOS',
          class: 'grey lighten-4'
        },
        {
          text: 'Resolvidos',
          align: 'center',
          value: 'PRODUTIVIDADE',
          class: 'grey lighten-4'
        },
        {
          text: 'Tempo Tratando',
          align: 'center',
          value: 'TEMPO_TRATANDO',
          class: 'grey lighten-4'
        },
        {
          text: 'Tempo Logado',
          align: 'center',
          value: 'TEMPO_LOGADO',
          class: 'grey lighten-4'
        },
        {
          text: 'Jackin',
          align: 'center',
          value: 'JACKIN',
          class: 'grey lighten-4'
        },
        {
          text: 'Taxa Ocupação',
          align: 'center',
          value: 'TX_OCUPACAO',
          class: 'grey lighten-4'
        },
        {
          text: 'Supervisor',
          align: 'center',
          value: 'SUPERVISOR',
          class: 'grey lighten-2'
        },
        {
          text: 'Coordenador',
          align: 'center',
          value: 'COORDENADOR',
          class: 'grey lighten-2'
        }
      ],
      date: null
    }),
    filters: {
      percentual: function (value) {
        if (!value) return '0,00%'

        return (value * 100).toFixed(2).concat('%')
      }
    },
    computed: {
      nameTratado() {
        this.moment.locale('pt-br')
        let data = this.moment().format('DDMMYYYY')
        return `PYXIS_${data}_BKO`
      }
    },
    methods: {
      dateSelected(e) {
        return (this.date = e + '-' + '01')
      },
      loadBase() {
        if (!this.produto) return
        this.loading = true
        let date = new Date()
        let month = (date.getMonth() + 1).toString()
        let monthF = month.length == 1 ? '0' + month : month
        let year = date.getFullYear().toString()
        let getNow = `${year}-${monthF}-01`

        let urlData = `${config.baseUrl}api/shared/backoffice/gerencial/dados_ocupacao_mes`

        this.$api
          .get(urlData, {
            params: {
              produto: this.produto,
              data: this.date ?? getNow
            }
          })
          .then(res => {
            this.base = res.data
            this.loading = false
          })
      }
    },
    created() {
      this.loadBase()
    },
    watch: {
      date() {
        this.loadBase()
      },
      produto: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadBase()
        }
      }
    }
  }
</script>

<style></style>
