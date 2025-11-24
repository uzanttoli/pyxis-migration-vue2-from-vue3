<template>
  <v-card class="pa-4 mt-3" v-if="tipoAcesso != 'SUPERVISOR' && tipoAcesso != 'OPERADOR'">
    <v-col class="pa-0">
      <v-card-text>
        <pre style="display: none">{{ valueProducts }}</pre>
        <v-row>
          <v-col>
            <div
              class="elementor-field-type-upload elementor-field-group elementor-column elementor-field-group-field_53c80dc elementor-col-50 elementor-field-required mt-5"
            >
              <label for="form-field-field_53c80dc" class="elementor-field-label text-truncate">
                {{ files[0] ? files[0] : text }}
              </label>
              <input
                type="file"
                accept="image/*"
                name="form_fields[field_53c80dc]"
                id="form-field-field_53c80dc"
                ref="files"
                class="elementor-field elementor-size-lg elementor-upload-field"
                v-on:change="handleFilesUpload()"
              />
            </div>
            <p class="mt-3 ml-1 red--text" v-show="editProduto">Imagem não pode ser editada!</p>
          </v-col>
          <v-col class="ml-2">
            <v-text-field
              outlined
              label="Nome do produto"
              v-model="formCadastroProduto.nomeProduto"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              outlined
              label="Valor do produto"
              type="number"
              v-model="formCadastroProduto.valorResgate"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              outlined
              v-model="formCadastroProduto.quantidade"
              label="Quantidade Estoque"
              type="number"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-col>
    <v-row align="center" class="justify-end mr-3">
      <v-btn
        @click="editProduto ? atualizarProdutoActions() : inserirProdutosActions()"
        color="primary"
        rounded
        :disabled="!this.isValid()"
      >
        {{ editProduto ? 'Editar' : 'Cadastrar' }}
      </v-btn>
    </v-row>
    <v-overlay :value="carregamento">
      <div class="d-flex flex-column justify-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <span class="ml-n9 mt-2">Por favor, Aguarde!</span>
      </div>
    </v-overlay>
  </v-card>
</template>

<script>
  import config from '../../../../core/config'
  export default {
    props: {
      editProduto: {
        type: Boolean,
        default: false
      },
      valueProducts: {
        type: [Array]
      }
    },
    components: {},
    data: () => ({
      carregamento: false,
      fileAdded: '',
      text: 'Clique aqui para enviar uma imagem',
      sendingFiles: '',
      edit: false,
      files: '',
      nameFilesValidate: '',
      idEdit: '',
      formCadastroProduto: [
        {
          nomeProduto: '',
          valorResgate: '',
          quantidade: ''
        }
      ]
    }),
    mounted() {
      // let inputFile = document.querySelector(
      //   ".elementor-field-type-upload input"
      // );
      // let labelInputFile = document.querySelector(
      //   ".elementor-field-type-upload label"
      // );
      // inputFile.addEventListener("change", () => {
      //   let inputImage = inputFile.files[0];
      //   labelInputFile.innerText = inputImage.name;
      //   this.nameFilesValidate = inputImage.name;
      // });
    },

    computed: {
      tipoAcesso() {
        let tipo = this.$store.getters.usuario.filtro
        return tipo
      }
    },

    methods: {
      isValid() {
        if (this.editProduto) {
          return (
            this.formCadastroProduto.nomeProduto &&
            this.formCadastroProduto.valorResgate &&
            this.formCadastroProduto.quantidade
          )
        } else {
          return (
            this.formCadastroProduto.nomeProduto &&
            this.formCadastroProduto.valorResgate &&
            this.formCadastroProduto.quantidade &&
            this.files
          )
        }
      },
      nameFiles() {
        let name = this.$refs.files.files
        return name[0].name
      },
      reset() {},
      clearForm() {
        ;(this.formCadastroProduto.nomeProduto = ''),
          (this.formCadastroProduto.valorResgate = ''),
          (this.formCadastroProduto.quantidade = ''),
          (this.files = '')
      },
      async inserirProdutosActions() {
        this.carregamento = true
        this.formCadastroProduto.visivel = 1
        this.formCadastroProduto.nomeArquivoImagem = this.nameFiles()
        this.formCadastroProduto.usuarioCadastro = this.$store.getters.usuario.almope
        await this.$store.dispatch('inserirProdutosActions', this.formCadastroProduto)
        this.submitFiles()
        this.text = 'Clique aqui para enviar uma imagem'
        this.$emit('updated:atualizar')
        this.clearForm()
        this.carregamento = false
      },
      async atualizarProdutoActions() {
        this.carregamento = true
        let v = this.valueProducts[0]
        let data = {
          idProduto: v.idProduto,
          // nomeArquivoImagem: this.nameFiles(),
          nomeProduto: this.formCadastroProduto.nomeProduto,
          quantidade: this.formCadastroProduto.quantidade,
          valorResgate: this.formCadastroProduto.valorResgate
        }
        await this.$store.dispatch('atualizarProdutoActions', data)
        this.text = 'Clique aqui para enviar uma imagem'
        this.$emit('updated:atualizar')
        this.clearForm()
        this.$emit('updated:editar')
        this.carregamento = false
      },
      submitFiles() {
        let formData = new FormData()

        for (let file of this.$refs.files.files) {
          formData.append('files', file)
        }
        let urlData = `${config.baseUrl}api/upload/recebe_upload/upload_img`
        urlData = this.replaceUrlMultiParamSeparator(urlData)
        this.$api
          .post(urlData, formData, {
            headers: {
              'Content-Type': false
            }
          })
          .then(function () {})
          .catch(function () {})
      },
      handleFilesUpload() {
        this.files = []
        let uploadedFiles = this.$refs.files.files
        if (this.$refs.files) {
          this.files.push(uploadedFiles[0].name)
        }
      }
    },
    watch: {
      valueProducts() {
        let v = this.valueProducts[0]
        this.formCadastroProduto.nomeProduto = v.nomeProduto
        this.formCadastroProduto.quantidade = v.quantidade
        this.formCadastroProduto.valorResgate = v.valorResgate
      }
    },
    created() {}
  }
