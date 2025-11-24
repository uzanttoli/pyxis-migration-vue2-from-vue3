<template>
  <div class="_container_ranking">
    <div class="btn">
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn class="btn" @click="$emit('update:close')" v-bind="attrs" v-on="on" icon>
            <i class="fa-solid fa-xmark" style="color: #fff"></i>
          </v-btn>
        </template>
        <span>Fechar</span>
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
  </div>
</template>

<script>
  import DemaisRanking from './demaisRanking.vue'
  import top3 from './top3.vue'
  import config from '../../../core/config'
  import CardConsolidado from './cardConsolidado.vue'
  import PainelTitle from './painelTitle.vue'
  export default {
    components: { top3, DemaisRanking, CardConsolidado, PainelTitle },
    data: () => ({
      abrirFullRanking: false,
      list: [],
      consolidadoRanking: [],
      dadosRanking: [],
      coordenadorSelecionado: null,
      tipoVenda: null,
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
      }
    },
    methods: {
      dadosSelecionadosRanking(e) {
        this.tipoVenda = e.tipoVendaSelecionado
        this.loadDadosRank(e.coordenadorSelecionado, e.tipoVendaSelecionado)
        this.loadListVendedores(e.tipoVendaSelecionado, e.coordenadorSelecionado)
      },
      loadDadosRank(coordenador, tipoVenda = '') {
        if (coordenador == 'CONSOLIDADO') {
          let urlData = `${config.baseUrl}api/shared/televendas/dados_ranking_cons/${tipoVenda}`
          this.$api.get(urlData).then(res => {
            this.dadosRanking = res.data
          })
        } else {
          let urlData = `${config.baseUrl}api/shared/televendas/dados_ranking_ope_coord/${coordenador}/${tipoVenda}`
          this.$api.get(urlData).then(res => {
            this.dadosRanking = res.data
          })
        }
      },
      setItemRankingLocalStorage() {
        let itemExist = JSON.parse(localStorage.getItem('vendedores-cache'))
        let horarioAtual = new Date()

        if (itemExist.length > 0) {
          let horarioAtt = new Date(itemExist[0]?.DATA_ATT)
          let diferencaMinutos = Math.abs((horarioAtual - horarioAtt) / (1000 * 60))

          if (diferencaMinutos >= 10) {
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
      async loadListVendedores(tipoVenda, coordenador) {
        let urlData = `${
          config.baseUrl
        }api/shared/televendas/top_vendedores/${15}/${tipoVenda}/${coordenador}`
        var res = await this.$api.get(urlData)
        this.list = res.data
        this.setItemRankingLocalStorage()
      }
    },
    created() {
      this.loadListVendedores('GERAL', 'CONSOLIDADO')
      this.loadDadosRank('CONSOLIDADO', 'GERAL')
      // this.loadListGerencialRanking();
      this.intervalo = setInterval(() => {
        this.loadDadosRank('CONSOLIDADO', this.tipoVenda ?? 'GERAL')
        // this.loadListVendedores();
      }, 60 * 1000)
    }
  }
</script>

<style scoped>
  ._container_ranking {
    background-color: rgb(20, 19, 50);
  }

  .container-dados {
    display: flex;
    justify-content: center;
    /* flex-wrap: wrap-reverse; */
    align-items: start;
    padding: 60px 0;
    min-height: 100vh;
    gap: 10px;
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
    top: 25px;
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
