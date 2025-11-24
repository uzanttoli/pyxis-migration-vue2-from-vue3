<template>
  <v-card elevation="1" class="rounded-xl">
    <title-negative-margin :title="title" className="rounded-r-xl"></title-negative-margin>
    <v-data-table
      dense
      multi-sort
      class="text-no-wrap"
      loading-text="Carregando..."
      no-data-text="Nenhum dados carregados..."
      :items="base"
      :headers="getHeaders(numSuperior, withSkill)"
      :loading="loading"
      :items-per-page="15"
      :search="search"
      :item-key="colunaChave"
    >
      <template v-slot:header>
        <thead class="text-center">
          <tr>
            <th class="text-center" :colspan="[title == 'Operador' ? 4 : 3]">Consolidado</th>
            <th class="text-center grey lighten-3" colspan="2">Anterior Consolidado</th>
            <th
              class="text-center"
              :class="[i % 2 ? 'grey lighten-3' : '']"
              v-for="(inter, i) in intervalos"
              colspan="2"
              :key="i"
            >
              {{ inter.INTERVALO ? inter.INTERVALO : '-' }}
            </th>
            <th
              v-if="numSuperior > 1"
              class="text-center grey lighten-3"
              :colspan="[numSuperior - 1]"
            >
              Gestores
            </th>
          </tr>
        </thead>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
  import { RechamadaService } from '@/data/services/dadosOnline'
  export default {
    name: 'tabela-tmt-intervalo-gerencial',
    props: {
      title: {
        type: String,
        default: 'Minha rechamada'
      },
      titleIcon: {
        type: String
      },
      tipoPerfil: {
        type: Number,
        required: true
      }
    },
    data: function () {
      return {
        itemClass: 'grey lighten-3',
        search: '',
        interval: null,
        colunaChave: 'COORDENADOR+SUPERVISOR',
        iconUp: 'fa-solid fa-caret-up',
        iconDown: 'fa-solid fa-caret-down',
        iconZero: 'fa-solid fa-minus',
        loading: false,
        base: [],
        intervalos: [],
        supervisorFilter: '',
        coordenadorFilter: '',
        numSuperior: 1,
        withFilter: null,
        withSkill: null
      }
    },
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async loadBase() {
        this.base = await RechamadaService.getDadosMinhaRechamada(
          this.usuario.almope,
          this.tipoPerfil
        )
      },
      async loadIntervalos() {
        this.intervalos = await RechamadaService.getDadosIntervaloRechamada()
      },
      getHeaders() {
        let arrHeaders = [
          {
            text: 'Nome',
            align: 'center',
            sortable: true,
            value: 'NOME_PARAMETRO',
            class: ''
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'ATENDIDAS',
            class: ''
          },
          {
            text: '(%) Rechamada',
            align: 'center',
            sortable: true,
            value: 'PERC_RECHAMADAS',
            class: ''
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS_ANT',
            class: 'grey lighten-3'
          },
          {
            text: '(%) Rechamada',
            align: 'center',
            sortable: true,
            value: 'PERC_RECHAM_ANT',
            class: 'grey lighten-3'
          },

          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS2',
            class: ''
          },
          {
            text: '(%) Rechamada',
            align: 'center',
            sortable: true,
            value: 'PERC_RECHAM2',
            class: ''
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS3',
            class: 'grey lighten-3'
          },
          {
            text: '(%) Rechamada',
            align: 'center',
            sortable: true,
            value: 'PERC_RECHAM3',
            class: 'grey lighten-3'
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS4',
            class: ''
          },
          {
            text: '(%) Rechamada',
            align: 'center',
            sortable: true,
            value: 'PERC_RECHAM4',
            class: ''
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS5',
            class: 'grey lighten-3'
          },
          {
            text: '(%) Rechamada',
            align: 'center',
            sortable: true,
            value: 'PERC_RECHAM5',
            class: 'grey lighten-3'
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS6',
            class: ''
          },
          {
            text: '(%) Rechamada',
            align: 'center',
            sortable: true,
            value: 'PERC_RECHAM6',
            class: ''
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS7',
            class: 'grey lighten-3'
          },
          {
            text: '(%) Rechamada',
            align: 'center',
            sortable: true,
            value: 'PERC_RECHAM7',
            class: 'grey lighten-3'
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS8',
            class: ''
          },
          {
            text: '(%) Rechamada',
            align: 'center',
            sortable: true,
            value: 'PERC_RECHAM8',
            class: ''
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS9',
            class: 'grey lighten-3'
          },
          {
            text: '(%) Rechamada',
            align: 'center',
            sortable: true,
            value: 'PERC_RECHAM9',
            class: 'grey lighten-3'
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS10',
            class: ''
          },
          {
            text: '(%) Rechamada',
            align: 'center',
            sortable: true,
            value: 'PERC_RECHAM10',
            class: ''
          }
        ]
        return arrHeaders
      }
    },
    watch: {},
    created() {
      this.loadIntervalos()
      this.loadBase()
    }
  }
</script>
<style scoped>
  .cor-button {
    background-image: linear-gradient(290deg, #00ecff, #8f0e8f);
  }
</style>
