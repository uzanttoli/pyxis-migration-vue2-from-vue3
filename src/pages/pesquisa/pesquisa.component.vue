<template>
  <v-dialog v-model="openForm" max-width="1000" class="overflow-x-hidden" persistent>
    <v-card elevation="0" tile class="rounded-t-xl">
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-card class="rounded-xl white--text" id="card" tile elevation="0">
            <v-card-title class="text-capitalize">
              <v-icon class="mr-3" color="white">fa-solid fa-file-signature</v-icon>
              {{ title.toLowerCase() }}
            </v-card-title>
            <v-btn icon class="mr-2" v-if="!handleAction" @click="$emit('update:close')">
              <v-icon>fas fa-close</v-icon>
            </v-btn>
          </v-card>
          <v-alert
            type="warning"
            v-if="invalid"
            style="margin-bottom: 10px"
            class="rounded-md mx-2 mt-3 pa-2"
          >
            Há campos que não foram preenchidos!
          </v-alert>
          <div class="pa-3" style="height: 300px">
            <p class="text-h6 pa-0 mx-0">
              Olá
              <span style="text-transform: capitalize">{{ nome }}</span>
              , tudo bem?
            </p>
            <p style="text-align: justify">
              <strong>
                <i class="fa-solid fa-book-open-reader grey--text mr-2"></i>
                Objetivo:
              </strong>
              {{ objetivo }}
            </p>
            <p style="text-align: justify">
              <strong>
                <i class="fa-solid fa-person-chalkboard grey--text mr-2"></i>
                Instruções:
              </strong>
              {{ instrucoes }}
            </p>
            <div class="actions" v-if="handleAction">
              <v-btn color="warning" @click="salvarDecisaoResposta(0)" :disabled="responderDepois">
                Responder Depois
              </v-btn>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="overflow-auto pa-2" style="overflow: auto; max-height: 400px">
            <div v-for="(item, i) in questionario" :key="i">
              <div style="display: flex; align-items: center; margin-top: 25px">
                {{ i + 1 }}) {{ item.nome_campo }}
              </div>
              <template v-if="item.tipo_pergunta === 'OPCAO'">
                <v-list v-for="(perguntas, j) in item.valor_campo" :key="j">
                  <validation-provider
                    v-slot="{ errors }"
                    :name="item.nome_campo"
                    :rules="item.obrigatorio == 1 ? 'required' : false"
                  >
                    <v-checkbox
                      :label="perguntas.valor"
                      :value="perguntas.id_valor_campo"
                      :error-messages="errors"
                      v-model="respostaChecklist[item.id_campo]"
                      color="green"
                    ></v-checkbox>
                  </validation-provider>
                </v-list>
              </template>
              <template v-else>
                <validation-provider
                  v-slot="{ errors }"
                  :name="item.nome_campo"
                  :rules="item.obrigatorio == 1 ? 'required' : false"
                >
                  <v-textarea
                    outlined
                    dense
                    class="mt-1"
                    rows="3"
                    v-model="respostaChecklist[item.nome_campo]"
                    :error-messages="errors"
                  ></v-textarea>
                </validation-provider>
              </template>
            </div>
          </div>
          <div style="display: flex; justify-content: end; padding: 10px; margin-right: 25px">
            <v-btn type="submit" :disabled="invalid" color="success" v-if="handleAction">
              Salvar
            </v-btn>
          </div>
        </form>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import { Tratamento } from '../../js/Tratamento'
  import config from '../../core/config'
  import alerts from '../../mixins/alerts.mixins'
  export default {
    components: { ValidationObserver, ValidationProvider },
    props: {
      objetivo: {
        type: String,
        required: true
      },
      instrucoes: {
        type: String,
        required: true
      },
      title: {
        type: String,
        default: 'Sem titulo'
      },
      idForm: {
        type: Number,
        required: true
      },
      handleAction: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      openForm: null,
      responderDepois: null,
      questionario: [],
      respostaChecklist: {}
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      nome() {
        let nome = new Tratamento(this.usuario.nome)
        return nome.myPrimaryName
      }
    },
    mixins: [alerts],
    mounted() {},
    methods: {
      salvarDecisaoResposta(res) {
        let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/responder_depois`
        this.$api
          .post(urlData, {
            almope: this.usuario.almope,
            idForm: this.idForm,
            idCampo: 0,
            idValor: res,
            statusTabulacao: 2,
            concluido: 0
          })
          .then(() => {
            this.openForm = false
            this.toast('Pesquisa agendada!', 'top-right', false, 1500, 'success')
          })
      },
      async submit() {
        try {
          this.respostaChecklist.almope = this.usuario.almope
          this.respostaChecklist.idForm = this.idForm
          this.respostaChecklist.concluido = 3
          let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/salvar`
          await this.$api.post(urlData, this.respostaChecklist)
          this.openForm = false
          this.toast('Respostas salvas com sucesso!', 'top-right', false, 1500, 'success')
        } catch (e) {
          this.toast(
            'Ops! Não conseguimos salvar suas respostas, tente novamente!',
            'top-right',
            false,
            1500,
            'error'
          )
        }
      },
      loadControlePesquisa() {
        let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/validacao`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuario.almope,
              idForm: this.idForm
            }
          })
          .then(res => {
            let dados = res?.data[0]
            // se ele nao tiver linhas ele precisa responder=ok
            // se ele respondeu, mas informou que iria finalizar depois precisa aparecer (Concluido = 0 && DataRetorno)
            // se ele respondeu (Concluido == 1) então não precisa aparecer mais...
            // retornar depois de 30 dias... se da data resposta já se passaram 30 dias, responder novamente.
            this.responderDepois = dados?.CONCLUIDO == 0 ? true : false

            let agora = this.moment().format('YYYY-MM-DD')
            let dataRetorno = this.moment(dados?.DATA_RETORNO)
            let diffRetornoHoje = dataRetorno.diff(agora, 'seconds')

            if (diffRetornoHoje <= 0 && dados?.CONCLUIDO == 0) {
              this.openForm = true
              this.loadChecklistId()
            } else if (dados?.length == 0 || dados == undefined) {
              this.openForm = true
              this.loadChecklistId()
            } else {
              this.openForm = false
            }
          })
      },
      loadChecklistId() {
        let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/checklist`
        this.$api
          .get(urlData, {
            params: {
              id: this.idForm,
              regional: this.usuario.regional.toLowerCase(),
              perfil: this.usuario.filtro.toLowerCase(),
              almope: this.usuario.almope
            }
          })
          .then(res => {
            this.questionario = res.data
            res.data.forEach(element => {
              this.$set(
                this.respostaChecklist,
                element.tipo_pergunta == 'TEXTO' ? element.nome_campo : element.id_campo,
                null
              )
            })
          })
      }
    },
    created() {
      this.loadControlePesquisa()
    }
  }
</script>

<style scoped>
  .actions {
    display: flex;
    padding: 0 10px;
    gap: 15px;
    align-items: center;
    justify-content: center;
  }

  .v-list {
    padding: 0;
    margin: 0;
  }

  #card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(
      90deg,
      rgb(0, 183, 255) 0%,
      rgb(0, 183, 255) 5%,
      rgb(255, 48, 255) 100%
    );
  }

  .v-input--checkbox {
    height: 25px;
  }
</style>
