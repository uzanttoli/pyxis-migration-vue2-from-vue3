<template>
  <section class="farol-online">
    <v-sheet elevation="5" class="rounded-tl-xl rounded-br-xl mb-6 mt-7">
      <v-card class="rounded-tl-xl rounded-br-xl pa-1">
        <v-card-title>
          Farol
          <v-tooltip right color="black">
            <template v-slot:activator="{ attrs, on }">
              <v-icon v-bind="attrs" v-on="on">mdi-information</v-icon>
            </template>
            <span v-for="(item, i) in glossario" :key="i">
              <p>
                {{ item.nome }}: {{ item.conceito }}.
                {{ item.calculo }}
              </p>
            </span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <span id="select-tipo">
            <v-select
              outlined
              label="Tipo"
              :items="tipo"
              item-text="descricao"
              dense
              v-model="tipoSelecionado"
              placeholder="Selecione um tipo"
              no-data-text="Não há dados disponiveis!"
            ></v-select>
          </span>
          <span id="select-produto">
            <v-select
              outlined
              dense
              :items="produto"
              v-model="produtoSelecionado"
              item-text="descricao"
              @change="loadRegionalFarol()"
              label="Produto"
              item-value="value"
              placeholder="Selecione um produto!"
            ></v-select>
          </span>
          <span id="select-regional">
            <v-select
              outlined
              label="Regional"
              :items="regionalFarol"
              item-text="regional"
              dense
              v-model="regionalSelecionado"
              placeholder="Selecione uma regional"
              no-data-text="Não há dados disponiveis!"
            ></v-select>
          </span>
        </v-card-title>
        <v-row>
          <v-col cols="8">
            <desempenho-geral
              :produto="produtoSelecionado"
              :regional="regionalSelecionado"
              :tipo="tipoSelecionado"
            ></desempenho-geral>
          </v-col>
          <v-col cols="4" style="margin-left: -14px">
            <desempenho-tmt
              :produto="produtoSelecionado"
              :regional="regionalSelecionado"
              :tipo="tipoSelecionado"
            ></desempenho-tmt>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="9">
            <desempenho-agentes
              :produto="produtoSelecionado"
              :regional="regionalSelecionado"
              :tipo="tipoSelecionado"
            ></desempenho-agentes>
          </v-col>
          <v-col cols="3" style="margin-left: -14px">
            <agentes-produtivos
              :produto="produtoSelecionado"
              :regional="regionalSelecionado"
              :tipo="tipoSelecionado"
            ></agentes-produtivos>
          </v-col>
        </v-row>
        <v-divider class="mt-5"></v-divider>
        <v-row>
          <v-col cols="4">
            <grafico-forecast
              :produto="produtoSelecionado"
              :regional="regionalSelecionado"
              :tipo="tipoSelecionado"
            ></grafico-forecast>
          </v-col>
          <v-col cols="4">
            <grafico-tmt
              :produto="produtoSelecionado"
              :regional="regionalSelecionado"
              :tipo="tipoSelecionado"
            ></grafico-tmt>
          </v-col>
          <v-col cols="4">
            <grafico-agents
              :produto="produtoSelecionado"
              :regional="regionalSelecionado"
              :tipo="tipoSelecionado"
            ></grafico-agents>
          </v-col>
        </v-row>
      </v-card>
    </v-sheet>
  </section>
</template>

