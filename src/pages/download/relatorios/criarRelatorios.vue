<template>
  <div class="container-criar-relatorio">
    <div class="section-criar-relatorio" id="section-criar-relatorio">
      <h2 style="color: #575757">
        <v-icon color="green" class="mr-2">fa-solid fa-sliders</v-icon>
        Criar Relatório
      </h2>
      <v-divider></v-divider>
      <div class="campo-preen mt-3">
        <v-row>
          <v-col cols="4" class="mb-n7">
            <v-autocomplete
              outlined
              dense
              placeholder="Produto"
              label="Produto"
              no-data-text="Não há informações"
              :items="produtos"
              item-text="PRODUTO"
              v-model="formRelatorio.produtos"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index === 0" small>{{ item.PRODUTO }}</v-chip>
                <span v-if="index === 1" class="grey--text text-caption">
                  (+{{ formRelatorio.produtos.length - 1 }}
                  outros)
                </span>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="4" class="mb-n7">
            <v-autocomplete
              outlined
              dense
              placeholder="Operação"
              label="Operação"
              no-data-text="Não há informações"
              :items="operacoes"
              item-text="OPERACAO"
              multiple
              v-model="formRelatorio.operacoes"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index === 0" small>{{ item.OPERACAO }}</v-chip>
                <span v-if="index === 1" class="grey--text text-caption">
                  (+{{ formRelatorio.operacoes.length - 1 }}
                  outros)
                </span>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="4" class="mb-n7">
            <v-autocomplete
              outlined
              dense
              placeholder="Perfil Liberação"
              label="Perfil Liberação"
              no-data-text="Não há informações"
              :items="tipoPerfil"
              item-text="TIPO_PERFIL"
              multiple
              v-model="formRelatorio.perfilLiberacao"
            >
              <template v-slot:selection="{ item, index }">
                <v-chip v-if="index === 0" small>{{ item.TIPO_PERFIL }}</v-chip>
                <span v-if="index === 1" class="grey--text text-caption">
                  (+{{ formRelatorio.perfilLiberacao.length - 1 }}
                  outros)
                </span>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="3" sm="6" class="mb-n7">
            <v-text-field
              outlined
              dense
              placeholder="Nome do Arquivo"
              label="Nome do Arquivo"
              v-model="formRelatorio.nomeArquivo"
            ></v-text-field>
          </v-col>
          <v-col cols="3" sm="6" class="mb-n7">
            <v-autocomplete
              outlined
              dense
              placeholder="Tipo Arquivo"
              label="Tipo Arquivo"
              no-data-text="Não há informações"
              v-model="formRelatorio.tipoArquivo"
              :items="['RELATORIO', 'ARQUIVO UPLOAD']"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3" sm="6" class="mb-n7">
            <v-autocomplete
              outlined
              dense
              placeholder="Extensão do Arquivo"
              label="Extensão do Arquivo"
              no-data-text="Não há informações"
              :items="tiposArquivos"
              item-text="FORMATO_ARQUIVO"
              v-model="formRelatorio.extensaoArquivo"
            ></v-autocomplete>
          </v-col>
          <v-col cols="3" sm="6" class="mb-n7">
            <v-autocomplete
              outlined
              dense
              placeholder="Fonte"
              label="Fonte do Relatório"
              no-data-text="Não há informações"
              v-model="formRelatorio.fonte"
              :items="['CCO', 'QUALIDADE']"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </div>
      <div style="position: absolute; bottom: 20px; left: 20px">
        <v-btn
          elevation="0"
          color="success"
          @click="criarRelatorio"
          :disabled="!this.formIsValid()"
          class="mr-2"
        >
          Criar
        </v-btn>
        <v-btn elevation="0" color="error" @click="clearForm">Limpar</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import config from '../../../core/config'
  import alerts from '../../../mixins/alerts.mixins'

  export default {
    mixins: [alerts],
    data: () => ({
      produtos: [],
      operacoes: [],
      tiposArquivos: [],
      tipoPerfil: [],
      formRelatorio: {
        produtos: null,
        operacoes: null,
        nomeArquivo: null,
        extensaoArquivo: null,
        perfilLiberacao: null,
        fonte: null,
        tipoArquivo: null
      },
      nomeArquivo: null,
      fileArquive: null,
      nameFileArquive: null
    }),

    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      nomeArquivoToUpperCase() {
        let text = this.formRelatorio.nomeArquivo
        return text?.toUpperCase().split(' ').join('_')
      }
    },
    mounted() {},
    methods: {
      arrayToString(array, separator) {
        if (!array) return
        let mapArray = array.map(e => e)
        return mapArray.join(separator)
      },
      async criarRelatorio() {
        try {
          const { formRelatorio, nomeArquivoToUpperCase, usuarioAlmope } = this

          const data = {
            //TODO retirar
            produtos: formRelatorio.produtos,
            operacoes: this.arrayToString(formRelatorio.operacoes),
            nomeArquivo: nomeArquivoToUpperCase,
            extensaoArquivo: formRelatorio.extensaoArquivo,
            fonte: formRelatorio.fonte,
            perfilLiberacao: this.arrayToString(formRelatorio.perfilLiberacao),
            tipoArquivo: formRelatorio.tipoArquivo,
            destino: 'http://10.64.175.49:4300/receptivo/index.php/api/arquivos/get_arquivos/',
            usuarioAlmope
          }

          const urlData = `${config.baseUrl}api/shared/relatorios/acoes/create`

          await this.$api.post(urlData, data)

          this.$emit('update-create-report')
          this.toast('Relatório criado com sucesso!', 'top-right', false, 3500, 'success')

          this.clearForm()
        } catch (error) {
          console.error('Erro ao criar relatório:', error)
          this.toast(
            'Erro ao criar relatório. Verifique as informações e tente novamente!',
            'top-right',
            false,
            3500,
            'error'
          )
        }
      },
      clearForm() {
        let newData = Object.assign({}, this.formRelatorio)
        Object.keys(newData).forEach(item => {
          newData[item] = null
        })
        this.formRelatorio = newData
      },
      formIsValid() {
        for (var key in this.formRelatorio) {
          if (this.formRelatorio[key] === null || this.formRelatorio[key] === '') {
            return false
          }
        }
        return true
      },
      loadProdutos() {
        let urlData = `${config.baseUrl}api/shared/pyxis/produtos`
        this.$api.get(urlData).then(res => {
          this.produtos = res.data
        })
      },
      loadOperacoes() {
        let urlData = `${config.baseUrl}api/shared/pyxis/operacoes`
        this.$api.get(urlData).then(res => {
          this.operacoes = res.data
        })
      },
      loadTipoArquivo() {
        let urlData = `${config.baseUrl}api/shared/relatorios/arquivos/tipos`
        this.$api.get(urlData).then(res => {
          this.tiposArquivos = res.data
        })
      },
      loadTipoPerfil() {
        let urlData = `${config.baseUrl}api/shared/admin/painel/listar_tipo_perfil/`
        this.$api.get(urlData).then(res => {
          this.tipoPerfil = res.data
        })
      }
    },
    created() {
      this.loadProdutos()
      this.loadOperacoes()
      this.loadTipoArquivo()
      this.loadTipoPerfil()
    }
  }
</script>

<style scoped>
  .container-criar-relatorio {
    display: flex;
    place-items: center;
    justify-content: center;
    min-width: 500px;
    border-radius: 15px;
    overflow: auto;
    /* height: 100vh; */
    height: 100%;
    /* box-shadow: 0px 5px 10px -3px rgba(0, 0, 0, 0.1); */
  }

  h2 {
    padding: 10px;
  }

  .section-criar-relatorio {
    width: 40vw;
    border: 1px solid #949494;
    height: 100%;
    border-radius: 15px;
    padding: 10px;
    position: relative;
    min-height: 300px;
  }

  .campo-preen {
    padding: 5px;
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }

  .input {
    background-color: #f7f7f7;
    padding: 10px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .input i {
    font-size: 40px;
    color: #949494;
  }

  p {
    margin: 0;
    font-weight: 600;
    letter-spacing: 2px;
    color: #949494;
  }

  .arquivo-anexado {
    padding: 10px;
    border-radius: 15px;

    gap: 5px;
    display: flex;
    align-items: center;
  }

  .arquivo-anexado i {
    font-size: 18px;
    color: #037909;
  }

  .btn {
    margin: 10px;
    margin-bottom: -500px !important;
  }
</style>
