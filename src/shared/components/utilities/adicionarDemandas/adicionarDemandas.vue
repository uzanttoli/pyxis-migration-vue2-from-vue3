<template>
  <v-card>
    <title-negative-margin
      title="Adicionar Demanda"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-col>
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" name="nome cliente" rules="required">
                <v-text-field
                  v-model="adicionarDemandas.nameClient"
                  label="Nome Cliente"
                  placeholder="Insira o nome do cliente"
                  outlined
                  dense
                  :error-messages="errors"
                  required
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" name="produto" rules="required">
                <v-select
                  item-text="DES"
                  item-value="VALUE"
                  :items="unidadeNegocio"
                  @change="loadTipoSolicitacao()"
                  v-model="adicionarDemandas.produto"
                  label="Informe o produto"
                  :error-messages="errors"
                  outlined
                  dense
                  required
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider rules="required" name="nome contato" v-slot="{ errors }">
                <v-text-field
                  v-model="adicionarDemandas.nameContact"
                  label="Nome do Contato"
                  :error-messages="errors"
                  placeholder="Insira o nome do contato"
                  outlined
                  dense
                  required
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="mt-n7">
              <validation-provider rules="required" name="solicitação" v-slot="{ errors }">
                <v-select
                  item-text="DES"
                  item-value="VALUE"
                  :items="tipoSolicitacao"
                  no-data-text="Selecione primeiro o produto."
                  :error-messages="errors"
                  @change="loadDetalheSolicitacao()"
                  v-model="adicionarDemandas.solicitacao"
                  label="Solicitação"
                  outlined
                  dense
                  required
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="mt-n7">
              <validation-provider
                rules="required"
                name="mencionou canais criticos"
                v-slot="{ errors }"
              >
                <v-select
                  v-model="adicionarDemandas.canalCritico"
                  :items="canaisCritico"
                  :error-messages="errors"
                  label="Mencionou canais criticos?"
                  outlined
                  dense
                  required
                ></v-select>
              </validation-provider>
            </v-col>

            <v-col
              cols="4"
              class="mt-n7"
              v-if="
                adicionarDemandas.produto != 'CLARO PRE' && adicionarDemandas.produto != 'CLARO TV'
              "
            >
              <validation-provider
                rules="required|min:14|max:14"
                name="número contrato"
                v-slot="{ errors }"
              >
                <v-text-field
                  v-model="adicionarDemandas.contractProtocol"
                  v-mask="masks.contratoComCodCidade"
                  label="Contrato"
                  placeholder="Insira o numero do contrato"
                  outlined
                  :error-messages="errors"
                  dense
                  required
                ></v-text-field>
              </validation-provider>
            </v-col>

            <v-col cols="4" class="mt-n7" v-else>
              <validation-provider rules="required" name="núm. protocolo" v-slot="{ errors }">
                <v-text-field
                  v-mask="masks.protocolo"
                  v-model="adicionarDemandas.contractProtocol"
                  label="Protocolo"
                  :error-messages="errors"
                  placeholder="Insira o numero do protocolo"
                  outlined
                  dense
                  required
                ></v-text-field>
              </validation-provider>
            </v-col>

            <v-col cols="4" class="mt-n7">
              <validation-provider
                rules="required|min:14|max:15"
                name="núm telefone"
                v-slot="{ errors }"
              >
                <v-text-field
                  v-model="adicionarDemandas.msisdnTelefone"
                  label="MSISDN / Telefone"
                  placeholder="Informe o número do telefone"
                  :error-messages="errors"
                  v-mask="[masks.telefoneBrMovel, masks.telefoneBrFixo]"
                  required
                  outlined
                  dense
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="mt-n7">
              <validation-provider rules="required" name="detalhe" v-slot="{ errors }">
                <v-select
                  v-model="adicionarDemandas.detalhe"
                  :items="detalheSolicitacao"
                  no-data-text="Selecione primeiro a solicitação."
                  :error-messages="errors"
                  item-text="DES"
                  item-value="VALUE"
                  label="Detalhe"
                  outlined
                  dense
                  required
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="mt-n7">
              <validation-provider
                v-slot="{ errors }"
                name="núm. contato"
                rules="required|min:14|max:15"
              >
                <v-text-field
                  v-model="adicionarDemandas.numberPhone"
                  v-mask="[masks.telefoneBrMovel, masks.telefoneBrFixo]"
                  :error-messages="errors"
                  label="Telefone Contato"
                  placeholder="Insira o numero de contato"
                  outlined
                  dense
                  required
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12" class="mt-n7">
              <validation-provider rules="required|min:15" name="observação" v-slot="{ errors }">
                <v-textarea
                  auto-grow
                  v-model="adicionarDemandas.observacao"
                  label="Observação"
                  rows="4"
                  row-height="25"
                  outlined
                  dense
                  required
                  :error-messages="errors"
                ></v-textarea>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row justify="end" class="ma-1" style="gap: 10px">
            <v-btn color="success" :disabled="invalid" type="submit">Enviar</v-btn>
            <v-btn color="red white--text" @click="limparForm()">Limpar</v-btn>
          </v-row>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>

