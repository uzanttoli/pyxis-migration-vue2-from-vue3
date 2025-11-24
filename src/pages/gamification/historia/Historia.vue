<template>
  <Conteudo
    :dialogHistoria="dialogHistoria"
    @closeHistoria="dialogHistoria = !dialogHistoria"
    :visualizado="visualizado"
  />
</template>

<script>
  import Conteudo from './Conteudo.vue'
  import config from '../../../core/config'
  export default {
    components: { Conteudo },
    data: () => ({
      dialogHistoria: false,
      window: 0,
      visualizado: []
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      existiVisualizacao() {
        let urlData = `${config.baseUrl}api/shared/gamification/historia/visualizar/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.visualizado = res.data[0] ? res.data[0] : []
          this.dialogHistoria = res.data[0]?.LOGIN_VISUALIZACAO ? false : true
        })
      }
    },
    created() {
      this.existiVisualizacao()
    }
  }
</script>

<style></style>
