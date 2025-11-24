<template>
  <v-container fluid>
    <v-card tile class="cor-padrao">
      <v-card-title class="white--text text-h5">Distribuição de Atividades</v-card-title>
    </v-card>
    <v-card tile>
      <v-expansion-panels v-model="panel" flat>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span
              style="color: grey; display: flex; flex-direction: row; align-items: center"
              title="Lista de operadores para tratativa."
            >
              <p class="text-h5 pa-0 ma-0">Lista de Operadores</p>
              <p class="text-h7 pa-0 ma-0 ml-2">(Clique para selecionar operadores aqui!)</p>
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="6">
                <div style="padding: 5px; margin: 4px; min-height: 140px">
                  <form id="form">
                    <v-text-field
                      :messages="'Quantidade:' + filteredListA.length.toString()"
                      outlined
                      dense
                      placeholder="Pesquisar"
                      v-model="searchListA"
                      class="rounded-tr-xl rounded-b-xl"
                    ></v-text-field>
                    <select
                      name="listA"
                      id="listA"
                      multiple
                      v-model="selectedA"
                      @change="itemsSelectedA"
                    >
                      <option
                        v-for="(item, i) in filteredListA"
                        :key="i"
                        :id="item.ALMOPE"
                        :value="item"
                      >
                        {{ item.NOME }} - {{ item.SUPERIOR1 }} ({{
                          item.SEGMENTO ? item.SEGMENTO : 'SEM SEGMENTO'
                        }})
                      </option>
                    </select>
                  </form>
                </div>
              </v-col>
              <v-col cols="6">
                <div style="padding: 5px; margin: 4px; min-height: 140px">
                  <form id="form">
                    <v-text-field
                      :messages="
                        'Quantidade:' +
                        (filteredListB.length.toString() == 0
                          ? ' Nada selecionado!'
                          : filteredListB.length.toString())
                      "
                      outlined
                      dense
                      placeholder="Pesquisar operadores já selecionados"
                      class="rounded-tr-xl rounded-b-xl"
                      v-model="searchListB"
                    ></v-text-field>
                    <select
                      name="listB"
                      id="listB"
                      multiple
                      v-model="selectedB"
                      @change="itemsSelectedB"
                    >
                      <option
                        v-for="(item, i) in filteredListB"
                        :key="i"
                        :id="item.ALMOPE"
                        :value="item"
                      >
                        {{ item.NOME }} - {{ item.SUPERIOR1 }} ({{
                          item.SEGMENTO ? item.SEGMENTO : 'SEM SEGMENTO'
                        }})
                      </option>
                    </select>
                  </form>
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-divider></v-divider>
      <v-col class="mt-6">
        <v-alert text prominent type="warning" icon="mdi-alert" dense v-if="inRowsInvalid">
          <span v-html="textRowInvalid"></span>
        </v-alert>
        <v-row justify="end">
          <v-col cols="2" class="my-0 py-0">
            <v-btn
              color="cor-padrao-btn rounded-r-xl rounded-bl-xl"
              @click="openFiltersDialog"
              :class="
                baseDistribution != ''
                  ? 'cor-padrao-btn darken-3--text font-weight-bold rounded-tr-xl rounded-b-xl'
                  : 'grey darken-3--text font-weight-bold rounded-tr-xl rounded-b-xl'
              "
              :disabled="baseDistribution == ''"
            >
              Filtrar
            </v-btn>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2" class="my-0 py-0">
            <v-text-field
              dense
              outlined
              class="rounded-bl-xl rounded-r-xl"
              v-model="search"
              placeholder="Procure aqui..."
              label="Pesquisa rápida"
            ></v-text-field>
          </v-col>
          <v-col cols="2" class="my-0 py-0">
            <v-btn
              id="btn-search"
              block
              :class="
                this.directCasesIsValid()
                  ? 'cor-padrao-btn darken-3--text font-weight-bold rounded-tr-xl rounded-b-xl'
                  : 'grey darken-3--text font-weight-bold rounded-tr-xl rounded-b-xl'
              "
              @click="directCases"
              :disabled="!this.directCasesIsValid()"
            >
              Direcionar
            </v-btn>
          </v-col>
          <v-col cols="2" class="my-0 py-0">
            <v-btn
              id="btn-search"
              block
              :class="
                this.sendReleaseIsValid()
                  ? 'cor-padrao-btn darken-3--text font-weight-bold rounded-tr-xl rounded-b-xl'
                  : 'grey darken-3--text font-weight-bold rounded-tr-xl rounded-b-xl'
              "
              @click="sendRelease"
              :disabled="!this.sendReleaseIsValid()"
            >
              Liberar
            </v-btn>
          </v-col>
          <v-col cols="1" class="my-0 py-0">
            <download-excel :data="baseDistribution" name="Base_BKO" worksheet="Base_BKO">
              <v-btn
                id="btn-search"
                block
                :class="
                  baseDistribution != ''
                    ? 'cor-padrao-btn darken-3--text font-weight-bold rounded-tr-xl rounded-b-xl'
                    : 'grey darken-3--text font-weight-bold rounded-tr-xl rounded-b-xl'
                "
                :disabled="baseDistribution == ''"
              >
                Baixar
              </v-btn>
            </download-excel>
          </v-col>
        </v-row>
        <v-data-table
          :search="search"
          no-data-text="Não há nada por aqui..."
          :headers="itemsHeaders"
          :items="baseConsideration"
          show-select
          :single-select="singleSelect"
          v-model="selectedBase"
          class="text-no-wrap"
          item-key="NUM_CASO"
          :footer-props="footerProps"
          dense
          no-results-text="Nada encontrado..."
          :loading="loadingBase"
          loading-text="Carregando... por favor aguarde!"
          :dialog="dialog"
        >
          <template v-slot:item.VENCIMENTO="{ item }">
            <span :style="'padding: 5px;' + isCasoVencido(item.VENCIMENTO)">
              {{ item.VENCIMENTO }}
            </span>
          </template>
        </v-data-table>
      </v-col>
    </v-card>
    <loadhastag :envioDados="updatingData" :activeMsg="true" :msg="msgData"></loadhastag>
    <filtered-items
      :dialog="dialog"
      :baseItems="baseDistribution"
      @update:close="dialog = !dialog"
      @update:items-selected="itemsFiltered"
      :isFilterLoad="isFilter"
    ></filtered-items>
  </v-container>