<script>
  import Masks from '../../../masks/masks'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  export default {
    components: { ValidationObserver, ValidationProvider },
    props: {
      dialogAdicionarDemandas: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      canaisCritico: ['SIM', 'NÃO'],
      adicionarDemandas: {
        nameClient: null,
        nameContact: null,
        numberPhone: null,
        contractProtocol: null,
        msisdnTelefone: null,
        produto: null,
        solicitacao: null,
        detalhe: null,
        canalCritico: null,
        observacao: null,
        dataEnvio: null
      }
    }),
    computed: {
      unidadeNegocio() {
        return this.$store.getters.unidadeNegocio
      },
      tipoSolicitacao() {
        return this.$store.getters.tipoSolicitacao
      },
      detalheSolicitacao() {
        return this.$store.getters.detalheSolicitacao
      },
      dataEnvioForm() {
        let data = new Date()
        let dia = data.getDate().toString()
        let diaF = dia.length == 1 ? '0' + dia : dia
        let mes = (data.getMonth() + 1).toString()
        let mesF = mes.length == 1 ? '0' + mes : mes
        let anoF = data.getFullYear()

        return diaF + '/' + mesF + '/' + anoF
      },
      masks() {
        return Masks
      }
    },
    methods: {
      limparForm() {
        let newForm = Object.assign({}, this.adicionarDemandas)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.adicionarDemandas = newForm
        this.$refs.observer.reset()
      },
      loadUnidadeNegocio() {
        this.$store.dispatch('loadUnidadeNegocio')
      },
      loadTipoSolicitacao() {
        if (this.adicionarDemandas.produto) this.adicionarDemandas.solicitacao = null
        this.$store.dispatch('loadTipoSolicitacao', this.adicionarDemandas.produto)
      },
      loadDetalheSolicitacao() {
        if (this.adicionarDemandas.solicitacao) this.adicionarDemandas.detalhe = null
        this.$store.dispatch('loadDetalheSolicitacao', {
          produto: this.adicionarDemandas.produto,
          solicitacao: this.adicionarDemandas.solicitacao
        })
      },
      async submit() {
        this.adicionarDemandas.almope = this.$store.getters.usuario.almope
        this.adicionarDemandas.nome = this.$store.getters.usuario.nome
        this.adicionarDemandas.superior1 = this.$store.getters.usuario.superior1
        this.adicionarDemandas.superior2 = this.$store.getters.usuario.superior2
        this.adicionarDemandas.regional = this.$store.getters.usuario.regional
        this.adicionarDemandas.dataEnvio = this.dataEnvioForm
        this.adicionarDemandas.observacao = this.adicionarDemandas.observacao.replaceAll('\n', ' ')
        await this.$store.dispatch('saveDataFormAdicionarDemandas', this.adicionarDemandas)

        // let urlData = `${config.baseUrl}api/shared/demandas_supervisor/create/`;
        // await this.$api.post(urlData, this.adicionarDemandas);
        this.limparForm()
      },
      initializeData() {
        this.loadUnidadeNegocio()
      }
    },
    watch: {
      dialogAdicionarDemandas() {
        if (this.dialogAdicionarDemandas == true) {
          this.initializeData()
        }
      }
    },
    created() {
      // this.loadUnidadeNegocio();
      this.initializeData()
    }
  }
</script>

<style></style>
