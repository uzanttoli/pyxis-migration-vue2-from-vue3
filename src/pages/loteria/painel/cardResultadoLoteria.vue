<template>
  <v-container>
    <div v-for="(resultado, i) in resultados" :key="i">
      <div class="title">
        <h3 style="color: white; margin-left: 10px">CONCURSO - {{ resultado.NUMERO }}</h3>
      </div>
      <div class="resultado">
        <div>
          <h2>🏆 PRÊMIO: {{ resultado.PREMIO }}</h2>
        </div>
        <div class="container-card">
          <div v-for="(item, i) in resultado.ITEMS" :key="i">
            <ticket
              :ganhador="item.ALMOPE_RESG"
              :nome="item.NOME_RESG"
              :coordenador="item.SUPERIOR2"
              :supervisor="item.SUPERIOR1"
              :numeroSorteado="item.NUMERO_RESG"
              :site="item.SITE"
            ></ticket>
          </div>
        </div>
      </div>
    </div>
    <loadhastag :activeMsg="true" :envioDados="loading" msg="Carregando resultado..."></loadhastag>
  </v-container>
</template>

<script>
  import config from '../../../core/config'
  import Loadhastag from '../../../shared/components/load/loadHastag.vue'
  import ticket from './ticket.vue'

  export default {
    props: {
      regionalSelecionada: {
        type: String,
        require: true
      },
      concursoSelecionado: {
        type: Number,
        require: true
      }
    },
    components: { ticket, Loadhastag },
    data: () => ({
      resultados: [],
      loading: false
    }),
    methods: {
      loadResultados() {
        if (this.regionalSelecionada && this.concursoSelecionado) {
          this.loading = true
          let urlData = `${config.baseUrl}api/shared/loteria/resultado/resultado_concursos/${this.regionalSelecionada}/${this.concursoSelecionado}`
          this.$api.get(urlData).then(res => {
            this.resultados = res.data
            this.loading = false
          })
        } else if (this.regionalSelecionada) {
          this.loading = true
          let urlData = `${config.baseUrl}api/shared/loteria/resultado/resultado_concursos_regional/${this.regionalSelecionada}`
          this.$api.get(urlData).then(res => {
            this.resultados = res.data
            this.loading = false
          })
        } else if (this.concursoSelecionado) {
          this.loading = true
          let urlData = `${config.baseUrl}api/shared/loteria/resultado/resultado_concursos_bilhete/${this.concursoSelecionado}`
          this.$api.get(urlData).then(res => {
            this.resultados = res.data
            this.loading = false
          })
        }
      }
    },
    created() {
      // this.loadResultados();
    },
    watch: {
      regionalSelecionada: function (oldVal, newVal) {
        if (oldVal != newVal) {
          this.loadResultados()
        }
      },
      concursoSelecionado: function (oldVal, newVal) {
        if (oldVal != newVal) {
          this.loadResultados()
        }
      }
    }
  }
</script>

<style scoped>
  .resultado {
    padding: 15px;
  }

  .title {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), #8f0e8f);
    padding: 10px;
    border-radius: 13px;
  }

  .container-card {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .card {
    background-color: #bb3c68;
    width: 320px;
    padding: 10px;
    margin: 10px;
    border-radius: 10px;
    box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.1);
    color: white;
  }

  p {
    padding: 0;
    margin: 0;
    width: 99%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20pt;
  }

  .container-card p:nth-child(1) {
    color: red;
  }
</style>
