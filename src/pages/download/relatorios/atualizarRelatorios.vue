<template>
  <div class="container-criar-relatorio">
    <div class="section-criar-relatorio">
      <h2 style="color: #575757">
        <v-icon color="green" class="mr-2">fa-solid fa-sliders</v-icon>
        Atualizar Relatório
        <v-alert dense outlined type="error" class="mt-3">
          O arquivo que será upado deve conter até 70MB!
        </v-alert>
      </h2>
      <v-divider></v-divider>
      <v-alert v-if="msgErro.status" text :type="msgErro.type" icon="mdi-cloud-alert">
        {{ msgErro.msg }}
      </v-alert>
      <div class="campo-preen mt-3">
        <v-autocomplete
          outlined
          dense
          placeholder="Qual produto?"
          label="Qual produto?"
          no-data-text="Não há informações"
          :items="produtoRelatorio"
          item-text="text"
          item-value="text"
          v-model="produtoRelatorioSelecionado"
        ></v-autocomplete>
        <v-autocomplete
          outlined
          dense
          placeholder="Qual arquivo gostaria de atualizar?"
          label="Qual arquivo gostaria de atualizar?"
          no-data-text="Primeiro selecione o produto..."
          :items="relatorioPorProduto"
          item-text="NOME_ARQUIVO_FANTASIA"
          item-value="ID"
          v-model="relatorioSelecionado"
        ></v-autocomplete>
        <v-menu
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-on="on"
              v-bind="attrs"
              dense
              readonly
              outlined
              placeholder="DD/MM/AAAA"
              label="Data da Parcial (Atualização)"
              v-model="dateFormated"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dataParcial"
            no-title
            @input="menu1 = false"
            locale="pt"
          ></v-date-picker>
        </v-menu>
        <v-text-field
          outlined
          dense
          readonly
          disabled
          placeholder="Extensão cadastrada"
          label="Extensão cadastrada"
          v-model="relatorioExtensao"
        ></v-text-field>
        <v-text-field
          outlined
          dense
          readonly
          disabled
          placeholder="Tipo de arquivo"
          label="Tipo de arquivo"
          v-model="tipoArquivo"
        ></v-text-field>
      </div>
      <div>
        <input type="file" style="display: none" ref="inputFileUpload" @change="dadosFile" />
        <div class="input" @click="openInput">
          <i class="fa-solid fa-cloud-arrow-up"></i>
          <p>{{ fileArquive != null ? 'Substituir' : 'Upload do' }} arquivo</p>
        </div>
        <div class="arquivo-anexado" v-if="fileArquive != null">
          <i class="fa-solid fa-circle-check"></i>
          <p>Arquivo anexado: {{ nameFileArquive }}</p>
        </div>
      </div>
      <div class="btn">
        <v-btn
          elevation="0"
          color="success"
          class="mr-2"
          @click="uploadArquivo"
          :disabled="!this.formIsValid()"
          :loading="isSend"
        >
          Atualizar
        </v-btn>
        <v-btn elevation="0" color="error" @click="clearForm">Limpar</v-btn>
      </div>
      <loading
        textAtualizacao="Atualizando..."
        :showLoading="isSend"
        :uploadPercentage="uploadPercentage"
      ></loading>
    </div>
  </div>
</template>

