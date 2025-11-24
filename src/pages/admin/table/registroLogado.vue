<template>
  <v-card class="mb-6">
    <title-negative-margin :title="title" icon="mdi-account-multiple-check">
      <v-text-field
        style="position: relative; right: 30px"
        v-model="search"
        append-icon="mdi-magnify"
        label="Pesquisar"
        single-line
        hide-details
      ></v-text-field>
      <v-btn
        @click="exportTableToExcel('tbLoggedTracking')"
        icon
        style="position: absolute; right: 10px; top: 30px"
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </title-negative-margin>
    <v-data-table
      hidden
      id="tbLoggedTracking"
      :headers="headers"
      :items="logsPyxis"
      :items-per-page="lengthLogsPyxis"
      item-key="text"
    ></v-data-table>
    <v-data-table
      no-data-text="Ops! Aparentemente ninguem logou ainda..."
      no-results-text="Informação não localizada."
      :headers="headers"
      :items="logsPyxis"
      multi-sort
      class="text-no-wrap"
      :search="search"
      :items-per-page="15"
      dense
      item-key="text"
    >
      <template v-slot:item.DATA_LOG="{ item }">
        {{ item.DATA_LOG.substr(0, 10).split('-').reverse().join('/') }}
        |
        {{ item.DATA_LOG.substr(10, 6) }}
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
  export default {
    name: 'AcompanhamentoDeLogados',
    props: {
      title: {
        type: String,
        default: 'Histórico de Log'
      }
    },
    data() {
      return {
        search: '',
        headers: [
          {
            text: 'Almope',
            align: 'center',
            value: 'ALMOPE'
          },
          {
            text: 'Nome',
            align: 'center',
            value: 'NOME'
          },
          {
            text: 'Supervisor',
            align: 'center',
            value: 'SUPERIOR1'
          },
          {
            text: 'Coordenador',
            align: 'center',
            value: 'SUPERIOR2'
          },
          {
            text: 'Rota Acessada',
            align: 'center',
            value: 'ROTA'
          },
          {
            text: 'Data Log',
            align: 'center',
            value: 'DATA_LOG'
          }
        ]
      }
    },
    computed: {
      logsPyxis() {
        return this.$store.getters.logsPyxis
      },
      lengthLogsPyxis() {
        return this.logsPyxis.length
      }
    },
    methods: {
      exportTableToExcel(tableID, fileName = '') {
        var downloadLink
        var dataType = 'application/vnd.ms-excel'
        var tableSelect = document.getElementById(tableID)
        var tableHtml = tableSelect.outerHTML.replace(/ /g, '%20')

        fileName = fileName ? fileName + '.xls' : 'dados_cco.xls'

        downloadLink = document.createElement('a')

        document.body.appendChild(downloadLink)

        if (navigator.msSaveOrOpenBlob) {
          var blob = new Blob(['\ufeff', tableHtml], {
            type: dataType
          })
          navigator.msSaveOrOpenBlob(blob, fileName)
        } else {
          downloadLink.href = 'data:' + dataType + ',' + tableHtml

          downloadLink.download = fileName

          downloadLink.click()
        }
      },
      loadLogsPyxis() {
        this.$store.dispatch('loadLogsPyxis')
      }
    },
    created() {
      this.loadLogsPyxis()
    }
  }
</script>
<style scoped>
  .theme--light.v-data-table tbody tr:hover:not(.v-data-table__expanded__content) {
    background: rgb(116, 23, 23);
  }
</style>