<script>
  //Load
  import desempenhoGeral from './table/desempenhoGeral.component.vue'
  import desempenhoTmt from './table/desempenhoTMT.component.vue'
  import desempenhoAgentes from './table/desempenhoAgentes.component.vue'
  import agentesProdutivos from './table/agentesProdutivosNET.component.vue'

  // Graficos
  import graficoForecast from './charts/farolOferecidasAtendidas.component.vue'
  import graficoTmt from './charts/tmt.component.vue'
  import graficoAgents from './charts/agents.component.vue'

  export default {
    components: {
      //load
      desempenhoGeral,
      desempenhoTmt,
      desempenhoAgentes,
      agentesProdutivos,
      // Graficos
      graficoForecast,
      graficoTmt,
      graficoAgents
    },
    data: () => ({
      regionalSelecionado: 'NET COMBO - N1 TOTAL',
      produtoSelecionado: 'NET COMBO',
      tipoSelecionado: 'COM TRANSBORDO',
      tipo: [
        { descricao: 'COM TRANSBORDO', value: 'COM TRANSBORDO' },
        { descricao: 'SEM TRANSBORDO', value: 'SEM TRANSBORDO' }
      ],
      produto: [
        { descricao: 'NET CM', value: 'NET COMBO' },
        { descricao: 'NET MTF', value: 'NET E2E' }
      ],
      glossario: [
        {
          nome: 'IMPORTANTE',
          conceito: 'Relatorio atualizado a cada 5 minutos'
        },
        {
          mdi: 'mdi-chart-histogram',
          nome: 'Forecast',
          conceito: 'Total de chamadas planejadas',
          calculo: ' Calculo: soma(forecast)'
        },
        {
          mdi: 'mdi-hand-coin',
          nome: 'Oferecidas',
          conceito: 'Total de chamadas oferecidas para empresa.',
          calculo: 'soma(Atendidas + Abandonadas)'
        },
        {
          mdi: 'mdi-phone-check',
          nome: 'Atendidas',
          conceito: 'Total de chamadas atendidas',
          calculo: ' Calculo: soma(Atendidas)'
        },
        {
          mdi: 'mdi-phone-cancel',
          nome: 'Abandono',
          conceito: 'Chamadas Abandonadas',
          calculo: '  Calculo: soma(Abandonadas)'
        },
        {
          mdi: 'mdi-rewind-10',
          nome: '% Ns 10s',
          conceito: 'Nível de chamadas atendidas até 10 segundos',
          calculo: '  Calculo: soma(Atendidas 10s) / soma(Oferecidas + Abandonadas 10s)'
        },

        {
          mdi: 'mdi-strategy',
          nome: 'Desvio Forecast',
          conceito: 'Percentual de desvio das chamadas Oferecidas frente ao Forecast',
          calculo: '  Calculo: soma(Atendidas + Abandonadas) / soma(Forecast) -1'
        },

        {
          mdi: 'mdi-percent',
          nome: 'Pca',
          conceito: 'Percentual de chamadas Atendidas',
          calculo: '  Calculo: soma(Atendidas) / soma(Atendidas + Abandonadas)'
        },

        {
          mdi: 'mdi-percent',
          nome: 'Pca Forecast',
          conceito: 'Percentual de chamadas Atendidas Planejadas',
          calculo: ' Calculo: soma(Atendidas) / soma(Forecast)'
        },

        {
          mdi: 'mdi-human-capacity-increase',
          nome: 'Tx Ocupação',
          conceito: 'Percentual que a campanha permaneceu ocupada no dia',
          calculo:
            ' Calculo: Soma(Falado + Pos_atendimento + Tempo_hold)/Sum(Falado + Pos_atendimento + Tempo_hold + Livre)'
        },

        {
          mdi: 'mdi-coffee',
          nome: '% Pausas',
          conceito: 'Percentual de pausas realizadas',
          calculo: ' Calculo: soma(Pausas) / soma(TempoLogado)'
        }
      ]
    }),
    computed: {
      regionalFarol() {
        let r = this.$store.getters.regionalFarol
        return r ? r : []
      }
    },
    methods: {
      loadRegionalFarol() {
        this.$store.dispatch('loadRegionalFarol', this.produtoSelecionado)
      }
    },
    created() {
      this.loadRegionalFarol()
    }
  }
</script>

<style scoped>
  #select-tipo {
    position: absolute;
    width: 15rem;
    right: 567px;
    top: 15px;
  }
  #select-regional {
    position: absolute;
    width: 20.1rem;
    right: 10px;
    top: 15px;
  }
  #select-produto {
    position: absolute;
    width: 200px;
    right: 350px;
    top: 15px;
  }
</style>
