<template>
  <!-- v-model="abrirModalCadastrar" -->
  <v-dialog
    :model-value="abrirModalCadastrar"
    @update:modelValue="val => $emit('update:abrirModalCadastrar', val)"
    width="900"
    persistent
  >
    <v-card elevation="0" tile>
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 5px">
        <v-card-title>Cadastro Massivo de Expurgo</v-card-title>
        <div class="container-actions">
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <a
                v-bind="attrs"
                v-on="on"
                style="text-decoration: none"
                :href="`${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/modelo/CADASTRO_MASSIVO_EXPURGO.xlsx`"
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
    <v-divider></v-divider>
    <v-card tile max-height="500" class="overflow-auto" elevation="0">
      <v-alert text type="warning" class="mt-3 mx-2">
        Expurgos
        <strong>duplicados</strong>
        ou que já tenham sidos
        <strong>cadastrados</strong>
        serão desconsiderados.
      </v-alert>
      <v-alert v-if="isApproval" text type="error" class="mt-3 mx-2">
        Seus expurgos serão
        <strong>aprovados automaticamente!</strong>
      </v-alert>
      <v-col>
        <v-textarea
          outlined
          placeholder="Utilize o modelo para cadastrar os expurgos!"
          label="Utilize o modelo para cadastrar os expurgos!"
          v-model="expurgos"
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
          :disabled="(!isSalve || dadosProcessados == '') && !testIsValid"
          @click="cadastrar"
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
      abrirModalCadastrar: {
        type: Boolean,
        default: false
      },
      indicadoresExpurgo: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      expurgos: '',
      dadosProcessados: [],
      isSalve: false,
      isSend: false,
      testIsValid: false,
      headersTable: ['LINHA', 'ALMOPE', 'DATA_INICIO', 'DATA_FIM', 'INDICADOR', 'JUSTIFICATIVA']
    }),
    mixins: [alerts],
    computed: {
      ipMaquina() {
        return localStorage.getItem('ip')
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      isApproval() {
        let arrayCargo = [
          'INATIVO',
          'STAFF',
          'BACK_OFFICE',
          'BACK_ATIVACAO',
          'OPERADOR',
          'SUPERVISOR',
          'COORDENADOR'
        ]
        let meuCargo = this.$store.getters.usuario.filtro
        return !arrayCargo.includes(meuCargo)
      },
      dateNow() {
        let date = new Date()

        let day = date.getDate().toString()
        let dayF = day.length === 1 ? '0' + day : day
        let month = (date.getMonth() + 1).toString()
        let monthF = month.length === 1 ? '0' + month : month
        let year = date.getFullYear().toString()

        return `${year}-${monthF}-${dayF}`
      }
    },
    methods: {
      corrigir() {
        this.dadosProcessados = ''
        this.isSalve = false
      },
      validacaoIndicador(string) {
        if (!string) return
        let indicador = this.indicadoresExpurgo.filter(indicador => {
          return indicador.INDICADOR == string
        })
        if (indicador[0]?.INDICADOR) {
          return true
        }
        return false
      },
      validacaoData(string) {
        const regexData = /^\d{2}\/\d{2}\/\d{4}$/
        if (!regexData.test(string)) {
          return false
        }
        let dataParse = string.split('/')
        let dia = parseInt(dataParse[0], 10)
        let mes = parseInt(dataParse[1], 10)
        let ano = parseInt(dataParse[2], 10)

        const date = new Date(ano, mes - 1, dia)
        // return `${date}`;
        // return `${date.getFullYear()}${date.getMonth()}${date.getDate()}`
        return date.getFullYear() === ano && date.getMonth() === mes - 1 && date.getDate() === dia
      },
      convertDate(string) {
        if (!string) return

        return string.split('/').reverse().join('-')
      },
      processar() {
        this.isSalve = true
        let texto = this.expurgos
        let arrayDeObjetos = []
        let linhas = texto.trim().split('\n')
        linhas.forEach((linha, i) => {
          let colunas = linha.split('\t')
          const objeto = {
            LINHA: i,
            ALMOPE: parseInt(colunas[0]),
            DATA_INICIO: this.validacaoData(colunas[1])
              ? this.convertDate(colunas[1])
              : 'Dados Inválidos',
            DATA_FIM: this.validacaoData(colunas[2])
              ? this.convertDate(colunas[2])
              : 'Dados Inválidos',
            INDICADOR: this.validacaoIndicador(colunas[3]) ? colunas[3] : 'Dados Inválidos',
            JUSTIFICATIVA: colunas[4],
            IP_MAQUINA: this.ipMaquina,
            SITUACAO_EXPURGO: this.isApproval ? 'APROVADO' : 'PENDENTE APROVAÇÃO',
            USUARIO_VALIDACAO: this.isApproval ? this.usuarioAlmope : null,
            IP_MAQUINA_VALIDACAO: this.isApproval ? this.ipMaquina : null,
            DATA_VALIDACAO: this.isApproval ? this.dateNow : null,
            USUARIO_CADASTRO: this.usuarioAlmope
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

        this.headersTable.forEach(header => {
          const cabecalhoCol = document.createElement('th')
          cabecalhoCol.style.padding = '8px'
          cabecalhoCol.style.textAlign = 'center'
          cabecalhoCol.style.borderBottom = '1px solid #ddd'
          cabecalhoCol.style.backgroundColor = '#f2f2f2'
          cabecalhoCol.textContent = header

          cabecalhoRow.appendChild(cabecalhoCol)
        })

        thead.appendChild(cabecalhoRow)

        this.dadosProcessados.forEach(item => {
          const linha = document.createElement('tr')

          this.headersTable.forEach(header => {
            const coluna = document.createElement('td')
            coluna.style.padding = '8px'
            coluna.style.textAlign = 'center'
            coluna.style.borderBottom = '1px solid #ddd'
            coluna.style.color = item[header] == 'Dados Inválidos' ? '#ff0000' : '#333'
            coluna.textContent = item[header]

            linha.appendChild(coluna)
          })

          tbody.appendChild(linha)

          tabela.appendChild(thead)
          tabela.appendChild(tbody)

          tabelaContainer.appendChild(tabela)
        })
      },
      async cadastrar() {
        try {
          this.isSend = true
          let urlData = `${config.baseUrl}api/shared/formularios/tabulador_expurgo/score_massivo/`
          await this.$api.post(urlData, this.dadosProcessados).then(() => {
            this.dadosProcessados = ''
            this.expurgos = ''
            this.isSalve = false
            this.toast('Expurgos cadastrados com sucesso!', 'top-right', false, 3500, 'success')
            this.isSend = false
          })
        } catch (error) {
          this.toast(
            'Oops, não conseguimos finalizar seus expurgos. Revise os dados e caso o erro persista entre em contato com o Administrador!',
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
