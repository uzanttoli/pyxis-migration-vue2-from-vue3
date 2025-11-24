<template>
  <v-row class="mt-7">
    <v-card class="mx-auto mt-2" width="60%">
      <v-card-title>
        <v-col class="ma-0 pa-0">
          <h4>
            <v-icon>mdi-pencil-plus</v-icon>
            Dados Da Publicação
          </h4>
          <h5>
            <v-icon>mdi-account</v-icon>
            Criado por: {{ userAlmope }}
          </h5>
        </v-col>
        <v-spacer></v-spacer>
        <v-tooltip bottom color="black">
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon to="/home" v-bind="attrs" v-on="on">
              <v-icon>fa-solid fa-person-walking-arrow-loop-left</v-icon>
            </v-btn>
          </template>
          <span>Voltar</span>
        </v-tooltip>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div id="title">
          <v-row align="center" justify="center" class="ma-0 pa-0">
            <v-col>
              <v-row>
                <v-text-field
                  dense
                  class="pa-3"
                  outlined
                  placeholder="Informe um titulo:"
                  v-model="dadosFeed.titulo"
                ></v-text-field>

                <v-autocomplete
                  outlined
                  dense
                  label="Desativar Comentarios?"
                  class="pa-3"
                  placeholder="Desativar Comentarios?"
                  v-model="comentario_desabilitado"
                  :items="comentarios"
                ></v-autocomplete>
                <v-autocomplete
                  outlined
                  dense
                  label="Categoria"
                  class="pa-3"
                  placeholder="Categoria"
                  v-model="dadosFeed.categoria"
                  :items="listarCategorias"
                  item-text="NOME_CATEGORIA"
                  item-value="NOME_ARQUIVO"
                ></v-autocomplete>
              </v-row>
              <v-row class="mt-n5">
                <v-autocomplete
                  v-model="para_publico"
                  :items="publico_alvo"
                  v-model:search-input="search"
                  cache-items
                  class="pa-3"
                  flat
                  multiple
                  label="Público Alvo?"
                  outlined
                  dense
                  hide-no-data
                  :disabled="paraSupervisores != '' || paraCoordenadores != ''"
                ></v-autocomplete>
                <v-autocomplete
                  class="pa-3"
                  outlined
                  v-model="paraSupervisores"
                  dense
                  label="Supervisor(es) Alvo"
                  hide-no-data
                  cache-items
                  :items="listaSupervisor"
                  item-text="NOME"
                  flat
                  :disabled="para_publico != '' || paraCoordenadores != ''"
                  multiple
                ></v-autocomplete>
                <v-autocomplete
                  class="pa-3"
                  outlined
                  dense
                  v-model="paraCoordenadores"
                  label="Coordenador(es) Alvo"
                  hide-no-data
                  cache-items
                  :items="listaCoordenador"
                  item-text="NOME"
                  flat
                  :disabled="para_publico != '' || paraSupervisores != ''"
                  multiple
                ></v-autocomplete>
                <v-autocomplete
                  placeholder="Produto(s)"
                  label="Produto(s)"
                  multiple
                  class="pa-3"
                  outlined
                  dense
                  hide-no-data
                  cache-items
                  :items="listarProdutos"
                  v-model="paraProdutos"
                  item-text="PRODUTO"
                  flat
                ></v-autocomplete>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto mt-5 pa-4 rounded-lg" width="60%">
      <v-divider></v-divider>
      <div class="quillEditorContainer">
        <div class="quillEditor">
          <quill-editor v-model="dadosFeed.descricao_artigo" :options="quillConfig"></quill-editor>
        </div>
      </div>
      <v-row class="ma-2" justify="center">
        <v-btn rounded color="primary" @click="publicarPost()" :disabled="!saveIsValid()">
          Publicar
        </v-btn>
      </v-row>
    </v-card>
    <v-snackbar v-model="snackbar">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="green" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>
