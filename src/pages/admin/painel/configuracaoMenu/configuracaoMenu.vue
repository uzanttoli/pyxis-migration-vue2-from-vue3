<template>
  <v-container>
    <title-negative-margin title="Configurações Menu" icon="mdi-database-alert-outline" />

    <Agrupamentos />

    <Rotas />

    <v-expansion-panels v-model="panel" multiple class="pa-4">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <v-toolbar-title>Menu Colaborador</v-toolbar-title>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <div class="mt-5 flex align-center">
            <v-col cols="12" sm="6" md="3" class="m-0 p-0">
              <v-row>
                <v-text-field
                  v-model="almopeSelecionado"
                  single-line
                  label="Almope"
                  @keyup.enter="buscarMenuUsuario(almopeSelecionado)"
                ></v-text-field>
                <v-btn class="ml-5" color="info" dark @click="buscarMenuUsuario(almopeSelecionado)">
                  <span>Buscar</span>
                </v-btn>
              </v-row>
            </v-col>

            <v-divider />

            <v-col cols="12">
              <v-text-field v-model="filtroRotas" label="Filtrar rotas" clearable class="mb-4" />
              <div style="max-height: 500px; overflow-y: auto">
                <v-row>
                  <v-col
                    v-for="(colRotas, colIdx) in rotasEmColunasFiltradas"
                    :key="'col-' + colIdx"
                    cols="12"
                    sm="4"
                  >
                    <v-row
                      dense
                      class="align-center m-0 px-4"
                      v-for="rota in colRotas"
                      :key="rota.id"
                    >
                      <div class="mr-auto" style="white-space: normal; word-break: break-word">
                        {{ rota.agrupamento ? rota.agrupamento + ' - ' : '' }}{{ rota.label }}
                      </div>
                      <v-switch
                        v-model="rota.ativo"
                        inset
                        class="ml-4 self-end"
                        @change="onToggleRota(rota)"
                      />
                      <v-tooltip bottom color="error">
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            :color="rota.almopeBloqueio ? 'red' : 'gray'"
                            v-bind="attrs"
                            v-on="on"
                          >
                            mdi mdi-shield-lock
                          </v-icon>
                        </template>
                        <span v-if="rota.almopeBloqueio">Bloqueado por exceção</span>
                      </v-tooltip>
                      <v-icon :color="!rota.almopeBloqueio && rota.status ? 'green' : 'gray'">
                        mdi mdi-shield-off
                      </v-icon>
                    </v-row>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
<script>
  import Agrupamentos from './agrupamentos.vue'
  import Rotas from './rotas/rotas.vue'
  import alerts from '@/mixins/alerts.mixins'

  import { MenuAlmopeService } from '@/data/services/menu/MenuAlmopeService'

  const NUM_COLUNAS = 3

  export default {
    components: { Agrupamentos, Rotas },
    mixins: [alerts],
    computed: {
      rotasEmColunas() {
        if (!this.rotasPorAlmope) return [[], [], []]
        const cols = [[], [], []]
        this.rotasPorAlmope.forEach((rota, idx) => {
          cols[idx % NUM_COLUNAS].push(rota)
        })
        return cols
      },
      rotasEmColunasFiltradas() {
        if (!this.rotasPorAlmope) return [[], [], []]
        let filtradas = this.rotasPorAlmope
        if (this.filtroRotas && this.filtroRotas.trim() !== '') {
          const filtro = this.filtroRotas.trim().toLowerCase()
          filtradas = filtradas.filter(
            r =>
              (r.label && r.label.toLowerCase().includes(filtro)) ||
              (r.agrupamento && r.agrupamento.toLowerCase().includes(filtro))
          )
        }
        const cols = [[], [], []]
        filtradas.forEach((rota, idx) => {
          cols[idx % NUM_COLUNAS].push(rota)
        })
        return cols
      }
    },
    data() {
      return {
        panel: [0],
        almopeSelecionado: null,
        rotasPorAlmope: [],
        filtroRotas: ''
      }
    },
    watch: {
      almopeSelecionado(val) {
        if (val === '' || val === null) {
          this.rotasPorAlmope = null
        }
      }
    },
    methods: {
      async onToggleRota(rota) {
        try {
          await MenuAlmopeService.toggleMenuAlmope(this.almopeSelecionado, rota.id, rota.ativo)
          await this.buscarMenuUsuario(this.almopeSelecionado)
          if (rota.ativo) {
            this.toast(
              `Acesso à rota "${rota.label}" liberado.`,
              'top-right',
              false,
              3500,
              'success'
            )
          } else {
            this.toast(
              `Acesso à rota "${rota.label}" bloqueado.`,
              'top-right',
              false,
              3500,
              'warning'
            )
          }
        } catch (_) {
          rota.ativo = !rota.ativo
          this.showSnackbar('Erro ao atualizar o acesso.', 'error')
        }
      },
      async buscarMenuUsuario(almope) {
        if (!almope) return
        let data = await MenuAlmopeService.getByAlmope(almope)
        data = data.map(r => ({
          ...r,
          ativo: r.status
        }))
        this.rotasPorAlmope = data
      }
    },
    async created() {}
  }
</script>
