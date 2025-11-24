<template>
  <v-row class="card-metas" v-if="baseHistorico != ''">
    <v-col>
      <v-card class="rounded-xl">
        <!-- <pre>{{ itemHeaders }}</pre> -->
        <title-rounded-tl-rb class="mb-4 ml-3">
          <template v-slot:title>
            <div style="display: flex; justify-content: center; align-items: center">
              <v-icon color="white" class="mr-2" style="transform: rotate(45deg)">
                fa-solid fa-gamepad
              </v-icon>
              <h2 class="white--text">
                Histórico de Perdas e Ganhos
                <!-- {{ openViewDetalhesTable }} -->
              </h2>
            </div>
          </template>
          <v-row justify="end" align="end" class="mr-2">
            <v-col class="pa-0 ma-0" cols="2">
              <v-select
                label="Selecione"
                single-line
                hide-details
                outlined
                rounded
                solo
                color="white"
                dense
                v-model="periodoSelecionado"
                :items="periodo"
                item-text="nome"
                item-value="value"
              ></v-select>
            </v-col>
            <v-col class="pa-0 ma-0 ml-2" cols="2">
              <v-text-field
                label="Pesquisar"
                single-line
                hide-details
                solo
                prepend-inner-icon="mdi-magnify"
                outlined
                rounded
                color="white"
                v-model="search"
                dense
              ></v-text-field>
            </v-col>
          </v-row>
        </title-rounded-tl-rb>
        <v-data-table
          dense
          :search="search"
          loading-text="Carregando...por favor aguarde!"
          no-data-text="Não conseguimos encontrar oque você slicitou."
          :headers="getHeaders()"
          :items="baseHistorico"
          :items-per-page="itemsPerPage"
          class="text-no-wrap"
          :loading="loading"
          :footer-props="footerProps"
          no-results-text="Não há dados disponiveis"
        >
          <template v-slot:header>
            <thead class="text-center">
              <tr>
                <th v-if="cargo != 'OPERADOR'"></th>
                <th v-if="cargo != 'OPERADOR'"></th>
                <th></th>
                <th
                  colspan="3"
                  v-for="(item, i) in indicadores"
                  :key="i"
                  class="text-center"
                  :class="i % 2 ? '' : 'grey lighten-5'"
                >
                  {{ item.INDICADOR }}
                </th>
              </tr>
            </thead>
          </template>
          <template v-slot:body="{ items }">
            <tr v-for="(item, i) in items" :key="i">
              <td v-for="(item2, j) in itemHeaders" :key="j">
                {{ item[item2.value] ? item[item2.value] : '-' }}
                <i :class="getIcon(item2.tipo, item[item2.value])"></i>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import config from '../../../core/config.js'
  export default {
    props: {
      produtoConsulta: {
        type: String,
        default: null
      },
      cargoConsulta: {
        type: String,
        default: null
      },
      almopeConsulta: {
        type: [String, Number],
        default: null
      },
      openViewDetalhesTable: {
        type: Boolean
      },
      indicadores: {
        type: [Array, Object]
      }
    },
    data: () => ({
      style: 'width:22px; padding: 2px',
      periodo: [
        { nome: 'ÚLTIMOS 15 DIAS', value: 15 },
        { nome: 'ÚLTIMOS 30 DIAS', value: 30 },
        { nome: 'ÚLTIMOS 60 DIAS', value: 60 },
        { nome: 'ÚLTIMOS 90 DIAS', value: 90 },
        { nome: 'ÚLTIMOS 180 DIAS', value: 180 }
      ],
      periodoSelecionado: 15,
      baseHistorico: [],
      search: '',
      loading: false,
      itemsPerPage: 5,
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      }
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      cargo() {
        return this.$store.getters.usuario.filtro
      },
      produto() {
        return this.$store.getters.usuario.produto
      },

      numCargo() {
        let cargo = this.cargo
        if (this.in('OPERADOR', this.cargoConsulta) || this.in('OPERADOR', cargo)) {
          return 1
        } else if (this.in('SUPERVISOR', this.cargoConsulta) || this.in('SUPERVISOR', cargo)) {
          return 2
        } else if (this.in('COORDENADOR', this.cargoConsulta) || this.in('COORDENADOR', cargo)) {
          return 3
        } else if (
          this.in('GERENTE, ADMINISTRADOR', this.cargoConsulta) ||
          this.in('GERENTE, ADMINISTRADOR', cargo)
        ) {
          return 4
        }
        return ''
      },
      itemHeaders() {
        return this.getHeaders()
      }
    },
    methods: {
      getIcon(tipo, value) {
        if (tipo === 'XP_' && value > 0) {
          return 'fa-solid fa-circle-check green--text'
        } else if (tipo === 'XP_' && value == 0) {
          return 'fa-solid fa-minus gray--text'
        }
        if (tipo === 'HP_' && value < 0) {
          return 'fa-solid fa-circle-exclamation red--text'
        } else if (tipo === 'HP_' && value == 0) {
          return 'fa-solid fa-minus gray--text'
        }
      },
      in(string, validateString) {
        if (!string) return
        let stringSplit = string.split(',')
        return stringSplit.includes(validateString)
      },
      getHeaders() {
        let almope = {
          text: 'ALMOPE',
          align: 'center',
          value: 'ALMOPE_OPE',
          tipo: null,
          class: null
        }

        let nome = {
          text: 'NOME',
          align: 'center',
          value: 'NOME_OPE',
          tipo: null,
          class: null
        }

        let header = [
          {
            text: 'DATA',
            align: 'center',
            value: 'DATA',
            tipo: null,
            class: null
          }
        ]

        let columnDefault = [
          {
            text: 'REALIZADO',
            align: 'center',
            tipo: null,
            value: null,
            class: null
          },
          {
            text: 'XP',
            align: 'center',
            tipo: 'XP_',
            value: null,
            class: null
          },
          {
            text: 'HP',
            align: 'center',
            tipo: 'HP_',
            value: null,
            class: null
          }
        ]

        for (let i = 0; i < this.indicadores.length; i++) {
          // Distribui as colunas dentro da tabela de acordo com o indicador
          let indicador = this.indicadores[i].INDICADOR
          let className = i % 2 ? null : 'grey lighten-5'
          for (let j = 0; j < columnDefault.length; j++) {
            columnDefault[j].class = className
            if (columnDefault[j].tipo == null) {
              columnDefault[j].value = indicador.split(' ').join('_')
            } else {
              columnDefault[j].value = columnDefault[j].tipo + indicador.split(' ').join('_')
            }
            header.push({ ...columnDefault[j] })
          }
        }

        if (this.cargo != 'OPERADOR') {
          header.unshift(nome)
          header.unshift(almope)
        }

        return header
      },
      loadHistoricoPerdasGanhos(produto, numCargo, almope, periodoSelecionado) {
        this.loading = true
        // let urlData = `${config.baseUrl}api/shared/gamification/detalhes/perdas_ganhos/${produto}/${numCargo}/${almope}/${periodoSelecionado}`;
        let urlData = `${config.baseUrl}api/shared/gamification/detalhes/perdas_ganhos/`
        this.$api
          .get(urlData, {
            params: { produto, numCargo, almope, periodoSelecionado }
          })
          .then(res => {
            this.baseHistorico = res?.data
            this.loading = false
          })
      }
    },
    watch: {
      periodoSelecionado() {
        if (this.almopeConsulta) {
          this.loadHistoricoPerdasGanhos(
            this.produtoConsulta,
            this.numCargo,
            this.almopeConsulta,
            this.periodoSelecionado
          )
        } else {
          this.loadHistoricoPerdasGanhos(
            this.produto,
            this.numCargo,
            this.usuarioAlmope,
            this.periodoSelecionado
          )
        }
      },
      almopeConsulta() {
        if (this.almopeConsulta) {
          this.loadHistoricoPerdasGanhos(
            this.produtoConsulta,
            this.numCargo,
            this.almopeConsulta,
            this.periodoSelecionado
          )
        }
      }
    },
    created() {
      if (this.openViewDetalhesTable == true) {
        if (this.almopeConsulta) {
          this.loadHistoricoPerdasGanhos(
            this.produtoConsulta,
            this.numCargo,
            this.almopeConsulta,
            this.periodoSelecionado
          )
        }
      } else {
        this.loadHistoricoPerdasGanhos(
          this.produto,
          this.numCargo,
          this.usuarioAlmope,
          this.periodoSelecionado
        )
      }
      // setTimeout(() => {
      //   if (this.almopeConsulta) {
      //     this.loadHistoricoPerdasGanhos(
      //       this.produtoConsulta,
      //       this.numCargo,
      //       this.almopeConsulta,
      //       this.periodoSelecionado
      //     );
      //   } else {
      //     this.loadHistoricoPerdasGanhos(
      //       this.produto,
      //       this.numCargo,
      //       this.usuarioAlmope,
      //       this.periodoSelecionado
      //     );
      //   }
      // }, 1500);
    }
  }
</script>

<style scoped>
  .card-metas {
    justify-content: center;
    padding: 10px;
    /* margin-left: 2px; */
    margin-bottom: 10px;
  }

  span {
    display: flex;
    justify-content: center;
  }

  tr {
    font-size: 14px;
  }

  td {
    text-align: center;
    border: 1px solid #f5f5f58d;
    padding: 5px 10px;
  }
</style>
