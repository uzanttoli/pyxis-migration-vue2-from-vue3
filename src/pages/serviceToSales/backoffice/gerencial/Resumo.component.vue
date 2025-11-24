<template>
  <div>
    <v-card elevation="1" class="rounded-xl" min-height="200">
      <div class="d-flex flex-row align-center justify-space-between">
        <v-card-title>
          <v-progress-circular
            size="20"
            value="10"
            indeterminate
            width="2"
            class="mr-2"
            v-if="loading"
          ></v-progress-circular>
          {{ title }}
        </v-card-title>
      </div>
      <v-divider></v-divider>
      <div v-if="dadosComponent != null" class="d-flex flex-wrap">
        <v-col cols="3">
          <CardInfo :listDados="dadosCards" />
        </v-col>
        <v-col cols="9">
          <TableInfo className="rounded-xl" :data="dadosTabela" :loading="loading">
            <template v-slot:title>
              <v-card-title>Operadores</v-card-title>
            </template>
          </TableInfo>
        </v-col>
        <v-col cols="12">
          <TableInfo className="rounded-xl" :data="dadosTabelaMotivo" :loading="loading">
            <template v-slot:title>
              <v-card-title>Motivos não venda</v-card-title>
            </template>
          </TableInfo>
        </v-col>
      </div>
      <div v-else class="d-flex justify-center align-center w-100%" style="height: 150px">
        <p class="text-h5 grey--text">Selecione uma fila...</p>
      </div>
    </v-card>
  </div>
</template>

<script>
  import DadosTratativaService from '@/data/services/bko/serviceToSales/gerencial/DadosTratativa'
  import TableInfo from '@/shared/components/DataTable/TableDinamics.vue'
  import CardInfo from './_components/CardInfo.vue'
  import Utils from '@/data/services/common/Utils'
  export default {
    components: { CardInfo, TableInfo },
    props: {
      title: {
        type: String
      },
      dadosComponent: {
        type: [Array, Object],
        default: () => []
      },
      dataFiltrada: {
        type: [Array]
      }
    },
    data: () => ({
      toggleExclusive: null,
      dadosCards: [],
      dadosTabela: [],
      dadosTabelaMotivo: [],
      loading: false
    }),
    methods: {
      async loadDadosGerencial() {
        this.$emit('update:loading', true)
        this.loading = true
        const relatorio = this.dadosComponent && this.dadosComponent.ValorRelatorio
        this.dadosCards = await DadosTratativaService.getDadosTratativaCard(
          relatorio,
          this.dataFiltrada
        )
        this.dadosTabela = await DadosTratativaService.getDadosTratativasBko(
          relatorio,
          this.dataFiltrada
        )
        this.dadosTabelaMotivo = await DadosTratativaService.getDadosMotivoTratativa(relatorio)
        this.dadosTabela.map(Utils.replaceNulls)

        this.loading = false
        this.$emit('update:loading', false)
      }
    },
    created() {
      // this.loadDadosGerencial();
    },
    watch: {
      dadosComponent: async function (newVal, oldVal) {
        if (newVal != oldVal) {
          await this.loadDadosGerencial()
        }
      },
      dataFiltrada: async function (newVal, oldVal) {
        if (newVal != oldVal && this.dataFiltrada.length == 2 && this.dadosComponent) {
          await this.loadDadosGerencial()
        }
      }
    }
  }
</script>

<style scoped>
  .custom-btn-toggle {
    background-color: rgba(103, 58, 183, 0.1); /* Leve fundo roxo transparente */
    padding: 6px;
    border-radius: 12px;
    transition: background 0.3s ease-in-out;
  }

  .custom-btn {
    color: #673ab7; /* Deep Purple */
    transition: all 0.3s ease-in-out;
  }

  .custom-btn:hover {
    background-color: rgba(103, 58, 183, 0.15); /* Fundo leve no hover */
  }

  .custom-btn .v-icon {
    font-size: 22px;
    transition: transform 0.2s ease-in-out;
  }

  .custom-btn:hover .v-icon {
    transform: scale(1.1);
  }
</style>
