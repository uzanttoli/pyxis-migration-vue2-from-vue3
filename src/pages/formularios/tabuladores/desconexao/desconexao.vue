<template>
  <!-- <v-dialog width="980" v-model="dialogModalDesconexao" persistent> -->
  <v-sheet elevation="4">
    <title-negative-margin title="Cancel. - Mudança de Endereço"></title-negative-margin>
    <v-divider></v-divider>
    <v-col v-if="formDesconexao.motivoContato == 'NÃO'">
      <v-alert type="warning" text border="left">
        Siga o processo de cancelamento conforme
        <strong>fique ligado!</strong>
      </v-alert>
    </v-col>
    <v-col>
      <v-row>
        <v-col cols="12" sm="6" md="6">
          <v-text-field
            outlined
            dense
            label="Contrato"
            v-mask="masks.contratoComCodCidade"
            v-model="formDesconexao.contrato"
            :rules="[rules.length(14)]"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select
            outlined
            dense
            label="Motivo do cancel. é mudança de endereco?"
            v-model="formDesconexao.motivoContato"
            :items="motivoContatoMudancaEndereco"
            item-text="OPTION_FIELD"
          ></v-select>
        </v-col>
      </v-row>
      <v-row class="mt-n5">
        <v-col cols="12" sm="6" md="4">
          <v-menu
            v-model="dataInicial"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                dense
                outlined
                v-model="computedDateFormattedInicio"
                label="Data Agendamento"
                persistent-hint
                append-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formDesconexao.dataAgendamento"
              no-title
              @input="dataInicial = false"
              locale="pt-br"
              :min="dateNow"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-select
            outlined
            dense
            label="Periodo do agendamento"
            v-model="formDesconexao.periodoAgendamento"
            :items="periodoAgendamento"
            item-text="OPTION_FIELD"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-text-field
            outlined
            dense
            label="Telefone de contato"
            v-mask="[masks.telefoneBrFixo, masks.telefoneBrMovel]"
            v-model="formDesconexao.telefoneContato"
            :rules="[rules.length(15)]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="pa-3 mt-n7" align="center" justify="center">
        <v-col cols="6">
          <v-btn
            class="success"
            block
            @click="adicionarTabulacao"
            :disabled="!this.formIsValid() || formDesconexao.motivoContato == 'NÃO'"
            :loading="enviando"
          >
            Salvar
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn class="error" block @click="clearForm" :disabled="!this.formClearIsValid()">
            Limpar
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-sheet>
  <!-- </v-dialog> -->
</template>

<script>
  import masks from '../../../../shared/masks/masks'
  import config from '../../../../core/config'
  export default {
    props: {
      dialogModalDesconexao: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      dataInicial: null,
      arrFiltro: [],
      enviando: false,
      formDesconexao: {
        contrato: null,
        motivoContato: null,
        periodoAgendamento: null,
        telefoneContato: null,
        dataAgendamento: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substring(0, 10)
      },
      formDesconexaoDefault: {
        contrato: null,
        motivoContato: null,
        periodoAgendamento: null,
        telefoneContato: null,
        dataAgendamento: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substring(0, 10)
      },
      rules: {
        length: len => v => (v || '').length <= len || `Números de caracteres necessários ${len}`
      }
    }),
    computed: {
      computedDateFormattedInicio() {
        return this.formatDate(this.formDesconexao.dataAgendamento)
      },
      dateNow() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-MM-DD')
      },
      masks() {
        return masks
      },
      periodoAgendamento() {
        let dados = this.arrFiltro
        return Object.values(dados).filter(item => item.TABULATION_FIELD == 'PERIODO_AGENDAMENTO')
      },
      motivoContatoMudancaEndereco() {
        let dados = this.arrFiltro
        return Object.values(dados).filter(
          item => item.TABULATION_FIELD == 'MOTIVO_CONTATO_MUD_ENDERECO'
        )
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      ipMaquina() {
        return localStorage.getItem('ip')
      }
    },
    methods: {
      formIsValid() {
        return (
          this.formDesconexao.contrato &&
          this.formDesconexao.contrato.length == 14 &&
          this.formDesconexao.motivoContato &&
          this.formDesconexao.periodoAgendamento &&
          this.formDesconexao.telefoneContato &&
          this.formDesconexao.telefoneContato.length >= 14 &&
          this.formDesconexao.dataAgendamento
        )
      },
      formClearIsValid() {
        return (
          this.formDesconexao.contrato ||
          this.formDesconexao.motivoContato ||
          this.formDesconexao.periodoAgendamento ||
          this.formDesconexao.telefoneContato
        )
      },
      clearForm() {
        Object.assign(this.formDesconexao, this.formDesconexaoDefault)
      },
      formatDate(date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${day}/${month}/${year}`
      },
      loadFiltro() {
        let urlData = `${config.baseUrl}api/shared/formularios/desconexao_me/filtros`
        this.$api.get(urlData).then(res => {
          this.arrFiltro = res.data
        })
      },
      async adicionarTabulacao() {
        try {
          this.enviando = true
          this.formDesconexao.almopeCadastro = this.usuarioAlmope
          this.formDesconexao.ipMaquina = this.ipMaquina
          this.formDesconexao.motivoContato = this.formDesconexao.motivoContato == 'SIM' ? 1 : 0

          let urlData = `${config.baseUrl}api/shared/formularios/desconexao_me/tabulacao_desconexao`
          let getFormData = object =>
            Object.keys(object).reduce((FormData, key) => {
              FormData.append(key, object[key])
              return FormData
            }, new FormData())
          await this.$api.post(urlData, getFormData(this.formDesconexao))
          const Toast = this.$swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: toast => {
              toast.addEventListener('mouseenter', this.$swal.stopTimer)
              toast.addEventListener('mouseleave', this.$swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'success',
            title: 'Tabulação enviada com sucesso!'
          })
          this.enviando = false
          this.clearForm()
        } catch (error) {
          console.error(error)
        }
      }
    },
    created() {
      this.loadFiltro()
    }
  }
</script>

<style></style>
vue
