<template>
  <div class="_container_ranking">
    <div class="btn" v-if="filtro != 'OPERADOR'">
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn icon v-bind="attrs" v-on="on" @click="abrirFullRanking = true">
            <i class="fa-solid fa-up-right-from-square"></i>
          </v-btn>
        </template>
        <span>Abrir Em Tela Cheia</span>
      </v-tooltip>
    </div>
    <div class="container-dados">
      <div
        v-if="dadosRanking != ''"
        style="display: grid; grid-template-columns: 185px 185px; margin-left: 150px"
      >
        <card-consolidado
          v-for="(dados, index) in dadosRanking"
          :key="index"
          :title="dados.COLUNA"
          :result="dados.VALOR"
        ></card-consolidado>
      </div>
      <div class="rankeamento">
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: 97vh;
            gap: 10px;
          "
        >
          <painel-title @update:dados-ranking="dadosSelecionadosRanking"></painel-title>
          <top-3 :list="listTop3"></top-3>
        </div>
        <demais-ranking :demaisRanking="demaisRank"></demais-ranking>
      </div>
    </div>
    <full-dialog
      :abrirFullRanking="abrirFullRanking"
      @update:close="abrirFullRanking = !abrirFullRanking"
    ></full-dialog>
  </div>
</template>

<script>
  import DemaisRanking from './demaisRanking.vue'
  import top3 from './top3.vue'
  import fullDialog from './fullDialog.vue'
  import config from '../../../core/config'
  import CardConsolidado from './cardConsolidado.vue'
  import PainelTitle from './painelTitle.vue'
  export default {
    components: { top3, DemaisRanking, fullDialog, CardConsolidado, PainelTitle },
    data: () => ({
      abrirFullRanking: false,
      list: [],
      consolidadoRanking: [],
      dadosRanking: [],
      coordenadorSelecionado: null,
      tipoVenda: null,
      agrupamento: null,
      intervalo: 0
    }),
    computed: {
      listTop3() {
        let list = []
        for (let i = 0; i < 3; i++) {
          list.push(this.list[i])
        }
        return list
      },
      demaisRank() {
        let list = []
        for (let i = 0; i < 15; i++) {
          if (i >= 3) {
            list.push(this.list[i])
          }
        }

        list = list.filter(item => {
          return item?.VENDAS > 0
        })
        return list
      },
      filtro() {
        return this.$store.getters.usuario.filtro
      }
    },
    methods: {
      dadosSelecionadosRanking(e) {
        this.tipoVenda = e.tipoVendaSelecionado
        this.coordenadorSelecionado = e.coordenadorSelecionado
        this.agrupamento = e.agrupamento

        this.loadDadosRank(e.coordenadorSelecionado, e.tipoVendaSelecionado, e.agrupamento)
        this.loadListVendedores(e.tipoVendaSelecionado, e.coordenadorSelecionado, e.agrupamento)
      },
      loadDadosRank(coordenador, tipoVenda, agrupamento) {
        if (coordenador == 'CONSOLIDADO') {
          let urlData = `${config.baseUrl}api/shared/televendas/dados_ranking_cons`
          this.$api
            .get(urlData, {
              params: {
                tipoVenda: tipoVenda,
                agrupamento: agrupamento
              }
            })
            .then(res => {
              this.dadosRanking = res.data
            })
        } else {
          let urlData = `${config.baseUrl}api/shared/televendas/dados_ranking_ope_coord`
          this.$api
            .get(urlData, {
              params: {
                coordenador: coordenador,
                tipoVenda: tipoVenda,
                agrupamento: agrupamento
              }
            })
            .then(res => {
              this.dadosRanking = res.data
            })
        }
      },
      setItemRankingLocalStorage() {
        let itemExist = JSON.parse(localStorage.getItem('vendedores-cache'))
        let horarioAtual = new Date()

        if (itemExist?.length > 0) {
          let horarioAtt = new Date(itemExist[0]?.DATA_ATT)
          let diferencaMinutos = Math.abs((horarioAtual - horarioAtt) / (1000 * 60 * 15))

          if (diferencaMinutos >= 15) {
            localStorage.setItem('vendedores-cache', JSON.stringify(this.demaisRank))
          }
        } else {
          localStorage.setItem('vendedores-cache', JSON.stringify(this.demaisRank))
        }
      },
      // loadListGerencialRanking() {
      //   let urlData = `${config.baseUrl}api/shared/televendas/gerencial_ranking/`;
      //   this.$api.get(urlData).then((res) => {
      //     this.consolidadoRanking = res.data;
      //   });
      // },
      async loadListVendedores(tipoVenda, coordenador, agrupamento) {
        let urlData = `${config.baseUrl}api/shared/televendas/top_vendedores`
        var res = await this.$api.get(urlData, {
          params: {
            range: 15,
            tipoVenda: tipoVenda,
            coordenador: coordenador,
            agrupamento: agrupamento
          }
        })
        this.list = res.data
        this.setItemRankingLocalStorage()
      }
    },
    created() {
      this.loadDadosRank('CONSOLIDADO', 'GERAL', 'NET - N1 TOTAL + SUL 2 + SP 3')
      this.loadListVendedores('GERAL', 'CONSOLIDADO', 'NET - N1 TOTAL + SUL 2 + SP 3')
      // this.loadListGerencialRanking();
      this.intervalo = setInterval(() => {
        this.loadDadosRank(
          this.coordenadorSelecionado ?? 'CONSOLIDADO',
          this.tipoVenda ?? 'GERAL',
          this.agrupamento ?? 'NET - N1 TOTAL + SUL 2 + SP 3'
        )
        this.loadListVendedores(
          this.tipoVenda ?? 'GERAL',
          this.coordenadorSelecionado ?? 'CONSOLIDADO',
          this.agrupamento ?? 'NET - N1 TOTAL + SUL 2 + SP 3'
        )
      }, 60 * 1000)
    }
  }
</script>

<style scoped>
  ._container_ranking {
    padding: 10px 0;
    background-color: rgb(20, 19, 50);
    margin: 10px;
    margin-top: 50px;
    border-radius: 25px;
  }

  .container-dados {
    display: flex;
    justify-content: center;
    /* flex-wrap: wrap-reverse; */
    align-items: start;
    min-height: 100vh;
    padding: 10px 0;
    margin: 10px;
    gap: 10px;
    margin-top: 50px;
    border-radius: 25px;
    position: relative;
  }

  .rankeamento {
    width: 100%;
    display: flex;
    /* flex-direction: column; */
    flex-wrap: wrap;
    gap: 10px;
    justify-content: space-evenly;
    align-items: center;
  }

  .container {
    max-width: 100vw;
    padding: 0px;
  }

  .ranking-title {
    width: 100%;
    padding: 30px;
    position: relative;
  }

  .btn {
    position: absolute;
    right: 50px;
    top: 90px;
    z-index: 1;
  }
  .btn i {
    color: #fff;
  }

  .dados-consolidados {
    width: 100%;
    padding: 25px;
    /* margin-top: 30px; */
  }
</style>