<script>
  import config from '../../../core/config'
  // import axios from 'axios'
  import { FileUploadService } from './FileUploadService.js'
  import masks from '../../../shared/masks/masks'
  import alerts from '../../../mixins/alerts.mixins'
  import loading from './loading.vue'
  import Utils from '@/data/services/common/Utils'
  export default {
    components: { loading },
    props: {
      reportCreated: {
        type: Boolean,
        default: false
      }
    },
    mixins: [alerts],
    data: () => ({
      relatorios: [],
      produtoRelatorio: [],
      msgErro: {},
      nomeArquivo: null,
      fileArquive: null,
      nameFileArquive: null,
      relatorioSelecionado: null,
      produtoRelatorioSelecionado: null,
      dataParcial: null,
      isSend: false,
      uploadPercentage: 0,
      menu1: false
    }),
    computed: {
      relatorioPorProduto() {
        return this.relatorios.filter(relatorio => {
          return relatorio.PRODUTO == this.produtoRelatorioSelecionado
        })
      },
      dateFormated() {
        return this.formatedDate(this.dataParcial)
      },
      masks() {
        return masks
      },
      usuario() {
        return this.$store.getters.usuario
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      relatorioExtensao() {
        let data = this.relatorios
        let rel = data.filter(item => {
          return item.ID == this.relatorioSelecionado
        })
        return rel[0]?.EXTENSAO ?? ''
      },
      nomeArquivoToUpperCase() {
        let text = this.nomeArquivo
        return text?.toUpperCase().split(' ').join('_')
      },
      tipoPerfil() {
        return this.$store.getters.usuario.filtro
      },
      almope() {
        return this.$store.getters.usuario.almope
      },
      tipoArquivo() {
        let data = this.relatorios
        let rel = data.filter(item => {
          return item.ID == this.relatorioSelecionado
        })
        return rel[0]?.TIPO_ARQUIVO ?? ''
      },
      dadosRelatorioSelecionado() {
        let relatorios = this.relatorios
        return relatorios
          .filter(item => {
            return item.ID == this.relatorioSelecionado
          })
          .map(n => {
            return {
              id: n.ID,
              nomeArquivo: n.NOME_ARQUIVO_FANTASIA,
              extensao: n.EXTENSAO
            }
          })
      },
      produto() {
        return this.$store.getters.usuario.produto
      }
    },
    methods: {
      async loadDataService() {
        this.produtoRelatorio = await Utils.getProductAvailable(
          'RELATORIO',
          this.usuario.filtro,
          this.usuario.almope
        )
      },
      formatedDate(date) {
        if (!date) return

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      extensaoValida(file, extensaoOriginal) {
        if (!file && !extensaoOriginal) return false
        let extensaoArquivo = file.name.split('.').pop()
        if (extensaoArquivo == extensaoOriginal.replace(/./, '')) {
          return true
        }
        return false
      },
      validarData(dataString) {
        const regexData = /^\d{2}\/\d{2}\/\d{4}$/
        if (!regexData.test(dataString)) {
          return false
        }

        let dataParse = dataString.split('/')
        const dia = parseInt(dataParse[0], 10)
        const mes = parseInt(dataParse[1], 10) - 1
        const ano = parseInt(dataParse[2], 10)

        const date = new Date(ano, mes, dia)

        return date.getFullYear() === ano && date.getMonth() == mes && date.getDate() == dia
      },
      openInput() {
        this.$refs.inputFileUpload.click()
      },
      dadosFile(event) {
        this.fileArquive = event.target.files[0]
        this.nameFileArquive = event.target.files[0].name
      },
      async salvarDadosArquivo() {
        try {
          let data = {
            idRelatorio: this.dadosRelatorioSelecionado[0].id,
            dataParcial: this.dateFormated,
            usuarioAlmope: this.usuarioAlmope
          }
          let urlData = `${config.baseUrl}api/shared/relatorios/acoes/create_rel_historico`
          await this.$api.post(urlData, data)
        } catch (e) {
          console.error(e)
        }
      },
      async uploadArquivo() {
        if (!this.extensaoValida(this.fileArquive, this.relatorioExtensao)) {
          this.msgErro = {
            msg: 'A extensão do arquivo precisa ser igual a cadastrada!',
            type: 'error',
            status: 1
          }
          return
        }

        this.isSend = true
        this.msgErro = {}

        const relatorioData = {
          dateFormated: this.dateFormated,
          dadosRelatorioSelecionado: this.dadosRelatorioSelecionado,
          produtoRelatorioSelecionado: this.produtoRelatorioSelecionado
        }

        const callbacks = {
          onProgress: percentage => {
            this.uploadPercentage = percentage
          },
          onSuccess: async results => {
            const tudoCerto = results.every(r => r.status === 'fulfilled')

            if (tudoCerto) {
              await this.salvarDadosArquivo()
              this.toast('Atualização concluída com sucesso!', 'top-right', false, 3000, 'success')
              this.clearForm()
            } else {
              console.error('Um ou mais uploads falharam:', results)
              this.toast(
                'Ops! Não conseguimos atualizar o relatório. Tente novamente!',
                'top-right',
                false,
                3000,
                'error'
              )
            }
            this.isSend = false
          },
          onError: error => {
            console.error('Erro crítico no processo de upload:', error)
            this.toast(
              'Ops! Não conseguimos atualizar o relatório. Tente novamente!',
              'top-right',
              false,
              3000,
              'error'
            )
            this.isSend = false
          }
        }

        const uploader = new FileUploadService(this.fileArquive, relatorioData, callbacks)
        await uploader.executeUpload()
      },
      formIsValid() {
        return (
          this.produtoRelatorioSelecionado &&
          this.relatorioSelecionado &&
          this.dataParcial &&
          this.fileArquive
        )
      },
      clearForm() {
        this.relatorioSelecionado = null
        this.dataParcial = null
        this.fileArquive = null
        this.nameFileArquive = null
        this.produtoRelatorioSelecionado = null
      },
      async loadRelatorios() {
        if (
          this.produtoRelatorio.length == 0 ||
          !this.produtoRelatorio.map(produto => produto.text).includes(this.usuario?.produto)
        ) {
          this.produtoRelatorio = [
            {
              IdProduto: null,
              text: this.usuario?.produto,
              ORDEM_PRODUTO: 1
            },
            ...this.produtoRelatorio
          ]
        }
        let urlData = `${config.baseUrl}api/shared/portal_cco/relatorios/listar_relatorios_gerenciar`
        const response = await this.$api.get(urlData, {
          params: {
            tipoPerfil: this.tipoPerfil,
            almope: this.almope
          }
        })
        this.relatorios = response.data
      }
    },
    async created() {
      await this.loadDataService()
      await this.loadRelatorios()
    },
    watch: {
      reportCreated() {
        this.loadRelatorios()
      }
    }
  }
</script>

<style scoped>
  .container-criar-relatorio {
    display: flex;
    place-items: center;
    justify-content: center;
    height: 100%;
    min-width: 500px;
    overflow: auto;
    border-radius: 15px;
    /* box-shadow: 0px 5px 10px -3px rgba(0, 0, 0, 0.1); */
  }

  h2 {
    padding: 10px;
  }

  .section-criar-relatorio {
    width: 40vw;
    border: 1px solid #949494;
    border-radius: 15px;
    height: 100%;
    padding: 10px;
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
  }
</style>
