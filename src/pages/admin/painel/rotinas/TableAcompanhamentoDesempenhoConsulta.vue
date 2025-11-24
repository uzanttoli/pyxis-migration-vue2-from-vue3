<template>
  <v-card class="mt-4" elevation="1">
    <title-negative-margin title="Desempenho PNC" icon="mdi-database-alert-outline">
      <v-col class="pa-0 ma-0 mb-n2" cols="3">
        <v-select
          outlined
          append-outer-icon="mdi-magnify"
          dense
          rounded
          :items="intervalos"
          item-text="time"
          v-model="intervaloSelecionado"
        ></v-select>
      </v-col>
    </title-negative-margin>
    <v-data-table
      :headers="getHeaders()"
      :items="baseDesempenhoPNC"
      dense
      :loading="loading"
      no-data-text="Nada encontrado nesse intervalo!"
      loading-text="Carregando... tenha paciência!"
    >
      <template v-slot:item.Duration="{ item }">
        <span :class="`${item.Duration >= '00:15:00' ? 'fa-blink' : ''}`">{{ item.Duration }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import config from '../../../../core/config'
  export default {
    data: () => ({
      baseDesempenhoPNC: [],
      intervaloSelecionado: '00:05:00',
      loading: false,
      intervalos: [
        { time: '00:05:00' },
        { time: '00:10:00' },
        { time: '00:15:00' },
        { time: '00:20:00' },
        { time: '00:25:00' },
        { time: '00:30:00' },
        { time: '00:35:00' },
        { time: '00:40:00' },
        { time: '00:45:00' }
      ]
    }),
    methods: {
      loadBaseDesempenhoPNC() {
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/admin/avaliacoes_pnc/desempenho_consultas/${this.intervaloSelecionado}`
        this.$api.get(urlData).then(res => {
          this.baseDesempenhoPNC = res.data
          this.loading = false
        })
      },
      getHeaders() {
        let headers = [
          {
            text: 'TextData',
            value: 'TextData'
          },
          {
            text: 'HostName',
            value: 'HostName'
          },
          {
            text: 'NTUserName',
            value: 'NTUserName'
          },
          {
            text: 'ApplicationName',
            value: 'ApplicationName'
          },
          {
            text: 'Duration',
            value: 'Duration',
            class: ''
          },
          {
            text: 'StartTime',
            value: 'StartTime'
          },
          {
            text: 'EndTime',
            value: 'EndTime'
          },
          {
            text: 'Reads',
            value: 'Reads'
          },
          {
            text: 'Writes',
            value: 'Writes'
          },
          {
            text: 'CPU',
            value: 'CPU'
          },
          {
            text: 'RowCounts',
            value: 'RowCounts'
          }
        ]
        return headers
      }
    },
    watch: {
      intervaloSelecionado() {
        this.loadBaseDesempenhoPNC()
      }
    },
    created() {
      this.loadBaseDesempenhoPNC()
    }
  }
</script>

<style scoped>
  @keyframes fa-blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
    }
  }
  .fa-blink {
    color: rgb(245, 12, 12);
    font-weight: bold;
    -webkit-animation: fa-blink 2s linear infinite;
    -moz-animation: fa-blink 2s linear infinite;
    -ms-animation: fa-blink 2s linear infinite;
    -o-animation: fa-blink 2s linear infinite;
    animation: fa-blink 2s linear infinite;
  }
</style>
