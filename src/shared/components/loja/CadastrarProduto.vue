<template>
  <v-sheet>
    <v-card elevation="2" tile class="mt-7 mx-auto rounded-0">
      <transition name="fade">
        <v-alert type="success" tile dark dense elevation="4" :value="alert">
          Produto Cadastrado com sucesso!
        </v-alert>
      </transition>
      <v-card-title>
        Crie um novo produto
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          rounded
          depressed
          small
          fab
          :to="{ name: 'Gerenciamento', params: { id: 'produtos' } }"
        >
          <v-icon>mdi-keyboard-return</v-icon>
        </v-btn>
      </v-card-title>

      <v-list>
        <v-row align="center" justify="center" class="px-3">
          <v-col cols="12" sm="6">
            <v-text-field
              filled
              rounded
              dense
              placeholder="Nome"
              label="Nome"
              v-model="formCadastroProduto.nome"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              filled
              rounded
              v-model="formCadastroProduto.preco"
              dense
              placeholder="Preço"
              type="number"
              label="Preço"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              filled
              v-model="formCadastroProduto.limiteCompra"
              rounded
              type="number"
              dense
              placeholder="Deixe em branco para ilimitado"
              label="Limite de compra"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center" justify="center" class="px-3 mt-n4">
          <v-col cols="12" sm="4">
            <v-autocomplete
              filled
              rounded
              dense
              chips
              :items="agrupamentoLoja"
              item-text="AGRUPAMENTO"
              v-model="publicoAlvo"
              small-chips
              label="Grupo"
              no-data-text="Não há informações"
              multiple
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              filled
              no-data-text="Não há informações"
              rounded
              dense
              v-model="formCadastroProduto.categoria"
              :items="listarCategories"
              item-text="NOME_CATEGORIAS"
              item-value="ID_CATEGORIAS"
              placeholder="Categoria"
              label="Categoria"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              filled
              rounded
              type="number"
              dense
              v-model="formCadastroProduto.quantidade"
              placeholder="Quantidade"
              label="Quantidade"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="px-3 mt-n4">
          <v-col cols="12">
            <v-textarea
              filled
              rows="3"
              v-model="formCadastroProduto.descricaoProduto"
              auto-grow
              label="Descrição breve do produto"
              shaped
              counter="400"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-list>
      <div class="px-6">
        <v-chip class="font-weight-medium mr-2">
          Tamanho necessário
          <strong class="ml-1">524 x 328</strong>
        </v-chip>
        <v-tooltip right>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              color="green"
              rounded
              fab
              x-small
              :href="downloadModelo('modeloImagemProdutoPyxis.png')"
            >
              <v-icon color="white">fas fa-download</v-icon>
            </v-btn>
          </template>
          <span>Baixar Modelo</span>
        </v-tooltip>
      </div>
      <div>
        <div class="file-upload-form">
          <label for="selecao-arquivo">Selecionar um arquivo de imagem &#187;</label>
          <input
            ref="files"
            id="selecao-arquivo"
            type="file"
            @change="previewImage"
            accept="image/*"
            v-on:change="handleFilesUpload()"
          />
        </div>
        <div class="image-preview" v-if="imageData.length > 0">
          <img class="preview" :src="imageData" />
        </div>
      </div>
      <div class="pa-3" align="end">
        <v-btn color="success" @click="saveInserirProduto" :disabled="!this.formIsValid()">
          Salvar
        </v-btn>
      </div>
    </v-card>
    <CadastrarBanner />
  </v-sheet>
</template>

