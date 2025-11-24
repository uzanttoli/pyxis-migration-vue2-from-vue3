<template>
  <v-container fluid class="mt-6">
    <v-card class="cor-padrao">
      <v-card-title class="white--text text-h4">Gestão de fila</v-card-title>
      <v-row class="ma-0 pa-0" justify="center">
        <v-col cols="12" sm="6" md="2">
          <label for="label" class="white--text font-weight-medium">Data Inicio/Data Fim</label>
          <v-menu
            id="label"
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
            persistent
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                class="font-weight-bold rounded-tr-xl rounded-b-xl"
                v-model="dateRangeText"
                label="Data inicio/Data fim"
                prepend-inner-icon="fa-regular fa-calendar"
                readonly
                v-bind="attrs"
                solo
                dense
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formGestaoFila.dates"
              range
              locale="pt-br"
              @change="dateIsInverted"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <label for="product" class="white--text font-weight-medium">Produto</label>
          <v-select
            dense
            class="rounded-tr-xl rounded-b-xl"
            solo
            id="product"
            no-data-text="Nada por aqui..."
            placeholder="Selecione um produto"
            :items="produtos"
            item-text="FILA_GRUPO"
            item-value="FILA_PROCEDURE"
            v-model="formGestaoFila.productSelected"
            @change="loadFilas"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <label for="row" class="white--text font-weight-medium">Fila</label>
          <v-select
            dense
            class="rounded-tr-xl rounded-b-xl"
            solo
            id="row"
            no-data-text="Nada por aqui..."
            :items="filas"
            item-text="FILA_NOME"
            v-model="formGestaoFila.fila"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="2">
          <label for="status" class="white--text font-weight-medium">Status</label>
          <v-select
            class="rounded-tr-xl rounded-b-xl"
            dense
            solo
            id="status"
            no-data-text="Nada por aqui..."
            :items="status"
            item-text="FILA_STATUS"
            v-model="formGestaoFila.status"
          ></v-select>
        </v-col>
        <!-- adicionado 28/03 -->
        <v-col cols="12" sm="6" md="2">
          <label for="status" class="white--text font-weight-medium">Intervalo Vencimento</label>
          <v-select
            class="rounded-tr-xl rounded-b-xl"
            dense
            solo
            id="status"
            no-data-text="Nada por aqui..."
            :items="intervaloVencimento"
            item-text="FILA_INTERVALO"
            item-value="VALUE"
            v-model="formGestaoFila.intervaloVencimento"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="2" class="mt-5">
          <v-btn
            id="btn-search"
            block
            class="cor-padrao-btn darken-3--text font-weight-bold rounded-tr-xl rounded-b-xl"
            @click="searchData()"
          >
            <v-icon>fa-sharp fa-solid fa-magnifying-glass-chart</v-icon>
            Buscar
          </v-btn>
        </v-col>
      </v-row>
      <!-- <pre>{{produtoEscolhido}}</pre> -->
    </v-card>
  </v-container>
</template>

