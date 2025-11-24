<template>
  <v-row>
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
          :headers="headers"
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
                <td>{{ item.NOME }}</td>
                <td>{{ item.SUPERVISOR }}</td>
                <td>{{ item.AGRUPAMENTO }}</td>
                <td>{{ item.TOTAL }}</td>
                <td :class="classTable(item['06:00'])">
                  {{ valueIsNull(item['06:00']) }}
                </td>
                <td :class="classTable(item['07:00'])">
                  {{ valueIsNull(item['07:00']) }}
                </td>
                <td :class="classTable(item['08:00'])">
                  {{ valueIsNull(item['08:00']) }}
                </td>
                <td :class="classTable(item['09:00'])">
                  {{ valueIsNull(item['09:00']) }}
                </td>
                <td :class="classTable(item['10:00'])">
                  {{ valueIsNull(item['10:00']) }}
                </td>
                <td :class="classTable(item['11:00'])">
                  {{ valueIsNull(item['11:00']) }}
                </td>
                <td :class="classTable(item['12:00'])">
                  {{ valueIsNull(item['12:00']) }}
                </td>
                <td :class="classTable(item['13:00'])">
                  {{ valueIsNull(item['13:00']) }}
                </td>
                <td :class="classTable(item['14:00'])">
                  {{ valueIsNull(item['14:00']) }}
                </td>
                <td :class="classTable(item['15:00'])">
                  {{ valueIsNull(item['15:00']) }}
                </td>
                <td :class="classTable(item['16:00'])">
                  {{ valueIsNull(item['16:00']) }}
                </td>
                <td :class="classTable(item['17:00'])">
                  {{ valueIsNull(item['17:00']) }}
                </td>
                <td :class="classTable(item['18:00'])">
                  {{ valueIsNull(item['18:00']) }}
                </td>
                <td :class="classTable(item['19:00'])">
                  {{ valueIsNull(item['19:00']) }}
                </td>
                <td :class="classTable(item['20:00'])">
                  {{ valueIsNull(item['20:00']) }}
                </td>
                <td :class="classTable(item['21:00'])">
                  {{ valueIsNull(item['21:00']) }}
                </td>
                <td :class="classTable(item['22:00'])">
                  {{ valueIsNull(item['22:00']) }}
                </td>
                <td :class="classTable(item['23:00'])">
                  {{ valueIsNull(item['23:00']) }}
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
  </v-row>
</template>

<script>
  import config from '../../../../core/config.js'
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
        loading: false,
        headers: [
          {
            text: 'Nome',
            value: 'NOME',
            align: 'center',
            class: 'grey lighten-2',
            sortable: true
          },
          {
            text: 'Supervisor',
            value: 'SUPERVISOR',
            align: 'center',
            sortable: true,
            class: 'grey lighten-2'
          },
          {
            text: 'Agrupamento',
            value: 'AGRUPAMENTO',
            align: 'center',
            sortable: true,
            class: 'grey lighten-2'
          },
          {
            text: 'Total',
            value: 'TOTAL',
            align: 'center',
            sortable: true,
            class: 'grey lighten-2'
          },
          {
            text: '6h',
            value: '06:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-5'
          },
          {
            text: '7h',
            value: '07:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-2'
          },
          {
            text: '8h',
            value: '08:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-5'
          },
          {
            text: '9h',
            value: '09:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-2'
          },
          {
            text: '10h',
            value: '10:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-5'
          },
          {
            text: '11h',
            value: '11:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-2'
          },
          {
            text: '12h',
            value: '12:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-5'
          },
          {
            text: '13h',
            value: '13:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-2'
          },
          {
            text: '14h',
            value: '14:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-5'
          },
          {
            text: '15h',
            value: '15:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-2'
          },
          {
            text: '16h',
            value: '14:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-5'
          },
          {
            text: '17h',
            value: '17:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-2'
          },
          {
            text: '18h',
            value: '18:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-5'
          },
          {
            text: '19h',
            value: '19:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-2'
          },
          {
            text: '20h',
            value: '20:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-5'
          },
          {
            text: '21h',
            value: '21:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-2'
          },
          {
            text: '22h',
            value: '22:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-5'
          },
          {
            text: '23h',
            value: '23:00',
            align: 'center',
            sortable: true,
            class: 'grey lighten-2'
          }
        ],
        base: []
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
        if (!value) return
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
