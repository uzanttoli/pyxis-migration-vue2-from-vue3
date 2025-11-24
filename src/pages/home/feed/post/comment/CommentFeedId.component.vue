<template>
  <div class="pa-2" v-if="comentarios != ''">
    <v-card elevation="0" class="mx-auto" color="backgroundCardComentarios">
      <v-card-title>
        Comentários:
        <v-spacer></v-spacer>
        <span style="font-family: 'Times New Roman', 'Times', 'serif'">
          {{ qtd_comentarios.QTD_COMENTARIOS }} comentários
        </span>
      </v-card-title>
      <v-divider></v-divider>
      <div v-for="(item, i) in comentarios" :key="i">
        <section class="comentarios">
          <div class="comentarioPorId">
            <div class="comentario-row">
              <v-avatar v-if="item.NOME_AVATAR" size="40px">
                <v-img :src="imagemPerfil(item.NOME_AVATAR)"></v-img>
              </v-avatar>
              <v-avatar v-else>
                <v-img src="../../../../../assets/img/Avatar/padrao.png"></v-img>
              </v-avatar>
              <h4>
                {{ item.NOME }}
                <span style="color: grey; font-style: italic">
                  ({{ item.PERFIL }}), Comentou {{ formatarData(item.DATA_COMENTARIO) }}
                </span>
                -
              </h4>
              <span>
                {{ item.DESCRICAO_COMENTARIO }}
              </span>
              <span class="btn-excluir">
                <v-tooltip bottom v-if="tipoUser != 'OPERADOR' && tipoUser != 'SUPERVISOR'">
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn
                      v-bind="attrs"
                      v-on="on"
                      icon
                      color="red"
                      class="mb-3"
                      @click="saveUpdateStatusComentarios(item.ID_COMENTARIOS)"
                    >
                      <v-icon>mdi-trash-can</v-icon>
                    </v-btn>
                  </template>
                  <span>Excluir</span>
                </v-tooltip>
              </span>
            </div>
          </div>
          <respostas-comentario
            :idComentario="item.ID_COMENTARIOS"
            :respondeu="respondeu"
            @updated:carregou="resultData"
          ></respostas-comentario>
          <responder-comentario
            :id="item.ID_COMENTARIOS"
            @updated:respondeu="atualizarResposta"
          ></responder-comentario>
        </section>
        <v-divider></v-divider>
      </div>
      <v-row class="pa-2 ma-2" align="center" justify="center" v-if="items <= comentarios.length">
        <v-btn @click="items += 5" depressed small color="primary" rounded>Carregar mais</v-btn>
      </v-row>
    </v-card>
  </div>
</template>

<script>
  import config from '../../../../../core/config'
  import ResponderComentario from './ResponderComentario.vue'
  import RespostasComentario from './RespostasComentario.vue'
  export default {
    components: { ResponderComentario, RespostasComentario },
    props: {
      id_feedback: {
        type: [Number, String],
        default: 0
      },
      atualizou: {
        typeof: Boolean,
        default: false
      }
    },
    data: () => ({
      responder: false,
      items: 5,
      respondeu: false,
      comentarios: [],
      qtd_comentarios: [],
      resultRetornoData: null
    }),
    computed: {
      tipoUser() {
        return this.$store.getters.usuario.filtro
      },
      date() {
        let date = new Date()
        let data = date.getDate().toString()
        let dataF = data.length == 1 ? '0' + data : data
        let mes = (date.getMonth() + 1).toString()
        let mesF = mes.length == 1 ? '0' + mes : mes
        let ano = date.getFullYear()

        let hora = date.getHours()
        let minutos = date.getMinutes()
        let segundos = date.getSeconds()

        return `${dataF}/${mesF}/${ano} ${hora}:${minutos}:${segundos}`
      }
    },
    methods: {
      resultData(e) {
        this.$emit('updated:retorno', e)
      },
      formatarData(value) {
        this.moment.locale('pt-br')
        return this.moment(value).fromNow()
      },
      atualizarResposta(e) {
        this.respondeu = e
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      async loadQtdComentarios() {
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/quantidade_comentarios/${this.id_feedback}`
        let res = await this.$api.get(urlData)
        this.qtd_comentarios = res.data[0]
      },
      loadComentariosId() {
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/comentarios_id/${this.id_feedback}/${this.items}`
        this.$api.get(urlData).then(res => {
          if (res.data == '') {
            this.$emit('update:sem-comentarios', false)
          } else {
            this.comentarios = res.data
          }
        })
      },
      saveUpdateStatusComentarios(item) {
        let inativarComentarios = {
          id_comentario: item,
          login_inativacao: this.$store.getters.usuario.almope,
          status: 0,
          data_inativacao: this.date
        }
        this.$store.dispatch('saveUpdateStatusComentarios', inativarComentarios).then(() => {
          setTimeout(() => {
            this.loadComentariosId()
          }, 1000)
        })
      }
    },
    created() {
      this.loadComentariosId()
      this.loadQtdComentarios()
    },
    watch: {
      items() {
        this.loadComentariosId()
      },
      atualizou() {
        if (this.atualizou === true) {
          setTimeout(() => {
            this.loadComentariosId()
          }, 1500)
        }
      }
    }
  }
</script>

<style scoped>
  .comentarioPorId {
    display: flex;
    flex-direction: row;
    align-items: center;

    padding: 10px;
  }

  .comentarios {
    display: flex;
    flex-direction: column;
  }

  h4 {
    margin: 10px;
  }

  h5 {
    margin-left: 4%;
  }

  .comentario-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .btn-excluir {
    position: absolute;
    right: 5px;
  }
</style>
