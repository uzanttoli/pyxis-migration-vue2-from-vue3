<template>
  <v-container>
    <div class="_container">
      <div class="card">
        <div class="_title">
          <div style="display: flex">
            <img src="../../../assets/img/core/smartsales.png" alt="smartsales" />
          </div>
          <div style="display: flex; align-items: center; flex-wrap: wrap">
            <a
              style="margin-right: 10px"
              href="http://10.64.175.49:4300/receptivo/index.php/api/arquivos/modelo_smart_sales/MODELO_UPLOAD_SMARTSALES"
              target="_blank"
            >
              Baixar Arquivo Modelo
              <i class="fa-solid fa-download"></i>
            </a>
            <download-excel
              :data="dadosCadastrados"
              name="SMARTSALES_DADOS_CADASTRADOS"
              worksheet="SMARTSALES_DADOS_CADASTRADOS"
            >
              <button style="margin-right: 10px; background-color: #ffa500">
                Download Dados Atuais
                <i class="fa-solid fa-download"></i>
              </button>
            </download-excel>
            <button
              :style="dataFile == '' ? ' background-color: #a1a1a1;' : 'background-color: #17630d;'"
              @click="atualizarDados"
              :disabled="dataFile == ''"
            >
              Atualizar Smartsales
              <i class="fa-solid fa-check"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="main-upload" @click="fileUpload">
        <input
          type="file"
          accept=".xls*;.xlsx*;.csv*;.xlsb*"
          @change="handleFileUpload"
          style="display: none"
          ref="uploadFile"
        />
        <div class="uploadData">
          <i class="fa-solid fa-cloud-arrow-up"></i>
          Realize o upload de um arquivo Excel para atualizar os dados do SmartSales
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
          :headers="getHeaders"
          no-data-text="Nada foi anexado!"
          :items="dataFile"
          class="text-no-wrap"
          :fixed-header="true"
          dense
        >
          <template v-slot:item.ACTION="{ item }">
            <v-btn small icon color="red" @click="deleteItem(item)">
              <v-icon small>fa-solid fa-trash</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </div>
  </v-container>
</template>

<script>
  import * as XLSX from 'xlsx/xlsx.mjs'
  import config from '../../../core/config'
  import alerts from '../../../mixins/alerts.mixins'
  import registrarMudancaSmartsales from './registrarMudancaSmartsales'
  export default {
    data: () => ({
      dataFile: [],
      dadosCadastrados: []
    }),
    mixins: [alerts],
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
    methods: {
      loadDadosCadastrados() {
        let urlData = `${config.baseUrl}api/shared/smartsales/configuracao/list_dados_smartsales/`
        this.$api.get(urlData).then(res => {
          this.dadosCadastrados = res.data
        })
      },
      modeloUpload() {
        return 'http://10.64.175.49:4300/receptivo/index.php/api/arquivos/modelo_smart_sales/'
      },
      deleteItem(item) {
        let dados = this.dataFile
        this.dataFile = dados.filter(item2 => {
          let chave =
            item2.DESC_AGRUPAMENTO +
            item2.DESC_FLAG_OFERTA +
            item2.DESC_GRUPO_CIDADE +
            item2.ID_VEND_PRODUTO +
            item2.DESC_PLANO +
            item2.VALOR_PLANO
          return (
            chave !==
            item.DESC_AGRUPAMENTO +
              item.DESC_FLAG_OFERTA +
              item.DESC_GRUPO_CIDADE +
              item.ID_VEND_PRODUTO +
              item.DESC_PLANO +
              item.VALOR_PLANO
          )
        })
      },
      async atualizarDados() {
        try {
          if (this.dataFile != '') {
            this.swalConfirmation(
              async () => {
                try {
                  let urlData = `${config.baseUrl}api/shared/smartsales/configuracao/list_products/${this.usuarioAlmope}`
                  await this.$api.post(urlData, this.dataFile)
                  registrarMudancaSmartsales(
                    'CADASTRO_MASSIVO_PLANOS',
                    this.ipMaquina,
                    this.usuarioAlmope
                  )
                } catch (error) {
                  this.toast(
                    'Não foi possivel atualizar os dados, por favor verifique se o modelo da planilha está atualizada e tente novamente.',
                    'top-right',
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
              'Você atualizou as ofertas do smartsales.'
            )
          }
        } catch (error) {
          console.error(error)
        }
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
      fileUpload() {
        let input = this.$refs.uploadFile.click()
        return input
      }
    },
    created() {
      this.loadDadosCadastrados()
    }
  }
</script>

<style scoped>
  ._container {
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

  .table {
    height: 60vh;
    overflow: auto;
  }

  img {
    width: 15em;
  }
</style>
