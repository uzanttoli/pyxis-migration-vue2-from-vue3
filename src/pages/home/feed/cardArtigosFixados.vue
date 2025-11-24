<template>
  <div class="card-container">
    <div class="data">
      <v-chip
        x-small
        :color="colorChip(imgCategoria)"
        class="white--text rounded-l-xl rounded-tr-xl"
      >
        Fixado {{ formatarData(data) }}
      </v-chip>
    </div>
    <v-menu absolute offset-y style="max-width: 600px">
      <template v-slot:activator="{ attrs, on }">
        <div class="card-info" v-bind="attrs" v-on="on">
          <h3>{{ title }}</h3>
          <div class="container-img">
            <img :src="imagemCategoria(imgCategoria)" />
          </div>
        </div>
      </template>
      <v-list dense>
        <v-list-item v-for="(item, i) in items" :key="i" @click="execAcao(item.acao)">
          <i :class="`fa-solid ${item.icon}`" class="mr-2"></i>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
  import config from '../../../core/config'
  import alerts from '../../../mixins/alerts.mixins'
  export default {
    props: {
      imgCategoria: {
        type: String,
        require: true
      },
      title: {
        type: String,
        require: true
      },
      artigo: {
        type: [String, Number]
      },
      data: {
        type: [String, Number]
      }
    },
    mixins: [alerts],
    data: () => ({
      items: [
        { title: 'Visualizar', acao: 'visualizar', icon: 'fa-eye' },
        { title: 'Remover', acao: 'remover', icon: 'fa-trash' }
      ]
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      async saveInsertVisualizacao() {
        let data = {
          id_artigo: this.artigo,
          login_visualizacao: this.$store.getters.usuario.almope
        }
        await this.$store.dispatch('saveInsertVisualizacao', data)
      },
      formatarData(value) {
        this.moment.locale('pt-br')
        return this.moment(value).fromNow()
      },
      async remover() {
        let data = {
          almope: this.usuarioAlmope,
          idArtigo: this.artigo
        }
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/delete_artigo/`
        await this.$api.post(urlData, data)
        this.toast('Artigo removido com sucesso!', 'bottom-right', false, 3000, 'success')
        this.$emit('update:reload')
      },
      execAcao(item) {
        if (item == 'visualizar') {
          this.visualizar()
        } else {
          this.remover()
        }
      },
      visualizar() {
        this.saveInsertVisualizacao()
        this.$router.push({
          name: 'FeedNoticias',
          params: { id: this.title },
          query: { artigo: this.artigo }
        })
      },
      imagemCategoria(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/wiki_categoria/${img}`
      },
      colorChip(tipo) {
        if (tipo == 'comunicacao.png') return '#F2B705'
        if (tipo == 'alteracaoProcessos.png') return '#2BB9D9'
        if (tipo == 'urgente.png') return '#F24C27'
        if (tipo == 'novidades.png') return '#7FBF1F'
      }
    },
    created() {}
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Karla:wght@200;700&display=swap"); */
  .card-container {
    display: flex;
    flex-direction: column;
    width: 75%;
    height: 100px;
    margin: 10px;
    padding: 7px;

    border: 1px solid #dcdcdc;
    border-radius: 10px;

    overflow: hidden;
    text-overflow: ellipsis;
    box-shadow: 8px 7px 7px -3px rgba(0, 0, 0, 0.1), 0px 10px 10px -3px rgba(0, 0, 0, 0.1);
  }

  h3 {
    font-family: 'Karla', sans-serif;
  }
  .card-info {
    display: flex;
  }
  .container-img {
    width: 200px;
    height: 100px;
  }

  .container-img img {
    width: 150px;
  }

  .data {
    margin-top: -20px;
    position: absolute;
    right: 35px;
  }
</style>
