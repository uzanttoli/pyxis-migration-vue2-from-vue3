<template>
  <section class="layout-online-superior">
    <v-sheet elevation="3">
      <title-negative-margin :title="title"></title-negative-margin>
      <v-data-table dense :headers="getHeaders()" :items="base" class="text-no-wrap"></v-data-table>
    </v-sheet>
  </section>
</template>

<script>
  import config from '../../../core/config'
  export default {
    props: {
      title: {
        type: String,
        require: true
      },
      actionUrl: {
        type: String,
        require: true
      }
    },
    data: () => ({
      base: []
    }),
    methods: {
      getHeaders() {
        let headers = [
          {
            text: 'Almope',
            sortable: false,
            value: 'ALMOPE',
            align: 'center'
          },
          {
            text: 'Nome',
            sortable: false,
            value: 'NOME',
            align: 'center'
          },
          {
            text: 'Ramal',
            sortable: false,
            value: 'RAMAL',
            align: 'center'
          },
          {
            text: 'DAC',
            sortable: false,
            value: 'DAC',
            align: 'center'
          },
          {
            text: 'Motivo',
            sortable: false,
            value: 'MOTIVO',
            align: 'center'
          },
          {
            text: 'Skill',
            sortable: false,
            value: 'SKILL',
            align: 'center'
          },
          {
            text: 'Estado',
            sortable: false,
            value: 'ESTADO',
            align: 'center'
          },
          {
            text: 'Duração',
            sortable: false,
            value: 'DURACAO',
            align: 'center'
          },
          {
            text: 'Campanha',
            sortable: false,
            value: 'CAMPANHA',
            align: 'center'
          },
          {
            text: 'Inaderência',
            sortable: false,
            value: 'INADERENCIA',
            align: 'center'
          },
          {
            text: 'Inicio',
            sortable: false,
            value: 'INICIO',
            align: 'center'
          },
          {
            text: 'Login',
            sortable: false,
            value: 'LOGIN',
            align: 'center'
          },
          {
            text: 'Login Net',
            sortable: false,
            value: 'LOGIN_NET',
            align: 'center'
          },
          {
            text: 'Estouro Pausa',
            sortable: false,
            value: 'PAUSA_ESTOURO',
            align: 'center'
          },
          {
            text: 'Nome Skill',
            sortable: false,
            value: 'NOME_SKILL',
            align: 'center'
          }
        ]
        return headers
      },
      async loadBase() {
        let urlData = `${config.baseUrl}${this.actionUrl}`
        await this.$api.get(urlData).then(res => {
          this.base = res.data
        })
      }
    },
    created() {
      this.loadBase()
    }
  }
</script>

<style></style>