</script>

<style scoped>
  #table-rows {
    align-items: center;
  }

  .elementor-field-type-upload label {
    background: #6d6e71 !important;
    border-radius: 8px !important;
    color: #f5f5f5 !important;
    font-size: 18px !important;
    padding: 15px 20px !important;
    width: 100% !important;
    cursor: pointer;
    margin: 5px 0px 0px !important;
  }

  .elementor-field-type-upload label + input {
    display: none;
  }

  .elementor-field-type-upload::after {
    margin-left: 10px;
    margin-top: 5px;
  }

  .elementor-field-type-upload label::before {
    content: '';
    padding: 10px;
    background-repeat: no-repeat;
    background-position: 0px 12px;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAuNDIzMzc1IDYuMDkxNTlMNS4wMTI3MyAxLjUzMTkxQzcuMDY4NjkgLTAuNTEwNjM4IDEwLjQwMjEgLTAuNTEwNjM4IDEyLjQ1OCAxLjUzMTkxQzE0LjUxNCAzLjU3NDc1IDE0LjUxNCA2Ljg4NjQ0IDEyLjQ1OCA4LjkyOTI3TDYuNDQ4OTkgMTQuODk5NUM0Ljk3NjE1IDE2LjM2MjkgMi41ODkzNCAxNi4zNjc1IDEuMTExMDggMTQuOTA5MkMtMC4zNjI2MTEgMTMuNDU2MSAtMC4zNzE0NjggMTEuMDkxIDEuMDkxMzYgOS42MjY5OEMxLjA5NDUxIDkuNjIzODQgMy4xMDYxOSA3LjYyNTI5IDcuMTI1ODMgMy42MzE2MUM4LjAxNDY3IDIuNzQ4NDcgOS40NTU3OSAyLjc0ODQ3IDEwLjM0NDYgMy42MzE2MUMxMS4yMzM1IDQuNTE0NzQgMTEuMjMzNSA1Ljk0NjQ0IDEwLjM0NDYgNi44Mjk1OEw1Ljc1NTI4IDExLjM4OTNMNC42MjgxNiAxMC4yNjkzTDkuMjE3NTEgNS43MDk4OEM5LjQ4Mzc5IDUuNDQ1MDIgOS40ODM3OSA1LjAxNTg4IDkuMjE3NTEgNC43NTEzMUM4Ljk1MTIzIDQuNDg2NDYgOC41MTkyNCA0LjQ4NjQ2IDguMjUyNjcgNC43NTEzMUwyLjIyODIgMTAuNzM3QzEuMzc5OTMgMTEuNTg1OCAxLjM4NTA3IDEyLjk0ODEgMi4yMzM5MiAxMy43ODUyQzMuMDg5MDQgMTQuNjI4NiA0LjQ2OTU5IDE0LjYyNjEgNS4zMjE4NiAxMy43Nzk1TDExLjMzMDkgNy44MDkyOEMxMi43NjQzIDYuMzg1MDEgMTIuNzY0MyA0LjA3NTg5IDExLjMzMDkgMi42NTE2MkM5Ljg5NzIxIDEuMjI3MzUgNy41NzMyNSAxLjIyNzM1IDYuMTM5NTYgMi42NTE2MkwxLjU1MDIxIDcuMjExMjlMMC40MjMzNzUgNi4wOTE1OVoiIGZpbGw9IiNGNUY1RjUiLz4KPC9zdmc+Cg==);
  }
</style>
