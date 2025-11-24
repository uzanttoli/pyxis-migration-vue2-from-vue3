<template>
  <v-container>
    <div class="_container">
      <div class="card">
        <div class="_title">
          <div style="display: flex">
            <img src="../../../assets/img/core/smartsales.png" alt="smartsales" />
          </div>
          <div style="display: flex; align-items: center; flex-wrap: wrap">
            <v-tooltip left>
              <template v-slot:activator="{ attrs, on }">
                <a
                  href="http://10.64.175.49:4300/receptivo/index.php/api/arquivos/modelo_smart_sales/MODELO_CIDADES_SMARTSALES"
                  style="margin-right: 10px"
                  target="_blank"
                  v-bind="attrs"
                  v-on="on"
                >
                  Baixar Arquivo Modelo
                  <i class="fa-solid fa-download"></i>
                </a>
              </template>
              <div style="display: flex; flex-direction: column">
                <span>Exemplo:</span>
                <img
                  style="width: 400px"
                  src="../../../assets/img/popup/smartSales/Captura de tela 2024-01-08 140748.png"
                  alt=""
                />
              </div>
            </v-tooltip>
            <download-excel
              :data="dadosCidades"
              name="SMARTSALES_CIDADES_CADASTRADAS"
              worksheet="SMARTSALES_CIDADES_CADASTRADAS"
            >
              <button style="margin-right: 10px; background-color: #ffa500">
                Download Dados Atuais
                <i class="fa-solid fa-download"></i>
              </button>
            </download-excel>
            <button
              @click="atualizarDados"
              :disabled="dataFile == ''"
              :style="dataFile == '' ? 'background-color: #a1a1a1;' : 'background-color: #17630d;'"
            >
              Atualizar Cidades
              <i class="fa-solid fa-check"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="main-upload" @click="fileUpload">
        <input
          type="file"
          style="display: none"
          accept=".xls*;.xlsx*;.csv*;.xlsb*"
          ref="uploadFile"
          @change="handleFileUpload"
        />
        <div class="uploadData">
          <i class="fa-solid fa-cloud-arrow-up"></i>
          Realize o upload de um arquivo Excel para atualizar a lista de cidades do SmartSales aqui.
        </div>
      </div>
      <v-alert outlined type="warning" prominent border="left" class="my-3">
        <p style="margin: 0; padding: 0">
          Antes de realizar a atualização, verifique se estão todos corretos, pois os dados que
          estão vigentes antes da atualização deixam de existir sendo substituidos pelos novos.
          <strong>Todas as alterações é de sua inteira responsabilidade!</strong>
          <br />
          Recomendamos que realize o download dos dados que estão cadastrado no momento pelo botão "
          <strong>DOWNLOAD DADOS ATUAIS</strong>
          ", e siga com as demais alterações.
        </p>
      </v-alert>
      <v-card elevation="1">
        <v-data-table
          no-data-text="Nada foi anexado!"
          :headers="getHeaders"
          :items="dataFile"
          dense
          class="text-no-wrap"
        >
          <template v-slot:item.ACTION="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn v-bind="attrs" v-on="on" small icon color="red" @click="deleteItem(item)">
                  <v-icon small>fa-solid fa-trash</v-icon>
                </v-btn>
              </template>
              <span>Excluir</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </v-container>
</template>

<script>
  import * as XLSX from 'xlsx'
  import config from '../../../core/config'
  import alerts from '../../../mixins/alerts.mixins'
  import registrarMudancaSmartsales from './registrarMudancaSmartsales'
  export default {
    data: () => ({
      dataFile: [],
      dadosCidades: []
    }),
    computed: {
      getHeaders() {
        let data = this.dataFile[0]
        if (data) {
          let header = []
          header.push({
            text: 'AÇÕES',
            sortable: false,
            value: 'ACTION',
            align: 'center'
          })
          Object.keys(data).forEach(item => {
            header.push({
              text: item,
              sortable: false,
              value: item,
              align: 'center'
            })
          })
          return header
        }
        return []
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      ipMaquina() {
        return localStorage.getItem('ip')
      }
    },
    mixins: [alerts],
    methods: {
      async atualizarDados() {
        if (this.dataFile != '') {
          this.swalConfirmation(
            async () => {
              try {
                let urlData = `${config.baseUrl}api/shared/smartsales/configuracao/grupo_cidades/${this.usuarioAlmope}`
                await this.$api.post(urlData, this.dataFile)
                registrarMudancaSmartsales(
                  'CADASTRO_MASSIVO_CIDADES',
                  this.ipMaquina,
                  this.usuarioAlmope
                )
              } catch (e) {
                this.toast(
                  'Não foi possivel atualizar os dados. Por favor, verifique o modelo para upload e tente novamente!',
                  false,
                  2500,
                  'error'
                )
              }
            },
            'Deseja continuar?',
            'Você não conseguirá reverter isso!',
            'Sim, atualizar!',
            'Atualizado!',
            'Você atualizou o grupo de cidades no smartsales.'
          )
        }
      },
      fileUpload() {
        this.$refs.uploadFile.click()
      },
      handleFileUpload(e) {
        let file = e.target.files[0]
        if (file) {
          this.readFile(file)
        }
      },
      readFile(file) {
        const reader = new FileReader()
        reader.onload = event => {
          const data = event.target.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]

          const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
          this.dataFile = excelData
        }
        reader.readAsBinaryString(file)
      },
      deleteItem(item) {
        let dados = this.dataFile
        this.dataFile = dados.filter(item2 => {
          let chave = item2.DESC_AGRUPAMENTO + item2.DESC_GRUPO_CIDADE + item2.DESC_CIDADE
          return chave !== item.DESC_AGRUPAMENTO + item.DESC_GRUPO_CIDADE + item.DESC_CIDADE
        })
      },
      loadDadosCidades() {
        let urlData = `${config.baseUrl}api/shared/smartsales/configuracao/listar_cidades/`
        this.$api.get(urlData).then(res => {
          this.dadosCidades = res.data
        })
      }
    },
    created() {
      this.loadDadosCidades()
    }
  }
</script>

<style scoped>
  ._container {
    min-height: 100vh;
    width: 100%;
  }

  ._title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0 15px 0;
    border-bottom: 1px solid #d5d5d5;
  }

  ._title button {
    color: white;
    padding: 15px;
    align-items: center;
    background-color: rgb(58, 58, 198);
  }

  ._title a {
    color: white;
    padding: 15px;
    text-decoration: none;
    align-items: center;
    background-color: rgb(58, 58, 198);
  }

  ._title button i {
    color: white;
    font-size: 20px;
    margin-left: 5px;
  }

  img {
    width: 15em;
  }

  .main-upload {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 10px;
    min-height: 50px;
    background-color: #faebd7;
    cursor: pointer;
  }
  .uploadData {
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 2px;

    font-size: 18px;
  }

  .uploadData i {
    font-size: 30px;
    margin-right: 8px;
    color: #a1a1a1;
  }
</style>
