<template>
  <div class="container-configuracao">
    <v-alert border="left" outlined type="warning" prominent>
      {{
        dadosEditTab != ''
          ? `O bilhete ${dadosEditTab['BILHETES']} está selecionado, e será nele que aplicaremos as mudanças. Para mudar um outro bilhete
      basta selecionar na caixa abaixo.`
          : 'As alterações serão realizadas de acordo com o bilhete selecionado.'
      }}
    </v-alert>
    <v-col class="my-0 py-0">
      <concursos-em-andamento-resultado
        @update:bilhete="bilheteSelecionado"
      ></concursos-em-andamento-resultado>
      <v-col v-if="concursos != ''">
        <bloco-component title="Selecione um concurso">
          <v-chip-group
            v-model="selection"
            :value="selection"
            active-class="deep-purple--text text--accent-4"
          >
            <!-- mandatory -->
            <v-chip
              v-for="(concurso, i) in concursos"
              :key="i"
              @click="selectConcurso(concurso.CONCURSO)"
            >
              {{ concurso.CONCURSO }}
            </v-chip>
          </v-chip-group>
        </bloco-component>
      </v-col>
      <v-row class="mx-1">
        <v-col cols="6">
          <bloco-component title="Editar">
            <div>
              <v-alert
                v-if="formEditar.imagem"
                color="blue-grey"
                dark
                dense
                icon="fa-solid fa-circle-exclamation"
                prominent
              >
                Bilhete possui um banner cadastrado, para modificar anexe outro Banner!
              </v-alert>
              <v-alert
                v-if="!formEditar.imagem"
                color="deep-orange"
                dark
                dense
                icon="fa-solid fa-circle-exclamation"
                prominent
              >
                Para todas as mudanças, é necessário escolher o bilhete e o concurso!
              </v-alert>
              <v-row>
                <v-col>
                  <v-text-field
                    outlined
                    dense
                    placeholder="Número do Concurso"
                    label="Número do Concurso"
                    v-mask="masks.loteria"
                    v-model="formEditar.concurso"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    outlined
                    dense
                    placeholder="Data Sorteio"
                    label="Data Sorteio"
                    v-mask="masks.data"
                    v-model="formEditar.dataSorteio"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n6">
                <v-col class="py-0">
                  <v-autocomplete
                    label="Selecione um público"
                    item-text="title"
                    item-value="valor"
                    outlined
                    dense
                    v-model="formEditar.tipoAlvoBilhetes"
                    @change="loadDadosPublicoSelecionado()"
                    :items="itemsPublico"
                  ></v-autocomplete>
                </v-col>
                <v-col class="py-0">
                  <v-autocomplete
                    label="Público"
                    item-text="PUBLICO"
                    item-value="PUBLICO"
                    outlined
                    dense
                    v-model="formEditar.alvoBilhetes"
                    :items="dadosPublico"
                    :multiple="formEditar.tipoAlvoBilhetes == 'REGIONAL' ? true : false"
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index === 0" small>
                        <span>{{ item.PUBLICO }}</span>
                      </v-chip>
                      <span v-if="index === 1" class="grey--text text-caption">
                        (+{{ formEditar.alvoBilhetes.length - 1 }} outros)
                      </span>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col class="py-0">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Descrição do prêmio"
                    label="Descrição do prêmio"
                    v-model="formEditar.descPremio"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n3">
                <v-col class="py-0">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Data Inicio"
                    label="Data Inicio"
                    v-model="formEditar.dataInicio"
                    v-mask="masks.data"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0">
                  <v-text-field
                    outlined
                    dense
                    placeholder="Data Fim"
                    label="Data Fim"
                    v-model="formEditar.dataFim"
                    v-mask="masks.data"
                  ></v-text-field>
                </v-col>
                <v-col class="py-0">
                  <v-select
                    outlined
                    dense
                    :items="statusConcurso"
                    placeholder="Status do concurso"
                    label="Status do concurso"
                    v-model="formEditar.statusConcurso"
                  ></v-select>
                </v-col>
              </v-row>
            </div>

            <div style="display: flex; justify-content: end; margin-top: 16px">
              <v-btn
                color="success"
                class="rounded-r-xl rounded-bl-xl"
                @click="salvarEdicao"
                :disabled="!this.salvarEditarValido()"
              >
                Salvar
              </v-btn>
            </div>
          </bloco-component>
        </v-col>
        <v-col cols="6">
          <bloco-component title="Informações Importantes">
            <v-alert color="blue-grey" dark dense icon="fa-solid fa-circle-exclamation" prominent>
              As Informações Importantes modificadas serão aplicadas para o bilhete. Use (";") para
              separar os items.
            </v-alert>
            <div>
              <v-textarea
                outlined
                placeholder="Use (';') para separar os items."
                label="Use ('Ponto e Virgula') para separar os items."
                v-model="formEditar.informacoes"
              ></v-textarea>
            </div>
            <div style="display: flex; justify-content: end">
              <v-btn
                color="success"
                class="rounded-r-xl rounded-bl-xl"
                @click="enviarInformacoesImportantes"
                :disabled="!this.enviarInformacoesImportanteEValido()"
              >
                Salvar
              </v-btn>
            </div>
          </bloco-component>
        </v-col>
      </v-row>
      <v-row class="mx-1">
        <v-col>
          <bloco-component title="Atualizar Banner">
            <div>
              <banner
                @update:limparDados="limparDadosEnvio"
                :nameImage="formEditar.imagem"
                :imagemProps="isImage"
                :numeroBilhete="queryId"
                :numeroConcurso="concurso"
              ></banner>
            </div>
          </bloco-component>
        </v-col>
      </v-row>
    </v-col>
  </div>
