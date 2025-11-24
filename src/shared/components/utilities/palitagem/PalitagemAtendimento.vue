<template>
  <v-card ref="form">
    <title-negative-margin title="Palitagem" className="rounded-r-xl"></title-negative-margin>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <form @submit.prevent="submit">
        <v-col class="py-5">
          <v-row>
            <v-tooltip right>
              <template v-slot:activator="{ attrs, on }">
                <v-col v-bind="attrs" v-on="on" cols="4">
                  <validation-provider v-slot="{ errors }" rules="required" name="produto">
                    <v-select
                      label="Selecione a campanha"
                      placeholder="Selecione a campanha"
                      :items="produtos"
                      @change="loadMotivoContato()"
                      dense
                      :error-messages="errors"
                      outlined
                      required
                      v-model="palitagem.produto"
                    ></v-select>
                  </validation-provider>
                </v-col>
              </template>
              <span>Selecione o produto</span>
            </v-tooltip>
            <v-tooltip right v-if="palitagem.produto == 'MTF'">
              <template v-slot:activator="{ attrs, on }">
                <v-col v-bind="attrs" v-on="on" cols="4">
                  <validation-provider v-slot="{ errors }" rules="required" name="produto">
                    <v-select
                      dense
                      outlined
                      required
                      :items="[
                        'CLARO BOX',
                        'INTERNET',
                        'FONE',
                        'TV (DTH VIA SATELITE)',
                        'TV (HFC VIA CABO)'
                      ]"
                      placeholder="Selecione o produto"
                      label="Selecione o produto"
                      v-model="palitagem.produtoCliente"
                      :error-messages="errors"
                    ></v-select>
                  </validation-provider>
                </v-col>
              </template>
              <span>Selecione o produto</span>
            </v-tooltip>

            <!-- adicionado 24/05/2024 -->
            <v-tooltip right>
              <template v-slot:activator="{ attrs, on }">
                <v-col v-bind="attrs" v-on="on" cols="4">
                  <validation-provider
                    v-slot="{ errors }"
                    name="cod. contrato"
                    rules="required|max:3|min:3"
                  >
                    <v-text-field
                      title="Cód. Contrato"
                      placeholder="Cód. Contrato"
                      label="Cód. Contrato"
                      v-model="palitagem.codCidade"
                      @change="filterCodCidade"
                      outlined
                      dense
                      :error-messages="errors"
                      required
                      v-mask="['###']"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </template>
              <span>Digite o cód. Contrato</span>
            </v-tooltip>
            <v-tooltip right>
              <template v-slot:activator="{ attrs, on }">
                <v-col v-bind="attrs" v-on="on" cols="4">
                  <validation-provider v-slot="{ errors }" rules="required" name="nome da cidade">
                    <v-autocomplete
                      title="Nome da Cidade"
                      label="Nome da Cidade"
                      placeholder="Nome da Cidade"
                      outlined
                      required
                      :items="listCidades"
                      item-text="NOME_CIDADE"
                      v-model="palitagem.nomeCidade"
                      @change="filterNomeCidade"
                      :error-messages="errors"
                      dense
                      no-data-text="Cidade não encontrada!"
                    ></v-autocomplete>
                  </validation-provider>
                </v-col>
              </template>
              <span>Digite o contrato aqui</span>
            </v-tooltip>
            <v-col cols="4">
              <validation-provider
                v-slot="{ errors }"
                name="nª contrato"
                rules="required|max:10|min:10"
              >
                <v-text-field
                  title="Nª Contrato"
                  label="Nª Contrato"
                  placeholder="Nª Contrato"
                  outlined
                  required
                  :error-messages="errors"
                  dense
                  v-model="palitagem.numeroContrato"
                  v-mask="['########-#']"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <!--  -->
            <v-tooltip left>
              <template v-slot:activator="{ attrs, on }">
                <v-col v-bind="attrs" v-on="on" cols="4">
                  <validation-provider v-slot="{ errors }" rules="required" name="motivo contato">
                    <v-select
                      :error-messages="errors"
                      label="Motivo de contato?"
                      :items="motivosContato"
                      @change="palitagem.motivo != 'CANCELAMENTO' ? loadSubMotivosContato() : ''"
                      item-text="DES"
                      item-value="VALUE"
                      dense
                      required
                      outlined
                      v-model="palitagem.motivo"
                    ></v-select>
                  </validation-provider>
                </v-col>
              </template>
              <span>Motivo de contato?</span>
            </v-tooltip>
          </v-row>
          <v-row v-if="palitagem.motivo != 'CANCELAMENTO'">
            <v-tooltip right>
              <template v-slot:activator="{ attrs, on }">
                <v-col cols="4" v-bind="attrs" v-on="on">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="submotivo contato"
                  >
                    <v-select
                      label="Sub motivo do contato?"
                      :items="subMotivoContato"
                      no-data-text="Selecione primeiro o motivo."
                      item-text="DES"
                      item-value="VALUE"
                      dense
                      outlined
                      required
                      v-model="palitagem.subMotivo"
                      :error-messages="errors"
                    ></v-select>
                  </validation-provider>
                </v-col>
              </template>
              <span>Sub. motivo do contato?</span>
            </v-tooltip>
            <template v-if="palitagem.produto != 'MPLAY'">
              <v-tooltip right>
                <template v-slot:activator="{ attrs, on }">
                  <v-col cols="4" v-bind="attrs" v-on="on">
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required"
                      name="cliente encaminhado para canais autoatendimento"
                    >
                      <v-select
                        label="Cliente encaminhado para canais de autoatendimento?"
                        :items="ofertouCanaisAutoatendimento"
                        @change="loadCanaisDeAutoatendimento()"
                        item-text="text"
                        item-value="value"
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        v-model="palitagem.clienteEncaminhadoCanaisAutoAtendimento"
                      ></v-select>
                    </validation-provider>
                  </v-col>
                </template>
                <span>Cliente encaminhado para canais de autoatendimento?</span>
              </v-tooltip>
              <v-tooltip right>
                <template v-slot:activator="{ attrs, on }">
                  <v-col cols="4" v-bind="attrs" v-on="on">
                    <validation-provider v-slot="{ errors }" rules="required" name="canal digital">
                      <v-select
                        :items="canaisDeAutoatendimento"
                        no-data-text="Selecione primeiro o campo acima."
                        label="Cliente informa se tentou algum canal digital antes de acionar a central"
                        item-text="DESCRICAO"
                        item-value="ID"
                        dense
                        outlined
                        required
                        class="mb-5"
                        v-model="palitagem.canalAtendimento"
                        :error-messages="errors"
                      ></v-select>
                    </validation-provider>
                  </v-col>
                </template>
                <span>
                  Cliente informa se tentou algum canal digital antes de acionar a central
                </span>
              </v-tooltip>
            </template>
            <template v-else>
              <v-tooltip right>
                <template v-slot:activator="{ attrs, on }">
                  <v-col cols="4" v-bind="attrs" v-on="on">
                    <validation-provider
                      v-slot="{ errors }"
                      rules="required"
                      name="encaminhado ouvidoria"
                    >
                      <v-select
                        label="Cliente encaminhado é de ouvidoria?"
                        placeholder="Cliente encaminhado é de ouvidoria?"
                        :items="['SIM', 'NÃO']"
                        :error-messages="errors"
                        dense
                        outlined
                        required
                        class="rounded-bl-xl rounded-r-xl"
                        v-model="palitagem.clienteOuvidoria"
                      ></v-select>
                    </validation-provider>
                  </v-col>
                </template>
                <span>Cliente encaminhado é de ouvidoria?</span>
              </v-tooltip>
              <v-tooltip right>
                <template v-slot:activator="{ attrs, on }">
                  <v-col cols="4" v-bind="attrs" v-on="on">
                    <validation-provider
                      v-slot="{ errors }"
                      name="registro ouvidoria"
                      rules="required"
                    >
                      <v-select
                        label="Existe registro da ouvidoria?"
                        placeholder="Existe registro da ouvidoria?"
                        :items="['SIM', 'NÃO']"
                        dense
                        required
                        outlined
                        class="rounded-bl-xl rounded-r-xl"
                        v-model="palitagem.existeRegistroOuvidoria"
                        :error-messages="errors"
                      ></v-select>
                    </validation-provider>
                  </v-col>
                </template>
                <span>Existe registro da ouvidoria?</span>
              </v-tooltip>
            </template>
          </v-row>
          <v-row v-else>
            <v-tooltip right>
              <template v-slot:activator="{ attrs, on }">
                <v-col cols="4" v-bind="attrs" v-on="on">
                  <validation-provider
                    v-slot="{ errors }"
                    rules="required"
                    name="acao realizada no contrato"
                  >
                    <v-select
                      label="Ação realizada no contrato?"
                      dense
                      outlined
                      required
                      no-data-text="Sem informações"
                      class="mb-5"
                      v-model="palitagem.cancelAcaoNoContrato"
                      :items="acaoRealizadaContrato"
                      item-text="text"
                      item-value="value"
                      :error-messages="errors"
                    ></v-select>
                  </validation-provider>
                </v-col>
              </template>
              <span>Ação realizada no contrato?</span>
            </v-tooltip>
            <v-tooltip right>
              <template v-slot:activator="{ attrs, on }">
                <v-col cols="4" v-bind="attrs" v-on="on">
                  <validation-provider v-slot="{ errors }" rules="required" name="qual lead gerado">
                    <v-select
                      label="Qual lead gerado? "
                      no-data-text="Sem informações"
                      dense
                      required
                      outlined
                      v-model="palitagem.cancelLeadGerado"
                      :items="leadGerado"
                      class="mb-5"
                      item-text="text"
                      item-value="value"
                      :error-messages="errors"
                    ></v-select>
                  </validation-provider>
                </v-col>
              </template>
              <span>Qual lead gerado?</span>
            </v-tooltip>
          </v-row>
        </v-col>

        <v-card-actions class="mt-n6">
          <v-col>
            <v-row justify="end">
              <v-btn
                type="submit"
                color="success"
                class="mr-3"
                :disabled="invalid"
                :loading="isSend"
              >
                Enviar
              </v-btn>
              <v-btn color="error white--text" @click="limparPalitagem()">Limpar</v-btn>
            </v-row>
          </v-col>
        </v-card-actions>
      </form>
    </validation-observer>
  </v-card>