</template>

<script>
  import config from '../../../core/config'
  // import dateNowAmerican from "../../../Date.js";
  import loadhastag from '../../../shared/components/load/loadHastag.vue'
  import FilteredItems from './dialog/FilteredItems.vue'
  export default {
    components: { loadhastag, FilteredItems },
    props: {
      arrayParameters: {
        type: [Array, Object],
        require: true
      },
      isSearch: {
        type: Boolean,
        default: false
      },
      reloadListOper: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      dialog: false,
      updatingData: false,
      loadingBase: false,
      msgData: '',
      totalDeItens: 0,
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      },
      itemsPerPageArray: [
        { text: 10, value: 10 },
        { text: 15, value: 15 },
        { text: 20, value: 20 },
        { text: 'Todos', value: -1 }
      ],
      panel: [0],
      selectedBase: [],
      listB: [],
      selectedA: [],
      selectedB: [],
      baseDistribution: [],
      baseDistributionFilters: [],
      isFilter: false,
      listA: [],
      occurrenceSelect: [],
      search: '',
      searchListA: '',
      searchListB: '',
      singleSelect: false,
      page: 1,
      itemsPerPage: 15,
      inRowsInvalid: false,
      textRowInvalid: ''
    }),
    computed: {
      numberOfPages() {
        return Math.ceil(
          this.isFilter
            ? this.baseDistributionFilters.length / this.itemsPerPage
            : this.baseDistribution.length / this.itemsPerPage
        )
      },
      filteredListA() {
        return this.listA.filter(item => {
          return (
            item.ALMOPE.match(this.searchListA) ||
            item.NOME.toLowerCase().match(this.searchListA.toLowerCase()) ||
            item.SEGMENTO?.toLowerCase().match(this.searchListA.toLowerCase()) ||
            item.SUPERIOR1?.toLowerCase().match(this.searchListA.toLowerCase())
          )
        })
      },
      filteredListB() {
        return this.listB.filter(item => {
          return (
            item.ALMOPE.match(this.searchListB) ||
            item.NOME.toLowerCase().match(this.searchListB.toLowerCase()) ||
            item.SEGMENTO?.toLowerCase().match(this.searchListB.toLowerCase()) ||
            item.SUPERIOR1?.toLowerCase().match(this.searchListB.toLowerCase())
          )
        })
      },
      baseConsideration() {
        return this.isFilter ? this.baseDistributionFilters : this.baseDistribution
      },
      usuario() {
        return this.$store.getters.usuario
      },
      itemsHeaders() {
        if (this.baseDistribution.length > 0) {
          let dados = []
          Object.keys(this.baseDistribution[0]).forEach(item => {
            dados.push({
              text: item,
              value: item,
              align: 'center'
            })
          })
          return dados ?? { text: 'NUM_CASO', value: 'NUM_CASO', align: 'center' }
        } else {
          return []
        }
      }
    },
    methods: {
      replaceNulls(obj) {
        if (!obj) return
        for (let key in obj) {
          if (obj[key] == null) {
            obj[key] = '-'
          }
        }
      },
      isCasoVencido(dtVencido) {
        if (!dtVencido) return
        let dateFormat =
          dtVencido.split(' ')[0].split('/').reverse().join('-') + ' ' + dtVencido.split(' ')[1]
        let dateNow = new Date()
        let _dtVencido = new Date(dateFormat)

        if (_dtVencido < dateNow) {
          // 2024-09-04 18:00:00
          return 'color: white; background-color: #e53935'
        } else {
          return 'color: white; background-color: #26a69a'
        }
      },
      itemsFiltered(e) {
        let dados = e
        this.baseDistributionFilters = dados.itemsFiltrados
        this.isFilter = dados.isFilter
      },
      lengthLine() {
        return this.isFilter ? this.baseDistributionFilters.length : this.baseDistribution.length
      },
      openFiltersDialog() {
        this.dialog = true
      },
      inRowIsValid() {
        let rows = this.selectedBase
        let rowsInvalid = ''

        this.selectedBase = this.selectedBase.filter(item => {
          return item.STATUS !== 'EM FILA'
        })

        for (let i = 0; i < rows.length; i++) {
          if (rows[i].STATUS == 'EM FILA') {
            rowsInvalid = rowsInvalid += rows[i].NUM_CASO
          }
        }
        // return (this.textRowInvalid = rowsInvalid);
      },
      reset() {
        this.selectedBase = []
        this.listB = []
      },
      directCasesIsValid() {
        return this.selectedBase.length > 0 && this.listB.length > 0
      },
      sendReleaseIsValid() {
        return this.selectedBase.length > 0
      },
      atribuirAtividades(pessoas, atividades) {
        const numPessoas = pessoas.length
        const numAtividades = atividades.length
        const numAtividadesPorPessoa = Math.floor(numAtividades / numPessoas)
        const pessoasComAtividades = []

        for (let i = 0; i < numPessoas; i++) {
          for (let j = 0; j < numAtividadesPorPessoa; j++) {
            const indexAtividade = i * numAtividadesPorPessoa + j
            pessoasComAtividades.push({
              ALMOPE: pessoas[i].ALMOPE,
              NUM_CASO: atividades[indexAtividade].NUM_CASO,
              ACAO: 2, // ACAO PARA DIRECIONAR CASOS
              AGENDA: '',
              TIPO: '',
              NOME_FILA: ''
            })
          }
        }

        return pessoasComAtividades
      },
      directCases() {
        let quantidadeCasos = this.selectedBase
        let quantidadePessoas = this.listB
        if (quantidadeCasos.length < quantidadePessoas.length) {
          this.$swal.fire({
            title: 'IMPORTANTE',
            text: 'Números de casos incompatível com a quantidade de operadores. Selecione menos operadores ou mais casos',
            icon: 'warning',
            showCancelButton: false,
            showConfirmButton: false
          })
        } else {
          this.$swal
            .fire({
              title: 'Deseja realmente direcionar os casos selecionados?',
              showDenyButton: false,
              showCancelButton: true,
              confirmButtonText: 'Sim',
              cancelButtonText: 'Não'
            })
            .then(result => {
              if (result.isConfirmed) {
                this.updatingData = true
                this.msgData = 'Direcionando casos selecionados...'
                let arrayListOperators = this.listB
                let pessoas = []
                for (let i = 0; i < arrayListOperators.length; i++) {
                  pessoas.push({
                    ALMOPE: arrayListOperators[i].ALMOPE,
                    atividades: []
                  })
                }

                // lista de atividades com números ímpares
                let atividades = this.selectedBase

                let index = 0 // index para controlar a distribuição das atividades

                // loop para distribuir as atividades
                for (let i = 0; i < atividades.length; i++) {
                  pessoas[index].atividades.push(atividades[i]) // atribui a atividade à pessoa
                  index = (index + 1) % pessoas.length // incrementa o index e reinicia quando chegar ao final da lista de pessoas
                }

                let newarray = [] //array com casos distribuido entre pessoas
                // exibe a lista de pessoas com suas respectivas atividades
                for (let i = 0; i < pessoas.length; i++) {
                  for (let j = 0; j < pessoas[i].atividades.length; j++) {
                    newarray.push({
                      ALMOPE: pessoas[i].ALMOPE,
                      NUM_CASO: pessoas[i].atividades[j].NUM_CASO,
                      ACAO: 2, // ACAO PARA DIRECIONAR CASOS
                      AGENDA: '',
                      TIPO: '',
                      NOME_FILA: ''
                    })
                  }
                }

                let nomeProcedures = [
                  'CCO.CM_BKO_CASOS',
                  'CCO.MTF_BKO_CASOS',
                  'CCO.CLARO_BKO_CASOS',
                  'CCO.ALMAVIVA_BKO_CASOS',
                  'CCO.SP_ALMAVIVA_BKO_ENEL'
                ]

                this.$api
                  .post(
                    `api/shared/backoffice/acoes_gestao/redirecionar_casos/${
                      nomeProcedures.indexOf(this.arrayParameters.productSelected) + 1
                    }`,
                    JSON.stringify(newarray)
                  )
                  .then(() => {
                    this.msgData = 'Atualizando dados...'
                    this.loadBaseDistribution()
                    setTimeout(() => {
                      this.updatingData = false
                      this.reset()
                    }, 2500)
                  })

                this.$swal.fire('Casos direcionados', '', 'success')
              } else if (result.isDenied) {
                this.$swal.fire('Changes are not saved', '', 'info')
              }
            })
        }
      },
      sendRelease() {
        let quantOccurrence = this.selectedBase

        let rows = this.selectedBase
        let rowsInvalid = ''

        for (let i = 0; i < rows.length; i++) {
          if (rows[i].STATUS == 'EM FILA') {
            rowsInvalid = rowsInvalid += `${i == 0 ? '' : ','} ${rows[i].NUM_CASO}${
              i + 1 == rows.length ? '.' : ''
            }`
          }
        }
        this.selectedBase = this.selectedBase.filter(item => {
          return item.STATUS !== 'EM FILA'
        })

        if (quantOccurrence.length > 0) {
          this.$swal
            .fire({
              title: ' <span>Deseja realmente liberar os casos selecionados?</span>',
              text:
                rowsInvalid.length > 0
                  ? 'Os casos a seguir serão desconsiderados, pois eles já estão em fila:' +
                    rowsInvalid
                  : '',
              showDenyButton: false,
              showCancelButton: true,
              confirmButtonText: 'Sim',
              cancelButtonText: 'Não',
              denyButtonText: `Don't save`
            })
            .then(result => {
              /* Read more about isConfirmed, isDenied below */
              if (result.isConfirmed) {
                this.updatingData = true
                this.msgData = 'Liberando casos selecionados...'

                const Toast = this.$swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  didOpen: toast => {
                    toast.addEventListener('mouseenter', this.$swal.stopTimer)
                    toast.addEventListener('mouseleave', this.$swal.resumeTimer)
                  }
                })

                Toast.fire({
                  icon: 'success',
                  title: 'Casos liberados com sucesso!'
                })

                this.selectOccurrence()
                let nomeProcedures = [
                  'CCO.CM_BKO_CASOS',
                  'CCO.MTF_BKO_CASOS',
                  'CCO.CLARO_BKO_CASOS',
                  'CCO.ALMAVIVA_BKO_CASOS',
                  'CCO.SP_ALMAVIVA_BKO_ENEL'
                ]
                // const validationNumActions = (procedure) => {
                //   if (procedure == "CCO.CM_BKO_CASOS") return 1;
                //   if (procedure == "CCO.MTF_BKO_CASOS") return 2;
                //   if (procedure == "CCO.CLARO_BKO_CASOS") return 3;
                //   if (procedure == "CCO.ALMAVIVA_BKO_CASOS") return 4;
                // };

                // .post(`api/shared/backoffice/acoes_gestao/liberar_casos/${validationNumActions(this.arrayParameters.productSelected)}`,
                this.$api
                  .post(
                    `api/shared/backoffice/acoes_gestao/liberar_casos/${
                      nomeProcedures.indexOf(this.arrayParameters.productSelected) + 1
                    }`,
                    JSON.stringify(this.occurrenceSelect) //array enviado para o backend
                  )
                  .then(() => {
                    this.msgData = 'Atualizando dados...'
                    this.loadBaseDistribution()
                    setTimeout(() => {
                      this.updatingData = false
                      this.reset()
                    }, 2500)
                  })
                  .catch(error => {
                    console.error(error)
                    this.msgData = 'Carregamento falhou. Tente novamente!'
                    this.$swal.fire('Saved!', '', 'success')
                    setTimeout(() => {
                      this.updatingData = false
                      this.reset()
                    }, 2500)
                  })
              }
            })
        } else {
          this.$swal.fire({
            title: 'IMPORTANTE',
            text: 'Necessário selecionar ao menos um caso...',
            icon: 'error',
            showCancelButton: false,
            showConfirmButton: false,
            // confirmButtonColor: "#3085d6",
            cancelButtonColor: '#d33',
            // confirmButtonText: "Yes, delete it!",
            cancelButtonText: 'Validar'
          })
        }
      },
      selectOccurrence() {
        //ocorrencias selecionadas

        let arrayCasos = []
        for (let index = 0; index < this.selectedBase.length; index++) {
          let element = this.selectedBase[index]
          arrayCasos.push({
            NUM_CASO: element.NUM_CASO,
            ALMOPE: this.usuario.almope,
            ACAO: 5,
            AGENDA: '',
            TIPO: '',
            NOME_FILA: ''
          })
        }
        return (this.occurrenceSelect = arrayCasos)
      },
      loadBaseDistribution() {
        // this.updatingData = true;
        this.loadingBase = true
        // const validationProduct = (procudure) => {
        //   if (procudure == "CCO.CM_BKO_CASOS") return "COMBO BKO";
        //   if (procudure == "CCO.MTF_BKO_CASOS") return "MTF BKO";
        //   if (procudure == "CCO.CM_WL_BKO_CASOS") return "COMBO WL";
        //   if (procudure == "CCO.CLARO_BKO_CASOS") return "CLARO BKO";
        //   if (procudure == "CCO.ALMAVIVA_BKO_CASOS") return "CLARO TRADE BKO"
        // }

        let urlData = `${config.baseUrl}api/shared/backoffice/direcionamento/distribuicao/`
        this.$api
          .get(urlData, {
            params: {
              // produto: validationProduct(this.arrayParameters.productSelected),
              produto: this.arrayParameters.produtoEscolhido,
              fila: this.arrayParameters.fila,
              status: this.arrayParameters.status,
              dataInicio: this.arrayParameters.dates[0],
              dataFim: this.arrayParameters.dates[1],
              intervalo: this.arrayParameters.intervaloVencimento
            }
          })
          .then(result => {
            this.baseDistribution = result.data
            this.baseDistribution.forEach(this.replaceNulls)
            this.loadingBase = false
            this.isFilter = false
            this.loadBaseDistributionOperators()
            // this.itemsPerPageArray.push({
            //   name: "Todos",
            //   value: result.data.length,
            // });

            this.totalDeItens = result.data.length

            // this.updatingData = false;
          })
      },
      loadBaseDistributionOperators() {
        //TODO validar função de carregamento
        let urlData = `${config.baseUrl}api/shared/backoffice/direcionamento/listar_operadores`
        this.$api
          .get(urlData, {
            params: {
              perfil: this.usuario.filtro,
              produto: this.usuario.produto,
              almope: this.usuario.almope
            }
          })
          .then(result => {
            this.listA = result.data
          })
      },

      itemsSelectedA() {
        let itemsSelected = this.selectedA
        if (this.listB.length > 0) {
          this.listB.push(...itemsSelected)

          let listA = this.listA

          let indexes = []

          for (let i = 0; i < itemsSelected.length; i++) {
            let index = listA.indexOf(itemsSelected[i])
            if (index !== -1) {
              indexes.push(index)
              listA.splice(index, 1)
            }
          }
        } else {
          this.listB = itemsSelected

          let listA = this.listA

          let indexes = []

          for (let i = 0; i < itemsSelected.length; i++) {
            let index = listA.indexOf(itemsSelected[i])
            if (index !== -1) {
              indexes.push(index)
              listA.splice(index, 1)
            }
          }
        }
      },
      itemsSelectedB() {
        let itemsSelected = this.selectedB
        this.listA.push(...itemsSelected)

        let listB = this.listB

        let indexes = []

        for (let i = 0; i < itemsSelected.length; i++) {
          let index = listB.indexOf(itemsSelected[i])
          if (index !== -1) {
            indexes.push(index)
            listB.splice(index, 1)
          }
        }
      },
      nextPage() {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage() {
        if (this.page - 1 >= 1) this.page -= 1
      },
      updateItemsPerPage(number) {
        if (number === 'Todos') {
          this.itemsPerPage = this.totalDeItens
        } else {
          this.itemsPerPage = number
        }
      }
    },
    created() {
      this.loadBaseDistributionOperators()
    },
    watch: {
      isSearch() {
        if (this.isSearch) {
          this.loadBaseDistribution()
        }
      }
    }
  }
