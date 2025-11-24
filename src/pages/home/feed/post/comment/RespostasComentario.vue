<template>
  <v-row class="mt-2 ml-n8">
    <v-card class="mt-n4 mb-6 mr-3 transparent" elevation="0" width="90%">
      <div class="overflow-auto" style="max-height: 300px; width: 100%" v-if="respostas.length > 0">
        <v-skeleton-loader
          v-bind="attrs"
          class="rounded-xl-0"
          type="list-item-avatar, list-item-two-line"
          :loading="carregando"
          width="100%"
        >
          <transition-group name="list">
            <v-list-item two-line v-for="(resposta, i) in respostas" :key="i">
              <v-timeline dense>
                <v-timeline-item dot small icon="mdi-circle">
                  <v-row align="center">
                    <v-list-item-avatar v-if="resposta.NOME_AVATAR">
                      <v-img :src="imagemPerfil(resposta.NOME_AVATAR)"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-avatar v-else>
                      <v-img src="../../../../../assets/img/Avatar/padrao.png"></v-img>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title style="font-size: 13px" class="font-weight-bold">
                        {{ resposta.NOME }},
                        <span style="color: grey; font-style: italic">({{ resposta.PERFIL }})</span>
                        - Respondeu
                        {{ formatarData(resposta.DATA_CADASTRO) }}
                      </v-list-item-title>

                      <span>{{ resposta.RES_COMENTARIO }}</span>
                    </v-list-item-content>
                  </v-row>
                </v-timeline-item>
              </v-timeline>
            </v-list-item>
          </transition-group>
        </v-skeleton-loader>
      </div>
    </v-card>
  </v-row>
</template>

<script>
  import config from '../../../../../core/config'
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
      respostas: [],
      carregando: false,
      attrs: {
        boilerplate: false,
        elevation: 2
      }
    }),
    methods: {
      formatarData(value) {
        this.moment.locale('pt-br')
        return this.moment(value).fromNow()
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      async loadRespostasComentarios() {
        try {
          let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/respostas_comentario/${this.idComentario}`
          var res = await this.$api.get(urlData)
          this.respostas = res.data
          this.$emit('updated:carregou', false)
        } catch (error) {
          console.error(error)
        }
      }
    },
    watch: {
      idComentario() {
        this.loadRespostasComentarios()
      },
      respondeu() {
        if (this.respondeu == true) {
          this.loadRespostasComentarios()
        }
      }
    },
    created() {
      this.loadRespostasComentarios()
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
