<template>
  <v-dialog v-model="openForm" max-width="1000" class="overflow-x-hidden" persistent>
    <v-card elevation="0" tile class="rounded-t-xl">
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-card class="rounded-xl white--text" id="card" tile elevation="0">
            <v-card-title>
              <v-icon class="mr-3" color="white">fa-solid fa-file-signature</v-icon>
              Pesquisa de Clima S2S
            </v-card-title>
          </v-card>
          <div class="pa-3" style="height: 300px">
            <p class="text-h6 pa-0 mx-0">
              Olá,
              <span style="text-transform: capitalize">{{ nome }}</span>
              , tudo bem?
            </p>
            <p style="text-align: justify">
              <i class="fa-solid fa-book-open-reader grey--text"></i>
              <span style="text-decoration: underline">
                O objetivo desta pesquisa é entender a sua percepção e sentimento com relação a sua
                gestão e ao ambiente de trabalho.
              </span>
              Suas respostas são essenciais para identificar pontos de melhoria e fortalecer nosso
              compromisso com o bem-estar e o sucesso de todos os membros da equipe. Suas respostas
              <mark><strong>são confidenciais</strong></mark>
              e serão usadas apenas para fins de análise interna.
            </p>
            <p style="text-align: justify">
              <strong>
                <i class="fa-solid fa-person-chalkboard grey--text mr-2"></i>
                Instruções:
              </strong>
              Por favor, responda às seguintes perguntas com base em suas experiências e percepções.
              Selecione a opção que melhor represente sua opinião ou experiência. Se desejar
              fornecer mais detalhes ou feedback adicional, sinta-se à vontade para fazê-lo nos
              campos abertos fornecidos.
            </p>
            <div class="actions">
              <v-btn color="success" @click="salvarResponderAgora(1)">Responder Agora</v-btn>
              <v-btn color="warning" @click="salvarResponderAgora(0)">Responder Depois</v-btn>
            </div>
          </div>
          <v-divider></v-divider>
          <div class="overflow-auto pa-2" style="overflow: auto; max-height: 400px">
            <div v-for="(item, i) in questionario" :key="i">
              <div style="display: flex; align-items: center; margin-top: 25px">
                {{ i + 1 }}) {{ item.nome_campo }}
              </div>
              <v-list v-for="(perguntas, j) in item.valor_campo" :key="j">
                <validation-provider v-slot="{ errors }" :name="item.nome_campo" rules="required">
                  <v-checkbox
                    :label="perguntas.valor"
                    :value="perguntas.id_valor_campo"
                    :error-messages="errors"
                    v-model="respostaChecklist[item.id_campo]"
                    color="green"
                  ></v-checkbox>
                </validation-provider>
              </v-list>
            </div>
          </div>
          <div style="display: flex; justify-content: end">
            <v-btn type="submit" :disabled="invalid" color="success">Salvar</v-btn>
          </div>
        </form>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import { Tratamento } from '../../../js/Tratamento'
  import config from '../../../core/config'
  export default {
    components: { ValidationObserver, ValidationProvider },
    data: () => ({
      openForm: null,
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
    methods: {
      salvarResponderAgora(res) {
        console.log(res)
      },
      async submit() {
        try {
          this.respostaChecklist.almope = this.usuario.almope
          this.respostaChecklist.idForm = 1 //pesquisa de clima
          this.respostaChecklist.concluido = 3
          // this.respostaChecklist.statusTabulacao = '';
          let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/salvar`
          await this.$api.post(urlData, this.respostaChecklist)
          this.openForm = false
        } catch (e) {}
      },
      loadControlePesquisa() {
        let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/validacao`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuario.almope,
              idForm: 1
            }
          })
          .then(res => {
            let dados = res?.data[0]
            // se ele nao tiver linhas ele precisa responder
            // se ele respondeu, mas informou que iria finalizar depois precisa aparecer (Concluido = 0 && DataRetorno)
            // se ele respondeu (Concluido == 1) então não precisa aparecer mais...
            // retornar depois de 30 dias... se da data resposta já se passaram 30 dias, responder novamente.

            let agora = this.moment().format('YYYY-MM-DD')
            let dataRetorno = this.moment(dados?.DATA_RETORNO)
            let diffRetornoHoje = dataRetorno.diff(agora, 'seconds')

            if (diffRetornoHoje <= 0 && dados?.CONCLUIDO == 0) {
              this.openForm = true
            } else if (dados?.length == 0 || dados == undefined) {
              this.openForm = true
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
              id: 1,
              regional: this.usuario.regional.toLowerCase(),
              perfil: this.usuario.filtro.toLowerCase()
            }
          })
          .then(res => {
            this.questionario = res.data
            res.data.forEach(element => {
              this.$set(this.respostaChecklist, element.id_campo, null)
            })
          })
      }
    },
    created() {
      this.loadChecklistId()
      this.loadControlePesquisa()
    }
  }
</script>

<style scoped>
  .actions {
    display: flex;
    padding: 10px;
    gap: 15px;
    align-items: center;
    justify-content: center;
  }

  .v-list {
    padding: 0;
    margin: 0;
  }

  #card {
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
