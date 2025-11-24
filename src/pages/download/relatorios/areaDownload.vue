<template>
  <!-- v-model="abrirDialogDownload" -->
  <v-dialog
    width="450"
    persistent
    :model-value="abrirDialogDownload"
    @update:modelValue="val => $emit('update:abrirDialogDownload', val)"
  >
    <v-card>
      <v-card-title style="padding: 10px">
        <div
          style="width: 100%; display: flex; align-items: center; justify-content: space-between"
        >
          <p style="text-transform: capitalize">
            Download
            <i class="fa-solid fa-right-long" style="color: #6e6e6e"></i>
            {{ convertText(relatorio.NOME_ARQUIVO_FANTASIA) }}
          </p>
          <v-btn icon @click="$emit('update:close-dialog')">
            <v-icon>fa fa-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <details>
        <summary>Informações importantes</summary>
        <ul>
          <li>Responsável: {{ relatorio.RESPONSAVEL }}</li>
          <li>Fonte: {{ relatorio.FONTE }}</li>
          <li>Operação: {{ relatorio.OPERACAO }}</li>
        </ul>
      </details>
      <div class="container_relatorios">
        <div class="dados_relatorios">
          <div v-for="(item, i) in listaRelatorios" :key="i">
            <h4>
              <i class="fa-regular fa-clock"></i>
              {{ item.PERIODO_RELATORIO }}
            </h4>
            <ul>
              <li v-for="(item2, i) in item.ITEMS" :key="'a' + i">
                <span>{{ formatedDate(item2.DATA_REFERENCIA) }}</span>
                <a @click="downloadArquivo(item2.HREF)">
                  <i class="fa-solid fa-download"></i>
                  Baixar
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </v-card>
    <loading
      textAtualizacao="Baixando..."
      :showLoading="isSend"
      :uploadPercentage="uploadPercentage"
    ></loading>
  </v-dialog>
</template>

<script>
  import config from '../../../core/config'
  import loading from './loading.vue'
  import axios from 'axios'
  export default {
    components: { loading },
    props: {
      abrirDialogDownload: {
        type: Boolean,
        default: false
      },
      relatorio: {
        type: [Array, Object]
      }
    },
    data: () => ({
      listaRelatorios: [],
      isSend: false,
      uploadPercentage: 0
    }),
    computed: {},
    methods: {
      async downloadArquivo(arquivo) {
        try {
          this.isSend = true
          const response = await axios.get(arquivo, {
            // headers:{
            //   'Authorization': `Bearer ${localStorage.getItem('token')}`
            // },
            responseType: 'blob',
            onDownloadProgress: progressEvent => {
              const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
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
        } catch (error) {
          console.error('Erro durante o download:', error)
          this.isSend = false
        }
      },
      formatedDate(string) {
        if (!string) return
        return string.split('-').reverse().join('/')
      },
      loadListaDownload() {
        let urlData = `${config.baseUrl}api/shared/relatorios/arquivos/downloads/${this.relatorio.ID}`
        this.$api.get(urlData).then(res => {
          this.listaRelatorios = res.data
        })
      },
      convertText(string) {
        if (!string) return
        return string.replace(/_/g, ' ').toLowerCase()
      }
    },
    watch: {
      abrirDialogDownload: function (oldVal, newVal) {
        if (oldVal != newVal) {
          this.loadListaDownload()
        }
      }
    }
  }
</script>

<style scoped>
  p {
    padding: 0;
    margin: 0;
  }
  .container_relatorios {
    display: flex;
    justify-content: center;
  }

  .dados_relatorios {
    margin: 10px;
    padding: 5px;
    width: 290px;
  }

  h4 {
    color: #5c5c5c;
  }

  h4 i {
    margin-right: 7px;
  }

  span {
    font-weight: 600;
    font-size: 15px;
  }

  .border {
    background-color: #a8a8a8;
    width: 1px;
    height: 20px;
  }

  ul li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    margin: 2px;
  }

  a {
    background-color: #2e7d32;
    color: #fff;
    border-radius: 5px;
    padding: 5px;
    width: 95px;
    text-align: center;
    text-decoration: none;

    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  details summary {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
    color: #fff;
    font-weight: bold;
    padding: 4px;
    cursor: pointer;
  }

  details ul {
    list-style-type: square;
    margin: 10px 0;
    padding-left: 20px;
  }

  details ul li {
    font-size: 13px;
  }

  details[open] {
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    margin-bottom: 10px;
  }
</style>
