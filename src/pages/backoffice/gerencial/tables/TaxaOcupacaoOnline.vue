<template>
  <v-row>
    <v-col>
      <title-negative-margin
        title="Taxa de Ocupação Online"
        :downloadExcel="true"
        :base="base"
        :namePlan="nameTratado"
        :worksheet="nameTratado"
      >
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
        dense
        :search="search"
        :headers="headers"
        no-results-text="Nada encontrado!"
        no-data-text="Não há informações"
        :items="base"
        :loading="loading"
        loading-text="Carregando... Por favor aguarde!"
        :footer-props="footerProps"
      >
        <template v-slot:item.TX_OCUPACAO="{ item }">
          {{ convertDecimal(item.TX_OCUPACAO) }}
        </template>
      </v-data-table>
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
        loading: false,
        footerProps: {
          itemsPerPageText: 'Itens por página:',
          pageText: '{0}-{1} de {2}',
          perPageText: 'Itens por página:'
        },
        headers: [
          {
            text: 'Almope',
            align: 'center',
            class: 'grey lighten-2',
            value: 'ALMOPE'
          },
          {
            text: 'Nome',
            align: 'center',
            class: 'grey lighten-2',
            value: 'NOME'
          },
          {
            text: 'Resolvidos',
            align: 'center',
            class: 'grey lighten-5',
            value: 'VOLUME'
          },
          {
            text: 'Agendamentos',
            align: 'center',
            class: 'grey lighten-5',
            value: 'AGENDAMENTOS'
          },
          {
            text: 'Tempo Tratando',
            align: 'center',
            class: 'grey lighten-5',
            value: 'TEMPO_TRATANDO'
          },
          {
            text: 'Tempo Logado',
            align: 'center',
            class: 'grey lighten-5',
            value: 'TEMPO_LOGADO'
          },
          {
            text: 'Jackin',
            align: 'center',
            class: 'grey lighten-5',
            value: 'JACKIN'
          },
          {
            text: 'Tx Ocupação',
            align: 'center',
            class: 'grey lighten-5',
            value: 'TX_OCUPACAO'
          },
          {
            text: 'Supervisor',
            align: 'center',
            class: 'grey lighten-5',
            value: 'SUPERIOR1'
          }
        ],
        base: []
      }
    },
    computed: {
      nameTratado() {
        let data = this.moment().format('DDMMYYYY')
        return `PYXIS_TRATAMENTO_ONLINE_${data}_BKO`
      }
    },
    methods: {
      convertDecimal(value) {
        return (value * 100).toFixed(2).concat('%')
      },
      loadBase() {
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/backoffice/gerencial/taxa_ocupacao/${this.produto}`
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
