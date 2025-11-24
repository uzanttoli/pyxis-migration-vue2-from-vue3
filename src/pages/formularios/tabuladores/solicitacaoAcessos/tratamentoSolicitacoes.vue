<template>
  <div class="_container">
    <div class="menu-lateral">
      <p class="text-h2 pa-2" style="font-size: 35px !important">Solicitações</p>
      <input v-model="search" id="search" type="text" placeholder="Pesquisar" />
      <div class="table-container">
        <v-progress-linear
          color="blue"
          indeterminate
          v-if="casosTratativas == ''"
        ></v-progress-linear>
        <table>
          <thead></thead>
          <tbody>
            <tr
              v-for="(casos, i) in casosTratativasFilter"
              :key="i"
              :class="casos.ID == dadosTratativa.ID ? 'selecionado' : ''"
            >
              <td :class="casos.IMPRODUTIVO == 'SIM' ? 'type-row-urgency' : 'type-row'">
                <a href="#" @click="pushCase(casos)">
                  <span>
                    <i class="fa-solid fa-calendar-days"></i>
                    {{ normalizeDate(casos.DATA_CADASTRO) }}
                  </span>
                  <div>
                    <p>Tipo Atend.: {{ normalizeText(casos.TIPO_ATENDIMENTO) }}</p>
                    <p>Sistema Erro: {{ normalizeText(casos.SISTEMA_COM_ERRO) }}</p>
                    <p>Improdutivo: {{ normalizeText(casos.IMPRODUTIVO) }}</p>
                    <p>Status Anterior: {{ normalizeText(casos.STATUS_CHAMADO) }}</p>
                    <span>
                      Status:
                      <v-chip
                        x-small
                        :class="casos.NOME_TRATAMENTO ? 'orange white--text' : 'green white--text'"
                      >
                        {{
                          casos.NOME_TRATAMENTO
                            ? normalizeText(casos.NOME_TRATAMENTO)
                            : 'Disponivel para Tratamento'
                        }}
                      </v-chip>
                    </span>
                  </div>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pagination">
        <v-btn icon @click="pageActual--, listItems(15)" :disabled="pageActual == 1">
          <i class="fa-solid fa-chevron-left"></i>
        </v-btn>
        <span>{{ pageActual }} / {{ totalPages }}</span>
        <v-btn icon @click="pageActual++, listItems(15)" :disabled="pageActual == totalPages">
          <i class="fa-solid fa-chevron-right"></i>
        </v-btn>
      </div>
    </div>
    <div>
      <div class="info-tratativa-not" v-if="dadosTratativa == ''">
        <div class="not-solicitation">
          <i class="fa-solid fa-folder-open"></i>
          Selecione um caso para tratativa!
          <loadhastag
            :activeMsg="true"
            msg="Carregando... Aguarde por favor!"
            :envioDados="loading"
          ></loadhastag>
        </div>
      </div>
      <div class="info-tratativa" v-else>
        <div class="title-container">
          <i class="fa-regular fa-clock"></i>
          <span class="ml-1">{{ normalizeDate(dadosTratativa.DATA_CADASTRO) }}</span>
          <p class="text-h2" style="font-size: 35px !important">
            Tipo de atendimento:
            {{ normalizeText(dadosTratativa.TIPO_ATENDIMENTO) }}
          </p>
        </div>
        <v-divider></v-divider>
        <div class="form-tratativa">
          <ValidationObserver v-slot="{ invalid }" ref="observer">
            <form @submit.prevent="submit">
              <fieldset
                style="display: flex; align-items: center; flex-wrap: wrap; justify-content: center"
              >
                <legend>Dados tabulados</legend>
                <div class="evidencia" v-if="dadosTratativa.ANEXO_EVIDENCIA != null">
                  <img :src="evidenciaImage(dadosTratativa.ANEXO_EVIDENCIA)" alt="Evidencia" />
                  <a
                    class="btn-download-img"
                    target="_blank"
                    :href="evidenciaImage(dadosTratativa.ANEXO_EVIDENCIA)"
                  >
                    Baixar Evidência
                  </a>
                </div>
                <div style="width: 59vw">
                  <div style="display: flex; flex-wrap: wrap; gap: 10px">
                    <v-text-field
                      dense
                      outlined
                      placeholder="Almope"
                      label="Almope"
                      readonly
                      :value="dadosTratativa.ALMOPE"
                    ></v-text-field>
                    <v-text-field
                      dense
                      outlined
                      placeholder="Nome"
                      label="Nome"
                      readonly
                      :value="dadosTratativa.NOME"
                    ></v-text-field>
                    <v-text-field
                      dense
                      outlined
                      placeholder="Supervisor"
                      label="Supervisor"
                      readonly
                      :value="dadosTratativa.SUPERVISOR"
                    ></v-text-field>
                    <v-text-field
                      dense
                      outlined
                      placeholder="Tipo Atendimento"
                      label="Tipo Atendimento"
                      :value="dadosTratativa.TIPO_ATENDIMENTO"
                      readonly
                    ></v-text-field>
                    <v-text-field
                      dense
                      outlined
                      placeholder="BR"
                      label="BR"
                      readonly
                      :value="dadosTratativa.BR"
                    ></v-text-field>
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 10px">
                    <v-text-field
                      dense
                      outlined
                      placeholder="Sistema com Erro"
                      label="Sistema com Erro"
                      :value="dadosTratativa.SISTEMA_COM_ERRO"
                      readonly
                    ></v-text-field>
                    <v-text-field
                      dense
                      outlined
                      placeholder="Improdutivo"
                      label="Improdutivo"
                      readonly
                      :value="dadosTratativa.IMPRODUTIVO"
                    ></v-text-field>

                    <v-text-field
                      dense
                      outlined
                      placeholder="Data Cadastro"
                      label="Data Cadastro"
                      readonly
                      :value="dadosTratativa.DATA_CADASTRO"
                    ></v-text-field>
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 10px">
                    <v-textarea
                      dense
                      outlined
                      auto-grow
                      placeholder="Descricao do Erro"
                      label="Descricao do Erro"
                      readonly
                      :value="dadosTratativa.DESCRICAO_ERRO"
                    ></v-textarea>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>Dados Tratativa</legend>

                <v-alert
                  color="blue-grey"
                  dark
                  v-show="dadosTratativaAnterior.NUMERO_CHAMADO != null"
                  icon="fa-solid fa-info"
                  prominent
                >
                  <p class="white--text" style="font-size: 14px">
                    <strong>
                      Essa solicitação já possui retorno, porém não foi finalizada. Caso queira
                      modificar algum dado fique a vontade.
                    </strong>
                  </p>
                  <ul style="color: #fff; margin-top: 6px; font-size: 13px">
                    <li>Nª Chamado: {{ dadosTratativaAnterior.NUMERO_CHAMADO }}</li>
                    <li>
                      Status Tratativa:
                      {{ dadosTratativaAnterior.STATUS_CHAMADO }}
                    </li>
                    <li>
                      Retorno SYSAID:
                      {{
                        dadosTratativaAnterior.RETORNO_OPERACAO == ''
                          ? 'Sem observação'
                          : dadosTratativaAnterior.RETORNO_OPERACAO
                      }}
                    </li>
                    <li>
                      Retorno Operação:
                      {{
                        dadosTratativaAnterior.RETORNO_SYSAID == ''
                          ? 'Sem observação'
                          : dadosTratativaAnterior.RETORNO_SYSAID
                      }}
                    </li>
                  </ul>
                </v-alert>
                <div style="display: flex; gap: 10px; flex-wrap: wrap">
                  <v-col class="pa-0 ma-0">
                    <ValidationProvider v-slot="{ errors }" rules="required" name="Status Chamado">
                      <v-select
                        dense
                        outlined
                        required
                        :error-messages="errors"
                        no-data-text="Não há items"
                        :items="listStatusChamado"
                        item-text="VALOR_CAMPO"
                        item-value="VALOR_CAMPO"
                        v-model="formTratamento.statusChamado"
                        placeholder="Status Chamado"
                        label="Status Chamado"
                      ></v-select>
                    </ValidationProvider>
                  </v-col>
                  <v-col class="pa-0 ma-0">
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required|numeric|min:7|max:7"
                      name="Número Chamado"
                    >
                      <v-text-field
                        dense
                        :error-messages="errors"
                        required
                        v-model="formTratamento.numeroChamado"
                        outlined
                        placeholder="Número do Chamado"
                        label="Número do Chamado"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap">
                  <v-col class="pa-0 ma-0">
                    <ValidationProvider v-slot="{ errors }" name="Retorno Sysaid">
                      <v-textarea
                        dense
                        :error-messages="errors"
                        v-model="formTratamento.retornoSysaid"
                        outlined
                        placeholder="Retorno Sysaid"
                        label="Retorno Sysaid"
                      ></v-textarea>
                    </ValidationProvider>
                  </v-col>
                  <v-col class="pa-0 ma-0">
                    <ValidationProvider v-slot="{ errors }" name="Retorno Operação">
                      <v-textarea
                        :error-messages="errors"
                        dense
                        v-model="formTratamento.retornoOperacao"
                        outlined
                        placeholder="Retorno Operação"
                        label="Retorno Operação"
                      ></v-textarea>
                    </ValidationProvider>
                  </v-col>
                </div>
                <div class="actions">
                  <v-btn @click="clearForm" color="error" class="mr-2">Limpar</v-btn>
                  <v-btn :disable="invalid" type="submit" color="success">Finalizar</v-btn>
                </div>
              </fieldset>
            </form>
          </ValidationObserver>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { ValidationProvider, ValidationObserver } from 'vee-validate'
  import config from '../../../../core/config'
  import Loadhastag from '../../../../shared/components/load/loadHastag.vue'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    components: { ValidationProvider, ValidationObserver, Loadhastag },
    data: () => ({
      casosTratativas: [],
      itemsPerPages: [],
      dadosTratativa: [],
      formTratamento: {
        numeroChamado: null,
        statusChamado: null,
        retornoSysaid: null,
        retornoOperacao: null
      },
      casoIdSelecionado: null,
      items: [],
      loading: false,
      search: '',
      pageActual: 1,
      limitItems: 15
    }),
    mixins: [alerts],
    computed: {
      totalPages: {
        get() {
          return this.search != ''
            ? Math.ceil(this.casosTratativasFilter.length / this.limitItems)
            : Math.ceil(this.casosTratativas.length / this.limitItems)
        },
        set(newValue) {
          return newValue
        }
      },
      listStatusChamado() {
        let items = this.items.filter(item => {
          return item.NOME_CAMPO == 'STATUS CHAMADO'
        })
        return items
      },
      casosTratativasFilter() {
        let items = []
        items = this.itemsPerPages.filter(item => {
          return (
            item.TIPO_ATENDIMENTO.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.SISTEMA_COM_ERRO.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.IMPRODUTIVO.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.NUMERO_CHAMADO.toString().indexOf(this.search) > -1 ||
            item.STATUS_CHAMADO.toLowerCase().indexOf(this.search.toLowerCase()) > -1 ||
            item.ALMOPE.indexOf(this.search) > -1
          )
        })
        return items
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      dadosTratativaAnterior() {
        let items = {
          NUMERO_CHAMADO: this.dadosTratativa.NUMERO_CHAMADO,
          RETORNO_OPERACAO: this.dadosTratativa.RETORNO_OPERACAO,
          RETORNO_SYSAID: this.dadosTratativa.RETORNO_SYSAID,
          STATUS_CHAMADO: this.dadosTratativa.STATUS_CHAMADO
        }

        return items
      }
    },
    methods: {
      listItems(itemsPerPages = 15) {
        let result = []

        let count = this.pageActual * this.limitItems - this.limitItems
        let demiliter = count == 0 ? itemsPerPages : count + itemsPerPages
        if (count <= demiliter) {
          for (let i = count; i < demiliter; i++) {
            if (this.casosTratativas[i] != undefined) {
              result.push(this.casosTratativas[i])
            }
          }
        }
        this.itemsPerPages = result
      },
      evidenciaImage(img) {
        if (img) {
          return `http://172.16.252.214:4200/index.php/api/shared/arquivos/image_generics/solicitacaoAcessosEnel/${img}`
        }
      },
      async submit() {
        try {
          const isValid = await this.$refs.observer.validate()
          if (isValid) {
            this.loading = true
            this.formTratamento.idCaso = this.dadosTratativa.ID
            this.formTratamento.almopeTratamento = this.usuarioAlmope
            let urlData = `${config.baseUrl}api/shared/formularios/solicitacao_acessos/dados_tratativa/`
            await this.$api.post(urlData, this.formTratamento)
            this.$refs.observer.reset()
            this.clearForm()
            this.dadosTratativa = ''
            this.loadCasosTratativa()
            this.loading = false
            this.toast('Solicitação finalizado com sucesso!', 'top-right', false, 2500, 'success')
          }
        } catch (error) {
          console.error('erro')
        }
      },
      clearForm() {
        let newForm = Object.assign({}, this.formTratamento)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formTratamento = newForm
        this.$refs.observer.reset()
      },
      async pushCase(e) {
        try {
          this.loading = true
          this.dadosTratativa = ''
          let urlData = `${config.baseUrl}api/shared/formularios/solicitacao_acessos/dados_tratativa/${e.ID}/${this.usuarioAlmope}`
          var res = await this.$api.get(urlData)
          if (res.data[0]['RETORNO_VALIDACAO']) {
            this.toast('Esse caso já está sendo tratado!', 'top-right', false, 2000, 'warning')
          } else {
            this.dadosTratativa = res.data[0]
            this.loadItemsSolicitacao()
            if (e.NOME_TRATAMENTO == null) {
              this.loadCasosTratativa()
            }
          }
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      },
      normalizeText(string) {
        if (!string) return
        let newText = string[0] + string.substring(1, string.length).toLowerCase()
        return newText
      },
      normalizeDate(string) {
        if (!string) return
        let newDateSplit = string.split('-')
        const [year, month, day] = newDateSplit
        let dayForm = day.split(' ')
        return `${dayForm[0]}/${month}/${year} ${dayForm[1]}`
      },
      loadItemsSolicitacao() {
        let urlData = `${config.baseUrl}api/shared/formularios/solicitacao_acessos/validacao_soli_acesso`
        this.$api.get(urlData).then(res => {
          this.items = res.data
        })
      },
      loadCasosTratativa() {
        let urlData = `${config.baseUrl}api/shared/formularios/solicitacao_acessos/casos_tratativa`
        this.$api.get(urlData).then(res => {
          this.casosTratativas = res.data
          this.listItems()
        })
      }
    },
    created() {
      this.loadCasosTratativa()
    },
    watch: {
      'formTratamento.statusChamado': function (newVal, oldVal) {
        if (newVal == 'IMPROCEDENTE' || oldVal == 'IMPORTANTE') {
          this.formTratamento.numeroChamado = '0000000'
        }
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Bangers&display=swap"); */
  ._container {
    margin-top: 25px;
    gap: 10px;
    display: grid;
    grid-template-columns: 300px minmax(auto, 1fr);
    grid-column-gap: 6px;

    @media screen and (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  h4 {
    margin-bottom: 10px;
    padding: 5px 5px 0 5px;
    font-size: 25px;
    font-family: Bangers;
  }

  .menu-lateral input {
    padding: 5px;
    font-size: 15px;
    width: 100%;
    border: 1px solid #b3b3b3;
    margin-bottom: 10px;
  }

  .menu-lateral input:focus {
    outline: none;
  }

  .menu-lateral {
    /* grid-area: menu-lateral; */
    max-height: 100vh;
    margin-top: 10px;
    padding: 5px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
    background-color: #f8f8f8;
  }

  .info-tratativa-not {
    min-width: 300px;
    height: 90vh;
    word-break: break-word;
    /* background-color: #f8f8f8; */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .info-tratativa {
    min-width: 300px;
    word-break: break-word;
    /* background-color: #f8f8f8; */
    padding: 5px;
  }

  .not-solicitation {
    display: flex;
    flex-direction: column;
    text-align: center;
    font-size: 25px;
    color: #a3a3a3;
  }

  .not-solicitation i {
    font-size: 50px;
    color: #747474;
  }

  a {
    text-decoration: none;
    color: #333;
    font-size: 13px;
  }

  p {
    padding: 0;
    margin: 0;
    color: #333;
    font-size: 13px;
  }

  .table-container {
    max-height: 75vh;
    overflow: auto;
  }

  .table-container::-webkit-scrollbar {
    width: 10px;
  }

  .table-container::-webkit-scrollbar-track {
    background: rgb(255, 255, 254);
  }

  .table-container::-webkit-scrollbar-thumb {
    background-color: rgb(143, 14, 143);
    border-radius: 25px;
    border: 3px solid rgb(245, 245, 245);
  }

  table {
    width: 100%;
  }

  tbody {
    row-gap: 10px;
  }

  .type-row-urgency {
    border-left: 3px solid #ff2600;
    padding: 5px;
    /* box-shadow: 0px 5px 5px 0px; */
  }
  .type-row {
    border-left: 3px solid #ffa500;
    padding: 5px;
    /* box-shadow: 0px 5px 5px 0px; */
  }

  tr {
    width: 100%;
    line-height: 21px;
  }

  .selecionado {
    width: 100%;
    background-color: #f8d697;
  }

  tr:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }

  .form-tratativa {
    padding: 10px;
  }

  fieldset {
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #b4b4b4;
  }

  fieldset legend {
    font-size: 20px;
    padding: 0 5px;
  }

  .actions {
    display: flex;
    justify-content: end;
  }

  .title-container {
    padding: 10px;
    font-size: 13px;
    color: #333;
  }

  .evidencia {
    display: flex;
    flex-direction: column;
    padding: 8px;
    margin-bottom: 10px;
    margin-right: 13px;
    width: 450px;
  }

  .btn-download-img {
    background-color: #0099ff;
    padding: 8px;
    color: white;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 0.1);
  }

  .pagination {
    height: 50px;
    gap: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
