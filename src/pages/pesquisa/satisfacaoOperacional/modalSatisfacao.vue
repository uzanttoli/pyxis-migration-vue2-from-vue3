<template>
  <!-- <v-dialog v-model="openModalCont" max-width="1200" class="overflow-x-hidden" persistent> -->
  <v-card elevation="2" tile class="rounded-t-xl" height="100%">
    <validation-observer v-slot="{ invalid, validate }" ref="observer">
      <form @submit.prevent="validate().then(submit)">
        <v-card class="mt-2 rounded-sm white--text" id="card" tile elevation="0">
          <v-card-title>
            <v-icon class="mr-3" color="white">fa-solid fa-file-signature</v-icon>
            Pesquisa de Satisfação
          </v-card-title>
        </v-card>
        <div class="pa-3" style="height: 250px">
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
            Selecione a opção que melhor represente sua opinião ou experiência. Se desejar fornecer
            mais detalhes ou feedback adicional, sinta-se à vontade para fazê-lo nos campos abertos
            fornecidos.
          </p>
          <div class="actions" v-if="disponivel">
            <v-btn color="success" @click="salvarResponderAgora(1)">Responder Agora</v-btn>
            <v-btn
              color="warning"
              @click="salvarResponderAgora(0)"
              :disabled="
                resultControlePesquisa.DATA_RETORNO != null ||
                resultControlePesquisa.RESPONDER_AGORA == 1
              "
            >
              Responder Depois
            </v-btn>
          </div>
          <div class="actions">
            <v-col class="pa-0 ma-0">
              <validation-provider v-slot="{ errors }" rules="required" name="coordenador">
                <v-autocomplete
                  :items="gestores"
                  outlined
                  item-text="nome"
                  required
                  dense
                  :error-messages="errors"
                  v-model="gestor"
                  placeholder="Selecione seu coordenador"
                  label="Selecione seu coordenador"
                  @change="generateMD5()"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
          </div>

          <v-alert type="warning" v-if="invalid" style="margin-bottom: 10px">
            Há campos que não foram preenchidos!
          </v-alert>
        </div>
        <v-divider :style="invalid ? 'margin-top: 70px;' : ''"></v-divider>
        <!-- v-if="responderAgora == 1" -->
        <div class="overflow-auto pa-2" style="overflow: auto; max-height: 550px">
          <div v-for="(item, i) in quest" :key="i">
            <div style="display: flex; align-items: center; margin-top: 25px">
              <h4>{{ item.TITULO }}</h4>
              : {{ item.SUBTITULO }}
            </div>
            <template v-if="item.TIPO_OPCAO == 'options'">
              <v-list v-for="(item2, j) in item.ITEMS" :key="j">
                <validation-provider
                  v-slot="{ errors }"
                  :rules="item.OBRIGATORIO == 1 ? 'required' : undefined"
                  :name="item.TITULO"
                >
                  <v-checkbox
                    :label="item2.OPCOES"
                    :value="item2.OPCOES"
                    :error-messages="errors"
                    v-model="formPesquisa[item.TITULO]"
                  ></v-checkbox>
                </validation-provider>
              </v-list>
            </template>
            <template v-else>
              <validation-provider
                v-slot="{ errors }"
                :rules="item.OBRIGATORIO == 1 ? 'required' : undefined"
                :name="item.TITULO"
              >
                <v-textarea
                  :error-messages="errors"
                  :label="item.TITULO"
                  dense
                  outlined
                  v-model="formPesquisa[item.TITULO]"
                ></v-textarea>
              </validation-provider>
            </template>
          </div>
          <!-- <pre>{{ formPesquisa }}</pre> -->
          <div v-if="disponivel">
            <div style="margin: 10px 0">
              <h4>Sugestões e Comentários Adicionais:</h4>
              Por favor, compartilhe quaisquer sugestões, comentários ou preocupações adicionais que
              você tenha sobre o ambiente de trabalho. (Obs.: As melhores sugestões serão premiadas
              com um PIX no valor de R$ 50,00).
            </div>
            <validation-provider
              v-slot="{ errors }"
              rules="required|min:15|max:255"
              name="sugestões e comentários..."
            >
              <v-textarea
                dense
                :error-messages="errors"
                outlined
                counter="255"
                v-model="formPesquisa.observacao"
                placeholder="Sugestões e Comentários Adicionais: Por favor, compartilhe quaisquer sugestões, comentários ou preocupações adicionais que você tenha sobre o ambiente de trabalho. (Obs.: As melhores sugestões serão premiadas com um PIX no valor de R$ 50,00)."
              ></v-textarea>
            </validation-provider>
          </div>

          <div style="display: flex; justify-content: start">
            <v-btn block type="submit" :disabled="invalid" color="success">Salvar pesquisa</v-btn>
          </div>
        </div>
      </form>
    </validation-observer>
  </v-card>
  <!-- </v-dialog> -->
