<template>
  <v-card color="" class="pa-3 mt-16 rounded-t-xl mb-n5" v-if="comentarios.length > 0">
    <section>
      <v-row align="center" justify="center" class="py-2 grey--text">
        <h3>Avaliações</h3>
      </v-row>
      <v-row class="mt-7 mb-5" align="center" justify="center">
        <v-col cols="12" xs="12" sm="6" md="2" v-for="(comentario, i) in comentarios" :key="i">
          <v-card
            class="elevation-2 mx-auto"
            width="400"
            :to="{
              name: 'Produto',
              params: { id: comentario.ID_PRODUTO },
              hash: `#${comentario.NOME_PRODUTO}`
            }"
          >
            <v-list subheader two-line>
              <v-list-item>
                <v-list-item-avatar v-if="comentario.NOME_AVATAR">
                  <v-img :src="imagemPerfil(comentario.NOME_AVATAR)"></v-img>
                </v-list-item-avatar>
                <v-list-item-avatar v-else>
                  <v-img src="../../../assets/img/Avatar/padrao.png"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">
                    {{ priName(comentario.NOME) }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Comprou: {{ comentario.NOME_PRODUTO }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-card-text class="mt-n4">
              <div class="mt-n5">
                <v-rating
                  :value="comentario.MEDIA_CLASSIFICACAO * 1"
                  color="amber"
                  dense
                  background-color="grey darken-1"
                  half-increments
                  readonly
                  size="14"
                  small
                ></v-rating>
              </div>
              <v-divider class="my-3"></v-divider>
              {{ comentario.COMENTARIO }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>
  </v-card>
</template>

<script>
  export default {
    props: {
      comentarios: {
        type: Array
      }
    },
    data: () => ({
      rating: 4.5
    }),
    methods: {
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      priName(value) {
        let separar = value.split(' ')
        let nome = separar[0]
        return nome[0] + nome.toLowerCase().substring(1)
      },
      getUrlImg(value) {
        var img = require.context('../../../assets/img/Avatar/', false, /\.png$/)
        return img('./' + value + '.png')
      }
    }
  }
</script>

<style></style>
