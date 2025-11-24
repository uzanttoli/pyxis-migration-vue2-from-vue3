<template>
  <v-container fluid>
    <CardAppBar
      isButtonReturn
      customClass="rounded-xl mb-8"
      :minHeight="135"
      style="margin-top: 10px"
      styleCustom="display: flex; height: 135px; padding: 25px; align-items:center; color: #fafafa;"
      @update:click="goBack"
    >
      <template v-slot:title>
        <h3>
          <v-icon color="white" x-large class="mr-3">fa-solid fa-cash-register</v-icon>
          Gestão de Bloqueados
        </h3>
      </template>
    </CardAppBar>
    <v-row>
      <v-col cols="12" md="6" sm="12" lg="4" v-for="(item, i) in items" :key="i">
        <div class="mt-4">
          <v-card class="pa-4 rounded-xl shadow-md" elevation="0" outlined>
            <div style="display: flex; justify-content: center; align-items: center">
              <h2 class="mb-n3">{{ item.produto }}</h2>
            </div>
            <GraficoStackerBar :title="item.produto" />
          </v-card>
        </div>
        <v-card class="pa-4 rounded-xl shadow-md mt-5" outlined>
          <v-col v-for="(item2, j) in item.info" :key="j" class="pa-1 py-2">
            <ListStyles
              :title="item2.headline"
              :valueTitle="j == 0 ? item2.value : ''"
              :percentageTitle="j == 0 ? item2.percentage + '%' : ''"
            />
            <v-col v-for="(item3, k) in item2.detalhe" :key="k" class="pa-0">
              <ListStyles
                :subtitle="item3.title"
                :value="item3.value"
                :percentage="percentage(item3.percentage)"
              />
            </v-col>
          </v-col>
        </v-card>
      </v-col>

      <v-col cols="12">
        <TableInfo className="rounded-xl" :data="dadosTabela" :loading="loading">
          <template v-slot:title>
            <v-card-title>
              <v-icon size="20" class="mr-2" color="orange">fa-solid fa-user-lock</v-icon>
              Nominal de bloqueados
              <v-spacer></v-spacer>
              <download-excel :data="dadosTabela" :name="nameDownload" :worksheet="nameDownload">
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn icon v-bind="attrs" v-on="on" class="success--text">
                      <v-icon>fa-solid fa-file-arrow-down</v-icon>
                    </v-btn>
                  </template>
                  <span>Baixar</span>
                </v-tooltip>
              </download-excel>
            </v-card-title>
          </template>
        </TableInfo>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import ListStyles from './ListStyles.component.vue'
  import GraficoStackerBar from './Grafico.gestaoBloqueados.vue'
  import TableInfo from '@/shared/components/DataTable/TableDinamics.vue'
  import CardAppBar from '@/shared/components/cards/modern/cardAppBar.vue'
  import GestaoBloqueadosService from '@/data/services/tabuladores/GestaoBloqueados'
  export default {
    components: { CardAppBar, ListStyles, GraficoStackerBar, TableInfo },
    data: vm => ({
      items: [],
      dadosTabela: [],
      loading: false,
      nameDownload: `PYXIS_NOMINAL_BLOQUEADOS_${vm.moment().format('DD_MM_YYYY HH-mm-ss')}`
    }),
    methods: {
      percentage(value) {
        return value.toString().replace('.', ',')
      },
      goBack() {
        this.$router.go(-1)
      },
      async loadDadosCardPainelGerencial() {
        try {
          const result = await GestaoBloqueadosService.getDadosCardPainelGerencial()
          this.items = result
        } catch (error) {
          console.error(error)
        }
      },
      async loadDadosNominalBloqueadosPainelGerencial() {
        try {
          this.loading = true
          const result = await GestaoBloqueadosService.getDadosNominalBloqueadosPainelGerencial()
          this.dadosTabela = result
          this.loading = false
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    },
    created() {
      this.loadDadosCardPainelGerencial()
      this.loadDadosNominalBloqueadosPainelGerencial()
    }
  }
</script>

<style scoped>
  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
    /* border-bottom: 1px dotted #999; */
    padding-bottom: 4px;
  }
</style>