</template>

<script>
  import config from '../../../core/config'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import { functions } from '../../../js/functions'
  import { Tratamento } from '../../../js/Tratamento'

  // const gestores = require('./gestores.json')
  import gestores from './gestores.json'
  // const crypto = require('crypto')
  export default {
    components: { ValidationObserver, ValidationProvider },
    props: {
      refazer: {
        type: Number
      },
      isModalRefazerPesquisa: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      quest: [],
      responderAgora: null,
      disponivel: false,
      formPesquisa: {},
      gestor: null,
      resultControlePesquisa: [],
      openModal: null,
      openModalCont: true,
      hashMD5: null
    }),
    created() {
      this.loadQuest()
      this.loadControlePesquisa()
    },
    computed: {
      gestores() {
        return gestores
      },
      nome() {
        let nome = new Tratamento(this.$store.getters.usuario.nome)
        return nome.myPrimaryName
      },
      ipMaquina() {
        return localStorage.getItem('ip')
      }
    },
    methods: {
      generateMD5() {
        const text = new Date().getTime().toString()

        const hashAttc = crypto.createHash('md5').update(text).digest('hex')

        this.hashMD5 = hashAttc
      },
      removerAcento(string) {
        if (!string) return
        let text = new functions()
        return text.retirarAcento(string).toUpperCase().replaceAll(' ', '_')
      },
      loadControlePesquisa() {
        let urlData = `${config.baseUrl}api/shared/pesquisa/satisfacao/controle_pesquisa`
        this.$api
          .get(urlData, {
            params: {
              almope: this.$store.getters.usuario.almope
            }
          })
          .then(res => {
            this.resultControlePesquisa = res?.data[0]
            let dados = res?.data[0]

            if (dados?.DATA_RETORNO == null && dados?.RESPOSTA_PESQUISA == 0) {
              // igual a null
              this.openModal = true
            } else {
              let agora = this.moment().format('YYYY-MM-DD')
              let dataRetorno = this.moment(dados?.DATA_RETORNO)
              let diferencaRetornaHoje = dataRetorno.diff(agora, 'seconds')

              if (diferencaRetornaHoje <= 0 && dados?.RESPOSTA_PESQUISA == 0) {
                this.openModal = true
              } else {
                this.openModal = false
              }
            }
          })
      },
      async salvarResponderAgora(decisao) {
        this.responderAgora = decisao
        let data = {
          almope: this.$store.getters.usuario.almope,
          decisao: decisao,
          produto: this.$store.getters.usuario.produto
        }

        decisao == 0
          ? (data.dataRetorno = this.moment().add(1, 'days').format('YYYY-MM-DD'))
          : false

        let urlData = `${config.baseUrl}api/shared/pesquisa/satisfacao/responder_agora`
        await this.$api.post(urlData, data)
        if (decisao == 0) {
          this.openModal = false
        } else if (decisao == 1) {
          this.resultControlePesquisa.RESPONDER_AGORA = 1
        }
      },
      async submit() {
        try {
          this.formPesquisa.almope = this.$store.getters.usuario.almope
          this.formPesquisa.produto = this.$store.getters.usuario.produto
          this.formPesquisa.supervisor = this.gestor //this.$store.getters.usuario.supervisor : realocar novamente
          this.formPesquisa.coordenador = this.gestor //this.$store.getters.usuario.coordenador : realocar novamente
          this.formPesquisa.reanaliseSatisfacao = this.refazer == 0 ? null : 1
          this.formPesquisa.ipMaquina = this.ipMaquina
          this.formPesquisa.idResposta = this.hashMD5
          let urlData = `${config.baseUrl}api/shared/pesquisa/satisfacao/respostas`
          await this.$api.post(urlData, this.formPesquisa)
          this.$swal.fire({
            title: 'Obrigado pelo feedback!',
            text: 'Valorizamos muito sua contribuição para melhorarmos nosso ambiente de trabalho.',
            icon: 'success'
          })
          this.openModal = false
          // this.$emit('update:close-search')
          this.$router.push('/home')
        } catch (e) {
          console.error(e)
        }
      },
      loadQuest() {
        let urlData = `${config.baseUrl}api/shared/pesquisa/satisfacao/perguntas`
        this.$api.get(urlData).then(res => {
          this.quest = res.data
          res.data.forEach(element => {
            this.$set(this.formPesquisa, element.TITULO, null)
            this.$set(this.formPesquisa, 'observacao', null)
            //   this.$set(this.formPesquisa, string.retirarAcento(element.TITULO).toUpperCase().replaceAll(" ", "_"), null);
          })
        })
      }
    },
    watch: {
      isModalRefazerPesquisa() {
        this.openModal = true
      }
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
