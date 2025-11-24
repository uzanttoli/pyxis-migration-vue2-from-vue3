<template>
  <v-row class="space mt-7" justify="center" v-if="comentarios.length > 0">
    <v-col>
      <v-container fluid>
        <h3>Comentários:</h3>
        <v-list v-for="(comentario, i) in comentarios" :key="i">
          <v-list-item two-line>
            <v-list-item-avatar v-if="comentario.NOME_AVATAR">
              <v-img :src="imagemPerfil(comentario.NOME_AVATAR)"></v-img>
            </v-list-item-avatar>
            <v-list-item-avatar v-else>
              <v-img src="../../../assets/img/Avatar/padrao.png"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title class="text-h7 font-weight-bold">
                {{ comentario.nome }} -
                <v-chip small color="green" class="white--text">
                  Comentou {{ formatarData(comentario.DATA_CLASS_COMEN) }}
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle class="mt-n1">{{ comentario.cargo }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <div class="pb-8 mb-3 ml-4 pl-4">
            {{ comentario.COMENTARIO }}
          </div>
          <RespostasComentarios :idComentario="comentario.ID_CLASS_COMENT" :respondeu="respondeu" />
          <ResponderComentarios
            :id="comentario.ID_CLASS_COMENT"
            @updated:respondeu="atualizarResposta"
          />
          <v-divider inset></v-divider>
        </v-list>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
  import ResponderComentarios from './ResponderComentarios.vue'
  import RespostasComentarios from './RespostasComentarios.vue'
  export default {
    props: {
      comentarios: {
        type: Array
      }
    },
    components: { ResponderComentarios, RespostasComentarios },
    data: () => ({
      responder: false,
      respondeu: false
    }),
    computed: {
      rota() {
        return this.$route.params.id
      }
    },
    methods: {
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      atualizarResposta(e) {
        this.respondeu = e
      },
      formatarData(value) {
        this.moment.locale('pt-br')
        return this.moment(value).fromNow()
      },
      getUrlImg(value) {
        var img = require.context('../../../assets/img/Avatar/', false, /\.png$/)
        return img('./' + value + '.png')
      }
    },
    created() {}
  }
</script>

<style></style>
>
