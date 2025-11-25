<template>
  <v-card class="rounded-xl" min-height="100">
    <v-card-title class="d-flex align-center pb-4 flex-column">
      <v-icon left color="blue" size="30">fa-solid fa-chart-simple</v-icon>
      Farol NICE
      <div class="d-flex">
        <v-col>
          <v-autocomplete
            outlined
            dense
            no-data-text="Não há regionais disponiveis..."
            hide-no-data
            placeholder="Selecione uma regional"
            :items="itemsRegionalSumario"
            v-model="regionalSumario"
            item-text="REGIONAL_SUMARIO"
            label="Selecione uma regional"
            @change="loadDadosFarol()"
          ></v-autocomplete>
        </v-col>
        <v-col style="margin-top: -10px">
          <DatePicker
            label="Selecione uma data"
            v-model="dataSelecionada"
            :dateMaxProps="true"
            :dateMinProps="false"
            :isRange="false"
            :addDay="0"
            @change="loadDadosFarol()"
          />
        </v-col>
      </div>
    </v-card-title>
    <v-col>
      <v-data-table
        :items="dados"
        :headers="header"
        :loading="loading"
        loading-text="Carregando..."
        dense
        no-data-text="Não há dados ainda... Selecione uma regional"
        no-results-text="Nada encontrado com o filtro selecionado"
      >
        <template v-slot:item.DATA="{ item }">
          <span>{{ item.DATA.split(' ')[0] | dataFormatada }}</span>
        </template>
        <template v-slot:item.INTERVALO="{ item }">
          <span>{{ item.INTERVALO.split(' ')[1] }}</span>
        </template>
        <template v-slot:item.RECURSOS="{ item }">
          <span>{{ Math.floor(item.RECURSOS) }}</span>
        </template>
        <template v-slot:item.PAUSA="{ item }">
          <v-icon size="15" class="mr-1">fa-solid fa-clock</v-icon>
          <span>{{ item.PAUSA }}</span>
        </template>
        <template v-slot:item.FALANDO="{ item }">
          <v-icon size="15" class="mr-1" color="orange">fa-solid fa-phone-volume</v-icon>
          <span>{{ item.FALANDO }}</span>
        </template>
        <template v-slot:item.DISPONIVEIS="{ item }">
          <v-icon size="15" class="mr-1" color="green">fa-solid fa-user</v-icon>
          <span>{{ item.DISPONIVEIS }}</span>
        </template>
        <template v-slot:item.LOGADOS="{ item }">
          <v-icon size="15" class="mr-1" color="green">fa-solid fa-user</v-icon>
          <span>{{ item.LOGADOS }}</span>
        </template>
        <template v-slot:item.ACW="{ item }">
          <v-icon size="15" class="mr-1" color="red">fa-solid fa-phone-slash</v-icon>
          <span>{{ item.ACW }}</span>
        </template>
        <template v-slot:item.OUTROS_STATUS="{ item }">
          <v-icon size="15" class="mr-1">fa-solid fa-circle-info</v-icon>
          <span>{{ item.OUTROS_STATUS }}</span>
        </template>
      </v-data-table>
    </v-col>
  </v-card>
</template>

<script>
  import DatePicker from '@/shared/components/DatePicker/DatePicker.vue'
  import { ExecutivoService } from '@/data/services/relatorioOnline'
  export default {
    name: 'farol-executivo',
    components: { DatePicker },
    data: () => ({
      dados: [],
      dataSelecionada: null,
      itemsRegionalSumario: [],
      loading: false,
      regionalSumario: null
    }),
    computed: {
      header() {
        let dados = this.dados[0]
        let colunasDesconsiderar = ['DATA_ATUALIZACAO', 'OPERACAO', 'REGIONAL']
        if (!dados) return
        let header = Object.keys(dados)
          ?.map(item => {
            return {
              text: item,
              value: item,
              align: 'center',
              class: 'light-blue darken-2 white--text'
            }
          })
          .filter(filterItem => {
            if (!colunasDesconsiderar?.includes(filterItem.text)) {
              return filterItem
            }
          })

        return header
      }
    },
    filters: {
      dataFormatada(value) {
        if (!value) return
        return value.split('-').reverse().join('/')
      }
    },
    methods: {
      async loadListarRegional() {
        this.itemsRegionalSumario = await ExecutivoService.getListarRegionalSumario()
      },
      async loadDadosFarol() {
        this.loading = true
        this.dados = await ExecutivoService.getDadosFarol(
          this.regionalSumario,
          this.dataSelecionada
        )
        this.loading = false
      }
    },
    created() {
      this.loadListarRegional()
    },
    watch: {}
  }
</script>

<style scoped></style>
