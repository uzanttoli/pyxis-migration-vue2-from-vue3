<template>
  <v-card class="mt-2 rounded-xl" elevation="2">
    <TableInfo :data="base" :loading="loading" :getClass="getClass">
      <template v-slot:title>
        <v-card-title>
          <i class="fa-solid fa-paste mr-2" style="color: #64b5f6"></i>
          {{ title }}
          {{ dataFiltrada }}
        </v-card-title>
      </template>
    </TableInfo>
  </v-card>
</template>

<script>
  import config from '@/core/config.js'
  import TableInfo from '@/shared/components/DataTable/TableDinamics.vue'
  export default {
    components: { TableInfo },
    props: {
      title: {
        type: String
      },
      titleIcon: {
        type: String
      },
      actionUrl: {
        type: String,
        required: true
      },
      data: {
        type: [Date, String],
        default: () => new Date()
      },
      produto: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      loading: true,
      countInterval: 0,
      base: []
    }),
    computed: {
      dataFiltrada() {
        if (!this.data) return this.dataAtual
        if (this.dataAtual == this.data) {
          return 'Online'
        } else {
          return `do dia ${this.moment(this.data).format('DD/MM/YYYY')}`
        }
      },
      dataAtual() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-MM-DD')
      },
      getHeaders() {
        const base = this.base[0] ?? []

        return Object.keys(base).map(item => {
          return {
            text: item,
            value: item,
            align: 'center',
            class: 'blue-grey lighten-5'
          }
        })
      }
    },
    filters: {
      formatarTMT(value) {
        return Math.round(value)
      },
      formatPercent(value) {
        if (!value) return '-'
        return (value * 100).toFixed(2).concat('%')
      }
    },
    methods: {
      getClass(item) {
        if (item.ALMOPE_TRATAMENTO_FECHAMENTO === 'TOTAL')
          return 'blue-grey lighten-5 font-weight-bold'
      },
      async loadBase() {
        try {
          this.loading = true
          let urlData = `${config.baseUrl}${this.actionUrl}`
          let res = await this.$api.get(urlData, {
            params: {
              produto: this.produto,
              data: this.data
            }
          })
          this.base = res.data
          this.loading = false
        } catch (error) {
          console.error(error)
        }
      }
    },
    created() {
      this.loadBase()
    },
    watch: {
      produto: async function (newVal, oldVal) {
        if (newVal !== oldVal) {
          await this.loadBase()
        }
      },
      data: async function (newVal, oldVal) {
        if (newVal !== oldVal) {
          await this.loadBase()
        }
      }
    }
  }
</script>

<style scoped></style>
