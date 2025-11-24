<template>
  <v-card>
    <title-negative-margin title="Propenso" className="rounded-r-xl"></title-negative-margin>
    <v-alert dense text type="success" v-if="formPropenso.CLIENTE_ACEITOU_MIGRACAO == 'SIM'">
      Oriente ao cliente para ir ate uma loja da claro, pode ser agente autorizado ou loja propria
      para que possa fazer a aquisição do produto.
    </v-alert>
    <v-col>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <v-col>
            <v-row>
              <v-col cols="3">
                <validation-provider
                  v-slot="{ errors }"
                  name="telefone"
                  rules="required|min:14|max:15"
                >
                  <v-text-field
                    v-mask="[masks.telefoneBrFixo, masks.telefoneBrMovel]"
                    placeholder="Telefone contato"
                    label="Telefone contato"
                    dense
                    outlined
                    class=""
                    :error-messages="errors"
                    v-model="formPropenso.TELEFONE"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="3">
                <validation-provider
                  v-slot="{ errors }"
                  name="contrato"
                  rules="required|min:14|max:14"
                >
                  <v-text-field
                    placeholder="Contrato"
                    label="Contrato"
                    dense
                    outlined
                    class=""
                    :error-messages="errors"
                    v-mask="[masks.contratoComCodCidade]"
                    v-model="formPropenso.CONTRATO"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="3">
                <validation-provider
                  v-slot="{ errors }"
                  name="satisfação do cliente"
                  rules="required"
                >
                  <v-select
                    placeholder="Qual nivel de satisfação do cliente?"
                    label="Qual nivel de satisfação do cliente?"
                    :error-messages="errors"
                    dense
                    required
                    outlined
                    v-model="formPropenso.SATISFACAO_CLIENTE"
                    :items="satisfacaoCliente"
                    item-text="text"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col cols="3">
                <validation-provider v-slot="{ errors }" name="motivo ligação" rules="required">
                  <v-autocomplete
                    placeholder="Motivo ligação"
                    label="Motivo ligação"
                    dense
                    outlined
                    :items="motivosContato"
                    item-text="SUBITEM_DE"
                    item-value="SUBITEM_DE"
                    @change="loadSubmotivoContato(), loadMotivoNaoResolvido()"
                    required
                    :error-messages="errors"
                    v-model="formPropenso.MOTIVO_CONTATO"
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col
                class="mt-n6"
                cols="3"
                v-if="
                  formPropenso.MOTIVO_CONTATO == 'OUTAGE SEGURANÇA PUBLICA EXCLUSIVO CM' ||
                  formPropenso.MOTIVO_CONTATO == 'OUTAGE SEGURANÇA PUBLICA EXCLUSIVO MTF'
                "
              >
                <validation-provider v-slot="{ errors }" name="motivo ligação" rules="required">
                  <v-autocomplete
                    placeholder="Motivo ligação"
                    label="Motivo ligação"
                    dense
                    outlined
                    :items="motivosContatoOutageSP"
                    item-text="SUBITEM_DE"
                    item-value="SUBITEM_DE"
                    required
                    :error-messages="errors"
                    v-model="formPropenso.MOTIVO_CONTATO_OUTAGE_SEG_PUBL"
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col cols="3" class="mt-n6">
                <validation-provider v-slot="{ errors }" name="submotivo contato" rules="required">
                  <v-autocomplete
                    placeholder="Submotivo contato"
                    label="Submotivo contato"
                    required
                    dense
                    outlined
                    :error-messages="errors"
                    :items="submotivoContato"
                    item-text="DESCRICAO"
                    item-value="DESCRICAO"
                    v-model="formPropenso.SUBMOTIVO_CONTATO"
                    hide-no-data
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
              <!--  -->
              <v-col
                v-if="
                  (formPropenso.SUBMOTIVO_CONTATO ==
                    'SEM SINAL  (REDE EXTERNA CLARO - SEM SINAL TOTAL)' ||
                    formPropenso.SUBMOTIVO_CONTATO ==
                      'SEM ACESSO (REDE INTERNA DO CLIENTE - COM PROBLEMA)') &&
                  formPropenso.MOTIVO_CONTATO_OUTAGE_SEG_PUBL == 'FINANCEIRO'
                "
                cols="3"
                class="mt-n6"
              >
                <validation-provider v-slot="{ errors }" name="finalidade" rules="required">
                  <v-autocomplete
                    placeholder="Finalidade contato"
                    label="Finalidade contato"
                    required
                    dense
                    outlined
                    :error-messages="errors"
                    :items="finalidadeContato"
                    item-text="DESCRICAO"
                    item-value="DESCRICAO"
                    hide-no-data
                    v-model="formPropenso.FINALIDADE_CONTATO_SEG_PUBLICA"
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
              <!--  -->
              <v-col cols="3" class="mt-n6">
                <validation-provider
                  v-slot="{ errors }"
                  name="solicitação resolvida?"
                  rules="required"
                >
                  <v-select
                    placeholder="Solicitação resolvida?"
                    label="Solicitação resolvida?"
                    :error-messages="errors"
                    dense
                    no-data-text="Não há nada por aqui!"
                    outlined
                    required
                    :items="['SIM', 'NÃO']"
                    v-model="formPropenso.SOLICITACAO_RESOLVIDA"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col class="mt-n6" cols="3" v-if="formPropenso.SOLICITACAO_RESOLVIDA == 'NÃO'">
                <validation-provider
                  v-slot="{ errors }"
                  name="porque não foi resolvida?"
                  rules="required"
                >
                  <v-select
                    dense
                    outlined
                    no-data-text="Não há nada por aqui!"
                    placeholder="Porque não foi resolvida?"
                    label="Porque não foi resolvida?"
                    :error-messages="errors"
                    required
                    :items="motivoNaoResolvido"
                    item-text="DESCRICAO"
                    item-value="DESCRICAO"
                    v-model="formPropenso.MOTIVO_NAO_RESOLVIDA"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col
                cols="6"
                class="mt-n6"
                v-if="
                  (formPropenso.SOLICITACAO_RESOLVIDA &&
                    formPropenso.MOTIVO_CONTATO == 'OUTAGE SEGURANÇA PUBLICA EXCLUSIVO CM') ||
                  formPropenso.MOTIVO_CONTATO == 'OUTAGE SEGURANÇA PUBLICA EXCLUSIVO MTF'
                "
              >
                <validation-provider
                  rules="required"
                  name="oferta cancelamento contrato"
                  v-slot="{ errors }"
                >
                  <v-select
                    dense
                    no-data-text="Não há nada por aqui!"
                    outlined
                    placeholder="Oferta cancelamento do contrato. Cliente aceitou?"
                    label="Oferta cancelamento do contrato. Cliente aceitou?"
                    :error-messages="errors"
                    required
                    :items="cancelamentoContrato"
                    item-text="text"
                    item-value="text"
                    v-model="formPropenso.OFERTA_CANCELAMENTO_CONTRATO"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col cols="6" v-if="formPropenso.OFERTA_CANCELAMENTO_CONTRATO" class="mt-n6">
                <validation-provider
                  rules="required"
                  name="oferta para modem roteador 4G"
                  v-slot="{ errors }"
                >
                  <v-select
                    dense
                    no-data-text="Não há nada por aqui!"
                    outlined
                    placeholder="Realizou oferta para modem roteador 4G?"
                    label="Realizou oferta para modem roteador 4G?"
                    required
                    :error-messages="errors"
                    :items="['SIM', 'NÃO']"
                    v-model="formPropenso.REALIZOU_OFERTA_MODEM_MIGRACAO"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col
                cols="6"
                class="mt-n6"
                v-if="
                  formPropenso.OFERTA_CANCELAMENTO_CONTRATO &&
                  formPropenso.REALIZOU_OFERTA_MODEM_MIGRACAO
                "
              >
                <validation-provider rules="required" name="cliente aceitou?" v-slot="{ errors }">
                  <v-select
                    dense
                    no-data-text="Não há nada por aqui!"
                    outlined
                    placeholder="Cliente aceitou?"
                    label="Cliente aceitou?"
                    required
                    :error-messages="errors"
                    :items="['SIM', 'NÃO']"
                    v-model="formPropenso.CLIENTE_ACEITOU_MIGRACAO"
                    @change="listarMotivoNaoAceiteMigracao()"
                  ></v-select>
                </validation-provider>
              </v-col>
              <!-- adicionar campo de número contato -->
              <v-col cols="6" class="mt-n6" v-if="formPropenso.CLIENTE_ACEITOU_MIGRACAO == 'SIM'">
                <validation-provider
                  rules="required|min:14|max:15"
                  name="número de contato"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    dense
                    no-data-text="Não há nada por aqui!"
                    outlined
                    placeholder="Melhor número de contato"
                    label="Melhor número de contato"
                    required
                    :error-messages="errors"
                    v-model="formPropenso.MELHOR_NUM_CONTATO"
                    v-mask="[masks.telefoneBrFixo, masks.telefoneBrMovel]"
                  ></v-text-field>
                </validation-provider>
              </v-col>

              <v-col
                cols="3"
                class="mt-n6"
                v-if="
                  formPropenso.OFERTA_CANCELAMENTO_CONTRATO &&
                  formPropenso.REALIZOU_OFERTA_MODEM_MIGRACAO &&
                  formPropenso.CLIENTE_ACEITOU_MIGRACAO == 'NÃO'
                "
              >
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="motivo do não aceite"
                >
                  <v-select
                    dense
                    no-data-text="Não há nada por aqui!"
                    outlined
                    placeholder="Motivo do não aceite?"
                    label="Motivo do não aceite"
                    required
                    :error-messages="errors"
                    v-model="formPropenso.MOTIVO_NAO_ACEITE_MIGRACAO"
                    :items="motivoNaoAceiteMigracao"
                    item-text="DESCRICAO"
                    item-value="DESCRICAO"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col
                class="mt-n6"
                v-if="formPropenso.MOTIVO_NAO_ACEITE_MIGRACAO == ' OUTROS MOTIVOS'"
                cols="12"
              >
                <validation-provider
                  v-slot="{ errors }"
                  rules="required|min:15|max:255"
                  name="observação"
                >
                  <v-textarea
                    placeholder="Observação"
                    label="Observação"
                    :error-messages="errors"
                    outlined
                    dense
                    auto-grow
                    v-model="formPropenso.OBSERVACAO"
                  ></v-textarea>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row
              class="mx-2"
              v-if="
                formPropenso.MOTIVO_CONTATO == 'OUTAGE SEGURANÇA PUBLICA EXCLUSIVO CM' ||
                formPropenso.MOTIVO_CONTATO == 'OUTAGE SEGURANÇA PUBLICA EXCLUSIVO MTF'
              "
            >
              <div>
                <span style="font-size: 13px">
                  Registre a ocorrencia:
                  <strong>CO85 - CR8 - CANCELAMENTO RJ SEGURANCA PUBLICA</strong>
                </span>
                <br />
                <span style="font-size: 13px">
                  <strong>Texto padrão:</strong>
                  <span id="text-copy">
                    Registre as informações que o cliente solicitou e o que foi informado ao mesmo
                    [texto].
                    <br />
                    Nome do Operador / Supervisor / Regional / ALMAVIVA + Site
                    <br />
                    (Para Combo multi é necessário colocar o registro nos sistemas Claro
                    residencial).
                  </span>
                </span>
              </div>
            </v-row>
            <v-col>
              <v-row justify="end">
                <v-btn
                  type="submit"
                  :disabled="invalid"
                  depressed
                  color="success"
                  class="rounded-r-xl rounded-bl-xl mr-2"
                >
                  Salvar
                </v-btn>
                <v-btn
                  @click="limparForm"
                  depressed
                  color="error"
                  class="rounded-r-xl rounded-bl-xl"
                >
                  Limpar
                </v-btn>
              </v-row>
            </v-col>
          </v-col>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>
