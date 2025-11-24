<template>
  <v-card>
    <title-negative-margin
      title="FCR - First Call Resolution"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-divider></v-divider>
    <v-col class="mt-4">
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form action="" @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="3" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="Contrato" rules="required|min:14">
                <v-text-field
                  outlined
                  dense
                  placeholder="Contrato"
                  label="Contrato"
                  :error-messages="errors"
                  required
                  v-model="formFCR.contrato"
                  v-mask="['###/########-#']"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="segmento do cliente" rules="required">
                <v-autocomplete
                  outlined
                  dense
                  placeholder="Qual segmento do cliente?"
                  label="Qual segmento do cliente?"
                  :error-messages="errors"
                  required
                  v-model="formFCR.qualSegmentoCliente"
                  :items="itemsSegmentoCliente"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="motivo reclamação" rules="required">
                <v-autocomplete
                  outlined
                  dense
                  placeholder="Qual Motivo da reclamação?"
                  label="Qual Motivo da reclamação?"
                  :error-messages="errors"
                  required
                  v-model="formFCR.motivoReclamacao"
                  :items="listMotivoReclamacao"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0" v-if="formFCR.motivoReclamacao == '2ª VIA DE FATURA'">
              <validation-provider v-slot="{ errors }" name="submotivo" rules="required">
                <v-autocomplete
                  outlined
                  dense
                  placeholder="Submotivo Fatura"
                  label="Submotivo Fatura"
                  :error-messages="errors"
                  required
                  v-model="formFCR.submotivoReclamacao"
                  :items="listSubmotivo"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0" v-if="formFCR.motivoReclamacao == '2ª VIA DE FATURA'">
              <validation-provider
                v-slot="{ errors }"
                name="método de recebimento"
                rules="required"
              >
                <v-autocomplete
                  outlined
                  dense
                  placeholder="Qual método de recebimento cadastro no sistema?"
                  label="Qual método de recebimento cadastro no sistema?"
                  :error-messages="errors"
                  required
                  v-model="formFCR.metodoCadastradoSistema"
                  :items="listMetodosSegundaVia"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="fatura contestada" rules="required">
                <v-autocomplete
                  outlined
                  dense
                  placeholder="Fatura contestada?"
                  label="Fatura contestada?"
                  :error-messages="errors"
                  required
                  v-model="formFCR.faturaContestada"
                  :items="listFaturaContestada"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="ação realizada" rules="required">
                <v-autocomplete
                  outlined
                  dense
                  placeholder="Qual ação realizada?"
                  label="Qual ação realizada?"
                  :error-messages="errors"
                  required
                  v-model="formFCR.acaoRealizada"
                  :items="listFaturaAcaoRealizada"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="transf. realizada" rules="required">
                <v-autocomplete
                  outlined
                  dense
                  placeholder="Transferencia realizada?"
                  label="Transferencia realizada?"
                  :error-messages="errors"
                  required
                  v-model="formFCR.transferenciaRealizada"
                  :items="listTransferenciaRealizada"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0" v-if="formFCR.transferenciaRealizada == 'SIM'">
              <validation-provider v-slot="{ errors }" name="motivo transf." rules="required">
                <v-autocomplete
                  outlined
                  dense
                  placeholder="Motivo da transferencia"
                  label="Motivo da transferencia"
                  :error-messages="errors"
                  required
                  v-model="formFCR.motivoTransferencia"
                  :items="listMotivoTransferencia"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="12" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="descrição" rules="required">
                <v-textarea
                  outlined
                  dense
                  placeholder="Descrição"
                  label="Descrição"
                  :error-messages="errors"
                  required
                  v-model="formFCR.descricao"
                ></v-textarea>
              </validation-provider>
            </v-col>
          </v-row>
          <div style="display: flex; gap: 5px">
            <v-btn type="submit" :disabled="invalid" color="success" :loading="isSend">
              Salvar
            </v-btn>
            <v-btn color="error" @click="limparDadosForm">Limpar</v-btn>
          </div>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>

