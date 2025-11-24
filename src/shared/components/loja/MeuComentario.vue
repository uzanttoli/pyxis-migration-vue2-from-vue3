<template>
  <v-row justify="center" class="space px-4 mt-7" v-if="comment">
    <v-col cols="12">
      <h3>O que você achou desse produto?</h3>
      <v-container fluid>
        <v-textarea
          outlined
          auto-grow
          rows="2"
          append-icon="mdi-send"
          @click:append="saveInserirComentario"
          @keyup.enter="saveInserirComentario"
          v-model="meuComentario"
        ></v-textarea>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
  import config from '../../../core/config'
  export default {
    data: () => ({
      meuComentario: '',
      comment: ''
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
      clearComentarios() {
        return (this.meuComentario = '')
      },
      userRecebeuProduto() {
        let urlData = `${config.baseUrl}api/shared/loja/validacao_comentario/${this.usuarioAlmope}/${this.$route.params.id}`
        this.$api.get(urlData).then(res => {
          this.comment = res.data.length > 0 && res.data[0].VALIDACAO_COMENTARIOS != 0
        })
      },
      async saveInserirComentario() {
        let data = {
          idProduto: this.$route.params.id,
          comentario: this.meuComentario,
          usuario: this.usuarioAlmope
        }
        await this.$store.dispatch('saveInserirComentario', data)
        this.clearComentarios()
        this.$store.dispatch('loadListarComentarios', this.$route.params.id)
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