<script>
  import { ValidationProvider, ValidationObserver } from 'vee-validate'
  import masks from '../../../../shared/masks/masks'
  import config from '../../../../core/config'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    components: { ValidationProvider, ValidationObserver },
    data: () => ({
      formPropenso: {
        TELEFONE: null,
        CONTRATO: null,
        SATISFACAO_CLIENTE: null,
        MOTIVO_CONTATO: null,
        SUBMOTIVO_CONTATO: null,
        SOLICITACAO_RESOLVIDA: null,
        MOTIVO_NAO_RESOLVIDA: null,
        OFERTA_CANCELAMENTO_CONTRATO: null,
        MOTIVO_CONTATO_OUTAGE_SEG_PUBL: null,
        REALIZOU_OFERTA_MODEM_MIGRACAO: null,
        CLIENTE_ACEITOU_MIGRACAO: null,
        MOTIVO_NAO_ACEITE_MIGRACAO: null,
        MELHOR_NUM_CONTATO: null,
        FINALIDADE_CONTATO_SEG_PUBLICA: null,
        OBSERVACAO: null
      },
      listValidacao: [],
      motivosContato: [],
      submotivoContato: [],
      finalidadeContato: [],
      motivoNaoResolvido: [],
      motivoNaoAceiteMigracao: [],
      satisfacaoCliente: [
        { text: 'SATISFEITO' },
        { text: 'NEUTRO' },
        { text: 'INSATISFEITO' },
        { text: 'CRITICO' }
      ],
      cancelamentoContrato: [
        {
          text: 'SIM, REGISTRAR A OCORRÊNCIA DE CANCELAMENTO E SEGUIR O PROCESSO.'
        },
        { text: 'NÃO, REGISTRAR A OCORRÊNCIA QUE NÃO DESEJA O CANCELAMENTO.' }
      ]
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
      motivosContatoOutageSP() {
        let items = this.motivosContato
        return items.filter(item => {
          return (
            item.SUBITEM_DE !== 'OUTAGE SEGURANÇA PUBLICA EXCLUSIVO CM' &&
            item.SUBITEM_DE !== 'OUTAGE SEGURANÇA PUBLICA EXCLUSIVO MTF'
          )
        })
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      async submit() {
        try {
          let isValid = await this.$refs.observer.validate()
          if (isValid) {
            this.formPropenso.ALMOPE_CADASTRO = this.usuarioAlmope
            let urlData = `${config.baseUrl}api/shared/formularios/propenso/salvar_cadastro`
            await this.$api.post(urlData, this.formPropenso)
            this.limparForm()
            this.toast('Cadastro realizado com sucesso!', 'top-right', false, 2500, 'success')
          }
        } catch (error) {
          this.toast('Cadastro não realizado. Tente novamente', 'top-right', false, 2500, 'error')
        }
      },
      loadMotivosContato() {
        let urlData = `${config.baseUrl}api/shared/formularios/propenso/motivos_contatos`
        this.$api.get(urlData).then(res => {
          this.motivosContato = res.data
        })
      },
      loadSubmotivoContato(params) {
        let urlData = `${config.baseUrl}api/shared/formularios/propenso/submotivo_contato/${
          params ?? this.formPropenso.MOTIVO_CONTATO
        }`
        this.$api.get(urlData).then(res => {
          if (params) {
            this.finalidadeContato = res.data
          } else {
            this.submotivoContato = res.data
          }
        })
      },
      loadMotivoNaoResolvido() {
        let urlData = `${config.baseUrl}api/shared/formularios/propenso/motivos_nao_resolvidos/${this.formPropenso.MOTIVO_CONTATO}`
        this.$api.get(urlData).then(res => {
          this.motivoNaoResolvido = res.data
        })
      },
      listarMotivoNaoAceiteMigracao() {
        let urlData = `${config.baseUrl}api/shared/formularios/propenso/motivos_nao_aceite_migracao/${this.formPropenso.MOTIVO_CONTATO}`
        this.$api.get(urlData).then(res => {
          this.motivoNaoAceiteMigracao = res.data
        })
      },
      limparForm() {
        let newForm = Object.assign({}, this.formPropenso)
        Object.keys(newForm).forEach(element => {
          newForm[element] = null
        })
        this.formPropenso = newForm
        this.$refs.observer.reset()
      }
    },
    created() {
      this.loadMotivosContato()
    },
    watch: {
      'formPropenso.SUBMOTIVO_CONTATO': function (newVal) {
        if (
          newVal == 'SEM SINAL  (REDE EXTERNA CLARO - SEM SINAL TOTAL)' ||
          newVal == 'SEM ACESSO (REDE INTERNA DO CLIENTE - COM PROBLEMA)'
        ) {
          this.loadSubmotivoContato('FINANCEIRO')
        }
      }
    }
  }
</script>
<style></style>