<script>
  import config from '../../../../core/config'
  import alerts from '../../../../mixins/alerts.mixins'

  import { ValidationProvider, ValidationObserver } from 'vee-validate'

  export default {
    components: {
      ValidationProvider,
      ValidationObserver
    },
    props: {
      almopesExcessoes: {
        type: String,
        default: ''
      }
    },
    mixins: [alerts],
    data: () => ({
      isSend: false,
      items: [],
      formFCR: {
        motivoReclamacao: null,
        submotivoReclamacao: null,
        metodoCadastradoSistema: null,
        faturaContestada: null,
        acaoRealizada: null,
        descricao: null,
        contrato: null,
        transferenciaRealizada: null,
        motivoTransferencia: null,
        qualSegmentoCliente: null,
        piloto: 'AUTONOMIA'
      },
      itemsSegmentoCliente: ['TV', 'CLARO BOX', 'CLARO APP', 'VIRTUA', 'NET FONE']
    }),
    mounted() {},
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },

      motivosMacros() {
        let items = this.items

        const uniqueArray = []
        const countMap = {}

        items.forEach(item => {
          const { NOME_OPCAO } = item
          if (!countMap[NOME_OPCAO]) {
            countMap[NOME_OPCAO] = 1
            uniqueArray.push({ ...item })
          } else {
            countMap[NOME_OPCAO]++
          }
        })

        return uniqueArray
          .filter(e => {
            return e.NOME_OPCAO != 'DESCRICAO'
          })
          .map(item => {
            return { NOME_OPCAO: item.NOME_OPCAO }
          })
      },

      listMotivoReclamacao() {
        let items = this.items
        let novosItems = items
          .filter(e => {
            return e.NOME_OPCAO == 'QUAL O MOTIVO DA RECLAMAÇÃO DO CLIENTE?'
          })
          .map(item => {
            return {
              text: item.NOME_SUB_OPCAO_1,
              value: item.NOME_SUB_OPCAO_1
            }
          })
        return novosItems
      },
      listFaturaContestada() {
        let items = this.items
        let novosItems = items
          .filter(e => {
            return e.NOME_OPCAO == 'FATURA CONTESTADA?'
          })
          .map(item => {
            return {
              text: item.NOME_SUB_OPCAO_1,
              value: item.NOME_SUB_OPCAO_1
            }
          })
        return novosItems
      },
      listFaturaAcaoRealizada() {
        let items = this.items
        let novosItems = items
          .filter(e => {
            return e.NOME_OPCAO == 'QUAL AÇÃO REALIZADA?'
          })
          .map(item => {
            return {
              text: item.NOME_SUB_OPCAO_1,
              value: item.NOME_SUB_OPCAO_1
            }
          })
        return novosItems
      },
      listTransferenciaRealizada() {
        let items = this.items
        let novosItems = items
          .filter(e => {
            return e.NOME_OPCAO == 'TRANSFERENCIA REALIZADA?'
          })
          .map(item => {
            return {
              text: item.NOME_SUB_OPCAO_1,
              value: item.NOME_SUB_OPCAO_1
            }
          })
        return novosItems
      },
      listMotivoTransferencia() {
        let items = this.items
        let novosItems = items
          .filter(e => {
            return e.NOME_OPCAO == 'MOTIVO DA TRANSFERENCIA'
          })
          .map(item => {
            return {
              text: item.NOME_SUB_OPCAO_1,
              value: item.NOME_SUB_OPCAO_1
            }
          })
        return novosItems
      },
      listSubmotivo() {
        let items = this.items
        let novosItems = items
          .filter(e => {
            return e.NOME_OPCAO == 'SUBMOTIVO_2_VIA'
          })
          .map(item => {
            return {
              text: item.NOME_SUB_OPCAO_1,
              value: item.NOME_SUB_OPCAO_1
            }
          })
        return novosItems
      },
      listMetodosSegundaVia() {
        let items = this.items
        let novosItems = items
          .filter(e => {
            return e.NOME_OPCAO == 'METODO_RECEBIMENTO_SEGUNDA_VIA'
          })
          .map(item => {
            return {
              text: item.NOME_SUB_OPCAO_1,
              value: item.NOME_SUB_OPCAO_1
            }
          })
        return novosItems
      }
    },
    methods: {
      async submit() {
        try {
          this.isSend = true
          let urlData = `${config.baseUrl}api/shared/formularios/fcr/create`

          this.formFCR.usuarioAlmope = this.usuarioAlmope
          this.formFCR.descricao = this.formFCR.descricao.toUpperCase()
          await this.$api.post(urlData, this.formFCR)
          this.toast('Dados enviado com sucesso!', 'bottom-right', false, 3000, 'success')
          this.isSend = false
          this.limparDadosForm()
        } catch (e) {
          this.toast('Não foi possível salvar os dados.', 'bottom-right', false, 3000, 'error')
        }
      },
      limparDadosForm() {
        for (let key in this.formFCR) {
          this.formFCR[key] = null
        }
        this.formFCR.usuarioAlmope = this.usuarioAlmope
        this.formFCR.piloto = 'AUTONOMIA'
        this.$refs.observer.reset()
      },
      loadDataItems() {
        let urlData = `${config.baseUrl}api/shared/formularios/fcr/items`
        this.$api.get(urlData).then(res => {
          this.items = res.data
        })
      }
      // formIsValid(objeto, dependencies) {
      //   let newObj = { ...objeto };
      //   for (let i = 0; i < dependencies.length; i++) {
      //     const dependency = dependencies[i];
      //     if (dependency.dependecies != null) {
      //       const dependencyValue = newObj[dependency.dependecies];
      //       if (dependencyValue === dependency.valueExpected) {
      //         newObj[dependency.model] = null || this.formFCR[dependency.model];
      //       } else {
      //         delete newObj[dependency.model];
      //       }
      //     }
      //   }
      //   for (var chave in newObj) {
      //     if (newObj[chave] == null || newObj[chave] == "") {
      //       return false;
      //     }
      //   }
      //   return true;
      // },
    },
    created() {
      this.loadDataItems()
    }
  }
</script>

<style></style>
