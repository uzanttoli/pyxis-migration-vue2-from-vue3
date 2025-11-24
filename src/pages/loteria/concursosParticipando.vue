<template>
  <v-col v-if="bilhetes != ''">
    <bloco-component title="Bilhetes em Andamento">
      <div
        style="
          display: flex;
          flex-wrap: wrap;
          justify-content: start;
          max-height: 190px;
          overflow-y: auto;
        "
      >
        <v-card
          class="my-1 mx-2 rounded-xl"
          max-width="200"
          v-for="(bilhete, i) in bilhetes"
          :key="i"
          :to="{ name: 'Bilhetes', query: { id: bilhete.BILHETES } }"
          :class="bilhete.BILHETES == queryId ? 'blue-grey lighten-4' : ''"
        >
          <v-img height="60" :src="bannerAtual(bilhete.IMAGEM_BANNER)"></v-img>
          <v-card-title>Bilhete: {{ bilhete.BILHETES }}</v-card-title>
        </v-card>
      </div>
    </bloco-component>
  </v-col>
</template>

<script>
  import config from '../../core/config'
  import blocoComponent from '../../shared/components/bloco/bloco.component.vue'
  export default {
    components: { blocoComponent },
    data: () => ({
      bilhetes: []
    }),
    computed: {
      queryId() {
        return this.$route.query.id ? this.$route.query.id : 0
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      bannerAtual(img) {
        if (img) {
          return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_loteria/${img}`
        }
      },
      gerarCorAleatoria() {
        let r = Math.floor(Math.random() * 256)
        let g = Math.floor(Math.random() * 256)
        let b = Math.floor(Math.random() * 256)

        return `rgb(${r}, ${g}, ${b})`
      },
      loadBilhetes() {
        let urlData = `${config.baseUrl}api/shared/loteria/concurso/participando_bilhetes/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.bilhetes = res.data.map(bilhete => {
            let corAleatoria = this.gerarCorAleatoria()

            return { ...bilhete, COR: corAleatoria }
          })
        })
      }
    },
    created() {
      this.loadBilhetes()
    }
  }
</script>

<style scoped></style>
