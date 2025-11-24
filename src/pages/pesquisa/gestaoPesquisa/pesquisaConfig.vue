<template>
  <v-container>
    <v-card elevation="1" class="rounded-xl" min-height="500">
      <v-card-title style="display: flex; justify-content: space-between; align-items: center">
        <div style="display: flex; align-items: center">
          <v-icon color="orange" class="mr-2">fa-solid fa-lightbulb</v-icon>
          Gestão de pesquisas
        </div>
        <div class="d-flex align-center flex-column justify-start">
          <div class="d-flex">
            <v-text-field
              outlined
              dense
              label="Pesquisar"
              placeholder="Pesquisar"
              class="mr-2"
              hide-details
              v-model="search"
            ></v-text-field>
            <v-btn depressed color="warning" to="/pyxis/pesquisa/gestao/elaborar-pesquisa">
              Criar pesquisa
            </v-btn>
          </div>
          <div class="d-flex justify-start w-100 mt-1">
            <v-btn-toggle v-model="statusPesquisa" mandatory color="deep-purple accent-3">
              <v-btn small :value="1">Ativos</v-btn>
              <v-btn small :value="0">Inativos</v-btn>
            </v-btn-toggle>
          </div>
        </div>
      </v-card-title>
      <v-card-subtitle>Gerencie suas pesquisas aqui...</v-card-subtitle>
      <v-divider></v-divider>
      <v-col>
        <v-row>
          <v-col v-for="(item, i) in pesquisaFilter" :key="i" xl="3" lg="6">
            <v-card
              elevation="1"
              class="rounded-xl"
              :color="item.STATUS == 0 ? 'grey lighten-2' : ''"
            >
              <v-card-title>
                <div style="width: 95%">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ attrs, on }">
                      <div
                        v-bind="attrs"
                        v-on="on"
                        style="display: flex; justify-content: space-between; position: relative"
                      >
                        <p class="pa-0 ma-0">
                          {{ item.FORM }}
                        </p>
                        <v-tooltip right>
                          <template v-slot:activator="{ attrs, on }">
                            <v-icon
                              style="position: absolute; right: -15px"
                              size="45"
                              color="grey"
                              v-if="item.STATUS == 0"
                              v-bind="attrs"
                              v-on="on"
                            >
                              fa-solid fa-ban
                            </v-icon>
                          </template>
                          <span>
                            Essa pesquisa está inativa, para utiliza-la novamente clique em
                            <v-icon size="16" color="green" class="ml-2">fa-solid fa-rotate</v-icon>
                          </span>
                        </v-tooltip>
                      </div>
                    </template>
                    <span>{{ item.FORM }}</span>
                  </v-tooltip>
                </div>
              </v-card-title>
              <v-card-subtitle>
                <div style="width: 95%">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ attrs, on }">
                      <p class="pa-0 ma-0" v-bind="attrs" v-on="on">
                        {{ item.OBJETIVO }}
                      </p>
                    </template>
                    <div style="width: 350px">
                      <span>{{ item.OBJETIVO }}</span>
                    </div>
                  </v-tooltip>
                </div>
              </v-card-subtitle>
              <v-divider></v-divider>
              <v-card-actions :class="item.STATUS == 0 ? 'grey lighten-2' : 'grey lighten-5'">
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn icon small v-bind="attrs" v-on="on" @click="visualizarPesquisa(item.ID)">
                      <v-icon size="16">fa-solid fa-square-up-right</v-icon>
                    </v-btn>
                  </template>
                  <span>Visualizar pesquisa</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn
                      icon
                      small
                      v-bind="attrs"
                      v-on="on"
                      color="blue lighten-2"
                      :to="{
                        name: 'Elaborar Pesquisas',
                        query: { id: item.ID, action: 'duplicar-pesquisa' }
                      }"
                    >
                      <v-icon size="16">fa-solid fa-copy</v-icon>
                    </v-btn>
                  </template>
                  <span>Duplicar pesquisa</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn
                      icon
                      small
                      v-bind="attrs"
                      v-on="on"
                      color="orange darken-1"
                      :to="{
                        name: 'Elaborar Pesquisas',
                        query: { id: item.ID, action: 'editar-pesquisa' }
                      }"
                    >
                      <v-icon size="16">fa-solid fa-pen-to-square</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar pesquisa</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn icon small v-bind="attrs" v-on="on" disabled>
                      <v-icon size="16">fa-solid fa-chart-pie</v-icon>
                    </v-btn>
                  </template>
                  <span>Analitico da pesquisa</span>
                </v-tooltip>

                <!-- <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }"> -->
                <v-menu absolute offset-y>
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn
                      icon
                      small
                      v-bind="attrs"
                      v-on="on"
                      @click="prepareDownloadPesquisa(item.ID)"
                    >
                      <v-icon size="16">fa-solid fa-download</v-icon>
                    </v-btn>
                    <!-- @click="prepareDownloadPesquisa(item.ID)" -->
                  </template>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-title>
                        <download-excel
                          :data="baseDownload"
                          :name="nameDownload(item.FORM)"
                          :worksheet="nameDownload(item.FORM)"
                        >
                          <v-btn :disabled="isDownloadCompleted">
                            <v-progress-circular
                              value="20"
                              indeterminate
                              size="20"
                              v-if="isDownloadCompleted"
                            ></v-progress-circular>
                            <v-icon small class="mr-2" v-else>fa-solid fa-file-excel</v-icon>
                            Baixar Dados
                          </v-btn>
                        </download-excel>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn
                      :disabled="item.STATUS != 1"
                      icon
                      small
                      v-bind="attrs"
                      v-on="on"
                      @click="controleViewPesquisa(item.ID, 0)"
                      color="error"
                    >
                      <v-icon size="16">fa-solid fa-trash</v-icon>
                    </v-btn>
                  </template>
                  <span>Inativar pesquisa</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn
                      icon
                      small
                      v-bind="attrs"
                      v-on="on"
                      color="green"
                      :disabled="item.STATUS != 0"
                      @click="controleViewPesquisa(item.ID, 1)"
                    >
                      <v-icon size="16">fa-solid fa-rotate</v-icon>
                    </v-btn>
                  </template>
                  <span>Habilitar pesquisa</span>
                </v-tooltip>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
    <template v-if="abrirPesquisa">
      <pesquisaComponent
        :idForm="dadosViewPesquisa.id"
        :title="dadosViewPesquisa.titulo"
        :instrucoes="dadosViewPesquisa.instrucoes"
        :objetivo="dadosViewPesquisa.objetivo"
        :handleAction="false"
        @update:close="abrirPesquisa = !abrirPesquisa"
      />
    </template>
  </v-container>