<script>
  import config from '../../../core/config'
  const api = `${config.baseUrl}api/shared/`
  export default {
    data: () => ({
      // dates: [],
      menu2: false,
      productSelected: null,
      date: '',
      produtos: [],
      filas: [],
      status: [
        { FILA_STATUS: 'TODOS' },
        { FILA_STATUS: 'AGENDADO' },
        { FILA_STATUS: 'AGENDADO IMEDIATO' },
        { FILA_STATUS: 'EM FILA' },
        { FILA_STATUS: 'EM TRATAMENTO' }
      ],
      intervaloVencimento: [
        {
          FILA_INTERVALO: 'TODOS',
          VALUE: 'TODOS'
        },
        {
          FILA_INTERVALO: 'Vence em +00:30min',
          VALUE: '00:30'
        },
        {
          FILA_INTERVALO: 'Vence em +1 hora',
          VALUE: '01:00'
        },
        {
          FILA_INTERVALO: 'Vence em +2 horas',
          VALUE: '02:00'
        },
        {
          FILA_INTERVALO: 'Vence em +3 horas',
          VALUE: '03:00'
        },
        {
          FILA_INTERVALO: 'Vence em +4 horas',
          VALUE: '04:00'
        },
        {
          FILA_INTERVALO: 'Vence em +5 horas',
          VALUE: '05:00'
        },
        {
          FILA_INTERVALO: 'Vence em +6 horas',
          VALUE: '06:00'
        },
        {
          FILA_INTERVALO: 'Vence em +8 horas',
          VALUE: '08:00'
        },
        {
          FILA_INTERVALO: 'Vence em +16 horas',
          VALUE: '16:00'
        },
        {
          FILA_INTERVALO: 'Vence em +24 horas',
          VALUE: '24:00'
        }
      ],
      formGestaoFila: {
        dates: [],
        status: 'TODOS',
        fila: 'TODOS',
        productSelected: 'CCO.CM_BKO_CASOS',
        intervaloVencimento: 'TODOS'
      }
    }),
    computed: {
      dateRangeText() {
        return this.convertDate(this.formGestaoFila.dates.join(' ~ '))
      },
      minDate() {
        let min = this.formGestaoFila.dates
        return min[0]
      },
      usuario() {
        return this.$store.getters.usuario
      },
      produtoEscolhido() {
        let produtos = this.produtos
        let dados = produtos.filter(item => {
          return item.FILA_PROCEDURE == this.formGestaoFila.productSelected
        })
        return dados[0]?.FILA_GRUPO || []
      }
    },
    mounted() {
      let date = new Date()
      let day = date.getDate().toString()
      let dayF = day.length == 1 ? '0' + day : day

      let month = (date.getMonth() + 1).toString()
      let monthF = month.length == 1 ? '0' + month : month

      let year = date.getFullYear().toString()
      if (localStorage.getItem('date-filter')) {
        this.formGestaoFila.dates = JSON.parse(localStorage.getItem('date-filter'))
      } else {
        this.formGestaoFila.dates = [`${year}-${monthF}-01`, `${year}-${monthF}-${dayF}`]
      }
    },
    methods: {
      dateIsInverted() {
        if (this.formGestaoFila.dates) {
          if (this.formGestaoFila.dates[0] > this.formGestaoFila.dates[1]) {
            return (this.formGestaoFila.dates = [
              this.formGestaoFila.dates[1],
              this.formGestaoFila.dates[0]
            ])
          }
        }
      },
      searchData() {
        this.formGestaoFila.produtoEscolhido = this.produtoEscolhido
        this.$emit('update:field', this.formGestaoFila)
        this.$emit('update:fila-procedure', this.formGestaoFila.productSelected)
        this.$emit('update:is-search', true)
        setTimeout(() => {
          this.$emit('update:is-search', false)
        }, 3500)
      },
      loadProduto() {
        let urlData = `${api}/backoffice/direcionamento/produtos`
        this.$api
          .get(urlData, {
            params: {
              produto: this.usuario.produto,
              perfil: this.usuario.filtro,
              almope: this.usuario.almope
            }
          })
          .then(result => {
            let produtos = result.data
            this.produtos = produtos

            this.formGestaoFila.productSelected = result?.data[0].FILA_PROCEDURE
            this.loadFilas()
          })
      },
      loadFilas() {
        let urlData = `${api}/backoffice/direcionamento/filas`
        this.$api
          .get(urlData, {
            params: {
              produto: this.usuario.produto,
              perfil: this.usuario.filtro,
              filaProcedure: this.formGestaoFila.productSelected
            }
          })
          .then(result => {
            let filas = result.data
            filas.unshift({ FILA_NOME: 'TODOS' })
            this.filas = filas

            this.$emit('update:reload-list-ope', this.formGestaoFila.productSelected)
          })
      },
      convertDate(arrayData) {
        let arrayInicio = []
        let arrayFim = []
        if (arrayData.length == 23) {
          arrayInicio.push(arrayData.toString().substring(0, 10).replaceAll('-', '/'))
          arrayFim.push(arrayData.toString().substring(13, 23).replaceAll('-', '/'))
        }
        return `${
          arrayInicio.toString().split('/').reverse().join('/') +
          (arrayData.length == 23 ? ' ~ ' : '') +
          arrayFim.toString().split('/').reverse().join('/')
        }`
      }
    },
    created() {
      this.loadProduto()
    },
    watch: {
      'formGestaoFila.dates': function (newVal, oldVal) {
        if (oldVal.length == 1) {
          localStorage.setItem('date-filter', JSON.stringify(newVal))
        }
      }
    }
  }
</script>

<style scoped>
  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(143, 14, 143), rgb(20, 190, 255));
  }

  .cor-padrao-btn {
    background-image: linear-gradient(200deg, rgb(120, 200, 255), rgb(0, 236, 255));
  }
</style>