</script>

<style scoped>
  /deep/ tr.v-data-table__selected {
    background: rgba(143, 14, 143, 0.466) !important;
    color: white !important;
  }

  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(143, 14, 143), rgb(20, 190, 255));
  }

  #listA,
  #listB {
    width: 100%;
  }

  #listA option,
  #listB option {
    background-color: #f9f9f9e5;
    color: #333;
    padding: 10px;
  }

  select[multiple] {
    background: none;
    width: auto;
    height: 240px;
    padding: 0;
    margin: 0;
    border: 2px solid grey;
    /* border-width: 2px solid grey; */
    /* border-style: inset; */
    font-family: inherit;
    font-size: inherit;
    cursor: inherit;
    line-height: inherit;
    appearance: none;
  }

  select:focus {
    box-shadow: 0 0 0 0;
    /* border: 0 none; */
    color: grey;
    outline: 0;
  }

  select::-webkit-scrollbar {
    width: 10px; /* width of the entire scrollbar */
  }

  select::-webkit-scrollbar-track {
    background: rgb(255, 255, 254); /* color of the tracking area */
  }

  select::-webkit-scrollbar-thumb {
    background-color: rgb(143, 14, 143); /* color of the scroll thumb */
    border-radius: 25px; /* roundness of the scroll thumb */
    border: 3px solid rgb(245, 245, 245); /* creates padding around scroll thumb */
  }

  .cor-padrao-btn {
    background-image: linear-gradient(200deg, rgb(120, 200, 255), rgb(0, 236, 255));
  }
</style>