</template>

<script>
  import config from '../../../core/config'
  import alerts from '../../../mixins/alerts.mixins'
  import pesquisaComponent from '../pesquisa.component.vue'
  export default {
    components: { pesquisaComponent },
    data: () => ({
      statusPesquisa: 1,
      pesquisas: [],
      dadosViewPesquisa: [],
      baseDownload: [],
      idDownloadSolicitado: null,
      abrirPesquisa: false,
      search: null,
      isDownloadCompleted: false
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      dateNow() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-DD-MM HH:mm:ss')
      },
      dateNameTitle() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYYMMDDHH')
      },
      pesquisaFilter() {
        let items = []
        if (!this.search) {
          let items = []
          items = this.pesquisas.filter(item => {
            return item.STATUS.toString().indexOf(this.statusPesquisa) > -1
          })

          return items
        }
        items = this.pesquisas.filter(item => {
          return item.FORM.toLowerCase().indexOf(this.search.toLowerCase()) > -1
        })
        return items
      }
    },
    mixins: [alerts],
    methods: {
      loadPesquisas() {
        let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/listar_pesquisas`
        this.$api
          .get(urlData, {
            params: {
              produto: this.usuario.produto,
              perfil: this.usuario.filtro
            }
          })
          .then(res => {
            this.pesquisas = res.data
          })
      },
      controleViewPesquisa(id, action) {
        let data = {
          almope: this.usuario.almope,
          idPesquisa: id,
          dataAlteracao: this.dateNow,
          status: action
        }
        this.swalConfirmation(
          () => {
            let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/controle_view_pesquisa_id`
            this.$api.post(urlData, data)
            // this.loadPesquisas();
            let index = this.pesquisas.findIndex(val => val.ID == id)
            this.pesquisas[index].STATUS = action
          },
          `${action == 0 ? 'Inativar pesquisa' : 'Ativar pesquisa'}`,
          'Deseja continuar?',
          'Sim',
          `${action == 0 ? 'Pesquisa indisponivel!' : 'Pesquisa disponivel'} `,
          `${
            action == 0
              ? 'Pesquisa foi removida e não está mais disponivel para a operação.'
              : 'Pesquisa liberada para a operação.'
          }`
        )
      },
      visualizarPesquisa(id) {
        let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/dados_pesquisa_abrir_id`
        this.$api
          .get(urlData, {
            params: {
              id: id
            }
          })
          .then(res => {
            this.dadosViewPesquisa = res?.data[0]
            this.abrirPesquisa = true
          })
      },
      prepareDownloadPesquisa(id) {
        if (this.baseDownload.length > 0 && this.idDownloadSolicitado == id) return
        this.isDownloadCompleted = true
        let urlData = `${config.baseUrl}api/shared/pyform/arvore_tabulacao/pesquisa/download_analitico_id`
        this.$api
          .get(urlData, {
            params: {
              id: id
            }
          })
          .then(res => {
            let dados = res?.data
            dados = dados.map(this.replaceNulls.bind(this))
            this.baseDownload = dados
            this.isDownloadCompleted = false
            this.idDownloadSolicitado = id
          })
      },
      replaceNulls(obj) {
        if (!obj) return obj

        const newObj = {}
        for (let key in obj) {
          if (obj[key] == null) {
            newObj[key] = 'N/A'
          } else {
            newObj[key] = obj[key]
          }
        }

        const normalizeKey = {}
        for (let key in newObj) {
          const normalizeText = this.removeCaracteresInvalid(key)
          if (
            normalizeText == 'ALMOPE_TABULACAO' &&
            this.usuario.filtro != 'ADMINISTRADOR' &&
            this.usuario.filtro != 'GERENTE'
          ) {
            normalizeKey[normalizeText] = '400000'
          } else if (
            normalizeText == 'NOME_TABULACAO' &&
            this.usuario.filtro != 'ADMINISTRADOR' &&
            this.usuario.filtro != 'GERENTE'
          ) {
            normalizeKey[normalizeText] = 'NOME OPERADOR'
          } else {
            normalizeKey[normalizeText] = newObj[key]
          }
        }

        return normalizeKey
      },
      removeCaracteresInvalid(text) {
        if (!text) return
        const regex = /[.,()]+/g

        const novaString = text.replace(regex, ' ')
        return novaString
      },
      nameDownload(form) {
        return form + '_' + this.dateNameTitle
      }
    },
    created() {
      this.loadPesquisas()
    }
  }
</script>

<style scoped>
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
