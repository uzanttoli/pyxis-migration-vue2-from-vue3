<template>
  <v-dialog v-model="avaliacao" width="360">
    <v-card class="elevation-16 mx-auto">
      <v-card-title class="text-h5">O que achou desse produto?</v-card-title>
      <v-card-text>
        Verificamos que você realizou a compra desse produto. O que você achou dele?
        <div class="text-center mt-12">
          <v-rating
            v-model="rating"
            color="yellow darken-3"
            background-color="grey darken-1"
            empty-icon="$ratingFull"
            half-increments
            hover
            large
          ></v-rating>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="justify-space-between">
        <v-btn text @click="saveAvaliarProduto(0)">Não Avaliar</v-btn>
        <v-btn color="primary" text @click="saveAvaliarProduto(1)">Avaliar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  import config from '../../../core/config'
  export default {
    data: () => ({
      avaliacao: '',
      rating: 0
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      rota() {
        return this.$route.params.id
      }
    },
    methods: {
      async saveAvaliarProduto(value) {
        let data = {
          classificacao: value == 0 ? -100 : this.rating,
          idProduto: this.rota,
          usuario: this.usuarioAlmope,
          permitirAvaliacao: 0
        }
        await this.$store.dispatch('saveAvaliarProduto', data)
        this.avaliacao = false
        this.rating = 0
      },
      userRecebeuProduto() {
        let urlData = `${config.baseUrl}api/shared/loja/validacao_classificacao/${this.usuarioAlmope}/${this.$route.params.id}`
        this.$api.get(urlData).then(res => {
          this.avaliacao =
            res.data.length > 0 &&
            res.data[0].VALIDACAO_CLASSIFICACAO == 1 &&
            res.data[0].PERMITIR_AVALIACAO == 1
        })
      }
    },
    watch: {
      rota() {
        this.userRecebeuProduto()
      }
    },
    created() {
      this.userRecebeuProduto()
    }
  }
</script>

<style></style>
