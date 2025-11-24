<template>
  <v-row justify="end">
    <v-card class="mt-n4 mb-6 mr-3" elevation="0" width="97%">
      <div
        style="border: 1px solid #a1a1a1ce; max-height: 300px"
        class="overflow-auto"
        v-if="respostas.length > 0"
      >
        <v-skeleton-loader
          v-bind="attrs"
          class="rounded-xl-0"
          type="list-item-avatar,  list-item-two-line"
          :loading="carregando"
          width="100%"
        >
          <transition-group name="list">
            <v-list-item two-line v-for="(resposta, i) in respostas" :key="i">
              <v-list-item-avatar v-if="resposta.NOME_AVATAR">
                <v-img :src="imagemPerfil(resposta.NOME_AVATAR)"></v-img>
              </v-list-item-avatar>
              <v-list-item-avatar v-else>
                <v-img src="../../../assets/img/Avatar/padrao.png"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title style="font-size: 13px" class="font-weight-bold">
                  {{ resposta.nome }} -
                  <v-chip small color="grey darken-1" class="white--text">
                    Respondeu {{ formatarData(resposta.DATA_RES_CLASS_COMEN) }}
                  </v-chip>
                </v-list-item-title>
                <v-list-item-subtitle style="font-size: 12px" class="mt-n2">
                  {{ resposta.cargo }}
                </v-list-item-subtitle>
                <span class="subtitle-1">
                  {{ resposta.RES_COMENTARIO }}
                </span>
              </v-list-item-content>
            </v-list-item>
          </transition-group>
        </v-skeleton-loader>
      </div>
    </v-card>
  </v-row>
</template>

<script>
  import config from '../../../core/config'
  export default {
    props: {
      idComentario: {
        type: Number
      },
      respondeu: {
        type: Boolean
      }
    },
    data: () => ({
      isActive: false,
      respostas: [],
      carregando: false,
      attrs: {
        boilerplate: false,
        elevation: 2
      }
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
      formatarData(value) {
        this.moment.locale('pt-br')
        return this.moment(value).fromNow()
      },
      async loadRespostasComentario() {
        this.carregando = true
        let urlData = `${config.baseUrl}api/shared/loja/respostas/${this.idComentario}`
        var res = await this.$api.get(urlData)
        this.respostas = res.data
        this.carregando = false
      },
      getUrlImg(value) {
        var img = require.context('../../../assets/img/Avatar/', false, /\.png$/)
        return img('./' + value + '.png')
      }
    },
    watch: {
      idComentario() {
        this.loadRespostasComentario()
      },
      respondeu() {
        if (this.respondeu == true) {
          this.loadRespostasComentario()
        }
      }
    },
    created() {
      this.loadRespostasComentario()
    }
  }
</script>

<style scoped>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.9s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>
