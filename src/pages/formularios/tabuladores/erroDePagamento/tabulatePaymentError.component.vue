<template>
  <!-- <v-dialog max-width="900" v-model="dialogTabErroPagamento" persistent> -->
  <v-card class="overflow-hidden">
    <v-card ref="form">
      <title-negative-margin title="Tabulador Erro Pagamento">
        <template v-if="filtro != 'SUPERVISOR'">
          <v-tooltip bottom color="green">
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                icon
                color="green"
                v-bind="attrs"
                v-on="on"
                @click="dialogAuthorization = !dialogAuthorization"
              >
                <v-icon>fa-solid fa-envelope</v-icon>
              </v-btn>
            </template>
            <span>Baixar autorização</span>
          </v-tooltip>
        </template>
        <v-tooltip bottom color="blue darken-4">
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              color="blue darken-4"
              icon
              v-bind="attrs"
              v-on="on"
              @click="dialogHistoricoDeCadastro = !dialogHistoricoDeCadastro"
            >
              <v-icon>fa-solid fa-clock-rotate-left</v-icon>
            </v-btn>
          </template>
          <span>Consulte o historico de cadastro</span>
        </v-tooltip>
        <v-tooltip bottom color="warning">
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              color="warning"
              @click="dialogDeletarCadastro = !dialogDeletarCadastro"
            >
              <v-icon color="red">fa-solid fa-trash-can</v-icon>
            </v-btn>
          </template>
          <span>Exclua um cadastro</span>
        </v-tooltip>
      </title-negative-margin>

      <v-row class="pa-2">
        <v-col cols="4" offset="2">
          <v-text-field
            label="Nome do Colaborador"
            disabled
            outlined
            v-model="consultarNomePorRH.NOME"
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            label="Período"
            disabled
            v-model="periodoDoErroPagamento.DESCRICAO_PERIODO"
            outlined
            dense
          ></v-text-field>
        </v-col>
      </v-row>
      <download-authorization
        @closeDialogAuthorization="dialogAuthorization = !dialogAuthorization"
        :dialogAuthorization="dialogAuthorization"
      ></download-authorization>
      <deletar-cadastro
        @closeDialogDeletarCadastro="dialogDeletarCadastro = !dialogDeletarCadastro"
        :dialogDeletarCadastro="dialogDeletarCadastro"
      ></deletar-cadastro>
      <historico-de-cadastro
        @closeDialogHistoricoCadastro="dialogHistoricoDeCadastro = !dialogHistoricoDeCadastro"
        :dialogHistoricoDeCadastro="dialogHistoricoDeCadastro"
      ></historico-de-cadastro>
      <v-row>
        <v-col cols="2" offset="2">
          <v-text-field
            label="Matricula"
            :rules="matriculaRules"
            required
            @change="loadTipoDesconto(), loadConsultarNomePorRH(), loadValorSalario()"
            outlined
            counter="10"
            dense
            v-model.lazy.trim="formErroPagamento.matricula"
            v-mask="masks.matricula"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="Data"
            required
            :rules="dataRules"
            :disabled="!this.formErroPagamento.matricula || usuarioInvalido == true"
            @change="loadPeriodoDoErroPagamento(), loadCasosJaCadastrados()"
            v-model="formErroPagamento.dataDoPeriodo"
            v-mask="masks.data"
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-overlay absolute :value="loading">
          <v-progress-circular indeterminate :size="50" color="primary"></v-progress-circular>
        </v-overlay>
        <v-col cols="4">
          <v-select
            label="Tipo Desconto"
            dense
            required
            :rules="tipoDescontoRules"
            no-data-text="Primeiro digite a matricula"
            v-model="formErroPagamento.tipoDesconto"
            outlined
            :items="tipoDesconto"
            @change="loadCausaRaiz()"
            item-text="DESCRICAO_TIPO_DESCONTO"
            item-value="ID_TIPO_DESCONTO"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <template
          v-if="
            this.formErroPagamento.tipoDesconto != 11 && this.formErroPagamento.tipoDesconto != 12
          "
        >
          <v-col cols="2" offset="2">
            <v-text-field
              label="Qtde Horas"
              outlined
              :disabled="
                !this.formErroPagamento.matricula ||
                this.formErroPagamento.tipoDesconto == 3 ||
                this.formErroPagamento.tipoDesconto == 4
              "
              v-model="formErroPagamento.quantidadeHora"
              dense
              v-mask="masks.hora"
            ></v-text-field>
          </v-col>
        </template>
        <template v-else>
          <v-col cols="2" offset="2">
            <v-text-field
              label="00:00"
              outlined
              :disabled="
                this.formErroPagamento.tipoDesconto == 11 ||
                this.formErroPagamento.tipoDesconto == 12
              "
              dense
              v-mask="masks.hora"
            ></v-text-field>
          </v-col>
        </template>
        <template
          v-if="
            this.formErroPagamento.tipoDesconto != 11 && this.formErroPagamento.tipoDesconto != 12
          "
        >
          <v-col cols="2">
            <v-text-field
              label="Desconto"
              disabled
              v-model="valorDoDescontoSemRVFormatado"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </template>
        <template v-else>
          <v-col cols="2">
            <v-text-field
              label="Desconto"
              outlined
              v-model="formErroPagamento.desconto"
              dense
              v-mask="[masks.realDoisDigitos, masks.realTresDigitos]"
            ></v-text-field>
          </v-col>
        </template>
        <v-col cols="4">
          <v-select
            label="Causa Raiz"
            :items="causaRaiz"
            required
            :rules="causaRules"
            v-model="formErroPagamento.causaRaiz"
            item-text="DESCRICAO_CAUSA_RAIZ"
            item-value="ID_CAUSA_RAIZ"
            no-data-text="Informe primeiro o tipo de desconto"
            dense
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-col cols="8" offset="2">
        <v-textarea
          label="Descrição"
          auto-grow
          v-model="formErroPagamento.descricao"
          outlined
          required
          :error-messages="
            formErroPagamento.descricao.length > 100 ? 'Não é permitido mais de 100 caracteres' : ''
          "
          :rules="descricaoRules"
          counter="100"
          rows="3"
          row-height="25"
          shaped
        ></v-textarea>
      </v-col>
      <v-row>
        <v-col cols="3" offset="3">
          <v-btn
            class="ma-2 rounded-xl"
            width="200"
            color="success"
            :disabled="!this.botaoEnviar()"
            @click="salvarDadosFormularioErroPagamento()"
          >
            Enviar
            <template v-slot:loader>
              <span>Loading...</span>
            </template>
          </v-btn>
        </v-col>
        <v-col cols="3">
          <v-btn class="ma-2 rounded-xl" width="200" color="error" @click="limparFormulario()">
            Limpar
            <template v-slot:loader>
              <span>Loading...</span>
            </template>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar">
        {{ text }}

        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">Fechar</v-btn>
        </template>
      </v-snackbar>
    </div>
    <div class="text-center ma-2" width="30px">
      <v-snackbar v-model="inserirDadosFormularioErroPagamento">
        {{ textDadosEnviado }}
        <template v-slot:action="{ attrs }">
          <v-icon color="green" text v-bind="attrs">mdi-checkbox-marked-circle-plus-outline</v-icon>
        </template>
      </v-snackbar>
    </div>
    <div class="text-center ma-2">
      <v-snackbar v-model="usuarioInvalido" v-if="this.comprimentoMatricula >= 4">
        {{ textMatriculaInvalida }}
        <template v-slot:action="{ attrs }">
          <v-icon color="red" text v-bind="attrs">mdi-alert</v-icon>
        </template>
      </v-snackbar>
    </div>
    <div class="text-center ma-2">
      <v-snackbar
        v-model="peridoErroPagamentoInvalido"
        v-if="this.formErroPagamento.dataDoPeriodo != ''"
      >
        {{ textPeriodoInvalido }}
        <template v-slot:action="{ attrs }">
          <v-icon color="yellow" text v-bind="attrs">mdi-calendar-range</v-icon>
        </template>
      </v-snackbar>
    </div>
    <div class="text-center ma-2">
      <v-snackbar v-model="dadosJaCadastrados">
        {{ textEnvioError }}
        <template v-slot:action="{ attrs }">
          <v-icon color="red" text v-bind="attrs">mdi-alert-circle-outline</v-icon>
        </template>
      </v-snackbar>
    </div>
  </v-card>
  <!-- </v-dialog> -->
