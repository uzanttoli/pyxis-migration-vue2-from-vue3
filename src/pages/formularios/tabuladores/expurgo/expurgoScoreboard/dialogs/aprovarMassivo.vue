<template>
  <!-- v-model="abrirModalAprovar" -->
  <v-dialog
    width="900"
    persistent
    :model-value="abrirModalAprovar"
    @update:modelValue="val => $emit('update:abrirModalAprovar', val)"
  >
    <v-card elevation="0" tile>
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 5px">
        <v-card-title>Validação Massiva de Expurgo</v-card-title>

        <div class="container-actions">
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <a
                v-bind="attrs"
                v-on="on"
                style="text-decoration: none"
                :href="`${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/modelo/VALIDACAO_MASSIVA_EXPURGO.xlsx`"
              >
                <i class="fa-solid fa-file-arrow-down" style="color: #1aac07"></i>
              </a>
            </template>
            <span>Baixar Modelo</span>
          </v-tooltip>
          <v-divider vertical></v-divider>
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <a v-bind="attrs" v-on="on" @click="$emit('update:close')" style="margin-right: 10px">
                <i class="fa-solid fa-xmark" style="color: #ff0000"></i>
              </a>
            </template>
            <span>Fechar</span>
          </v-tooltip>
        </div>
      </div>
    </v-card>
    <v-card tile max-height="500" class="overflow-auto" elevation="0">
      <v-divider></v-divider>
      <v-col>
        <v-textarea
          outlined
          v-model="expurgos"
          placeholder="Utilize o modelo para validar os expurgos!"
          label="Utilize o modelo para validar os expurgos!"
          v-if="dadosProcessados == ''"
        ></v-textarea>
        <div id="tabelaContainer" v-else></div>
      </v-col>
      <v-divider></v-divider>
    </v-card>
    <v-card elevation="0" tile>
      <div style="display: flex; justify-content: end; padding: 13px 10px 10px 10px">
        <v-btn
          @click="processar"
          :disabled="dadosProcessados != ''"
          color="orange"
          class="mr-3 rounded-bl-xl rounded-r-xl white--text"
        >
          AVANÇAR
        </v-btn>
        <v-btn
          class="mr-3 rounded-bl-xl rounded-r-xl"
          color="error"
          @click="corrigir"
          :disabled="dadosProcessados == ''"
        >
          EDITAR
        </v-btn>
        <v-btn
          class="rounded-bl-xl rounded-r-xl"
          color="success"
          :disabled="!isSalve || dadosProcessados == ''"
          @click="atualizar"
          :loading="isSend"
        >
          SALVAR
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../../../../../core/config'
  import alerts from '../../../../../../mixins/alerts.mixins'

  export default {
    props: {
      abrirModalAprovar: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      expurgos: '',
      dadosProcessados: [],
      isSend: false,
      headersTable: ['ALMOPE', 'INDICADOR', 'DATA_INICIO', 'DATA_FIM', 'SITUACAO'],
      isSalve: false
    }),
    computed: {
      ipMaquina() {
        return localStorage.getItem('ip')
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    mixins: [alerts],
    methods: {
      corrigir() {
        this.dadosProcessados = ''
        this.isSalve = false
      },
      processar() {
        this.isSalve = true
        let texto = this.expurgos
        let arrayDeObjetos = []
        let linhas = texto.trim().split('\n')
        linhas.forEach(linha => {
          let colunas = linha.split('\t')
          const objeto = {
            ALMOPE: parseInt(colunas[0]),
            INDICADOR: colunas[1],
            DATA_INICIO: colunas[2],
            DATA_FIM: colunas[3],
            SITUACAO: colunas[4],
            USUARIO_VALIDACAO: this.usuarioAlmope,
            IP_MAQUINA_VALIDACAO: this.ipMaquina
          }
          arrayDeObjetos.push(objeto)
        })

        let result = arrayDeObjetos.filter(item => {
          return isNaN(item.ALMOPE) === false
        })
        this.dadosProcessados = result
        setTimeout(() => {
          this.criarTabela()
        }, 1000)
      },
      criarTabela() {
        const tabelaContainer = document.getElementById('tabelaContainer')

        const tabela = document.createElement('table')
        tabela.style.borderCollapse = 'collapse'
        tabela.style.width = '100%'
        tabela.style.border = '1px solid #ccc'
        tabela.style.fontFamily = 'Arial, sans-serif'

        const thead = document.createElement('thead')
        const tbody = document.createElement('tbody')

        const cabecalhoRow = document.createElement('tr')

        this.headersTable.forEach(item => {
          const cabecalhoCol = document.createElement('th')
          cabecalhoCol.style.padding = '8px'
          cabecalhoCol.style.textAlign = 'center'
          cabecalhoCol.style.borderBottom = '1px solid #ddd'
          cabecalhoCol.style.backgroundColor = '#f2f2f2'
          cabecalhoCol.textContent = item
          cabecalhoRow.appendChild(cabecalhoCol)

          thead.appendChild(cabecalhoRow)
        })

        this.dadosProcessados.forEach(dados => {
          const linha = document.createElement('tr')

          this.headersTable.forEach(header => {
            const coluna1 = document.createElement('td')
            coluna1.style.padding = '8px'
            coluna1.style.textAlign = 'center'
            coluna1.style.borderBottom = '1px solid #ddd'
            coluna1.textContent = dados[header]

            linha.appendChild(coluna1)
          })

          tbody.appendChild(linha)

          tabela.appendChild(thead)
          tabela.appendChild(tbody)

          tabelaContainer.appendChild(tabela)
        })
      },
      async atualizar() {
        try {
          this.isSend = true
          let urlData = `${config.baseUrl}api/shared/formularios/tabulador_expurgo/atualizar_expurgo/`
          await this.$api.post(urlData, this.dadosProcessados).then(() => {
            this.dadosProcessados = ''
            this.expurgos = ''
            this.isSalve = false
            this.isSend = false
            this.toast('Expurgos atualizados com sucesso!', 'top-right', false, 3500, 'success')
          })
        } catch (error) {
          this.toast(
            'Expurgos não atualizado(s)! Caso erro persista contate um administrador.',
            'top-right',
            false,
            3500,
            'error'
          )
          this.isSend = false
        }
      }
    }
  }
</script>

<style scoped>
  .container-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  i {
    font-size: 22px;
  }
</style>
