<template>
  <v-card>
    <title-negative-margin
      className="rounded-r-xl"
      :title="title"
      :maxWidth="600"
    ></title-negative-margin>
    <v-col>
      <validation-observer ref="observer" v-slot="{ invalid, validate }">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="3">
              <validation-provider
                v-slot="{ errors }"
                name="nª contrato"
                rules="required|max:14|min:14"
              >
                <v-text-field
                  dense
                  outlined
                  label="Número do contrato"
                  placeholder="Número do contrato"
                  required
                  :error-messages="errors"
                  v-model="formMotivoCancelamento.contrato"
                  v-mask="[masks.contratoComCodCidade]"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3">
              <validation-provider v-slot="{ errors }" name="nª contato" rules="required">
                <v-text-field
                  dense
                  outlined
                  label="Número telefone/celular"
                  placeholder="Número telefone/celular"
                  required
                  :error-messages="errors"
                  v-model="formMotivoCancelamento.contato"
                  v-mask="[masks.telefoneBrMovel, masks.telefoneBrFixo]"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3">
              <validation-provider
                v-slot="{ errors }"
                name="motivo para que não cancelasse"
                rules="required"
              >
                <v-select
                  dense
                  outlined
                  label="Perguntou oque poderia fazer para que não cancelasse?"
                  placeholder="Perguntou oque poderia fazer para que não cancelasse?"
                  required
                  :items="['SIM', 'NÃO']"
                  :error-messages="errors"
                  v-model="formMotivoCancelamento.oquePoderiaFazerNaoCancelar"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3">
              <validation-provider
                v-slot="{ errors }"
                name="conselho dado a claro"
                rules="required"
              >
                <v-select
                  dense
                  outlined
                  label="Perguntou qual o conselho dado a claro?"
                  placeholder="Perguntou qual o conselho dado a claro?"
                  required
                  :items="['SIM', 'NÃO']"
                  :error-messages="errors"
                  v-model="formMotivoCancelamento.conselhoDadoClaro"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="mt-n7">
              <validation-provider v-slot="{ errors }" name="motivo cancelamento" rules="required">
                <v-select
                  dense
                  outlined
                  label="Motivo do cancelamento?"
                  placeholder="Motivo do cancelamento?"
                  required
                  :items="itemsMotivoCancelamento"
                  item-text="motivo"
                  :error-messages="errors"
                  v-model="formMotivoCancelamento.motivo"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="12" class="mt-n7">
              <v-alert
                v-if="formMotivoCancelamento.motivo"
                border="left"
                colored-border
                type="warning"
                dense
                elevation="2"
              >
                {{ textMotivo[0].detalhe }}
              </v-alert>
            </v-col>
            <v-col cols="12" class="mt-n4">
              <validation-provider
                v-slot="{ errors }"
                name="descrição"
                rules="required|max:100|min:15"
              >
                <v-textarea
                  outlined
                  placeholder="Observação"
                  label="Observação"
                  auto-grow
                  counter="100"
                  :error-messages="errors"
                  maxlength="100"
                  v-model="formMotivoCancelamento.descricao"
                ></v-textarea>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="ma-0 pa-0" justify="end">
            <v-btn type="submit" :disabled="invalid" color="success" class="mr-2" :loading="isSend">
              Salvar
            </v-btn>
            <v-btn color="error" @click="limparForm">Limpar</v-btn>
          </v-row>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import masks from '../../../../shared/masks/masks'
  import config from '../../../../core/config'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    components: { ValidationObserver, ValidationProvider },
    props: {
      title: {
        type: String
      }
    },
    data: () => ({
      isSend: false,
      formMotivoCancelamento: {
        contrato: null,
        contato: null,
        oquePoderiaFazerNaoCancelar: null,
        conselhoDadoClaro: null,
        motivo: null,
        descricao: null
      },
      itemsMotivoCancelamento: [
        { motivo: 'ERA MDE MAS FIZERAM UM CONTRATO NOVO' },
        { motivo: 'TÉCNICO NÃO CUMPRIU AGENDA' },
        { motivo: 'CANCELAMENTO POR SEGURANÇA PÚBLICA' }
        // { motivo: "CANCELAMENTO POR ERRO TÉCNICO" },
        // { motivo: "CANCELAMENTO POR SEGURANÇA PÚBLICA " },
        // { motivo: "CANCELAMENTO POR ERRO DO VENDEDOR" },
        // { motivo: "CANCELAMENTO POR VENDA DE CONTRATO AO INVÉS DE MDE" },
        // { motivo: "CANCELAMENTO POR AGENDA NÃO CUMPRIDA" },
        // { motivo: "CANCELAMENTO POR TRANSFERÊNCIA DE TITULARIDADE NÃO EXECUTADA", },
        // { motivo: "CANCELAMENTO POR VENDA DE CONTRATO AO INVÉS DE TRF. DE TITULARIDADE",},
        // { motivo: "MDE + CONTATO DA CONCORRÊNCIA" },
      ],
      detalheMotivoCancelamento: [
        {
          motivo: 'ERA MDE MAS FIZERAM UM CONTRATO NOVO',
          detalhe:
            'Tabule este motivo quando você terá que cancelar o contrato antigo do cliente, pois o vendedor fez um novo contrato quando deveria fazer uma mudança de endereço'
        },
        {
          motivo: 'TÉCNICO NÃO CUMPRIU AGENDA',
          detalhe:
            'Tabule este motivo quando você vai cancelar um contrato porque o técnico não foi até a casa do cliente ou quando executou um serviço de maneira incorreta.'
        },
        {
          motivo: 'CANCELAMENTO POR SEGURANÇA PÚBLICA',
          detalhe:
            'Tabule este motivo quando você executar o cancelamento de um contrato porque a área do cliente é dominada por tráfico ou milícia.'
        }

        // {
        //   motivo: "CANCELAMENTO POR ERRO TÉCNICO",
        //   detalhe: "Contrato que você fez o cancelamento por algum erro do técnico. Exemplos: técnico danificou equipamentos ou a casa, técnico disse que não instalaria o produto ou que não funciona, técnico tratou a cliente mal...",
        // },
        // {
        //   motivo: "CANCELAMENTO POR SEGURANÇA PÚBLICA ",
        //   detalhe: "O cancelamento do contrato será executado pelo fato de o local do cliente ser dominado por milícias ou tráfico.",
        // },
        // {
        //   motivo: "CANCELAMENTO POR ERRO DO VENDEDOR",
        //   detalhe: "Contrato que você fez o cancelamento pois o vendedor passou alguma oferta enganosa e, mesmo que você tenha tentado ainda sim o cliente optou por cancelar (somente para desconexão. Acesso virtua não é valido)",
        // },
        // {
        //   motivo: "CANCELAMENTO POR VENDA DE CONTRATO AO INVÉS DE MDE",
        //   detalhe: "Quando o vendedor faz mais um contrato para o cliente quando o necessário era apenas mudar o endereço.",
        // },
        // {
        //   motivo: "CANCELAMENTO POR AGENDA NÃO CUMPRIDA",
        //   detalhe:"Cancelamento que ocorre devido ao técnico não ter ido até a residência do cliente",
        // },
        // {
        //   motivo: "CANCELAMENTO POR TRANSFERÊNCIA DE TITULARIDADE NÃO EXECUTADA",
        //   detalhe: "Cancelamento que foi executado porque a transferência de titularidade anterior (feita por você ou não) não foi executada.",
        // },
        // {
        //   motivo: "CANCELAMENTO POR VENDA DE CONTRATO AO INVÉS DE TRF. DE TITULARIDADE",
        //   detalhe: "Quando o vendedor faz mais um contrato para o cliente quando o necessário era apenas mudar a titularidade.",
        // },
        // {
        //   motivo: "MDE + CONTATO DA CONCORRÊNCIA",
        //   detalhe: "O cliente ia mudar o endereço e alguém dise que não teria cabeamento e vendeu outro contrato para ele.",
        // },
      ]
    }),
    mixins: [alerts],
    computed: {
      textMotivo() {
        let motivo = this.detalheMotivoCancelamento.filter(item => {
          return this.formMotivoCancelamento.motivo == item.motivo
        })
        return motivo ?? []
      },
      masks() {
        return masks
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      async submit() {
        try {
          this.isSend = true
          this.formMotivoCancelamento.usuarioAlmope = this.usuarioAlmope
          let urlData = `${config.baseUrl}api/shared/formularios/motivo_cancelamento/salvar`
          await this.$api.post(urlData, this.formMotivoCancelamento)
          this.toast('Tabulação salva com sucesso!', 'top-right', false, 2000, 'success')
          this.limparForm()
          this.isSend = false
        } catch (error) {
          this.toast('Tabulação não foi salva, tente novamente!', 'top-right', false, 2000, 'error')
          this.isSend = false
        }
      },
      limparForm() {
        let newForm = Object.assign({}, this.formMotivoCancelamento)
        Object.keys(newForm).forEach(item => {
          return (newForm[item] = null)
        })
        this.formMotivoCancelamento = newForm
        this.$refs.observer.reset()
      }
    }
  }
</script>

<style></style>