<script>
  import config from '../../../../../core/config.js'
  export default {
    name: 'VueQuillEditorComponent',
    data: () => ({
      snackbar: false,
      text: 'Publicado com sucesso!',
      publico_alvo: [],
      para_publico: '',
      paraSupervisores: '',
      paraCoordenadores: '',
      paraProdutos: '',
      filtro_tratado: '',
      search: null,
      // listaCoordenador: [],
      // listaSupervisor: [],
      hierarquias: [],
      listarCategorias: [],
      listarProdutos: [],
      dadosFeed: {
        titulo: '',
        descricao_artigo: '',
        status: 1,
        categoria: ''
      },
      comentario_desabilitado: 3,
      comentarios: [
        { text: 'Selecione uma opção', value: 3 },
        { text: 'SIM', value: 0 },
        { text: 'NÃO', value: 1 }
      ],
      quillConfig: {
        readOnly: false,
        placeholder: 'Descrição da postagem...'
      }
    }),
    computed: {
      userAlmope() {
        return this.$store.getters.usuario.almope
      },
      data() {
        let date = new Date()
        let day = date.getDate().toString()
        let dayF = day.length === 1 ? '0' + day : day

        let month = (date.getMonth() + 1).toString()
        let monthF = month.length === 1 ? '0' + month : month

        let year = date.getFullYear()

        let hours = date.getHours()
        let minutes = date.getMinutes()

        return `${dayF}/${monthF}/${year} ${hours}:${minutes}`
      },
      produto() {
        return this.$store.getters.usuario.produto
      },
      filtro() {
        return this.$store.getters.usuario.filtro
      },
      listaCoordenador() {
        let uniqueArray = []
        const countMap = {}
        this.hierarquias
          .map(el => {
            return {
              NOME: el.COORDENADOR
            }
          })
          .forEach(item => {
            const { NOME } = item

            if (!countMap[NOME]) {
              countMap[NOME] = 1
              uniqueArray.push({ ...item, quantidade: 1 })
            } else {
              countMap[NOME]++
            }
          })

        uniqueArray.forEach(item => {
          item.quantidade = countMap[item.NOME]
        })
        return uniqueArray
      },
      listaSupervisor() {
        let uniqueArray = []
        const countMap = {}
        this.hierarquias
          .map(el => {
            return {
              NOME: el.SUPERVISOR
            }
          })
          .forEach(item => {
            const { NOME } = item

            if (!countMap[NOME]) {
              countMap[NOME] = 1
              uniqueArray.push({ ...item, quantidade: 1 })
            } else {
              countMap[NOME]++
            }
          })
        uniqueArray.forEach(item => {
          item.quantidade = countMap[item.NOME]
        })
        return uniqueArray
      },
      tratamentoProduto() {
        let produtos = this.paraProdutos
        if (!produtos) return

        let produtoJoin = produtos.map(produto => produto).join('; ')
        return this.produto + ';' + produtoJoin
      }
    },
    methods: {
      loadListProdutos() {
        let urlData = `${config.baseUrl}api/shared/utils/geral/produtos_disp_pyxis`
        this.$api.get(urlData).then(res => {
          this.listarProdutos = res.data.filter(item => {
            return item.PRODUTO != this.produto
          })
        })
      },
      loadListarCategorias() {
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/listar_categorias`
        this.$api.get(urlData).then(res => {
          this.listarCategorias = res.data
        })
      },
      validarSelect() {
        if (this.para_publico != '') {
          return 'REGIONAL'
        } else if (this.paraCoordenadores != '') {
          return 'COORDENADOR'
        } else if (this.paraSupervisores != '') {
          return 'SUPERVISOR'
        }
      },

      tratamentoFiltro() {
        // REGIONAL
        if (this.para_publico != '') {
          let regional = this.para_publico

          let data = []
          data.push('ADMINISTRADOR', 'GERENTE', 'COORDENADOR')
          for (let i = 0; i < regional.length; i++) {
            data.push(regional[i])
          }

          let dataSplit = data.toString().split(',')

          let dataJoin = dataSplit.join('; ')

          return dataJoin
        } else if (this.paraSupervisores != '') {
          let supervisores = this.paraSupervisores
          let data = []
          data.push('ADMINISTRADOR', 'GERENTE', 'COORDENADOR')
          for (let i = 0; i < supervisores.length; i++) {
            data.push(supervisores[i])
          }

          let dataSplit = data.toString().split(',')

          let dataJoin = dataSplit.join('; ')

          return dataJoin
        } else if (this.paraCoordenadores != '') {
          let coordenadores = this.paraCoordenadores
          let data = []
          data.push('ADMINISTRADOR', 'GERENTE')
          for (let i = 0; i < coordenadores.length; i++) {
            data.push(coordenadores[i])
          }

          let dataSplit = data.toString().split(',')

          let dataJoin = dataSplit.join('; ')

          return dataJoin
        }
      },
      saveIsValid() {
        return (
          this.dadosFeed.titulo &&
          this.dadosFeed.descricao_artigo &&
          this.dadosFeed.categoria &&
          (this.para_publico || this.paraCoordenadores || this.paraSupervisores) &&
          this.comentario_desabilitado != 3
        )
      },
      async loadHierarquiasPortal() {
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/listar_hierarquia/${this.filtro}/${this.produto}`
        var res = await this.$api.get(urlData)
        this.hierarquias = res.data
      },
      async filtroPublico() {
        let urlData = `${config.baseUrl}api/shared/wiki/wiki_postagens/publico_alvo/${this.produto}/${this.filtro}`
        var res = await this.$api.get(urlData)
        let data = []

        for (let i = 0; i < res.data.length; i++) {
          data.push(res.data[i].REGIONAL)
        }
        data.unshift('TODOS')
        this.publico_alvo = data
      },

      async publicarPost() {
        try {
          this.dadosFeed.comentario_desabilitado = this.comentario_desabilitado
          this.dadosFeed.criado_por = this.userAlmope
          this.dadosFeed.publico_alvo = this.tratamentoFiltro()
          this.dadosFeed.produto = this.tratamentoProduto ?? this.produto
          this.dadosFeed.tipoAlvoPublicacao = this.validarSelect()
          await this.$store.dispatch('saveInsertFeed', this.dadosFeed)
          const Toast = this.$swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: toast => {
              toast.addEventListener('mouseenter', this.$swal.stopTimer)
              toast.addEventListener('mouseleave', this.$swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'success',
            title: 'Artigo publicado com sucesso!'
          })

          // this.snackbar = false;
          this.dadosFeed.titulo = ''
          this.dadosFeed.descricao_artigo = ''
          this.para_publico = ''
          this.dadosFeed.categoria = ''
        } catch (error) {
          const Toast = this.$swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: toast => {
              toast.addEventListener('mouseenter', this.$swal.stopTimer)
              toast.addEventListener('mouseleave', this.$swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'error',
            title: error.response.data
          })
        }
      }
    },
    created() {
      this.loadListProdutos()
      this.filtroPublico()
      this.loadHierarquiasPortal()
      this.loadListarCategorias()
    }
  }
</script>
<style scoped>
  #editor {
    height: 250px;
  }
  #editor .quill-editor {
    height: 100%;
  }
  #editor .quill-editor .ql-container {
    height: 60%;
  }

  #preview {
    padding: 15px;
  }

  #preview h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  h2 {
    display: block;
    font-size: 1.5em;
    margin-block-start: 0.83em;
    margin-block-end: 0.83em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }
</style>
