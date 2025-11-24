<template>
  <v-col class="px-0">
    <v-card class="rounded-xl">
      <v-card-title class="mb-n7">
        <title-negative-margin
          title="Minhas visitas Técnicas"
          class="pa-0 ma-0 ml-n3"
          className="rounded-r-xl"
          :minWidth="310"
        >
          <template v-slot:button v-if="usuario.filtro !== 'OPERADOR'">
            <download-excel
              :data="visitas"
              :name="'MINHAS VISITAS TÉCNICAS'"
              :worksheet="'MINHAS VISITAS TÉCNICAS'"
            >
              <v-btn fab x-small class="mr-1 ml-2" elevation="1">
                <v-icon class="blue--text">fa-solid fa-file-arrow-down</v-icon>
              </v-btn>
            </download-excel>
          </template>
        </title-negative-margin>
        <v-spacer></v-spacer>
        <div style="max-width: max-content">
          <v-text-field
            v-model="search"
            placeholder="Pesquisar"
            label="Pesquisar"
            outlined
            dense
          ></v-text-field>
        </div>
      </v-card-title>

      <v-data-table
        :headers="getHeaders"
        :items="visitas"
        dense
        :footer-props="footerProps"
        :search="search"
        no-data-text="Nenhum registro encontrado"
      >
        <template v-slot:top>
          <v-col>
            <v-row>
              <CardVisitaTecnica class="mb-n5" />
            </v-row>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </v-col>
        </template>
      </v-data-table>
    </v-card>
  </v-col>
</template>

<script>
  import CardVisitaTecnica from './CardVisitaTecnica.vue'
  import { DadosOnlineOperadorVisitaTecnicaService } from '@/data/services/operacoes/dadosOnline/index'
  export default {
    components: { CardVisitaTecnica },
    name: 'TableGenericsVisitaImprodutiva',
    data() {
      return {
        visitas: [],
        search: null,
        toggle_exclusive: null,
        footerProps: {
          itemsPerPageText: 'Itens por página:',
          pageText: '{0}-{1} de {2}',
          perPageText: 'Itens por página:'
        }
      }
    },
    methods: {
      async loadDadosImprodutivos() {
        let result = await DadosOnlineOperadorVisitaTecnicaService.getVisitaImprodutiva(
          this.usuario.almope,
          this.tipoPerfil
        )
        this.visitas = result
      }
    },
    computed: {
      getHeaders() {
        if (!Array.isArray(this.visitas) || this.visitas.length === 0) {
          return []
        }
        const data = this.visitas[0]
        return Object.keys(data).map(item => ({
          text: item.replace(/_/g, ' '),
          value: item,
          class: 'light-blue lighten-1 white--text',
          align: 'center'
        }))
      },
      tipoPerfil() {
        const perfilMap = {
          OPERADOR: '1',
          SUPERVISOR: '2',
          COORDENADOR: '3'
        }
        return perfilMap[this.usuario.filtro] || ''
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    created() {
      this.loadDadosImprodutivos()
    }
  }
</script>

<style scoped></style>
