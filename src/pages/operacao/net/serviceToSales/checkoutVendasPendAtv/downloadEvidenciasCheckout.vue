<template>
  <v-container class="mt-3" fluid>
    <v-card style="position: relative">
      <v-card-title style="display: flex; justify-content: space-between">
        Download de arquivos
        <div>
          <v-btn icon to="/pyxis/service-to-sales/checkout-vendas-pend-atv">
            <v-icon>fa-solid fa-arrow-left</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-divider class="mb-4"></v-divider>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <v-col>
          <v-alert
            max-width="600"
            color="#2A3B4D"
            dark
            border="left"
            icon="fa-solid fa-triangle-exclamation"
            dense
          >
            Limite mínimo de
            <strong style="color: #2cb314">2</strong>
            e máximo de
            <strong style="color: #c45708">20</strong>
            items para downloads em massa.
          </v-alert>
        </v-col>
        <div>
          <v-btn
            style="margin-right: 10px; margin-top: 10px; margin-bottom: 20px"
            class="rounded-r-xl rounded-bl-xl"
            color="success"
            @click="downloadItemsSelected"
            :disabled="selected.length <= 1"
          >
            <span class="mr-2">Baixar arquivos</span>
            <v-icon>fa-solid fa-list-check</v-icon>
          </v-btn>
          <v-btn
            class="rounded-l-xl"
            tile
            disabled
            depressed
            style="margin-right: 0px; margin-top: 10px; margin-bottom: 20px"
          >
            <v-icon>fa-solid fa-gear</v-icon>
          </v-btn>
        </div>
      </div>
      <div style="width: 400px">
        <v-col>
          <v-select
            outlined
            dense
            placeholder="Filtrar por tabulador"
            label="Filtrar por tabulador"
            :items="['VALIDAÇÃO ATIVAÇÃO', 'VENDA NÃO LOCALIZADA', 'VALIDAÇÃO GROSS', '']"
            v-model="search"
          ></v-select>
        </v-col>
      </div>
      <v-data-table
        v-model="selected"
        :headers="arrHeaders"
        :items="arrDados"
        no-data-text="Não há arquivos para downloads..."
        item-key="NUM_CASO"
        show-select
        :search="search"
        :items-per-page="20"
      >
        <template v-slot:item.IMAGE_ARQUIVO="{ item }">
          <img
            height="50"
            src="../../../../../assets/img/geral/pasta-de-arquivo-zip.png"
            :alt="item.IMAGE_ARQUIVO"
          />
        </template>
        <template v-slot:item.DOWNLOAD_ITEM="{ item }">
          <v-btn
            icon
            small
            color="success"
            @click="
              downloadArquivo(
                `http://10.64.175.49:4300/receptivo/index.php/api/checkout_vendas_pend_atv/imagem/download/${gerarNomeArquivo(
                  item.NUM_CASO,
                  formatedString('text', item.DSC_MUNICIPIO_BI),
                  item.NUM_CONTRATO,
                  formatedString('data', item.DATA_VENDA_BRUTA)
                )}.zip`
              )
            "
          >
            <v-icon small>fa-solid fa-download</v-icon>
          </v-btn>
        </template>
        <template v-slot:item.NOME_ARQUIVO="{ item }">
          <span style="font-weight: 600">
            {{
              gerarNomeArquivo(
                item.NUM_CASO,
                formatedString('text', item.DSC_MUNICIPIO_BI),
                item.NUM_CONTRATO,
                formatedString('data', item.DATA_VENDA_BRUTA)
              )
            }}
          </span>
        </template>
        <template v-slot:item.DATA_VENDA_BRUTA="{ item }">
          {{ item.DATA_VENDA_BRUTA.split('-').reverse().join('/') }}
        </template>
      </v-data-table>
    </v-card>
    <loading
      :showLoading="isSend"
      textAtualizacao="Baixando..."
      :uploadPercentage="uploadPercentage"
    ></loading>
  </v-container>
</template>

<script>
  import config from '../../../../../core/config'
  import axios from 'axios'
  import loading from '../../../../download/relatorios/loading.vue'
  import alerts from '../../../../../mixins/alerts.mixins'
  export default {
    components: { loading },
    data: () => ({
      arrHeaders: [
        {
          text: '',
          value: 'IMAGE_ARQUIVO',
          align: 'center'
        },
        {
          text: 'Nª Caso | Município | Contrato | Data Venda',
          value: 'NOME_ARQUIVO',
          align: 'start'
        },
        {
          text: 'Nª Caso',
          value: 'NUM_CASO',
          align: 'center'
        },
        {
          text: 'Tabulador',
          value: 'BASE',
          align: 'center'
        },
        {
          text: 'Município',
          value: 'DSC_MUNICIPIO_BI',
          align: 'center'
        },
        {
          text: 'Contrato',
          value: 'NUM_CONTRATO',
          align: 'center'
        },
        {
          text: 'Data Venda Bruta',
          value: 'DATA_VENDA_BRUTA',
          align: 'center'
        },
        {
          text: 'Almope Checkout',
          value: 'ALMOPE_CHECK',
          align: 'center'
        },

        {
          text: 'Data Checkout',
          value: 'DATA_CHECK',
          align: 'center'
        },
        {
          text: 'Baixar',
          value: 'DOWNLOAD_ITEM',
          align: 'center'
        }
      ],
      selected: [],
      arrDados: [],
      uploadPercentage: 0,
      singleSelect: false,
      isSend: false,
      search: null
    }),
    mixins: [alerts],
    methods: {
      downloadItemsSelected() {
        let items = this.selected
        if (!items) return
        if (items.length > 20) {
          this.toast(
            'Para continuar selecione apenas 20 arquivos!',
            'top-right',
            false,
            3000,
            'error'
          )
        } else {
          for (const key of items) {
            this.downloadArquivo(
              this.linkDownload(
                this.gerarNomeArquivo(
                  key.NUM_CASO,
                  this.formatedString('text', key.DSC_MUNICIPIO_BI),
                  key.NUM_CONTRATO,
                  this.formatedString('data', key.DATA_VENDA_BRUTA)
                )
              )
            )
          }
        }
      },
      gerarNomeArquivo(text1, text2, text3, text4) {
        return text1 + '_' + text2 + '_' + text3 + '_' + text4
      },
      formatedString(type, string) {
        if (!string) return
        if (type == 'data') {
          return string.split('-').reverse().join('')
        } else if (type == 'text') {
          return string.split(' ').join('_')
        }
      },
      loadListaDownloadZip() {
        let urlData = `${config.baseUrl}api/shared/service_to_sales/validacao_venda/download_evidencia`
        this.$api.get(urlData).then(res => {
          this.arrDados = res.data
        })
      },
      async downloadArquivo(arquivo) {
        try {
          this.isSend = true
          const response = await axios.get(arquivo, {
            responseType: 'blob',
            onDownloadProgress: processEvent => {
              const percentage = Math.round((processEvent.loaded * 100) / processEvent.total)
              this.uploadPercentage = percentage
            }
          })
          const blob = new Blob([response.data])
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = arquivo.split('/').pop()
          link.click()

          window.URL.revokeObjectURL(url)
          this.isSend = false
        } catch (e) {
          console.error('Erro durante o download:', e)
          this.isSend = false
        }
      },
      linkDownload(nomeArquivo) {
        return `http://10.64.175.49:4300/receptivo/index.php/api/checkout_vendas_pend_atv/imagem/download/${nomeArquivo}.zip`
      }
    },
    created() {
      this.loadListaDownloadZip()
    }
  }
</script>

<style></style>