</template>

<script>
  import banner from '../painel/setting/banner.vue'
  import config from '../../../core/config'
  import BlocoComponent from '../../../shared/components/bloco/bloco.component.vue'
  import ConcursosEmAndamentoResultado from '../concursosEmAndamentoResultado.vue'

  import Masks from '../../../shared/masks/masks'
  import alerts from '../../../mixins/alerts.mixins'
  import { isArray } from '@amcharts/amcharts4/core'
  export default {
    components: { banner, BlocoComponent, ConcursosEmAndamentoResultado },
    props: {
      dadosEdit: {
        type: [Array, Object]
      }
    },
    data: () => ({
      statusConcurso: [
        { text: 'ATIVO', value: 1 },
        { text: 'INATIVO', value: 0 }
      ],
      dadosEditTab: [],
      bilhetes: [],
      dadosConcurso: [],
      concursos: [],
      regionais: [],
      alert: false,
      selection: null,
      concurso: null,
      bilhete: null,
      numeroConcurso: null,
      formEditar: {
        informacoes: null,
        bilhete: null,
        alvoBilhetes: null,
        dataSorteio: null,
        descPremio: null,
        status: null,
        concurso: null,
        imagem: null,
        dataInicio: null,
        dataFim: null,
        statusConcurso: 0,
        tipoAlvoBilhetes: null
      },
      itemsPublico: [
        { title: 'Por Regional', valor: 'REGIONAL' },
        { title: 'Por Coordenador', valor: 'COORDENADOR' }
      ],
      dadosPublico: []
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return Masks
      },
      imagemBanner() {
        let dado = this.dadosConcurso['BILHETE']
        if (dado) {
          return dado[0]['ITEMS'][0]['IMAGEM_BANNER']
        }
        return null
      },
      isImage() {
        if (this.dadosEditTab != '') {
          return this.dadosEditTab.IMAGEM_BANNER
        } else {
          return this.imagemBanner
        }
      },
      regional() {
        return this.$store.getters.usuario.regional
      },
      queryId() {
        return this.formEditar.bilhete
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      loadDadosPublicoSelecionado() {
        let urlData = `${config.baseUrl}api/shared/loteria/configuracao/dados_publico_selecionado/${this.formEditar.tipoAlvoBilhetes}`
        this.$api.get(urlData).then(res => {
          this.dadosPublico = res.data
        })
      },
      limparDadosEnvio() {
        this.loadDadosConcursos(this.concurso)
      },
      salvarEditarValido() {
        return this.numeroConcurso && this.formEditar.bilhete
      },
      salvarEdicao() {
        let data = {
          numeroBilhete: this.formEditar.bilhete,
          numeroConcurso: this.numeroConcurso,
          numeroConcursoModificado: this.formEditar.concurso,
          dataSorteio: this.formEditar.dataSorteio,
          publico: this.arrayToString(this.formEditar.alvoBilhetes),
          premio: this.formEditar.descPremio,
          dataInicio: this.formEditar.dataInicio,
          dataFim: this.formEditar.dataFim,
          statusConcurso: this.formEditar.statusConcurso,
          tipoAlvoBilhetes: this.formEditar.tipoAlvoBilhetes
        }
        let urlData = `${config.baseUrl}/api/shared/loteria/configuracao/dados_concurso/`
        this.$api
          .post(urlData, data)
          .then(() => {
            this.toast('Dados atualizados com sucesso', 'bottom-right', false, 3500, 'success')
            this.limparDadosEnvio()
          })
          .catch(e => {
            this.toast('Dados não atualizados. Error: ' + e, 'bottom-right', false, 3500, 'error')
          })
      },
      enviarInformacoesImportanteEValido() {
        return this.formEditar.bilhete && this.formEditar.concurso && this.formEditar.informacoes
      },
      selectConcurso(item) {
        this.concurso = item
        this.loadDadosConcursos(item)
        this.loadListComunicado()
      },
      tratarPublico(string) {
        if (!string) return
        let publico = string.split(';')
        for (let i = 0; i < publico.length; i++) {
          publico[i] = publico[i].trim()
        }
        return publico
      },
      arrayToString(array) {
        if (!array) return
        if (isArray(array) == true) {
          let mapArray = array.map(e => e)
          return mapArray.join('; ')
        } else {
          return array
        }
      },
      formatarData(data) {
        if (!data) return
        return data.split('-').reverse().join('/')
      },
      possuiPontoEVirgula(text) {
        var minhaString = text

        var possuiPontoEVirgula = /;/.test(minhaString)

        if (possuiPontoEVirgula) {
          return minhaString.trim()
        } else {
          return minhaString.trim().concat('; ')
        }
      },
      loadDadosConcursos(concurso) {
        let urlData = `${config.baseUrl}api/shared/loteria/comunicado/dados_concurso/${this.formEditar.bilhete}/${concurso}`
        this.$api
          .get(urlData)
          .then(res => {
            let result = res.data
            result.map(item => {
              this.formEditar.alvoBilhetes = this.tratarPublico(item.ALVO_BILHETES)
              this.formEditar.dataSorteio = this.formatarData(item.DATA_SORTEIO)
              this.formEditar.descPremio = item.DESC_PREMIO
              this.formEditar.concurso = item.CONCURSO
              this.numeroConcurso = item.CONCURSO
              this.formEditar.status = item.VISIVEL
              this.formEditar.imagem = item.IMAGEM_BANNER
              this.formEditar.dataInicio = this.formatarData(item.DATA_INICIO)
              this.formEditar.dataFim = this.formatarData(item.DATA_FIM)
              this.formEditar.statusConcurso = item.STATUS
              this.formEditar.tipoAlvoBilhetes = item.TIPO_ALVO_BILHETES
            })
          })
          .then(() => {
            this.loadDadosPublicoSelecionado()
          })
      },
      async enviarInformacoesImportantes() {
        try {
          let list = this.formEditar.informacoes
          let listSplit = list.split(';')
          let newList = listSplit
            .map(item => {
              return {
                textoInfo: this.possuiPontoEVirgula(item),
                usuarioCadastro: this.usuarioAlmope,
                regional: this.arrayToString(this.formEditar.alvoBilhetes),
                bilhete: this.formEditar.bilhete
              }
            })
            .filter(el => {
              return el.textoInfo != '' && el.textoInfo != '; '
            })
          let urlData = `${config.baseUrl}api/shared/loteria/comunicado/informacoes/`
          await this.$api.post(urlData, newList)
          this.toast(
            'Informações importantes atualizadas com sucesso!',
            'bottom-right',
            false,
            3500,
            'success'
          )
        } catch (e) {
          this.toast(
            `Dados não foram atualizados. Erro: ${e}`,
            'bottom-right',
            false,
            3500,
            'error'
          )
        }
      },
      loadListComunicado() {
        let urlData = `${config.baseUrl}api/shared/loteria/comunicado/informacoes/${this.queryId}`
        this.$api.get(urlData).then(res => {
          let listComunicado = res.data
          let newList = listComunicado.map(item => item.TEXTO_INFO)
          this.formEditar.informacoes = newList.join('')
        })
      },
      // loadRegionais() {
      //   let urlData = `${config.baseUrl}api/shared/regional/portal`;
      //   this.$api.get(urlData).then((res) => {
      //     this.regionais = res.data;
      //   });
      // },
      bilheteSelecionado(item) {
        this.formEditar.bilhete = item
        this.loadConcursos(item)
      },
      loadConcursos(bilhete) {
        let urlData = `${config.baseUrl}api/shared/loteria/configuracao/concursos_ativos/${bilhete}`
        this.$api.get(urlData).then(res => {
          this.concursos = res.data
        })
      },
      loadEditTab() {
        this.formEditar.bilhete = null
        this.alert = true
        this.dadosEditTab = this.dadosEdit
      },
      loadBilhetes() {
        let urlData = `${config.baseUrl}api/shared/loteria/configuracao/dados_bilhetes_ativos/`
        this.$api.get(urlData).then(res => {
          this.bilhetes = res.data
          // this.loadRegionais();
        })
      }
    },
    created() {
      this.loadEditTab()
      this.loadBilhetes()
    },
    watch: {
      dadosEdit() {
        this.loadEditTab()
      },
      'formEditar.bilhete': function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.dadosEditTab = ''
        }
      }
    }
  }
</script>

<style scoped>
  .container-configuracao {
    padding: 20px;
  }
</style>
