<template>
  <v-row>
    <v-col>
      <v-card elevation="1" class="rounde-xl">
        <title-negative-margin title="Tratativa Dia Dia">
          <template v-slot:button>
            <download-excel :data="base" :name="nameTratado" :worksheet="nameTratado">
              <v-btn fab x-small class="mr-1" elevation="1">
                <v-icon class="blue--text">fa-solid fa-file-arrow-down</v-icon>
              </v-btn>
            </download-excel>
          </template>
          <v-spacer></v-spacer>
          <v-col cols="2" class="mb-n8">
            <v-text-field
              dense
              outlined
              class="rounded-bl-xl rounded-r-xl"
              v-model="search"
              placeholder="Procure aqui..."
              label="Pesquisa rápida"
            ></v-text-field>
          </v-col>
          <month @update:date="dateSelected" class="mb-n8"></month>
        </title-negative-margin>
        <v-data-table
          :headers="headers"
          dense
          :search="search"
          :items="base"
          class="text-no-wrap"
          no-data-text="Não há nada por aqui!"
          no-results-text="Nada encontrado!"
          loading-text="Carregando... Por favor aguarde!"
          :loading="loading"
          :footer-props="footerProps"
        ></v-data-table>
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
    data() {
      return {
        search: '',
        footerProps: {
          itemsPerPageText: 'Itens por página:',
          pageText: '{0}-{1} de {2}',
          perPageText: 'Itens por página:'
        },
        date: null,
        headers: [],
        base: [],
        loading: false
      }
    },
    computed: {
      nameTratado() {
        this.moment.locale('pt-br')
        let data = this.moment().format('DDMMYYYY_HHmm')
        return `${this.produto}_PYXIS_PRODUTIVIDADE_${data}_BKO`
      }
    },
    methods: {
      replaceNulls(obj) {
        for (let key in obj) {
          if (obj[key] === null || obj[key] == '') {
            obj[key] = '0'
          }
        }
      },
      dateSelected(e) {
        return (this.date = e + '-' + '01')
      },
      loadBase() {
        if (!this.produto) return
        let date = new Date()
        let month = (date.getMonth() + 1).toString()
        let monthF = month.length == 1 ? '0' + month : month
        let year = date.getFullYear().toString()
        let getNow = `${year}-${monthF}-01`

        // let urlData = `${config.baseUrl}api/shared/backoffice/gerencial/tratativa_dia_dia/${this.produto}/${ this.date == null ? getNow : this.date }`;
        let urlData = `${config.baseUrl}api/shared/backoffice/gerencial/tratativa_dia_dia`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produto,
              data: this.date ?? getNow
            }
          })
          .then(res => {
            this.base = res.data
            this.base.forEach(this.replaceNulls)
            this.loading = false
          })
      },
      completedArrHeaders() {
        this.loading = true
        let date = new Date()
        let numDays
        let dayNumber = date.getDate().toString()

        let datePicker = this.date
        let datePickerSplit = datePicker?.split('-')
        const monthSelected = datePickerSplit ? parseInt(datePickerSplit[1]) : 0
        const yearSelected = datePickerSplit ? parseInt(datePickerSplit[0]) : 0

        let month = monthSelected === 0 ? date.getMonth() + 1 : monthSelected
        let year = yearSelected === 0 ? date.getFullYear() : yearSelected

        monthSelected ? new Date(year, month, 0).getDate() : (numDays = dayNumber)

        let headersFormat = [
          {
            text: 'Nome',
            align: 'center',
            value: 'NOME',
            class: 'grey lighten-2'
          },
          {
            text: 'Supervisor',
            align: 'center',
            value: 'SUPERVISOR',
            class: 'grey lighten-2'
          },
          {
            text: 'Agrupamento',
            align: 'center',
            value: 'GRUPO',
            class: 'grey lighten-2'
          },
          {
            text: 'Trabalhados',
            align: 'center',
            value: 'TRABALHADOS',
            class: 'grey lighten-2'
          },
          // {
          //   text: "Média Dia",
          //   align: "center",
          //   value: "MEDIA_DIA",
          //   class: "grey lighten-2",
          // },
          {
            text: 'TMT Médio',
            align: 'center',
            value: 'TMT_MEDIO',
            class: 'grey lighten-2'
          },
          {
            text: 'Ocorrências',
            align: 'center',
            value: 'OCORRENCIAS',
            class: 'grey lighten-2'
          }
        ]
        for (let i = 0; i < numDays; i++) {
          let day = 1 + i
          headersFormat.push({
            text: 'Dia ' + day,
            align: 'center',
            sortable: false,
            value: day.toString().padStart(2, '0'),
            class: 'grey lighten-4'
          })
        }

        this.headers = headersFormat
        this.loadBase()
      }
    },
    created() {
      this.completedArrHeaders()
      // this.loadBase();
    },
    watch: {
      date() {
        this.completedArrHeaders()
      },
      produto: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.completedArrHeaders()
          this.loadBase()
        }
      }
    }
  }
</script>

<style></style>
