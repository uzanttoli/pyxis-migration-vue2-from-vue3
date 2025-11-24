<template>
  <v-container fluid style="min-height: 100vh; margin-top: 20px">
    <menu-fila-tratativa-component
      @update:dados-carregados="carregamentoDados"
    ></menu-fila-tratativa-component>
    <load-envio-dados :envioDados="baixandoInfor"></load-envio-dados>
    <right-side-bar :base="base" @updated:reload-base="reload"></right-side-bar>
  </v-container>
</template>

<script>
  import config from '../../core/config'
  import RightSideBar from './RightSideBarTratativa.vue'
  import loadEnvioDados from '../../shared/components/load/loadHastag.vue'
  import MenuFilaTratativaComponent from './operador/MenuFilaTratativa.component.vue'

  export default {
    components: {
      MenuFilaTratativaComponent,
      loadEnvioDados,
      RightSideBar
    },
    data: () => ({
      baixandoInfor: true,
      base: [],
      filaConfig: []
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      nome() {
        let nome = this.$store.getters.usuario.nome
        nome = nome.split(' ')
        nome = nome[0].toLowerCase()
        return nome[0].toUpperCase() + nome.slice(1)
      }
    },
    methods: {
      reload() {
        this.loadIndicadoresConsolidado()
      },
      carregamentoDados(event) {
        this.baixandoInfor = event
      },
      loadIndicadoresConsolidado() {
        let urlData = `${config.baseUrl}api/shared/backoffice/tratativa/meus_indicadores`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuario.almope,
              produto: `${this.usuario.produto} BKO`
            }
          })
          .then(result => {
            let diffAlmope = result.data

            let i = diffAlmope.filter(item => {
              return item.COLUNA != 'ALMOPE'
            })
            this.base = i
          })
      }
    },
    created() {
      this.loadIndicadoresConsolidado()
    }
  }
</script>

<style scoped>
  .img_model {
    width: 80vw;
    position: absolute;
    bottom: 10px;
  }

  @media screen and (max-width: 1594px) {
    .img_model {
      width: 70vw;
      position: absolute;
      bottom: 10px;
    }
  }
  @media screen and (max-width: 1024px) {
    .img_model {
      width: 55vw;
      position: absolute;
      bottom: 10px;
    }
  }

  @media screen and (max-width: 768px) {
    .img_model {
      width: 40vw;
      position: absolute;
      bottom: 10px;
    }
  }
</style>
