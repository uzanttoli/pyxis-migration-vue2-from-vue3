<template>
  <div style="margin-right: 10px">
    <h2>🔰 Informações Importante</h2>
    <v-divider></v-divider>
    <div class="mt-2">
      <ul v-for="(item, i) in listComunicado" :key="i">
        <li>{{ item.TEXTO_INFO }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import config from '../../core/config'
  export default {
    data: () => ({
      listComunicado: []
    }),
    computed: {
      regional() {
        return this.$store.getters.usuario.regional
      },
      filtro() {
        return this.$store.getters.usuario.filtro
      },
      queryId() {
        return this.$route.query.id ? this.$route.query.id : 0
      }
    },
    methods: {
      loadListComunicado() {
        let urlData = `${config.baseUrl}api/shared/loteria/comunicado/informacoes/${this.queryId}`
        this.$api.get(urlData).then(res => {
          this.listComunicado = res.data
        })
      }
    },
    created() {
      this.loadListComunicado()
    },
    watch: {
      queryId: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadListComunicado()
        }
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=ABeeZee&display=swap"); */
  li {
    font-size: 17px;
    font-family: 'ABeeZee', sans-serif;
    margin-top: 10px;
  }
</style>
