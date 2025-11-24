<template>
  <div>
    <div>
      <h3>Tratativa Reversão</h3>
    </div>
    <v-divider class="py-2"></v-divider>
    <fieldset>
      <legend>Dados Contato</legend>
      <div class="ma-2 fields">
        <v-text-field
          placeholder="Contrato"
          label="Contrato"
          outlined
          dense
          readonly
          :value="dadosTratativa.CONTRATO"
        ></v-text-field>
        <v-text-field
          placeholder="Cidade"
          label="Cidade"
          outlined
          dense
          readonly
          :value="dadosTratativa.CIDADE"
        ></v-text-field>
        <v-text-field
          placeholder="Tipo Ocorrência"
          label="Tipo Ocorrência"
          outlined
          dense
          readonly
          :value="dadosTratativa.TIPO_OCORRENCIA"
        ></v-text-field>
        <v-text-field
          placeholder="Usuário Cancelamento"
          label="Usuário Cancelamento"
          outlined
          dense
          readonly
          :value="dadosTratativa.USUARIO_CANCEL"
        ></v-text-field>
        <v-text-field
          placeholder="Almope"
          label="Almope"
          outlined
          dense
          readonly
          :value="dadosTratativa.ALMOPE"
        ></v-text-field>
        <v-text-field
          placeholder="Supervisor"
          label="Supervisor"
          outlined
          dense
          readonly
          :value="dadosTratativa.SUPERIOR1"
        ></v-text-field>
        <v-text-field
          placeholder="Coordenador"
          label="Coordenador"
          outlined
          dense
          readonly
          :value="dadosTratativa.SUPERIOR2"
        ></v-text-field>
        <v-text-field
          placeholder="Motivo Cancelamento"
          label="Motivo Cancelamento"
          outlined
          dense
          readonly
          :value="dadosTratativa.MOTIVO_CANCEL"
        ></v-text-field>
        <v-text-field
          placeholder="Data Ligação"
          label="Data Ligação"
          outlined
          dense
          readonly
          :value="dadosTratativa.DATA_LIGACAO"
        ></v-text-field>
      </div>
    </fieldset>
    <fieldset>
      <legend>Dados Tratativa</legend>
      <div class="ma-2 fields">
        <v-select
          placeholder="Cliente Atendeu a Ligação?"
          label="Cliente Atendeu a Ligação?"
          outlined
          dense
          :items="['SIM', 'NÃO']"
          v-model="form.atendeuLigacao"
          :disabled="dadosTratativa == ''"
        ></v-select>
        <v-text-field
          v-show="form.atendeuLigacao == 'NÃO'"
          placeholder="Motivo do Não Contato"
          label="Motivo do Não Contato"
          outlined
          dense
          v-model="form.motivoNaoContato"
          :disabled="dadosTratativa == ''"
        ></v-text-field>
        <v-select
          v-show="form.atendeuLigacao == 'SIM'"
          placeholder="Cliente é o Titular Do Contrato?"
          label="Cliente é o Titular Do Contrato?"
          outlined
          dense
          v-model="form.titularContrato"
          :items="['SIM', 'NÃO']"
          :disabled="dadosTratativa == ''"
        ></v-select>
        <v-text-field
          v-show="form.titularContrato == 'NÃO'"
          placeholder="Nome Completo do terceiro"
          label="Nome Completo do terceiro"
          outlined
          dense
          v-model="form.nomeCompletoTerceiro"
          :disabled="dadosTratativa == ''"
        ></v-text-field>
        <v-select
          v-show="form.atendeuLigacao == 'SIM' && form.titularContrato"
          placeholder="Cliente Revertido?"
          label="Cliente Revertido?"
          outlined
          dense
          :items="['SIM', 'NÃO']"
          v-model="form.clienteRevertido"
          :disabled="dadosTratativa == ''"
        ></v-select>
        <v-text-field
          v-show="form.atendeuLigacao == 'SIM' && form.clienteRevertido == 'NÃO'"
          placeholder="Motivo do Não Aceite"
          label="Motivo do Não Aceite"
          outlined
          dense
          v-model="form.motivoNaoAceite"
          :disabled="dadosTratativa == ''"
        ></v-text-field>
        <v-text-field
          v-show="form.atendeuLigacao == 'SIM' && form.clienteRevertido == 'SIM'"
          placeholder="Oferta Aceita"
          label="Oferta Aceita"
          outlined
          dense
          v-model="form.ofertaAceite"
          :disabled="dadosTratativa == ''"
        ></v-text-field>
        <v-text-field
          v-show="form.atendeuLigacao == 'SIM' && form.ofertaAceite"
          placeholder="Data do Cancelamento da OS"
          label="Data do Cancelamento da OS"
          outlined
          dense
          v-model="form.dataCancelamentoOS"
          v-mask="[masks.data]"
          :rules="[() => dataIsValid(form.dataCancelamentoOS) || 'Data Inválida']"
          :disabled="dadosTratativa == ''"
        ></v-text-field>
      </div>
    </fieldset>
    <div class="pa-2" style="display: flex; gap: 5px; justify-content: end; flex-wrap: wrap">
      <v-btn
        color="info"
        @click="loadNovoCaso"
        :disabled="dadosTratativa != ''"
        :loading="isLoading"
        class="rounded-r-xl rounded-bl-xl"
      >
        Novo Tratamento
      </v-btn>
      <v-btn
        color="orange white--text"
        @click="agendar = true"
        :disabled="dadosTratativa == ''"
        class="rounded-r-xl rounded-bl-xl"
      >
        Agendar
      </v-btn>
      <v-btn
        color="success"
        @click="executaAcoesTabulador(3)"
        :disabled="!this.formIsValid()"
        class="rounded-r-xl rounded-bl-xl"
      >
        Salvar
      </v-btn>
      <v-btn color="error" @click="clearForm" class="rounded-r-xl rounded-bl-xl">Limpar</v-btn>
    </div>
    <agendar-caso-component
      :abrirSheetFooterAgendar="agendar"
      @updated-close="agendar = !agendar"
      @updated:salvar="finalizarAgendarCaso"
    ></agendar-caso-component>
  </div>
