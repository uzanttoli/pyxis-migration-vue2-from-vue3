<template>
  <section class="performance-hora" v-if="mplayPerformanceHora != ''">
    <v-card>
      <title-negative-margin
        title="Performance Hora"
        :progressVisible="true"
        :countIntervalProgress="countInterval"
        corProgress="cyan accent-3"
      ></title-negative-margin>
      <v-data-table
        dense
        no-data-text="Não há informações no momento!"
        :headers="getHeaders()"
        :items="mplayPerformanceHora"
        loading-text="Carregando..."
        :loading="loading"
        :footer-props="{
          'items-per-page-text': 'Itens por página'
        }"
      >
        <template v-slot:item.Performance="{ item }">{{ item.Performance.toUpperCase() }}</template>
      </v-data-table>
    </v-card>
  </section>
</template>

<script>
  // import config from "../../../../core/config";
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
      base: [],
      loading: false,
      interval: null,
      countInterval: 0,
      tempoInterval: 60000
    }),
    computed: {
      mplayPerformanceHora() {
        let mplayPerformanceHora = this.$store.getters.mplayPerformanceHora
        // let percent = "%";
        if (mplayPerformanceHora[0]) {
          if (mplayPerformanceHora[0]['11']) {
            mplayPerformanceHora[0]['11'] = mplayPerformanceHora[0]['11'] + '%'
          } else {
            mplayPerformanceHora[0]['11'] = '-'
          }
          if (mplayPerformanceHora[0]['12']) {
            mplayPerformanceHora[0]['12'] = mplayPerformanceHora[0]['12'] + '%'
          } else {
            mplayPerformanceHora[0]['12'] = '-'
          }
          if (mplayPerformanceHora[0]['13']) {
            mplayPerformanceHora[0]['13'] = mplayPerformanceHora[0]['13'] + '%'
          } else {
            mplayPerformanceHora[0]['13'] = '-'
          }
          if (mplayPerformanceHora[0]['14']) {
            mplayPerformanceHora[0]['14'] = mplayPerformanceHora[0]['14'] + '%'
          } else {
            mplayPerformanceHora[0]['14'] = '-'
          }
          if (mplayPerformanceHora[0]['15']) {
            mplayPerformanceHora[0]['15'] = mplayPerformanceHora[0]['15'] + '%'
          } else {
            mplayPerformanceHora[0]['15'] = '-'
          }
          if (mplayPerformanceHora[0]['16']) {
            mplayPerformanceHora[0]['16'] = mplayPerformanceHora[0]['16'] + '%'
          } else {
            mplayPerformanceHora[0]['16'] = '-'
          }
          if (mplayPerformanceHora[0]['17']) {
            mplayPerformanceHora[0]['17'] = mplayPerformanceHora[0]['17'] + '%'
          } else {
            mplayPerformanceHora[0]['17'] = '-'
          }
          if (mplayPerformanceHora[0]['18']) {
            mplayPerformanceHora[0]['18'] = mplayPerformanceHora[0]['18'] + '%'
          } else {
            mplayPerformanceHora[0]['18'] = '-'
          }
          if (mplayPerformanceHora[0]['19']) {
            mplayPerformanceHora[0]['19'] = mplayPerformanceHora[0]['19'] + '%'
          } else {
            mplayPerformanceHora[0]['19'] = '-'
          }
          if (mplayPerformanceHora[0]['20']) {
            mplayPerformanceHora[0]['20'] = mplayPerformanceHora[0]['20'] + '%'
          } else {
            mplayPerformanceHora[0]['20'] = '-'
          }
          if (mplayPerformanceHora[0]['21']) {
            mplayPerformanceHora[0]['21'] = mplayPerformanceHora[0]['21'] + '%'
          } else {
            mplayPerformanceHora[0]['21'] = '-'
          }
          if (mplayPerformanceHora[0]['22']) {
            mplayPerformanceHora[0]['22'] = mplayPerformanceHora[0]['22'] + '%'
          } else {
            mplayPerformanceHora[0]['22'] = '-'
          }
          if (mplayPerformanceHora[0]['TOTAL_COLABORADOR']) {
            mplayPerformanceHora[0]['TOTAL_COLABORADOR'] =
              mplayPerformanceHora[0]['TOTAL_COLABORADOR'] + '%'
          } else {
            mplayPerformanceHora[0]['TOTAL_COLABORADOR'] = '-'
          }
        } else {
          return []
        }

        return mplayPerformanceHora
        // return mplayPerformanceHora ? mplayPerformanceHora : [];
      }
    },
    methods: {
      loadmplayPerformanceHora() {
        this.$store.dispatch('loadmplayPerformanceHora', this.urlAction)
      },
      // loadBase() {
      //   this.loading = true;
      //   let urlData = `${config.baseUrl}${this.urlAction}`;
      //   urlData = this.replaceUrlMultiParamSeparator(urlData);
      //   this.$api.get(urlData).then((res) => {
      //     this.base = res.data;
      //     this.loading = false;
      //   });
      // },
      getHeaders() {
        let arrHeader = [
          {
            text: 'Performance Hora',
            align: 'center',
            sortable: false,
            value: 'Performance',
            class: 'grey lighten-3'
          },
          {
            text: '11:00',
            align: 'center',
            sortable: false,
            value: '11',
            class: ''
          },
          {
            text: '12:00',
            align: 'center',
            sortable: false,
            value: '12',
            class: ''
          },
          {
            text: '13:00',
            align: 'center',
            sortable: false,
            value: '13',
            class: ''
          },
          {
            text: '14:00',
            align: 'center',
            sortable: false,
            value: '14',
            class: ''
          },
          {
            text: '15:00',
            align: 'center',
            sortable: false,
            value: '15',
            class: ''
          },
          {
            text: '16:00',
            align: 'center',
            sortable: false,
            value: '16',
            class: ''
          },
          {
            text: '17:00',
            align: 'center',
            sortable: false,
            value: '17',
            class: ''
          },
          {
            text: '18:00',
            align: 'center',
            sortable: false,
            value: '18',
            class: ''
          },
          {
            text: '19:00',
            align: 'center',
            sortable: false,
            value: '19',
            class: ''
          },
          {
            text: '20:00',
            align: 'center',
            sortable: false,
            value: '20',
            class: ''
          },
          {
            text: '21:00',
            align: 'center',
            sortable: false,
            value: '21',
            class: ''
          },
          {
            text: '22:00',
            align: 'center',
            sortable: false,
            value: '22',
            class: ''
          },
          {
            text: 'Total',
            align: 'center',
            sortable: false,
            value: 'TOTAL_COLABORADOR',
            class: 'grey lighten-3'
          }
        ]
        return arrHeader
      }
    },
    watch: {
      usuarioNome() {
        this.loadmplayPerformanceHora()
      }
    },
    created() {
      this.loadmplayPerformanceHora()
      this.interval = setInterval(() => {
        this.countInterval += 6.66
        if (this.countInterval >= 99.66) {
          this.loadmplayPerformanceHora()
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
