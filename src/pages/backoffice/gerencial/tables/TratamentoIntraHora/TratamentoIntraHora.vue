<template>
  <v-row>
    <!-- <pre>{{base}}</pre> -->
    <v-col>
      <v-card elevation="1" class="rounded-xl">
        <title-negative-margin title="Tratamento Intra Hora" className="rounded-r-xl">
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
          :headers="headers.concat(hours)"
          dense
          :search="search"
          :loading="loading"
          no-results-text="Nada encontrado!"
          class="text-no-wrap"
          :items="base"
          :items-per-page="10"
          :footer-props="footerProps"
        >
          <template v-slot:body="{ items }">
            <tbody class="text-center">
              <tr v-for="(item, i) in items" :key="i">
                <TableColumn
                  v-for="(column, index) in headers"
                  :key="column.value + index"
                  :item="item[column.value]"
                />
                <TableColumn
                  v-for="(hour, index) in hours"
                  :key="hour + index"
                  :item="item[hour.value]"
                  formatableValue
                />
              </tr>
              <tr v-if="base == ''">
                <td colspan="21" class="grey--text">Não há informações</td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import config from '../../../../../core/config.js'
  import headers from './_columns/headers.js'
  import hours from './_columns/hours.js'
  import TableColumn from './_components/TableColumn.vue'
  export default {
    name: 'TratamentoIntraHora',
    components: {
      TableColumn
    },
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
        loading: false,
        headers: headers,
        base: [],
        hours: hours
        // hours: Array.from({ length: 18 }, (v, k) => k + 6),
      }
    },
    computed: {
      nameTratado() {
        this.moment.locale('pt-br')
        let data = this.moment().format('DDMMYYYY_HHmm')
        return `${this.produto}_PYXIS_TRATAMENTO_INTRA_${data}`
      }
    },
    methods: {
      valueIsNull(value) {
        if (value == null) {
          return '-'
        } else {
          return value
        }
      },
      classTable(value) {
        if (value == null) return '-'
        if (value < 4) {
          return 'orange darken-3 white--text'
        } else if (value == 4) {
          return 'cyan accent-4 white--text'
        } else {
          return 'light-blue darken-4 white--text'
        }
      },
      loadBase() {
        if (!this.produto) return
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/backoffice/gerencial/tratatos_online/${this.produto}`
        this.$api.get(urlData).then(result => {
          this.base = result.data
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

<style scoped></style>