</template>

<script>
  import downloadAuthorization from './dialogs/downloadAuthorization'
  import deletarCadastro from './dialogs/table/deleteRegister.vue'
  import historicoDeCadastro from './dialogs/table/registrationHistory.vue'
  import masks from '../../../../shared/masks/masks'
  // import DownloadAuthorization from "./dialogs/downloadAuthorization.vue";
  export default {
    name: 'TabuladorErroPagamento',
    components: {
      historicoDeCadastro,
      deletarCadastro,
      downloadAuthorization
      // DownloadAuthorization,
    },
    props: {
      dialogTabErroPagamento: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      valid: true,
      dialogAuthorization: false,
      dialogHistoricoDeCadastro: false,
      dialogDeletarCadastro: false,
      dadosJaCadastrados: false,
      textEnvioError: `Envio não realizado. Aparentemente você está tentando cadastrar uma pessoa já cadastrada, caso não seja isso, verifique os dados e tente novamente!`,
      textSalarioNaoCadastrado: `Matricula não cadastrada na base de Salário. Contate o CCO`,
      textPeriodoInvalido: `Periodo informado não pode ser cadastrado!`,
      textDadosEnviado: `Dados enviado com sucesso!`,
      textMatriculaInvalida: `Parece que você digitou uma matricula que não existe. Por favor,
            verifique e tente novamente!`,
      snackbarValorInvalido: false,
      textValorInvalido: `Ops, acho que você digitou um valor invalido!`,
      snackbar: false,
      text: ``,
      loading: false,
      formErroPagamento: {
        matricula: null,
        dataDoPeriodo: null,
        tipoDesconto: null,
        causaRaiz: null,
        desconto: null,
        quantidadeHora: '00:00',
        descricao: ''
      },
      formErroPagamentoDefault: {
        matricula: null,
        dataDoPeriodo: null,
        tipoDesconto: null,
        causaRaiz: null,
        desconto: null,
        quantidadeHora: '00:00',
        descricao: ''
      },
      matriculaRules: [
        matricula => !!matricula || 'Necessário informar a matricula',
        matricula => (matricula && matricula.length >= 5) || 'Caracteres necessário 5'
      ],
      dataRules: [
        dataDoPeriodo => !!dataDoPeriodo || 'Necessário informar uma data!',
        dataDoPeriodo =>
          (dataDoPeriodo && dataDoPeriodo.length >= 10) || 'Data precisa er 10 caracteres'
      ],
      tipoDescontoRules: [
        tipoDesconto => !!tipoDesconto || 'Necessário informar um tipo de desconto!'
      ],
      causaRules: [causaRaiz => !!causaRaiz || 'Necessário preencher a Causa Raiz!'],
      descricaoRules: [descricao => !!descricao || 'Necessário preencher a descrição do erro!']
    }),
    computed: {
      filtro() {
        return this.$store.getters.usuario.filtro
      },
      casosJaCadastrados() {
        return this.$store.getters.casosJaCadastrados
      },
      comprimentoMatricula() {
        let matricula = this.formErroPagamento.matricula
        if (matricula) {
          return matricula.length
        } else {
          return ''
        }
      },
      peridoErroPagamentoInvalido() {
        return this.$store.getters.peridoErroPagamentoInvalido
      },
      dadosNaoEnviado() {
        return this.$store.getters.dadosNaoEnviado
      },
      usuarioInvalido() {
        return this.$store.getters.usuarioInvalido
      },
      prazoCadastro() {
        let prazoCadastro = this.$store.getters.prazoCadastro[0]
        if (prazoCadastro) {
          return prazoCadastro
        } else {
          return []
        }
      },
      valorInvalido() {
        let valorInvalido = this.$store.getters.valorInvalido
        return valorInvalido
      },
      masks() {
        return masks
      },
      consultarNomePorRH() {
        let consultarNomePorRH = this.$store.getters.consultarNomePorRH[0]
        if (consultarNomePorRH) {
          return consultarNomePorRH
        } else {
          return ''
        }
      },
      validacaoData() {
        let dataConvertida = this.formErroPagamento.dataDoPeriodo
        function isValidDate(dateString) {
          // First check for the pattern
          if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false

          // Parse the date parts to integers
          var parts = dateString.split('/')
          var day = parseInt(parts[0], 10)
          var month = parseInt(parts[1], 10)
          var year = parseInt(parts[2], 10)
          var data = new Date()
          var anoAtual = data.getFullYear()
          // Check the ranges of month and year
          if (year < 1000 || year > anoAtual || month == 0 || month > 12) return false

          var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

          // Adjust for leap years
          if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) monthLength[1] = 29

          // Check the range of the day
          return day > 0 && day <= monthLength[month - 1]
        }
        return isValidDate(dataConvertida)
      },
      dataConvertida() {
        let dataConvertida = this.formErroPagamento.dataDoPeriodo
        if (dataConvertida != null) {
          return dataConvertida.split('/').join('-')
        } else {
          return ''
        }
      },
      tipoDesconto() {
        let tipoDesconto = this.$store.getters.tipoDesconto
        if (tipoDesconto) {
          return tipoDesconto
        } else {
          return []
        }
      },
      valorSalario() {
        return this.$store.getters.valorSalario
      },
      causaRaiz() {
        return this.$store.getters.causaRaiz
      },
      inserirDadosFormularioErroPagamento() {
        return this.$store.getters.inserirDadosFormularioErroPagamento
      },
      valorDoDescontoSemRVFormatado() {
        return this.valorDoDesconto.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      valorDoDesconto() {
        if (this.formErroPagamento.tipoDesconto) {
          if (
            this.formErroPagamento.tipoDesconto != 11 &&
            this.formErroPagamento.tipoDesconto != 12
          ) {
            let valorDesconto = 0
            let valorSalario = this.valorSalario[0].SALARIO
            let cargaHoraria = this.valorSalario[0].CARGA_HORARIA
            let jornadaTrabalho = this.valorSalario[0].JORNADA_TRABALHO
            // SALARIO / CARGA HORARIA * QUANTIDADE DE HORAS
            if (this.formErroPagamento.tipoDesconto == 1 && this.formErroPagamento.quantidadeHora) {
              let numQtdHoras = this.formErroPagamento.quantidadeHora.split(':')
              numQtdHoras[0] = numQtdHoras[0] * 60 * 60
              numQtdHoras[1] = numQtdHoras[1] * 60
              let qtdHorasEmSegundos = numQtdHoras[0] + numQtdHoras[1]

              valorDesconto = (valorSalario / (cargaHoraria * 60 * 60)) * qtdHorasEmSegundos
            } else if (
              // ((SALARIO / CARGA_HORARIA) * QTDE HORA) + ((SALARIO / CARGA_HORARIA) * JORNADA DE TRABALHO))
              this.formErroPagamento.tipoDesconto == 2 &&
              this.formErroPagamento.quantidadeHora
            ) {
              let numQtdHorasJornada = jornadaTrabalho.split(':')
              numQtdHorasJornada[0] = numQtdHorasJornada[0] * 60 * 60
              numQtdHorasJornada[1] = numQtdHorasJornada[1] * 60
              let qtdHorasEmSegundosJornada = numQtdHorasJornada[0] + numQtdHorasJornada[1]

              let numQtdHoras = this.formErroPagamento.quantidadeHora.split(':')
              numQtdHoras[0] = numQtdHoras[0] * 60 * 60
              numQtdHoras[1] = numQtdHoras[1] * 60
              let qtdHorasEmSegundos = numQtdHoras[0] + numQtdHoras[1]

              valorDesconto =
                (valorSalario / (cargaHoraria * 60 * 60)) * qtdHorasEmSegundos +
                (valorSalario / (cargaHoraria * 60 * 60)) * qtdHorasEmSegundosJornada
            } else if (this.formErroPagamento.tipoDesconto == 3) {
              //((SALARIO / CARGA_HORARIA) * JORNADA)
              let numQtdHorasJornada = jornadaTrabalho.split(':')
              numQtdHorasJornada[0] = numQtdHorasJornada[0] * 60 * 60
              numQtdHorasJornada[1] = numQtdHorasJornada[1] * 60
              let qtdHorasEmSegundosJornada = numQtdHorasJornada[0] + numQtdHorasJornada[1]

              valorDesconto = (valorSalario / (cargaHoraria * 60 * 60)) * qtdHorasEmSegundosJornada
            } else if (this.formErroPagamento.tipoDesconto == 4) {
              //  ((SALARIO / CARGA_HORARIA) * JORNADA DE TRABALHO) + ((SALARIO / CARGA_HORARIA) * JORNADA DE TRABALHO))
              let numQtdHorasJornada = jornadaTrabalho.split(':')
              numQtdHorasJornada[0] = numQtdHorasJornada[0] * 60 * 60
              numQtdHorasJornada[1] = numQtdHorasJornada[1] * 60
              let qtdHorasEmSegundosJornada = numQtdHorasJornada[0] + numQtdHorasJornada[1]

              valorDesconto =
                (valorSalario / (cargaHoraria * 60 * 60)) * qtdHorasEmSegundosJornada +
                (valorSalario / (cargaHoraria * 60 * 60)) * qtdHorasEmSegundosJornada
            } else if (this.formErroPagamento.tipoDesconto == 6) {
              // VALOR FIXO DE 134.01
              valorDesconto = 134.01
            } else if (
              this.formErroPagamento.tipoDesconto == 7 &&
              this.formErroPagamento.quantidadeHora
            ) {
              // ((SALARIO / CARGA_HORARIA)/2) + (SALARIO / CARGA_HORARIA) * QTDE HORA
              let numQtdHoras = this.formErroPagamento.quantidadeHora.split(':')
              numQtdHoras[0] = numQtdHoras[0] * 60 * 60
              numQtdHoras[1] = numQtdHoras[1] * 60
              let qtdHorasEmSegundos = numQtdHoras[0] + numQtdHoras[1]

              valorDesconto =
                (valorSalario / (cargaHoraria * 60 * 60) / 2 +
                  valorSalario / (cargaHoraria * 60 * 60)) *
                qtdHorasEmSegundos
            } else if (
              this.formErroPagamento.tipoDesconto == 9 &&
              this.formErroPagamento.quantidadeHora
            ) {
              // (SALARIO / CARGA_HORARIA) * 20%
              let numQtdHoras = this.formErroPagamento.quantidadeHora.split(':')
              numQtdHoras[0] = numQtdHoras[0] * 60 * 60
              numQtdHoras[1] = numQtdHoras[1] * 60
              let qtdHorasEmSegundos = numQtdHoras[0] + numQtdHoras[1]

              valorDesconto = (valorSalario / (cargaHoraria * 60 * 60)) * 0.2 * qtdHorasEmSegundos
            } else if (
              this.formErroPagamento.tipoDesconto == 8 &&
              this.formErroPagamento.quantidadeHora
            ) {
              // (SALARIO / CARGA_HORARIA) * QTDE HORA
              let numQtdHoras = this.formErroPagamento.quantidadeHora.split(':')
              numQtdHoras[0] = numQtdHoras[0] * 60 * 60
              numQtdHoras[1] = numQtdHoras[1] * 60
              let qtdHorasEmSegundos = numQtdHoras[0] + numQtdHoras[1]

              valorDesconto = (valorSalario / (cargaHoraria * 60 * 60)) * qtdHorasEmSegundos
            } else if (
              this.formErroPagamento.tipoDesconto == 10 &&
              this.formErroPagamento.quantidadeHora
            ) {
              // (SALARIO / CARGA_HORARIA) * 2 *QTDE HORAS
              let numQtdHoras = this.formErroPagamento.quantidadeHora.split(':')
              numQtdHoras[0] = numQtdHoras[0] * 60 * 60
              numQtdHoras[1] = numQtdHoras[1] * 60
              let qtdHorasEmSegundos = numQtdHoras[0] + numQtdHoras[1]

              valorDesconto = (valorSalario / (cargaHoraria * 60 * 60)) * 2 * qtdHorasEmSegundos
            }
            return valorDesconto
          } else {
            let valorDesconto = this.formErroPagamento.desconto
            return valorDesconto
          }
        } else {
          return 0.0
        }
      },
      periodoCadastro() {
        // data padrão
        let dataCadastro = this.prazoCadastro
        let dataInicio = dataCadastro.INICIO
        let dataInicioF = dataInicio.length == 1 ? '0' + dataInicio : dataInicio
        let dataFim = dataCadastro.FIM
        let dataFimF = dataFim.length == 1 ? '0' + dataFim : dataFim
        let data = new Date()
        let dia = data.getDate().toString()
        let diaFormatado = dia.length == 1 ? '0' + dia : dia
        //
        if (diaFormatado >= dataInicioF) {
          if (diaFormatado <= dataFimF) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      dataPeriodoValido() {
        if (this.formErroPagamento.dataDoPeriodo) {
          // Formatacao da data
          let data = new Date()
          // let dia = data.getDate().toString();
          // let diaF = dia.length == 1 ? "0" + dia : dia;
          let mes = (data.getMonth() + 1).toString() //+1 pois no getMonth Janeiro começa com zero.
          let mesF = mes.length == 1 ? '0' + mes : mes
          let ano = data.getFullYear()

          // Valores digitados
          let dataDigitada = this.formErroPagamento.dataDoPeriodo
          let anoDataDigitada = dataDigitada.substring(6, 10)
          let mesDataDigitada = dataDigitada.substring(3, 5)
          // let dataMesAno = dataSeparada[1] + "/" + dataSeparada[2];

          if (ano < anoDataDigitada) {
            return false
          }

          if (mesF <= mesDataDigitada && ano != anoDataDigitada) {
            return true
          } else {
            let diferencaMes = mesF - mesDataDigitada
            if (diferencaMes >= 1) {
              if (ano > anoDataDigitada && diferencaMes >= 1) {
                return true
              } else {
                if (ano == anoDataDigitada && diferencaMes > 1) {
                  return true
                } else {
                  if (mesF < mesDataDigitada && ano > anoDataDigitada) {
                    return true
                  } else {
                    if (mesF < mesDataDigitada && ano == anoDataDigitada) {
                      return true
                    }
                  }
                }
              }
            } else {
              false
            }
          }
          return false
        } else {
          return ''
        }
      },
      perfilAutorizadao() {
        let perfil = this.$store.getters.usuario.filtro
        return perfil == 'ADMINISTRADOR' ? true : false
      },
      salarioNaoCadastrado() {
        return this.$store.getters.salarioNaoCadastrado
      },
      periodoDoErroPagamento() {
        let periodoDoErroPagamento = this.$store.getters.periodoDoErroPagamento[0]
        if (periodoDoErroPagamento) {
          return periodoDoErroPagamento
        } else {
          return ''
        }
      },
      ipMaquina() {
        return localStorage.getItem('ip')
      }
    },
    methods: {
      loadCasosJaCadastrados() {
        this.$store.dispatch('loadCasosJaCadastrados', {
          matricula: this.formErroPagamento.matricula,
          data: this.dataConvertida
        })
      },
      botaoEnviar() {
        return (
          this.formErroPagamento?.descricao?.length <= 100 &&
          this.formErroPagamento.matricula &&
          this.formErroPagamento.dataDoPeriodo &&
          this.formErroPagamento.tipoDesconto &&
          this.formErroPagamento.causaRaiz &&
          this.formErroPagamento.descricao
        )
      },
      validacaoCargaHorariaFixa() {
        let tipoDesconto = this.tipoDesconto
        let jornadaTrabalho = this.valorSalario[0].JORNADA_TRABALHO
        if (tipoDesconto == 3) {
          return (this.formErroPagamento.quantidadeHora = jornadaTrabalho)
        }
      },
      resetarValidacao() {
        this.$refs.form.resetValidation()
      },
      matriculaValida() {
        if (this.consultarNomePorRH == '') {
          return false
        } else {
          return true
        }
      },
      controleDeFormulario() {
        this.$emit('closeTabErroPagamento')
      },

      formularioEValido() {
        let validacaoHora = this.formErroPagamento.quantidadeHora
        let tipoDesconto = this.formErroPagamento.tipoDesconto

        if (tipoDesconto == 3 || tipoDesconto == 4 || tipoDesconto == 12 || tipoDesconto == 11) {
          if (
            this.formErroPagamento.matricula == null ||
            this.formErroPagamento.dataDoPeriodo == null ||
            this.formErroPagamento.tipoDesconto == null ||
            this.formErroPagamento.causaRaiz == null ||
            this.formErroPagamento.descricao == ''
          ) {
            return true
          } else {
            return false
          }
        } else {
          if (
            validacaoHora.length < 5 ||
            this.formErroPagamento.matricula == null ||
            this.formErroPagamento.dataDoPeriodo == null ||
            this.formErroPagamento.tipoDesconto == null ||
            this.formErroPagamento.causaRaiz == null ||
            this.formErroPagamento.quantidadeHora == '00:00' ||
            this.formErroPagamento.descricao == ''
          ) {
            return true
          } else {
            return false
          }
        }
      },

      limparFormulario() {
        this.formErroPagamento.dataDoPeriodo = ''
        this.formErroPagamento.tipoDesconto = null
        this.formErroPagamento.desconto = null
        this.formErroPagamento.causaRaiz = null
        this.formErroPagamento.quantidadeHora = '00:00'
        this.formErroPagamento.descricao = ''
        this.loadPeriodoDoErroPagamento()
        this.loadConsultarNomePorRH()
        this.resetarValidacao()
      },

      salvarDadosFormularioErroPagamento() {
        const exibirSnackbar = (mensagem, timeout = 5000) => {
          this.snackbar = true
          this.text = mensagem
          setTimeout(() => {
            this.snackbar = false
          }, timeout)
        }

        if (this.periodoCadastro == true || this.perfilAutorizadao) {
          if (this.casosJaCadastrados != '') {
            this.dadosJaCadastrados = true
            this.limparFormulario()
            this.loadCasosJaCadastrados()
            setTimeout(() => {
              this.dadosJaCadastrados = false
            }, 10000)
          } else {
            if (this.formularioEValido() == true) {
              this.snackbar = true
              this.text = `Necessário preenchimento de todos os campos corretamente!`
              setTimeout(() => {
                this.snackbar = false
              }, 4000)
              return
            } else {
              if (this.dataPeriodoValido == false) {
                this.snackbar = true
                this.text = `Data informada não pode ser cadastrada`
                setTimeout(() => {
                  this.snackbar = false
                }, 4000)
              } else {
                if (this.validacaoData == false) {
                  this.snackbar = true
                  this.text = `Data (${this.formErroPagamento.dataDoPeriodo}) inválida. Verifique e tente novamente!`
                  setTimeout(() => {
                    this.snackbar = false
                  }, 4000)
                } else {
                  if (this.formErroPagamento.descricao.length > 100) {
                    this.snackbar = true
                    this.text = `Não é possivel inserir mais de 100 caracteres`
                    setTimeout(() => {
                      this.snackbar = false
                    }, 4000)
                  } else {
                    // Onde vem as informacoes para enviar ao banco
                    this.formErroPagamento.almope = this.$store.getters.usuario.almope
                    this.formErroPagamento.ipMaquina = this.ipMaquina
                    this.formErroPagamento.descricaoPeriodo = this.periodoDoErroPagamento.ID_PERIODO
                    this.formErroPagamento.desconto = this.valorDoDesconto

                    this.formErroPagamento.almopeSuperior1 =
                      this.consultarNomePorRH.ALMOPE_SUPERIOR1
                    this.formErroPagamento.superior1 = this.consultarNomePorRH.SUPERIOR1
                    this.formErroPagamento.superior2 = this.consultarNomePorRH.SUPERIOR2

                    const { CARGO } = this.consultarNomePorRH

                    if (this.$store.getters.usuario.cargo == CARGO) {
                      exibirSnackbar(
                        'Não foi possivel realizar o cadastro. Favor solicite ao seu gestor.'
                      )
                      return
                    }

                    this.$store.dispatch(
                      'salvarDadosFormularioErroPagamento',
                      this.formErroPagamento
                    )
                    this.limparFormulario()
                  }
                }
              }
            }
          }
        } else {
          let dataCadastro = this.prazoCadastro
          let dataInicio = dataCadastro.INICIO
          let dataFim = dataCadastro.FIM
          this.snackbar = true
          this.text = `O tabulador ficou disponivel do dia ${dataInicio} até ${dataFim} desse mês!`
          setTimeout(() => {
            this.snackbar = false
            this.limparFormulario()
            this.controleDeFormulario()
          }, 6000)
        }
      },
      loadPrazoCadastro() {
        this.$store.dispatch('loadPrazoCadastro')
      },
      clienteIP() {
        this.$store.dispatch('clienteIP')
      },
      loadValorSalario() {
        this.$store.dispatch('loadValorSalario', this.formErroPagamento.matricula)
      },
      loadPeriodoDoErroPagamento() {
        this.$store.dispatch('loadPeriodoDoErroPagamento', this.dataConvertida)
      },
      loadTipoDesconto() {
        this.$store.dispatch('loadTipoDesconto')
      },
      loadCausaRaiz() {
        this.$store.dispatch('loadCausaRaiz')
      },
      loadConsultarNomePorRH() {
        this.$store.dispatch('loadConsultarNomePorRH', this.formErroPagamento.matricula)
      }
    },
    watch: {
      consultarNomePorRH() {
        this.loadTipoDesconto()
      },
      causaRaiz() {
        this.formErroPagamento.quantidadeHora = '00:00'
        this.formErroPagamento.desconto = null
        this.formErroPagamento.causaRaiz = null
      },
      dialogTabErroPagamento() {
        this.loadPrazoCadastro()
      }
    },
    created() {
      this.dataPeriodoValido
      this.loadPrazoCadastro()
    }
  }
</script>

<style scoped></style>
