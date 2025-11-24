<template>
  <v-card elevation="1">
    <v-card-title>Visitas Improdutivas</v-card-title>
    <v-col>
      <v-row>
        <v-col>
          <v-select
            :items="filter"
            v-model="search"
            outlined
            label="Pesquisar por semana"
            placeholder="Pesquisar por semana"
          ></v-select>
        </v-col>
        <v-col>
          <v-text-field
            v-model="search"
            outlined
            label="Pesquisar"
            placeholder="Pesquisar"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-data-table
        :search="search"
        no-data-text="Não há visitas improdutivas geradas..."
        :headers="getHeaders"
        :items="visitas"
        class="text-no-wrap"
        no-results-text="Nada encontrado..."
        dense
      ></v-data-table>
    </v-col>
  </v-card>
</template>

<script>
  import { DadosOnlineOperadorVisitaTecnicaService } from '@/data/services/operacoes/dadosOnline/index'
  export default {
    data: () => ({
      visitas: [],
      filter: ['SEM1', 'SEM2', 'SEM3', 'SEM4', 'SEM5'],
      search: null
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      getHeaders() {
        let data = this.visitas[0] ?? []
        let headers = []
        if (!data) return []
        Object.keys(data).map(item => {
          headers.push({
            text: item,
            value: item,
            align: 'center'
          })
        })

        return headers
          .map(element => element)
          .filter(item => !['ALMOPE_OPE', 'NOME_OPE'].includes(item.text))
      },
      tipoPerfil() {
        const perfilMap = {
          OPERADOR: '1',
          SUPERVISOR: '2',
          COORDENADOR: '3'
        }
        return perfilMap[this.usuario.filtro] || ''
      }
    },
    methods: {
      async loadMinhasVisitasImprodutivas() {
        let result = await DadosOnlineOperadorVisitaTecnicaService.getVisitaImprodutiva(
          this.usuario.almope,
          this.tipoPerfil
        )
        this.visitas = result
      }
    },
    created() {
      this.loadMinhasVisitasImprodutivas()
    }
  }
</script>

<style></style>
