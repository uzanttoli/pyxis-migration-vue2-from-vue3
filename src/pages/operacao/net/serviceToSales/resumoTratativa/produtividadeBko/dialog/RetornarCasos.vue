<template>
  <!-- v-model="openRetornarCasos" -->
  <v-dialog
    persistent
    :model-value="openRetornarCasos"
    @update:modelValue="val => $emit('update:openRetornarCasos', val)"
  >
    <v-card tile>
      <v-card-title>
        Gerenciador de casos |
        <span style="font-style: italic; margin-left: 10px; color: #605d5da1">
          Atualize Casos Sobre Demanda
        </span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('update:closeRetornarCasos')">
          <v-icon>fas fa-xmark</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card elevation="0" tile max-height="80vh" class="overflow-auto">
        <v-col class="mt-3">
          <div class="caixa">
            <h1 class="titulo color-red">Informações Importante</h1>
            <div class="mt-3">
              <ol>
                <li>
                  Baixe a base
                  <strong>
                    <a href="/pyxis/bases-download/" target="_blank">CONTROLE BKO ATIVACAO S2S</a>
                  </strong>
                  ;
                </li>
                <li>Filtre quais vendas devem voltar para a fila de tratativa;</li>
                <li>
                  Copie a coluna
                  <strong><mark>ID_MAILING</mark></strong>
                  e cole no
                  <!-- :href="`${process.env.PYXIS_API_CHAT}/arquivos/modelo/MODELO_ATT_CASOS.xlsx`" -->
                  <a href="`/arquivos/modelo/MODELO_ATT_CASOS.xlsx`"><strong>modelo</strong></a>
                  junto da data retorno (Data agendada do retorno dos casos);
                </li>
                <li>
                  Copie os dados das colunas `ID_MAILING` e cole no bloco
                  <strong><mark>Dados p/ atualizar</mark></strong>
                  em seguida clique para atualizar;
                </li>
              </ol>
            </div>
          </div>
        </v-col>
        <v-col class="mt-3">
          <div class="caixa">
            <h1 class="titulo">Validações</h1>
            <v-checkbox
              disabled
              v-model="selected"
              label="Validar se existe `ID_MAILING` antes de qualquer alteração?"
            ></v-checkbox>
          </div>
        </v-col>
        <v-col>
          <div class="caixa">
            <h1 class="titulo">Dados p/ atualizar</h1>
            <div class="textarea-container">
              <v-textarea
                outlined
                class="mx-2 mt-5"
                autofocus
                placeholder="Insira os dados para atualizar!"
                v-model="arrCasos"
              ></v-textarea>
              <v-row justify="end">
                <v-btn
                  :disabled="arrCasos == null || arrCasos == ''"
                  @click="processData"
                  class="rounded-bl-xl rounded-r-xl mb-3 mr-5"
                  color="primary"
                  :loading="loading"
                >
                  <v-icon small class="mr-2">fa-solid fa-highlighter</v-icon>
                  Atualizar
                </v-btn>
              </v-row>
            </div>
            <!-- <div class="table-container">
              <v-row>
                <table-two-column
                  :cols="6"
                  :data="dataTreat"
                  title="🔎 Preview Dos Dados"
                  namePlan="DOWNLOAD_BASE_ATT_CASOS_PYXIS"
                ></table-two-column>
                <table-two-column
                  :cols="6"
                  :data="dataInvalid"
                  title="🚦 Status da Atualização"
                  namePlan="DOWNLOAD_BASE_ATT_CASOS_PYXIS"
                ></table-two-column>
              </v-row>
            </div> -->
          </div>
        </v-col>
        <v-col>
          <div class="caixa">
            <h1 class="titulo">Histórico</h1>
            <v-row>
              <v-col>
                <tabela-list-movimentacoes
                  @update:emitirID="idImport"
                  :atualizarHistorico="atualizarHistoricoMovimentacoes"
                ></tabela-list-movimentacoes>
              </v-col>
              <v-col v-if="idImportConsiderar">
                <list :idImport="idImportConsiderar" transition="scale-transition"></list>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-card>
      <!-- <loadhastag
        :activeMsg="true"
        msg="Estamos processando seus dados, aguarde!"
        :envioDados="loading"
      ></loadhastag> -->
    </v-card>
  </v-dialog>
</template>