</template>

<script>
  import AgendarCasoComponent from '../../../../../shared/components/bottomSheet/agendamento.vue'
  import config from '../../../../../core/config'
  import masks from '../../../../../shared/masks/masks'
  import alerts from '../../../../../mixins/alerts.mixins'
  export default {
    components: { AgendarCasoComponent },
    name: 'formulario-tratativa',
    data: () => ({
      agendar: false,
      dadosTratativa: [],
      isLoading: false,
      form: {
        titularContrato: null,
        atendeuLigacao: null,
        motivoNaoContato: null,
        clienteRevertido: null,
        motivoNaoAceite: null,
        ofertaAceite: null,
        dataCancelamentoOS: null,
        nomeCompletoTerceiro: null,
        dataAgendamento: null
      }
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      formIsValid() {
        return (
          (this.form.atendeuLigacao == 'NÃO' && this.form.motivoNaoContato) ||
          (this.form.atendeuLigacao == 'SIM' &&
            this.form.titularContrato == 'SIM' &&
            this.form.clienteRevertido == 'SIM' &&
            this.form.ofertaAceite &&
            this.dataIsValid(this.form.dataCancelamentoOS)) ||
          (this.form.atendeuLigacao == 'SIM' &&
            this.form.titularContrato == 'SIM' &&
            this.form.clienteRevertido == 'NÃO' &&
            this.form.motivoNaoAceite) ||
          (this.form.atendeuLigacao == 'SIM' &&
            this.form.titularContrato == 'SIM' &&
            this.form.nomeCompletoTerceiro &&
            this.form.clienteRevertido == 'SIM' &&
            this.form.ofertaAceite &&
            this.dataIsValid(this.form.dataCancelamentoOS)) ||
          (this.form.atendeuLigacao == 'SIM' &&
            this.form.titularContrato == 'NÃO' &&
            this.form.nomeCompletoTerceiro &&
            this.form.clienteRevertido == 'SIM' &&
            this.form.ofertaAceite &&
            this.dataIsValid(this.form.dataCancelamentoOS)) ||
          (this.form.atendeuLigacao == 'SIM' &&
            this.form.titularContrato == 'NÃO' &&
            this.form.nomeCompletoTerceiro &&
            this.form.clienteRevertido == 'NÃO' &&
            this.form.motivoNaoAceite)
        )
      },
      dataIsValid(string) {
        const regexData = /^\d{2}\/\d{2}\/\d{4}$/
        if (!regexData.test(string)) {
          return false
        }

        let dataParse = string.split('/')
        let dia = parseInt(dataParse[0], 10)
        let mes = parseInt(dataParse[1], 10)
        let ano = parseInt(dataParse[2], 10)

        const date = new Date(ano, mes, dia)

        return date.getFullYear() === ano && date.getMonth() == mes && date.getDate() == dia
      },
      async finalizarAgendarCaso(e) {
        await this.executaAcoesTabulador(2, e)
      },
      async executaAcoesTabulador(numberAction, dataAgendamento) {
        try {
          this.form.numCaso = this.dadosTratativa.NUM_CASO
          this.form.statusTratativa = numberAction
          this.form.dataAgendamento = numberAction == 2 ? dataAgendamento : null
          let urlData = `${config.baseUrl}api/shared/formularios/piloto_reversao/exec_acoes/`
          await this.$api.post(urlData, this.form)
          this.toast(
            `Caso nª: ${this.dadosTratativa.NUM_CASO} ${
              numberAction == 2 ? 'agendado' : 'finalizado'
            } com sucesso!`,
            'bottom-right',
            false,
            3000,
            'success'
          )
          this.dadosTratativa = []
          this.clearForm()
        } catch (e) {
          this.toast(
            `Oops! Caso ${this.dadosTratativa.NUM_CASO} não foi finalizado!`,
            'bottom-right',
            false,
            3000,
            'error'
          )
        }
      },
      clearForm() {
        let newForm = Object.assign({}, this.form)
        Object.keys(newForm).map(item => {
          newForm[item] = null
        })
        this.form = newForm
      },
      async loadNovoCaso() {
        try {
          this.isLoading = true
          let urlData = `${config.baseUrl}api/shared/formularios/piloto_reversao/novo_caso/${this.usuarioAlmope}`
          var res = await this.$api.get(urlData)
          this.dadosTratativa = res.data
          this.toast(
            `Caso nª: ${res.data.NUM_CASO}, em andamento!`,
            'bottom-right',
            false,
            3000,
            'success'
          )
          this.isLoading = false
        } catch (e) {
          this.toast(
            `Oops! Não há casos para tratativa, sinalize ao seu gestor!`,
            'bottom-right',
            false,
            3000,
            'error'
          )
          this.isLoading = false
        }
      }
    },
    watch: {
      'form.clienteRevertido': function () {
        this.form.motivoNaoAceite = null
        this.form.ofertaAceite = null
        this.form.dataCancelamentoOS = null
      },
      'form.titularContrato': function () {
        this.form.nomeCompletoTerceiro = null
      },
      'form.atendeuLigacao': function () {
        this.form.motivoNaoContato = null
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Jost:wght@300&display=swap"); */

  fieldset {
    border: 1px solid rgb(190, 190, 190);
  }
  .fields {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  legend {
    font-size: 20px;
    padding: 5px;
    margin-left: 10px;
  }

  h3 {
    font-family: 'Jost', sans-serif;
    font-size: 2em;
  }
</style>
