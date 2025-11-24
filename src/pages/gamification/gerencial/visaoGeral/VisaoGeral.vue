<template>
  <v-sheet color="pa-3">
    <v-row align="center" justify="end" class="pa-3">
      <div class="filtro">
        <v-select
          placeholder="Selecione um indicador"
          v-model="indicadorSelecionado"
          :items="indicadores"
        ></v-select>
      </div>
    </v-row>
    <v-data-table hide-default-footer>
      <template v-slot:header>
        <thead>
          <tr class="table-row">
            <th class="table-header">
              <h2 style="text-align: center">Agrupamentos</h2>
            </th>
            <th class="table-header" style="text-align: center">
              <img :src="imgTeam('GATO-COM-FUNDO')" class="table-header-img" />
              <h4>Players: {{ valorPlayer('GATO') }}</h4>
            </th>
            <th class="table-header" style="text-align: center">
              <img :src="imgTeam('LOBO-COM-FUNDO')" class="table-header-img" />
              <h4>Players: {{ valorPlayer('LOBO') }}</h4>
            </th>
            <th class="table-header" style="text-align: center">
              <img :src="imgTeam('TUBARÃO-COM-FUNDO')" class="table-header-img" />
              <h4>Players: {{ valorPlayer('TUBARÃO') }}</h4>
            </th>
            <th class="table-header" style="text-align: center">
              <img :src="imgTeam('AGUIA-COM-FUNDO')" class="table-header-img" />
              <h4>Players: {{ valorPlayer('AGUIA') }}</h4>
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:body>
        <tbody>
          <tr style="text-align: center" v-for="(resultado, i) in resultado" :key="i">
            <td>{{ resultado.AGRUPAMENTO }}</td>
            <td>
              {{ resultado.GATO ? convertPercent(resultado.GATO) : '-' }}
            </td>
            <td>{{ resultado.LOBO ? convertPercent(resultado.LOBO) : '-' }}</td>
            <td>
              <!-- <td :class="setMaiorValor(resultado.TUBARÃO)"> -->
              {{ resultado.TUBARÃO ? convertPercent(resultado.TUBARÃO) : '-' }}
            </td>
            <td>
              {{ resultado.AGUIA ? convertPercent(resultado.AGUIA) : '-' }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <v-overlay :value="carregando">
      <v-progress-circular indeterminate size="100" value="Carregando">
        Carregando...
      </v-progress-circular>
    </v-overlay>
  </v-sheet>
</template>

<script>
  import config from '../../../../core/config.js'
  export default {
    data: () => ({
      Headerdados: [],
      resultado: [],
      indicadorSelecionado: 'TMT',
      carregando: false,
      quandidadeDeJogadores: [],
      dadosTeste: [],
      indicadores: [
        'TMT',
        'JACKIN E LABORAL',
        'ABS',
        'CONVERSÃO VENDAS',
        'PERFORMANCE OS',
        'RECHAMADA 72H',
        'RECHAMADA DIA',
        'TNPS',
        'TRANSF. TOTAIS'
      ]
    }),
    filters: {},
    computed: {
      maiorValorTubarao() {
        let dadosTeste = this.resultado
        return this.getMaiorValor(dadosTeste.map(e => e.TUBARÃO))
      }
    },
    methods: {
      setMaiorValor(value) {
        if (value == this.maiorValorTubarao) {
          return 'red'
        }
      },
      getMaiorValor(arr) {
        return Math.max.apply(null, arr)
      },
      valorPlayer(value) {
        let dados = this.quandidadeDeJogadores
        let dadosTratados = dados.filter(e => e.GRUPO == value).map(e => e.QTD_PLAYER)
        return dadosTratados[0]
      },
      convertPercent(value) {
        if (
          this.indicadorSelecionado == 'CONVERSÃO VENDAS' ||
          this.indicadorSelecionado == 'RECHAMADA 72H' ||
          this.indicadorSelecionado == 'RECHAMADA DIA' ||
          this.indicadorSelecionado == 'ABS' ||
          this.indicadorSelecionado == 'TNPS' ||
          this.indicadorSelecionado == 'PERFORMANCE OS' ||
          this.indicadorSelecionado == 'TRANSF. TOTAIS'
        ) {
          return (value * 100).toFixed(2).concat('%')
        } else {
          return value
        }
      },

      imgTeam(imgName) {
        return require(`@/assets/img/team/${imgName}.png`)
      },
      loadQtdPlayer() {
        let urlData = `${config.baseUrl}api/shared/gamification/gerencial/quantidade_player`
        this.$api.get(urlData).then(res => {
          this.quandidadeDeJogadores = res.data
          this.carregando = false
        })
      },
      loadResultados() {
        this.carregando = true
        let urlData = `${config.baseUrl}api/shared/gamification/gerencial/resultados/${this.indicadorSelecionado}`
        this.$api.get(urlData).then(res => {
          this.resultado = res.data
          this.loadQtdPlayer()
        })
      }
    },
    watch: {
      indicadorSelecionado() {
        this.loadResultados()
      }
    },
    created() {
      this.loadResultados()
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Sarala&display=swap"); */

  /*  */

  .table-header {
    text-align: center;
  }

  .table-header-back {
    background: rgb(233, 125, 1);
    width: 180px;
    border-radius: 300px;
  }
  .table-header-img {
    box-shadow: 4px 0px 6px 5px rgba(230, 161, 105, 0.308);
    width: 150px;
    border-radius: 300px;
  }

  h2 {
    font-family: 'Sarala', sans-serif;
    font-size: 20px;
  }

  h4 {
    margin-bottom: 7px;
  }

  .filtro {
    width: 400px;
  }

  .alert-dados {
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: grey;
  }
</style>