<script>
  import config from '../../../core/config.js'
  import CadastrarBanner from './CadastrarBanner.vue'
  import { MediaDimensions } from '../../../pages/media-dimensions-comment.js'
  export default {
    data: () => ({
      imageData: '',
      alert: false,
      files: '',
      tamanho: [],
      publicoAlvo: ['ADMINISTRADOR', 'GERENTE', 'COORDENADOR'],
      formCadastroProduto: {
        descricaoProduto: '',
        nome: '',
        preco: '',
        quantidade: '',
        limiteCompra: '',
        categoria: ''
      },
      formCadastroProdutoDefault: {
        descricaoProduto: '',
        nome: '',
        preco: '',
        quantidade: '',
        limiteCompra: '',
        categoria: ''
      }
    }),
    components: { CadastrarBanner },
    computed: {
      listarCategories() {
        let listarCategories = this.$store.getters.listarCategories
        let novaCategoria = listarCategories.filter(item => {
          return item.NOME_CATEGORIAS != 'Todos'
        })
        return novaCategoria ? novaCategoria : []
      },
      agrupamentoLoja() {
        let agrupamentoLoja = this.$store.getters.agrupamentoLoja
        agrupamentoLoja.unshift({ AGRUPAMENTO: 'TODOS' })
        return agrupamentoLoja ? agrupamentoLoja : []
      },

      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      replacePublicoAlvo() {
        let replaceIn = this.publicoAlvo
        return replaceIn.toString().replaceAll(',', ';')
      }
    },
    methods: {
      imagemIsValid() {
        let dimensao = this.tamanho
        let largura = dimensao[0]?.largura ?? 0
        let altura = dimensao[0]?.altura ?? 0

        if (largura === 524 && altura === 328) {
          return true
        } else {
          return false
        }
      },
      downloadModelo(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_produto/${img}`
      },
      clearForm() {
        Object.assign(this.formCadastroProduto, this.formCadastroProdutoDefault)
        this.imageData = ''
        this.publicoAlvo = ['ADMINISTRADOR', 'GERENTE', 'COORDENADOR']
      },
      formIsValid() {
        return (
          this.formCadastroProduto.descricaoProduto != '' &&
          this.formCadastroProduto.nome != '' &&
          this.formCadastroProduto.preco != '' &&
          this.formCadastroProduto.quantidade != '' &&
          this.formCadastroProduto.categoria != '' &&
          this.imagemIsValid()
        )
      },
      nameFiles() {
        let name = this.$refs.files.files
        return name[0].name
      },
      previewImage: function (event) {
        var input = event.target
        this.tamanho = []
        new MediaDimensions.getImageDimensionsFromFile(input.files[0]).then(res => {
          this.tamanho.push({ largura: res.width, altura: res.height })
        })
        if (input.files && input.files[0]) {
          var reader = new FileReader()
          reader.onload = e => {
            this.imageData = e.target.result
          }
          reader.readAsDataURL(input.files[0])
        }
      },
      handleFilesUpload() {
        this.files = []
        let uploadedFiles = this.$refs.files.files
        if (this.$refs.files) {
          this.files.push(uploadedFiles[0].name)
        }
      },
      async saveInserirProduto() {
        if (this.imageData == '') {
          alert('Insira uma imagem')
        } else {
          this.alert = true
          this.formCadastroProduto.usuarioCadastro = this.usuarioAlmope
          this.formCadastroProduto.nomeArquivoImagem = this.nameFiles()
          this.formCadastroProduto.publicoAlvo = this.replacePublicoAlvo
          await this.$store.dispatch('saveInserirProduto', this.formCadastroProduto)
          await this.submitFiles()
          setTimeout(() => {
            this.alert = false
          }, 2000)
          this.clearForm()
        }
      },
      submitFiles() {
        let formData = new FormData()

        for (let file of this.$refs.files.files) {
          formData.append('files', file)
        }
        let urlData = `${config.baseUrl}api/shared/loja/upload_img_product`
        urlData = this.replaceUrlMultiParamSeparator(urlData)
        this.$api.post(urlData, formData, {
          headers: {
            'Content-Type': false
          }
        })
      },
      loadAgrupamentoLoja() {
        this.$store.dispatch('loadAgrupamentoLoja')
      },
      loadListarCategories() {
        this.$store.dispatch('loadListarCategories')
      }
    },
    created() {
      this.loadAgrupamentoLoja()
      this.loadListarCategories()
    }
  }
</script>

<style scoped>
  .file-upload-form,
  .image-preview {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 20px;
  }
  img.preview {
    width: 400px;
    background-color: white;
    border: 1px solid #ddd;
    padding: 5px;
  }

  input[type='file'] {
    display: none;
  }

  /* Aparência que terá o seletor de arquivo */
  label {
    background-color: #591b3d;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    margin: 10px;
    padding: 6px 20px;
  }
</style>
