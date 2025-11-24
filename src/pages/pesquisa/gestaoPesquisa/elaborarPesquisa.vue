<template>
  <v-container>
    <v-card elevation="1" class="rounded-xl" min-height="500">
      <v-card-title style="display: flex; justify-content: space-between">
        <div style="display: flex">
          <v-icon color="orange" class="mr-2">fa-solid fa-square-pen</v-icon>
          Elaborar pesquisa
          <v-progress-circular
            :value="20"
            indeterminate
            class="ml-2"
            color="orange"
            v-if="infoLoad"
          ></v-progress-circular>
        </div>
        <div>
          <v-btn icon to="/pyxis/pesquisa/gestao">
            <v-icon>fa-solid fa-xmark</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-card-subtitle>Elabore pesquisas para operadores/supervisores...</v-card-subtitle>
      <v-divider></v-divider>

      <v-col>
        <validation-observer v-slot="{ invalid, validate }" ref="observer">
          <form @submit.prevent="validate().then(submit)">
            <fieldset>
              <legend>Identificação da pesquisa</legend>
              <v-alert
                border="right"
                v-if="$route.query.action == 'editar-pesquisa'"
                colored-border
                type="error"
                elevation="1"
              >
                Os campos almopes, regionais, perfil, produto e recorrência quando vazios os dados
                permaneceram os de cadastro. Caso queira alterar, basta preencher que
                subistituiremos para os dados editado.
              </v-alert>
              <validation-provider v-slot="{ errors }" name="titulo" rules="required">
                <v-text-field
                  placeholder="Informe um titulo para a pesquisa"
                  label="Informe um titulo para a pesquisa"
                  outlined
                  dense
                  :error-messages="errors"
                  required
                  v-model="formPesquisa.titulo"
                ></v-text-field>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="objetivo" rules="required">
                <v-textarea
                  placeholder="Descreva qual o objetivo da pesquisa"
                  label="Descreva qual o objetivo da pesquisa"
                  outlined
                  dense
                  :error-messages="errors"
                  required
                  rows="1"
                  class="mt-n2"
                  v-model="formPesquisa.objetivo"
                ></v-textarea>
              </validation-provider>
              <validation-provider v-slot="{ errors }" name="instruções" rules="required">
                <v-textarea
                  placeholder="Descreva a instrução para quem irá realizar a pesquisa"
                  label="Descreva a instrução para quem irá realizar a pesquisa"
                  outlined
                  :error-messages="errors"
                  required
                  dense
                  rows="1"
                  class="mt-n2"
                  v-model="formPesquisa.instrucoes"
                ></v-textarea>
              </validation-provider>
              <template v-if="regionaisSelecionados == null || regionaisSelecionados == ''">
                <validation-provider v-slot="{ errors }" name="almopes" rules="required">
                  <v-textarea
                    placeholder="Cole uma lista com os almopes aqui..."
                    label="Cole uma lista com os almopes aqui..."
                    outlined
                    :error-messages="errors"
                    required
                    dense
                    rows="1"
                    class="mt-n2"
                    v-model="arrAlmopes"
                  ></v-textarea>
                </validation-provider>
              </template>

              <template v-if="arrAlmopes == null || arrAlmopes == ''">
                <validation-provider v-slot="{ errors }" name="regionais" rules="required">
                  <v-autocomplete
                    label="Selecione pra quais regionais a pesquisa ficará disponivel"
                    placeholder="Selecione pra quais regionais a pesquisa ficará disponivel"
                    hide-no-data
                    outlined
                    dense
                    :items="regionais"
                    item-text="CAMPANHA"
                    item-value="CAMPANHA"
                    v-model="regionaisSelecionados"
                    :error-messages="errors"
                    multiple
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index === 0" small>{{ item.CAMPANHA }}</v-chip>
                      <span v-if="index === 1" class="grey--text text-caption">
                        (+{{ regionaisSelecionados.length - 1 }}
                        outros)
                      </span>
                    </template>
                  </v-autocomplete>
                </validation-provider>
              </template>
              <v-col class="mt-n5">
                <v-row style="display: flex">
                  <v-col cols="3" class="pl-0 px-1">
                    <validation-provider
                      v-slot="{ errors }"
                      name="perfil liberação"
                      rules="required"
                    >
                      <v-autocomplete
                        label="Perfil liberação"
                        placeholder="Perfil liberação"
                        hide-no-data
                        outlined
                        dense
                        :items="['OPERADOR', 'SUPERVISOR']"
                        v-model="perfilsSelecionados"
                        :error-messages="errors"
                        multiple
                      >
                        <template v-slot:selection="{ item, index }">
                          <v-chip v-if="index === 0" small>{{ item }}</v-chip>
                          <span v-if="index === 1" class="grey--text text-caption">
                            (+{{ perfilsSelecionados.length - 1 }}
                            outros)
                          </span>
                        </template>
                      </v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="3" class="pl-0 px-1">
                    <validation-provider v-slot="{ errors }" name="produto" rules="required">
                      <v-select
                        placeholder="Produto"
                        :error-messages="errors"
                        label="Produto"
                        required
                        outlined
                        dense
                        :items="['NET', 'CLARO', 'ENEL']"
                        v-model="formPesquisa.produto"
                        no-data-text="Não há regionais disponiveis"
                        rows="1"
                      ></v-select>
                    </validation-provider>
                  </v-col>
                  <v-col cols="3" class="pl-0 px-1" style="margin-top: -10px">
                    <DatePicker
                      label="Data para pesquisa expirar"
                      v-model="formPesquisa.dataExpiracao"
                      :dateMaxProps="false"
                      :dateMinProps="true"
                      :isRange="false"
                      :addDay="30"
                    />
                  </v-col>
                </v-row>
                <div
                  style="display: flex; justify-content: end"
                  v-if="$route.query.action == 'editar-pesquisa'"
                >
                  <v-btn color="warning" small @click="editInstrucoes" :loading="sendEdit">
                    Salvar alterações
                  </v-btn>
                </div>
              </v-col>
            </fieldset>
            <fieldset>
              <!-- <pre>{{ almopesPesquisa }}</pre> -->
              <legend>Perguntas / Respostas</legend>
              <v-btn
                rounded
                small
                color="success"
                @click="adicionarPergunta"
                v-if="$route.query.action != 'editar-pesquisa'"
              >
                Adicionar pergunta
                <v-icon class="ml-2" size="17">fa-solid fa-circle-plus</v-icon>
              </v-btn>
              <v-row
                v-for="(item, i) in formPesquisa.questions"
                :key="i"
                align="center"
                class="mt-2"
              >
                <v-card elevation="1" class="rounded-xl ma-2" style="width: 100%">
                  <v-card-title style="display: flex; justify-content: space-between">
                    Digite a {{ i + 1 }}ª pergunta
                    <v-tooltip v-if="i > 0 && $route.query.action != 'editar-pesquisa'">
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn icon @click="removerPergunta(i)" v-bind="attrs" v-on="on">
                          <v-icon>fa-solid fa-xmark</v-icon>
                        </v-btn>
                      </template>
                      <span>Remover pergunta</span>
                    </v-tooltip>
                    <v-tooltip bottom v-else-if="i > 0 && $route.query.action == 'editar-pesquisa'">
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          v-bind="attrs"
                          v-on="on"
                          icon
                          color="red"
                          @click="
                            editQuestions(
                              formPesquisa.id,
                              item.id_pergunta,
                              item.pergunta,
                              'delete',
                              i
                            )
                          "
                        >
                          <v-icon>fa-solid fa-xmark</v-icon>
                        </v-btn>
                      </template>
                      <span>Remover pergunta</span>
                    </v-tooltip>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-col>
                    <v-row>
                      <v-col>
                        <validation-provider>
                          <v-select
                            :items="['OPCAO', 'TEXTO']"
                            outlined
                            required
                            label="Selecione o formato da pergunta"
                            placeholder="Selecione o formato da pergunta"
                            dense
                            v-model="item.tipoPergunta"
                          ></v-select>
                        </validation-provider>
                      </v-col>
                      <v-col cols="4">
                        <validation-provider v-slot="{ errors }" rules="required" name="pergunta">
                          <v-text-field
                            :error-messages="errors"
                            required
                            placeholder="Digite uma pergunta"
                            label="Digite uma pergunta"
                            outlined
                            dense
                            v-model="item.pergunta"
                          >
                            <template v-slot:append>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ attrs, on }">
                                  <v-btn
                                    v-bind="attrs"
                                    v-on="on"
                                    v-if="$route.query.action == 'editar-pesquisa'"
                                    style="margin-top: -5px"
                                    @click="
                                      editQuestions(
                                        formPesquisa.id,
                                        item.id_pergunta,
                                        item.pergunta,
                                        'update',
                                        null
                                      )
                                    "
                                    icon
                                    color="green darken-4"
                                  >
                                    <v-icon>fa-solid fa-floppy-disk</v-icon>
                                  </v-btn>
                                </template>
                                <span>Salvar mudanças</span>
                              </v-tooltip>
                            </template>
                          </v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="4">
                        <validation-provider
                          v-slot="{ errors }"
                          name="campo obrigatorio"
                          rules="required"
                        >
                          <v-select
                            :error-messages="errors"
                            required
                            placeholder="Campo Obrigatório?"
                            label="Campo Obrigatório?"
                            outlined
                            dense
                            :disabled="$route.query.action == 'editar-pesquisa'"
                            :items="[
                              { text: 'SIM', value: 1 },
                              { text: 'NÃO', value: 0 }
                            ]"
                            item-text="text"
                            item-value="value"
                            v-model="item.obrigatorio"
                          ></v-select>
                        </validation-provider>
                      </v-col>
                      <v-col v-if="item.tipoPergunta == 'OPCAO'" cols="12">
                        <v-row v-for="(resposta, j) in item.respostas" :key="j">
                          <v-col cols="12" class="mt-n7">
                            <validation-provider
                              v-slot="{ errors }"
                              name="respostas"
                              rules="required"
                            >
                              <v-text-field
                                style="position: relative"
                                :error-messages="errors"
                                required
                                outlined
                                dense
                                prepend-inner-icon="fa-regular fa-square-check"
                                placeholder="Digite uma resposta"
                                label="Digite uma resposta"
                                v-model="resposta.checkbox"
                              >
                                <template v-slot:append>
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ attrs, on }">
                                      <v-btn
                                        v-bind="attrs"
                                        v-on="on"
                                        style="margin-top: -5px"
                                        v-if="j > 0 && $route.query.action != 'editar-pesquisa'"
                                        @click="removerItem(i, j)"
                                        icon
                                        color="deep-orange darken-4"
                                      >
                                        <v-icon>fa-solid fa-circle-minus</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>Remover resposta</span>
                                  </v-tooltip>
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ attrs, on }">
                                      <v-btn
                                        v-bind="attrs"
                                        v-on="on"
                                        style="margin-top: -5px"
                                        v-if="
                                          j + 1 == item.respostas.length &&
                                          $route.query.action != 'editar-pesquisa'
                                        "
                                        @click="adicionarItem(i)"
                                        icon
                                        color="deep-purple accent-4"
                                      >
                                        <v-icon>fa-solid fa-circle-plus</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>Adicionar pergunta</span>
                                  </v-tooltip>
                                  <!-- acoes editar-form -->
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ attrs, on }">
                                      <v-btn
                                        v-bind="attrs"
                                        v-on="on"
                                        style="margin-top: -5px"
                                        v-if="j > 0 && $route.query.action == 'editar-pesquisa'"
                                        @click="
                                          saveResponseId(
                                            formPesquisa.id,
                                            item.id_pergunta,
                                            resposta.id_resposta,
                                            'delete',
                                            resposta.checkbox,
                                            i,
                                            j
                                          )
                                        "
                                        icon
                                        color="red"
                                      >
                                        <v-icon size="19">fa-solid fa-trash-can</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>Remover resposta</span>
                                  </v-tooltip>
                                  <v-tooltip bottom>
                                    <template v-slot:activator="{ attrs, on }">
                                      <v-btn
                                        v-bind="attrs"
                                        v-on="on"
                                        style="margin-top: -5px"
                                        v-if="$route.query.action == 'editar-pesquisa'"
                                        @click="
                                          saveResponseId(
                                            formPesquisa.id,
                                            item.id_pergunta,
                                            resposta.id_resposta,
                                            'update',
                                            resposta.checkbox,
                                            null,
                                            null
                                          )
                                        "
                                        icon
                                        color="green darken-4"
                                      >
                                        <v-icon>fa-solid fa-floppy-disk</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>Salvar mudanças</span>
                                  </v-tooltip>
                                </template>
                              </v-text-field>
                            </validation-provider>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-card>
              </v-row>
              <v-btn
                rounded
                small
                color="success"
                @click="adicionarPergunta"
                v-if="$route.query.action != 'editar-pesquisa' && formPesquisa.questions.length > 1"
                class="mt-5"
              >
                Adicionar pergunta
                <v-icon class="ml-2" size="17">fa-solid fa-circle-plus</v-icon>
              </v-btn>
            </fieldset>
            <div
              style="display: flex; justify-content: end"
              v-if="$route.query.action != 'editar-pesquisa'"
            >
              <!-- @click="elaborarPesquisa" -->
              <v-btn type="submit" color="success" rounded :disabled="invalid" :loading="isSend">
                {{ $route.query.action == 'duplicar-pesquisa' ? 'Duplicar' : 'Salvar' }} pesquisa
              </v-btn>
            </div>
          </form>
        </validation-observer>
      </v-col>
    </v-card>
  </v-container>