</template>

<script>
  import Masks from '../../../masks/masks'
  import alerts from '../../../../mixins/alerts.mixins'
  import config from '../../../../core/config'

  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  export default {
    components: { ValidationObserver, ValidationProvider },
    props: {},
    data: () => ({
      ofertouCanaisAutoatendimento: [
        { text: 'Sim', value: '1' },
        { text: 'Não', value: '0' }
      ],
      acaoRealizadaContrato: [
        { text: 'DESCONEXÃO', value: 'DESCONEXAO' },
        { text: 'LEAD', value: 'LEAD' }
      ],
      leadGerado: [
        { text: 'RETIDO', value: 'RETIDO' },
        { text: 'NÃO RETIDO', value: 'NAO RETIDO' }
      ],
      produtos: ['CM', 'MTF', 'MPLAY', { text: 'MTF JEC', value: 'JEC' }],
      listCidades: [],
      palitagem: {
        produto: 'CM',
        produtoCliente: null,
        motivo: null,
        subMotivo: null,
        clienteEncaminhadoCanaisAutoAtendimento: null,
        canalAtendimento: null,
        cancelAcaoNoContrato: null,
        cancelLeadGerado: null,
        clienteOuvidoria: null,
        existeRegistroOuvidoria: null,
        nomeCidade: null,
        codCidade: null,
        numeroContrato: null
      },
      isSend: false
    }),
    mixins: [alerts],
    computed: {
      maskContrato() {
        let { contratoComCodCidade } = Masks
        return contratoComCodCidade
      },
      motivosContato() {
        return this.$store.getters.motivosContato
      },
      subMotivoContato() {
        return this.$store.getters.subMotivoContato
      },
      canaisDeAutoatendimento() {
        return this.$store.getters.canaisDeAutoatendimento
      }
    },
    methods: {
      filterCodCidade() {
        let cidades = this.listCidades
        return cidades.filter(cidade => {
          if (cidade.COD_CIDADE == this.palitagem.codCidade) {
            this.palitagem.nomeCidade = cidade.NOME_CIDADE
          }
        })
      },
      filterNomeCidade() {
        let cidades = this.listCidades
        return cidades.filter(cidade => {
          if (cidade.NOME_CIDADE == this.palitagem.nomeCidade) {
            this.palitagem.codCidade = cidade.COD_CIDADE
          }
        })
      },
      loadCidades() {
        let urlData = `${config.baseUrl}api/shared/utils/geral/cidades`
        this.$api.get(urlData).then(res => {
          this.listCidades = res.data
        })
      },
      async submit() {
        const isValid = await this.$refs.observer.validate()
        if (isValid) {
          this.palitagem.almope = this.$store.getters.usuario.almope
          this.isSend = true
          let urlData = `${config.baseUrl}api/shared/palitagem/create/`
          this.$api.post(urlData, this.palitagem)
          this.toast('Palitagem cadastrada!', 'top-right', false, 2000, 'success')
          this.limparPalitagem()
          this.isSend = false
        }
      },
      loadMotivoContato() {
        this.palitagem.motivo = null
        this.palitagem.subMotivo = null
        let produto = this.palitagem.produto == 'MPLAY' ? 'CM' : this.palitagem.produto
        this.$store.dispatch('loadMotivosContato', produto)
      },
      loadSubMotivosContato() {
        if (this.palitagem.motivo) this.palitagem.subMotivo = null
        let produto = this.palitagem.produto == 'MPLAY' ? 'CM' : this.palitagem.produto
        this.$store.dispatch('loadSubMotivosContato', {
          produto: produto,
          motivo: this.palitagem.motivo
        })
      },
      loadCanaisDeAutoatendimento() {
        this.palitagem.canalAtendimento = null
        this.$store.dispatch(
          'loadCanaisDeAutoatendimento',
          this.palitagem.clienteEncaminhadoCanaisAutoAtendimento
        )
      },
      limparPalitagem() {
        let newForm = Object.assign({}, this.palitagem)
        Object.keys(newForm).forEach(item => {
          return (newForm[item] = null)
        })
        this.palitagem = newForm
        this.palitagem.produto = 'CM'
        this.$refs.observer.reset()
      },
      initializeData() {
        this.loadMotivoContato()
      }
    },
    watch: {
      'palitagem.motivo': function (newValue, oldValue) {
        if (oldValue != newValue) {
          this.palitagem.cancelAcaoNoContrato = null
          this.palitagem.cancelLeadGerado = null
          this.palitagem.subMotivo = null
          this.palitagem.clienteEncaminhadoCanaisAutoAtendimento = null
          this.palitagem.canalAtendimento = null
          this.palitagem.clienteOuvidoria = null
          this.palitagem.existeRegistroOuvidoria = null
        }
      },
      'palitagem.produto': function (newValue, oldValue) {
        if (oldValue != newValue) {
          this.palitagem.cancelAcaoNoContrato = null
          this.palitagem.cancelLeadGerado = null
          this.palitagem.subMotivo = null
          this.palitagem.clienteEncaminhadoCanaisAutoAtendimento = null
          this.palitagem.canalAtendimento = null
          this.palitagem.clienteOuvidoria = null
          this.palitagem.existeRegistroOuvidoria = null
        }
      }
    },
    created() {
      this.initializeData()
      this.loadCidades()
    }
  }
</script>
<style scoped>
  .zindexTop {
    z-index: 999;
  }
</style>
