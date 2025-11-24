<template>
  <v-container>
    <title-negative-margin title="Configurações Campanha" icon="mdi-database-alert-outline" />
    <v-expansion-panels v-model="panel" readonly multiple class="pa-4">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <v-toolbar-title>Adicionar Campanha</v-toolbar-title>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <adicionar-campanha @saved="refresh()" />
          <campanhas-datatable :campanhas="campanhas" @refresh="refresh()"></campanhas-datatable>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
<script>
  import AdicionarCampanha from './_components/adicionarCampanha.vue'
  import CampanhasDatatable from './_components/campanhasDatatable.vue'
  import ConfiguracaoCampanha from '@/data/services/configuracaoCampanha/ConfiguracaoCampanhaService'

  export default {
    components: { AdicionarCampanha, CampanhasDatatable },
    data() {
      return {
        panel: [0],
        campanhas: []
      }
    },
    methods: {
      async refresh() {
        this.campanhas = await ConfiguracaoCampanha.getAll()
      }
    },
    async mounted() {
      await this.refresh()
    }
  }
</script>
