import config from '../../../../core/config'
import alerts from '../../../../mixins/alerts.mixins'

export default (await import('vue')).defineComponent({
  components: {
    VAutocomplete,
    VSelect,
    VTextArea,
    VTextField,
    VInputField,
    AgendarCasoComponent
  },
  data: () => ({
    idCaso: null,
    existeProtocolo: null,
    formCheckoutContigencia: {
      numeroLinha: null,
      dataAtivacaoMig: null,
      codigoDealer: null,
      telefoneContato: null,
      nomeclaturaPlano: null,
      cpf: null
    },
    formTratativaContigencia: {
      acaoRealizada: null,
      isencaoMulta: null,
      contestacaoValores: null,
      valorContestado: null,
      necessarioProtocoloEps: null,
      protocoloGerado: null,
      memorandoProtocolo: null
    },
    agendar: false,
    items: [],
    simNao: [
      { text: 'SIM', value: 'SIM' },
      { text: 'NAO', value: 'NAO' }
    ]
  }),
  mixins: [alerts],
  computed: {
    usuarioAlmope() {
      return this.$store.getters.usuario.almope
    },
    itemsList() {
      return {
        simNao: this.simNao,
        listAcaoRealizada: this.listAcaoRealizada
      }
    },
    listAcaoRealizada() {
      let items = this.items
      let novosItems = items
        .filter(e => {
          return e.NOME_CAMPO == 'QUAL_ACAO_REALIZADA?'
        })
        .map(item => {
          return {
            text: item.VALOR_CAMPO,
            value: item.VALOR_CAMPO
          }
        })
      return novosItems
    },
    listFieldDadosCheckout() {
      let fieldsDados = [
        {
          id: 1,
          component: 'v-text-field',
          label: 'Número da linha',
          model: 'numeroLinha',
          isDisabled: false,
          readonly: true,
          items: null,
          controleFcr: null,
          dependecies: null,
          valueExpected: null,
          isMasks: true,
          masks: 'telefoneBrFixo',
          cols: 4
        },
        {
          id: 2,
          component: 'v-text-field',
          label: 'Data Ativação ou migração',
          model: 'dataAtivacaoMig',
          items: null,
          isDisabled: false,
          readonly: true,
          controleFcr: null,
          dependecies: null,
          valueExpected: null,
          isMasks: true,
          masks: 'data',
          cols: 4
        },
        {
          id: 3,
          component: 'v-text-field',
          label: 'Código Dealer Ativação/Migração(cod.vendedor):',
          model: 'codigoDealer',
          items: null,
          isDisabled: false,
          readonly: true,
          controleFcr: null,
          dependecies: null,
          valueExpected: null,
          isMasks: false,
          masks: null,
          cols: 4
        },
        {
          id: 4,
          component: 'v-text-field',
          label: 'Telefone para contato:',
          model: 'telefoneContato',
          items: null,
          isDisabled: false,
          readonly: true,
          controleFcr: null,
          dependecies: null,
          valueExpected: null,
          isMasks: true,
          masks: 'telefoneBrFixo',
          cols: 4
        },
        {
          id: 5,
          component: 'v-text-field',
          label: 'CPF:',
          model: 'cpf',
          items: null,
          isDisabled: false,
          readonly: true,
          controleFcr: null,
          dependecies: null,
          valueExpected: null,
          isMasks: true,
          masks: 'cpf',
          cols: 4
        },
        {
          id: 6,
          component: 'v-text-field',
          label: 'Nomenclatura do Plano Cliente:',
          model: 'nomeclaturaPlano',
          items: null,
          isDisabled: false,
          readonly: true,
          controleFcr: null,
          dependecies: null,
          valueExpected: null,
          isMasks: false,
          masks: null,
          cols: 4
        }
      ]
      return fieldsDados
    }
  },
  methods: {
    async finalizarAgendarCaso(e) {
      try {
        let data = {
          ofensorAlmaviva: this.formTratativaContigencia.ofensorAlmaviva,
          loginOfensor: this.formTratativaContigencia.loginOfensor,
          acaoRealizada: this.formTratativaContigencia.acaoRealizada,
          isencaoMulta: this.formTratativaContigencia.isencaoMulta,
          contestacaoValores: this.formTratativaContigencia.contestacaoValores,
          valorContestado: this.formTratativaContigencia.valorContestado,
          necessarioProtocoloEps: this.formTratativaContigencia.necessarioProtocoloEps,
          protocoloGerado: this.formTratativaContigencia.protocoloGerado,
          idCaso: this.idCaso,
          memorandoProtocolo: this.formTratativaContigencia.memorandoProtocolo,
          dataAgendamento: this.formTratativaContigencia.acaoRealizada == 'AGENDAMENTO' ? e : null
        }

        let urlData = `${config.baseUrl}api/shared/formularios/reclamacao_contigencia/alter_status_caso/`
        await this.$api.post(urlData, data)
        this.clearForm()
        this.clearDadosCheckout()
        this.idCaso = null
        this.toast(`Tratativa salva com sucesso!`, 'top-right', false, 4000, 'success')
      } catch (e) {
        this.toast(
          'Ops! Não conseguimos salvar seus dados. Por favor, tente novamente!',
          'top-right',
          false,
          4000,
          'error'
        )
      }
    },
    async newCase() {
      try {
        let urlData = `${config.baseUrl}api/shared/formularios/reclamacao_contigencia/novo_caso/${this.usuarioAlmope}`
        var res = await this.$api.get(urlData)
        this.formCheckoutContigencia.numeroLinha = res.data[0].NUMERO_LINHA
        this.formCheckoutContigencia.dataAtivacaoMig = res.data[0].DATA_ATIV_MIG
        this.formCheckoutContigencia.codigoDealer = res.data[0].CODIGO_DEALER
        this.formCheckoutContigencia.telefoneContato = res.data[0].TELEFONE_CONTATO
        this.formCheckoutContigencia.nomeclaturaPlano = res.data[0].NOMENCLATURA_PLANO
        this.formCheckoutContigencia.cpf = res.data[0].CPF
        this.idCaso = res.data[0].NUM_CASO
        this.toast(
          `Caso Nª: ${res.data[0].NUM_CASO} foi atribuido a você!`,
          'top-right',
          false,
          4000,
          'success'
        )
      } catch (e) {
        this.toast('Ops! Não há casos para tratativa.', 'top-right', false, 4000, 'warning')
      }
    },
    clearForm() {
      let newForm = Object.assign({}, this.formTratativaContigencia)
      Object.keys(newForm).forEach(item => {
        newForm[item] = null
      })

      this.formTratativaContigencia = newForm
    },
    clearDadosCheckout() {
      let newForm = Object.assign({}, this.formCheckoutContigencia)
      Object.keys(newForm).forEach(item => {
        newForm[item] = null
      })

      this.formCheckoutContigencia = newForm
    },
    updateFormField(model, value) {
      this.formTratativaContigencia[model] = value
    },
    isDependecis(typeDependency, dependecis, valueExpected) {
      if (typeDependency == 'esperarValor') {
        if (!dependecis || !valueExpected) return true
        if (valueExpected.includes(this.formTratativaContigencia[dependecis])) {
          return true
        }
        return false
      }
    },
    isNotDependecis(valueExpected) {
      if (!valueExpected) return true
      if (
        this.formTratativaContigencia[valueExpected] == 'AGENDAMENTO' ||
        this.formTratativaContigencia[valueExpected] == null
      ) {
        return false
      }
      return true
    },
    loadDadosCampo() {
      let urlData = `${config.baseUrl}api/shared/formularios/reclamacao_contigencia/listar_dados_campo`
      this.$api.get(urlData).then(res => {
        this.items = res.data
      })
    },
    formIsValid() {}
  },
  created() {
    this.loadDadosCampo()
  }
})