<script>
  // import loadhastag from "@/shared/components/load/loadhastag.vue";
  import config from '@/core/config'
  // import tableTwoColumn from "../table/tableTwoColumn.vue";
  import tabelaListMovimentacoes from '../table/tabelaListMovimentacoes.vue'
  import List from '../listDetalheMovimentacoes.vue'
  import alerts from '@/mixins/alerts.mixins'
  export default {
    components: { tabelaListMovimentacoes, List },
    props: {
      openRetornarCasos: {
        type: Boolean,
        default: false
      }
    },
    mixins: [alerts],
    data: () => ({
      arrCasos: null,
      dataTreat: [],
      dataInvalid: [],
      selected: true,
      itemsPerPage: 10, // número de itens por página
      currentPage: 1, // página atual
      idImportConsiderar: null,
      loading: null,
      atualizarHistoricoMovimentacoes: false
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      ipMaquina() {
        return localStorage.getItem('ip')
      },
      hashImport() {
        return this.generateHashImport()
      }
    },
    methods: {
      idImport(e) {
        this.idImportConsiderar = e
      },
      generateHashImport() {
        const date = new Date()
        return `IMPORT_${date.getTime().toString()}`
      },
      dateIsValid(data) {
        let regexData = /^\d{2}\/\d{2}\/\d{4}$/
        if (!regexData.test(data)) {
          return false
        }

        let partes = data.split('/')
        let dia = parseInt(partes[0], 10)
        let mes = parseInt(partes[1], 10)
        let ano = parseInt(partes[2], 10)

        let dataValid = new Date(ano, mes - 1, dia)
        if (
          dataValid.getDate() !== dia ||
          dataValid.getMonth() !== mes - 1 ||
          dataValid.getFullYear() !== ano
        ) {
          return false
        }

        let dataAtual = new Date()
        dataAtual.setHours(0, 0, 0, 0)

        if (dataValid < dataAtual) {
          return false
        } else {
          return true
        }
      },
      formatData(data) {
        let dataSplit = data.split('/')
        const [dia, mes, ano] = dataSplit
        return ano + '-' + mes + '-' + dia
      },
      async returnStatus() {
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/update_id/`
        var res = await this.$api.post(urlData, this.dataTreat)
        this.dataInvalid = res.data
        this.arrCasos = null
        this.loading = false
        this.atualizarHistoricoMovimentacoes = true
        this.toast('Dados processados com sucesso!', 'top-right', false, 3000, 'success')
        setTimeout(() => {
          this.atualizarHistoricoMovimentacoes = false
        }, 1500)
      },
      async processData() {
        this.loading = true
        this.generateHashImport()
        const data = this.arrCasos

        const arrayObjetos = []

        const linhas = data.trim().split('\n')
        await linhas.forEach(linha => {
          const colunas = linha.split('\t')
          const objeto = {
            ID_IMPORTACAO: this.hashImport,
            ID_MAILING: colunas[0],
            // DATA_RETORNO: this.formatData(colunas[1]),
            USUARIO_ATUALIZACAO: this.usuarioAlmope,
            IP_ATUALIZACAO: this.ipMaquina
          }

          if (!isNaN(objeto.ID_MAILING)) {
            arrayObjetos.push(objeto)
          }
        })

        const idsMailing = arrayObjetos.map(item => item.ID_MAILING).join(',')

        let newObjeto = {
          ID_IMPORTACAO: arrayObjetos[0]?.ID_IMPORTACAO,
          ID_MAILING: idsMailing,
          // DATA_RETORNO: arrayObjetos[0].DATA_RETORNO,
          USUARIO_ATUALIZACAO: this.usuarioAlmope,
          IP_ATUALIZACAO: arrayObjetos[0].IP_ATUALIZACAO
        }
        // let result = arrayObjetos.filter((item) => {
        //   return item.ID_MAILING != "ID_MAILING";
        // });
        this.dataTreat = newObjeto
        await this.returnStatus()
      }
    }
  }
</script>

<style scoped>
  table {
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid black;
    padding: 8px;
  }

  .container {
    display: flex;
    flex-direction: row;
  }
  .caixa {
    position: relative;
    border: 1px solid #807f7f;
    border-radius: 5px;
    padding: 20px;
  }

  .titulo {
    position: absolute;
    top: -20px;
    background-color: white;
    color: #484848;
    padding: 0 10px;
  }

  .color-red {
    color: red !important;
  }
</style>
