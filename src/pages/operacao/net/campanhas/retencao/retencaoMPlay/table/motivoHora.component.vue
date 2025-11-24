<template>
  <section class="motivo-hora" v-if="base != ''">
    <v-card>
      <title-negative-margin
        title="Performance Motivo Hora"
        :progressVisible="true"
        :countIntervalProgress="countInterval"
        corProgress="cyan accent-3"
      ></title-negative-margin>
      <v-data-table
        dense
        no-data-text="Não há informações no momento!"
        :headers="getHeaders()"
        :loading="loading"
        loading-text="Carregando...Por favor Aguarde!"
        :items="base"
        :footer-props="{
          'items-per-page-text': 'Itens por página'
        }"
      >
        <template v-slot:item.onze="{ item }">{{ item.onze | percentage }}</template>
        <template v-slot:item.doze="{ item }">{{ item.doze | percentage }}</template>
        <template v-slot:item.treze="{ item }">{{ item.treze | percentage }}</template>
        <template v-slot:item.quatorze="{ item }">{{ item.quatorze | percentage }}</template>
        <template v-slot:item.quinze="{ item }">{{ item.quinze | percentage }}</template>
        <template v-slot:item.dezesseis="{ item }">{{ item.dezesseis | percentage }}</template>
        <template v-slot:item.dezessete="{ item }">{{ item.dezessete | percentage }}</template>
        <template v-slot:item.dezoito="{ item }">{{ item.dezoito | percentage }}</template>
        <template v-slot:item.dezenove="{ item }">{{ item.dezenove | percentage }}</template>
        <template v-slot:item.vinte="{ item }">{{ item.vinte | percentage }}</template>
        <template v-slot:item.vinte_um="{ item }">{{ item.vinte_um | percentage }}</template>
        <template v-slot:item.vinte_dois="{ item }">{{ item.vinte_dois | percentage }}</template>
      </v-data-table>
    </v-card>
  </section>
</template>

<script>
  import config from '@/core/config'
  export default {
    props: {
      usuarioNome: {
        type: String,
        require: true
      },
      urlAction: {
        type: String,
        require: true
      }
    },
    data: () => ({
      search: '',
      loading: false,
      countInterval: 0,
      interval: null,
      tempoInterval: 60000,
      base: []
    }),
    computed: {},
    methods: {
      getHeaders() {
        let arrHeader = [
          {
            text: 'Motivo Hora',
            align: 'center',
            sortable: false,
            value: 'MOTIVO',
            class: 'grey lighten-3'
          },
          {
            text: '11:00',
            align: 'center',
            sortable: false,
            value: 'onze',
            class: ''
          },
          {
            text: '12:00',
            align: 'center',
            sortable: false,
            value: 'doze',
            class: ''
          },
          {
            text: '13:00',
            align: 'center',
            sortable: false,
            value: 'treze',
            class: ''
          },
          {
            text: '14:00',
            align: 'center',
            sortable: false,
            value: 'quatorze',
            class: ''
          },
          {
            text: '15:00',
            align: 'center',
            sortable: false,
            value: 'quinze',
            class: ''
          },
          {
            text: '16:00',
            align: 'center',
            sortable: false,
            value: 'dezesseis',
            class: ''
          },
          {
            text: '17:00',
            align: 'center',
            sortable: false,
            value: 'dezessete',
            class: ''
          },
          {
            text: '18:00',
            align: 'center',
            sortable: false,
            value: 'dezoito',
            class: ''
          },
          {
            text: '19:00',
            align: 'center',
            sortable: false,
            value: 'dezenove',
            class: ''
          },
          {
            text: '20:00',
            align: 'center',
            sortable: false,
            value: 'vinte',
            class: ''
          },
          {
            text: '21:00',
            align: 'center',
            sortable: false,
            value: 'vinte_um',
            class: ''
          },
          {
            text: '22:00',
            align: 'center',
            sortable: false,
            value: 'vinte_dois',
            class: ''
          },
          {
            // text: "Total",
            // align: "center",
            // sortable: false,
            // value: "",
            // class: "grey lighten-3",
          }
        ]
        return arrHeader
      },
      loadBase() {
        this.loading = true
        let urlData = `${config.baseUrl}${this.urlAction}`
        urlData = this.replaceUrlMultiParamSeparator(urlData)
        this.$api.get(urlData).then(res => {
          this.base = res.data
          this.loading = false
        })
      }
    },
    created() {
      this.loadBase()
      this.interval = setInterval(() => {
        this.countInterval += 6.66
        if (this.countInterval >= 99.66) {
          this.loadBase()
          this.countInterval = 0
        }
      }, 60000)
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style></style>
