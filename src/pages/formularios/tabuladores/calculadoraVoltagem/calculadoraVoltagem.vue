<template>
  <v-card>
    <selecao-equipamento @update:detalhesConsumo="detalhesFormConsumo"></selecao-equipamento>
    <div class="pa-2" style="display: flex; justify-content: center">
      <v-btn depressed disabled>Adicionar aparelho inexistente</v-btn>
    </div>
    <v-divider class="py-2"></v-divider>
    <div class="table">
      <table>
        <thead>
          <tr>
            <th>Quantidade</th>
            <th>Descrição</th>
            <th>Uso Diário</th>
            <th>Potência</th>
            <th>KWh/mês</th>
            <th>KWh/ano</th>
            <th>Tipo Potência</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-show="dadosDetalhesFormConsumo != ''"
            v-for="(item, i) in dadosDetalhesFormConsumo"
            :key="i"
          >
            <td>{{ item.quantidadeEquipamento }}</td>
            <td>{{ item.equipamento }}</td>
            <td>{{ item.tempoUso }}</td>
            <td>{{ item.potencia }}</td>
            <td>{{ item.kwhMes }}</td>
            <td>{{ item.kwhAno }}</td>
            <td>{{ item.tipoPotencia }}</td>
            <td>
              <!-- <v-btn icon small @click="editItem(item)" disabled>
                <v-icon color="blue" small>mdi-pencil</v-icon>
              </v-btn> -->
              <v-tooltip bottom>
                <template v-slot:activator="{ attrs, on }">
                  <v-btn icon small @click="removeItem(item)" v-bind="attrs" v-on="on">
                    <v-icon small color="error">mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Excluir</span>
              </v-tooltip>
            </td>
          </tr>
          <tr v-show="dadosDetalhesFormConsumo == ''" style="text-align: center">
            <td colspan="7" style="color: #757575; padding: 5px">Nada cadastrado ainda.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <v-divider></v-divider>
    <div class="total-estimado">
      <h2 style="color: #333">Total Estimado</h2>
      <div class="detalhes">
        <div>
          <p>Consumo (KWh)</p>
          <h2>{{ calcularkW }}</h2>
        </div>
        <div>
          <p>Potência Total (W)</p>
          <h2>{{ calcularPotenciaTotalW }}</h2>
        </div>
        <div>
          <p>Total KWh/mês</p>
          <h2>{{ calcularkWM }}</h2>
        </div>
        <div>
          <p>Total KWh/ano</p>
          <h2>{{ calcularkWA }}</h2>
        </div>
      </div>
    </div>
    <dialog-adicionar-detalhes-consumo
      :adicionarDetalhesConsumo="adicionarDetalhesConsumo"
      @update:close="adicionarDetalhesConsumo = !adicionarDetalhesConsumo"
      :dadosEdit="dadosEdit"
    ></dialog-adicionar-detalhes-consumo>
  </v-card>
</template>

<script>
  import selecaoEquipamento from './selecaoEquipamento.vue'
  import dialogAdicionarDetalhesConsumo from './dialogAdicionarDetalhesConsumo.vue'
  export default {
    components: { selecaoEquipamento, dialogAdicionarDetalhesConsumo },
    data: () => ({
      form: {
        qtdEquipamentos: null,
        consumoEnergia: null,
        horasUsoPorDIa: null
      },
      adicionarDetalhesConsumo: false,
      dadosDetalhesFormConsumo: [],
      dadosEdit: []
    }),
    computed: {
      calcularPotenciaTotalW() {
        let dados = this.dadosDetalhesFormConsumo
        let valores = []
        for (let i = 0; i < dados.length; i++) {
          let potenciaTotal = dados[i].potencia * dados[i].quantidadeEquipamento
          valores.push(potenciaTotal)
        }
        let calculo = valores.reduce((valorAtual, proximoValor) => {
          return valorAtual + proximoValor
        }, 0)

        return calculo
      },
      calcularkW() {
        let dados = this.dadosDetalhesFormConsumo
        let valores = []
        for (let i = 0; i < dados.length; i++) {
          let potenciaTotal = (dados[i].potencia * dados[i].quantidadeEquipamento) / 1000
          valores.push(potenciaTotal)
        }
        let calculo = valores.reduce((valorAtual, proximoValor) => {
          return valorAtual + proximoValor
        }, 0)

        return calculo.toFixed(2)
      },
      calcularkWM() {
        let dados = this.dadosDetalhesFormConsumo
        let valores = []
        for (let i = 0; i < dados.length; i++) {
          let KWH = dados[i].kwhMes

          valores.push(KWH)
        }
        let calculo = valores.reduce((valorAtual, proximoValor) => {
          return valorAtual + proximoValor
        }, 0)

        return calculo.toFixed(2)
      },
      calcularkWA() {
        let dados = this.dadosDetalhesFormConsumo
        let valores = []
        for (let i = 0; i < dados.length; i++) {
          let KWH = dados[i].kwhAno

          valores.push(KWH)
        }
        let calculo = valores.reduce((valorAtual, proximoValor) => {
          return valorAtual + proximoValor
        }, 0)

        return calculo.toFixed(2)
      }
    },
    methods: {
      timeToDecimal(t) {
        const [hour, min] = t.split(':')
        const dec = parseInt((min / 6) * 10, 10)
        return parseFloat(parseInt(hour, 10) + '.' + (dec < 10 ? '0' : '') + dec)
      },
      editItem(item) {
        this.adicionarDetalhesConsumo = true
        this.dadosEdit = item
      },
      removeItem(item) {
        let dados = this.dadosDetalhesFormConsumo
        let chave = item.equipamento + item.potencia + item.quantidadeEquipamento + item.tempoUso

        let removeDados = dados.filter(dado => {
          let chaveDetalhes =
            dado.equipamento + dado.potencia + dado.quantidadeEquipamento + dado.tempoUso
          return chave != chaveDetalhes
        })

        this.dadosDetalhesFormConsumo = removeDados
      },
      detalhesFormConsumo(event) {
        this.dadosDetalhesFormConsumo.push(event)
      }
    }
  }
</script>

<style scoped>
  .calculadora {
    margin: 0 10px 0 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  .total-estimado {
    margin: 10px 10px 0 10px;
  }

  .detalhes {
    display: flex;
    justify-content: space-between;
  }

  .detalhes div {
    justify-content: start;
    width: 200px;
    color: #757575;
  }

  p {
    margin: 0;
  }

  h2 {
    color: #3430f0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background-color: #ebebeb;
    border-radius: 1px solid #bdbdbd;
  }

  tr {
    overflow-y: auto;
  }

  th {
    padding: 6px;
  }

  td {
    text-align: center;
  }
</style>
