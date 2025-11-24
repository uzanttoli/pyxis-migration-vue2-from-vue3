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
          @click="pegarBilhete(bilhete.BILHETES)"
          :class="bilhete.BILHETES == bilheteSelecionado ? 'blue-grey lighten-4' : ''"
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
    props: {
      loadDados: {
        type: Boolean
      }
    },
    data: () => ({
      bilhetes: [],
      bilheteSelecionado: null
    }),
    computed: {
      queryId() {
        return this.$route.query.id ? this.$route.query.id : 0
      }
    },
    methods: {
      pegarBilhete(item) {
        this.bilheteSelecionado = item
        this.$emit('update:bilhete', item)
      },
      bannerAtual(img) {
        if (img) {
          return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_loteria/${img}`
        }
      },
      loadBilhetes() {
        let urlData = `${config.baseUrl}api/shared/loteria/configuracao/bilhetes_ativos/`
        this.$api.get(urlData).then(res => {
          this.bilhetes = res.data
            .filter(item => {
              return item.VISIVEL != 0
            })
            .map(bilhete => {
              return { ...bilhete }
            })
        })
      }
    },
    created() {
      this.loadBilhetes()
    },
    watch: {
      loadDados() {
        if (this.loadDados == true) {
          this.loadBilhetes()
          this.$emit('update:loadDados', false)
        }
      }
    }
  }
</script>

<style scoped></style>
