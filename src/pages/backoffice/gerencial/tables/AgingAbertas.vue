<template>
  <v-row>
    <v-col>
      <title-negative-margin title="Abertas">
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
        no-results-text="Nada encontrado!"
        no-data-text="Não há nada por aqui!"
        :items="base"
        loading-text="Carregando... Por favor aguarde!"
        :loading="loading"
        :footer-props="footerProps"
      >
        <template v-slot:item="{ item, index }">
          <tr :class="index % 2 === 0 ? 'white' : 'grey lighten-4'" class="text-center">
            <td>{{ item.AGRUPAMENTO }}</td>
            <td>{{ item.FP }}</td>
            <td>{{ item.CR_TRATANDO }}</td>
            <td>{{ item.OC_POR_CR }}</td>
            <td>{{ item['07:00'] }}</td>
            <td>{{ item['08:00'] }}</td>
            <td>{{ item['09:00'] }}</td>
            <td>{{ item['10:00'] }}</td>
            <td>{{ item['11:00'] }}</td>
            <td>{{ item['12:00'] }}</td>
            <td>{{ item['13:00'] }}</td>
            <td>{{ item['14:00'] }}</td>
            <td>{{ item['15:00'] }}</td>
            <td>{{ item['16:00'] }}</td>
            <td>{{ item['17:00'] }}</td>
            <td>{{ item['18:00'] }}</td>
            <td>{{ item['19:00'] }}</td>
            <td>{{ item['20:00'] }}</td>
            <td>{{ item['21:00'] }}</td>
            <td>{{ item['22:00'] }}</td>
            <td>{{ item['23:00'] }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
  import config from '../../../../core/config'
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
        base: [],
        loading: false,
        headers: [
          {
            text: 'Agrupamento',
            align: 'center',
            value: 'AGRUPAMENTO',
            class: 'grey lighten-2'
          },
          {
            text: 'Fora do Prazo',
            align: 'center',
            value: 'FP',
            class: 'grey lighten-2'
          },
          {
            text: 'Agentes Tratando',
            align: 'center',
            value: 'CR_TRATANDO',
            class: 'grey lighten-2'
          },
          {
            text: 'OC por Agente',
            align: 'center',
            value: 'OC_POR_CR',
            class: 'grey lighten-2'
          },
          {
            text: '07:00',
            align: 'center',
            value: '07:00',
            class: 'grey lighten-4'
          },
          {
            text: '08:00',
            align: 'center',
            value: '08:00',
            class: 'grey lighten-4'
          },
          {
            text: '09:00',
            align: 'center',
            value: '09:00',
            class: 'grey lighten-4'
          },
          {
            text: '10:00',
            align: 'center',
            value: '10:00',
            class: 'grey lighten-4'
          },
          {
            text: '11:00',
            align: 'center',
            value: '11:00',
            class: 'grey lighten-4'
          },
          {
            text: '12:00',
            align: 'center',
            value: '12:00',
            class: 'grey lighten-4'
          },
          {
            text: '13:00',
            align: 'center',
            value: '13:00',
            class: 'grey lighten-4'
          },
          {
            text: '14:00',
            align: 'center',
            value: '14:00',
            class: 'grey lighten-4'
          },
          {
            text: '15:00',
            align: 'center',
            value: '15:00',
            class: 'grey lighten-4'
          },
          {
            text: '16:00',
            align: 'center',
            value: '16:00',
            class: 'grey lighten-4'
          },
          {
            text: '17:00',
            align: 'center',
            value: '17:00',
            class: 'grey lighten-4'
          },
          {
            text: '18:00',
            align: 'center',
            value: '18:00',
            class: 'grey lighten-4'
          },
          {
            text: '19:00',
            align: 'center',
            value: '19:00',
            class: 'grey lighten-4'
          },
          {
            text: '20:00',
            align: 'center',
            value: '20:00',
            class: 'grey lighten-4'
          },
          {
            text: '21:00',
            align: 'center',
            value: '21:00',
            class: 'grey lighten-4'
          },
          {
            text: '22:00',
            align: 'center',
            value: '22:00',
            class: 'grey lighten-4'
          },
          {
            text: '23:00',
            align: 'center',
            value: '23:00',
            class: 'grey lighten-4'
          }
        ]
      }
    },
    computed: {},
    methods: {
      laodBase() {
        if (!this.produto) return
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/backoffice/gerencial/aging_abertas/${this.produto}`
        this.$api.get(urlData).then(res => {
          this.base = res.data
          this.loading = false
        })
      }
    },
    created() {
      this.laodBase()
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

<style scoped>
  .piscar {
    animation: piscar 1s 3;
  }

  @keyframes piscar {
    50% {
      opacity: 15;
      color: red;
      text-shadow: 0px 0px 10px red;
    }
  }
</style>