</template>

<script>
  import config from '../../../core/config'
  import alerts from '../../../mixins/alerts.mixins'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import DatePicker from '@/shared/components/DatePicker/DatePicker.vue'
  export default {
    components: { ValidationObserver, ValidationProvider, DatePicker },
    data: () => ({
      isSend: false,
      sendEdit: false,
      infoLoad: false,
      arrAlmopes: null,
      regionaisSelecionados: null,
      perfilsSelecionados: null,
      formPesquisa: {
        // id: null,
        titulo: null,
        objetivo: null,
        dataExpiracao: null,
        instrucoes: null,
        recorrencia: null,
        almopesSelecionados: null,
        regionaisSelecionados: null,
        perfilsSelecionados: null,
        usuarioCadastro: null,
        produto: null,
        questions: [
          {
            // id_pergunta: null,
            tipoPergunta: 'OPCAO',
            pergunta: null,
            obrigatorio: 1,
            respostas: [
              {
                // id_resposta: null,
                checkbox: null
              }
            ]
          }
        ]
      }
    }),
    mixins: [alerts],
    computed: {
      regionais() {
        return this.$store.getters.regionais
      },
      regionaisTratadas() {
        let regionais = this.regionaisSelecionados
        return regionais?.join('; ')
      },
      almopesPesquisa() {
        let texto = this.arrAlmopes
        const linhas = texto?.trim().split('\n')
        let linhasArray = linhas
          ?.map(item => {
            return {
              almopeSelecionado: item * 1
            }
          })
          ?.filter(item2 => !isNaN(item2.almopeSelecionado))
        return linhasArray
      },
      perfilsSelecionadosTratado() {
        let perfis = this.perfilsSelecionados
        return perfis?.join('; ')
      },
      usuario() {
        return this.$store.getters.usuario
      },
      idRoute() {
        return this.$route.query.id || false
      },
      dateNow() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-DD-MM HH:mm')
      }
    },
    methods: {
      async editInstrucoes() {
        try {
          this.sendEdit = true
          let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/update_infor_pesq`
          var res = await this.$api.post(urlData, {
            idForm: this.formPesquisa.id,
            titulo: this.formPesquisa.titulo,
            objetivo: this.formPesquisa.objetivo,
            instrucoes: this.formPesquisa.instrucoes,
            usuarioAlteracao: this.usuario.almope,
            dataAlteracao: this.dateNow,
            dataExpiracao: this.formPesquisa.dataExpiracao,
            recorrencia: this.formPesquisa.recorrencia, // senão for preenchido, salvar oque está no banco
            produto: this.formPesquisa.produto, // senão for preenchido, salvar oque está no banco
            regionaisSelecionados: this.regionaisTratadas, // senão for preenchido, salvar oque está no banco
            perfilsSelecionados: this.perfilsSelecionadosTratado, // senão for preenchido, salvar oque está no banco
            almopesSelecionados: this.almopesPesquisa // senão for preenchido, salvar oque está no banco [tabela diferente]
          })
          this.toast(res.data.message, 'top-right', false, 2000, 'success')
          this.sendEdit = false
        } catch (e) {
          this.toast(
            'Não foi possivel atualizar informações da pesquisa!',
            'top-right',
            false,
            2000,
            'error'
          )
          this.sendEdit = false
        }
      },
      editQuestions(idForm, idPerg, pergunta, action, index) {
        let urlConfig = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/`
        if (action == 'update') {
          let urlData = `${urlConfig}update_questions`
          this.$api
            .post(urlData, {
              idForm,
              idPerg,
              pergunta
            })
            .then(() => {
              this.toast('Pergunta atualizada com sucesso!', 'top-right', false, 2000, 'success')
            })
        } else if (action == 'delete') {
          let urlData = `${urlConfig}alter_status_question`
          this.$api
            .post(urlData, {
              idForm,
              idPerg
            })
            .then(() => {
              this.removerPergunta(index)
              this.toast('Pergunta excluída com sucesso!', 'top-right', false, 2000, 'success')
            })
        }
      },
      saveResponseId(idForm, idPerg, idResp, action, checkbox, indexPerg, indexResp) {
        let url = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/`
        if (action == 'update') {
          let urlData = `${url}update_response`
          this.$api
            .post(urlData, {
              idForm,
              idPerg,
              idResp,
              checkbox
            })
            .then(() => {
              this.toast('Resposta atualizada com sucesso!', 'top-right', false, 2000, 'success')
            })
        } else if (action == 'delete') {
          let urlData = `${url}alter_status_resp`
          this.$api
            .post(urlData, {
              idForm,
              idPerg,
              idResp
            })
            .then(() => {
              this.removerItem(indexPerg, indexResp)
              this.toast('Resposta excluída com sucesso!', 'top-right', false, 2000, 'success')
            })
        }
      },
      async submit() {
        try {
          this.isSend = true
          let data = {
            ...this.formPesquisa,
            almopesSelecionados: this.almopesPesquisa,
            regionaisSelecionados: this.regionaisTratadas,
            perfilsSelecionados: this.perfilsSelecionadosTratado,
            usuarioCadastro: this.usuario.almope
          }
          let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/elaborar`
          await this.$api.post(urlData, data)
          this.toast(
            'Pesquisa criada com sucesso! Realize a validação com algum operador/supervisor.',
            'bottom-right',
            false,
            2500,
            'success'
          )
          this.resetFormPesquisa(this.formPesquisa)
          this.$router.push({ name: 'Gestão de Pesquisas' })
          this.isSend = false
        } catch (e) {
          this.toast(
            'Não foi possivel criar a pesquisa, tente novamente!',
            'bottom-right',
            false,
            2500,
            'error'
          )
          this.isSend = false
        }
      },
      handleRespDepois() {
        return {
          id_pergunta: null,
          pergunta: null,
          obrigatorio: 1,
          respostas: [
            {
              id_resposta: null,
              checkbox: null
            }
          ]
        }
      },
      resetFormPesquisa(obj) {
        for (let key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
              this.resetFormPesquisa(obj[key])
            } else if (Array.isArray(obj[key])) {
              obj[key] = obj[key].map(item => {
                if (typeof item === 'object') {
                  this.resetFormPesquisa(item)
                }
                return item
              })
            } else {
              obj[key] = null
            }
          }
          this.perfilsSelecionados = null
          this.regionaisSelecionados = null
          this.arrAlmopes = null
          this.$refs.observer.reset()
        }
      },
      adicionarPergunta() {
        this.formPesquisa.questions.push({
          pergunta: null,
          obrigatorio: 1,
          respostas: [
            {
              checkbox: null
            }
          ]
        })
      },
      adicionarItem(i) {
        this.formPesquisa.questions[i].respostas.push({
          checkbox: null
        })
      },
      removerItem(i, j) {
        this.formPesquisa.questions[i].respostas.splice(j, 1)
      },
      removerPergunta(index) {
        this.formPesquisa.questions.splice(index, 1)
      },
      loadRegionais() {
        return this.$store.dispatch('loadRegionais')
      },
      loadDadosChecklistUpdate() {
        if (this.idRoute) {
          this.infoLoad = true
          let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/campos_pesquisa_id`
          this.$api
            .get(urlData, {
              params: {
                id: this.$route.query.id
              }
            })
            .then(res => {
              let dados = res.data
              this.formPesquisa.id = dados[0].id
              this.formPesquisa.titulo = dados[0].titulo
              this.formPesquisa.objetivo = dados[0].objetivo
              this.formPesquisa.instrucoes = dados[0].instrucoes
              const questions = res?.data[0].questions.map(item => {
                return {
                  id_pergunta: item.id_pergunta,
                  pergunta: item.pergunta,
                  obrigatorio: item.obrigatorio,
                  respostas: item.respostas.map(resposta => {
                    return {
                      id_resposta: resposta.id_resposta,
                      checkbox: resposta.checkbox
                    }
                  })
                }
              })
              this.formPesquisa.questions = questions
              this.infoLoad = false
            })
        }
      }
    },
    watch: {},
    created() {
      this.loadRegionais()
      this.loadDadosChecklistUpdate()
    }
  }
</script>

<style scoped>
  fieldset {
    padding: 15px;
    border: 1px solid #3333;
    border-radius: 20px;
    margin-bottom: 15px;
  }
  legend {
    padding: 0 10px;
    font-size: 20px;
  }
</style>
