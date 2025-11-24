<template>
  <div>
    <div v-for="(item, i) in dadosPesquisaAtiva" :key="i">
      <PesquisaComponent
        :idForm="item.id"
        :title="item.titulo"
        :instrucoes="item.instrucoes"
        :objetivo="item.objetivo"
      />
    </div>
  </div>
</template>

<script>
  import PesquisaComponent from '../pesquisa/pesquisa.component.vue'
  import config from '../../core/config'
  export default {
    components: { PesquisaComponent },
    data: () => ({
      dadosPesquisaAtiva: []
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      loadDadosPesquisaAtivas() {
        let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/dados_pesquisa`
        this.$api
          .get(urlData, {
            params: {
              regional: this.usuario.regional.toLowerCase(),
              perfil: this.usuario.filtro.toLowerCase(),
              almope: this.usuario.almope
            }
          })
          .then(res => {
            this.dadosPesquisaAtiva = res.data
          })
      }
    },
    created() {
      this.loadDadosPesquisaAtivas()
    }
  }
</script>

<style></style>
