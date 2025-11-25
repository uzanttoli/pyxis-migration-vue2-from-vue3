<template>
  <v-container fluid>
    <v-row style="display: flex; flex-wrap: nowrap">
      <div v-for="(item, i) in items" :key="i" class="pa-1">
        <div class="board-header" :style="`border-top: 3px solid ${item.COLOR};`">
          <h4 :style="`color: ${item.COLOR} ;`">{{ item.TITLE }}</h4>
        </div>
        <div class="board-container">
          <div class="board-body">
            <v-card
              v-for="(item2, j) in itemsFilter(item.ITEMS)"
              :key="j"
              class="ma-2"
              :to="{
                name: 'TratativaProjectManager',
                params: { id: item2.NUM_SOLICITACAO },
                query: { notificationUser: true }
              }"
              elevation="1"
            >
              <v-tooltip right class="tooltip-custom">
                <template v-slot:activator="{ on, attrs }">
                  <div v-bind="attrs" v-on="on">
                    <v-list class="rounded-xl" style="border-radius: 50px">
                      <v-list-item three-line>
                        <v-list-item-icon class="mr-4">
                          <v-icon class="icon" :color="item.COLOR">fa-solid fa-folder</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content style="gap: 3px">
                          <v-list-item-title style="font-size: 17px; font-weight: 500">
                            <strong>#{{ item2.NUM_SOLICITACAO }}</strong>
                            -
                            {{ item2.MOTIVO_SOLICITACAO }}
                          </v-list-item-title>
                          <v-divider class="mx-1 my-2"></v-divider>
                          <v-list-item-subtitle
                            class="d-inline-block text-truncate"
                            style="max-width: 300px; font-size: 12px"
                          >
                            <strong>Solicitante:</strong>
                            {{ item2.USUARIO_SOLICITACAO }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle
                            class="d-inline-block text-truncate"
                            style="max-width: 300px; font-size: 12px"
                          >
                            <strong>Titulo:</strong>
                            {{ item2.TITULO_SOLICITACAO }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle
                            class="d-inline-block text-truncate"
                            style="max-width: 300px; font-size: 12px"
                          >
                            <strong>Motivo:</strong>
                            {{ item2.MOTIVO_SOLICITACAO }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle
                            class="d-inline-block"
                            style="max-width: 300px; font-size: 12px"
                            v-if="item2.DESIGNADO_PARA"
                          >
                            <strong>Resp:</strong>
                            <v-chip x-small :color="item.COLOR" class="white--text" label>
                              <v-icon left>mdi-account-circle-outline</v-icon>
                              {{ item2.DESIGNADO_PARA }}
                            </v-chip>
                          </v-list-item-subtitle>
                          <v-list-item-subtitle v-if="item2.SLA_FINAL">
                            <v-chip
                              v-if="
                                retirarS(item2.STATUS_GESTAO_SOLIC) != 'CANCELADO' &&
                                retirarS(item2.STATUS_GESTAO_SOLIC) != 'FINALIZADO'
                              "
                              x-small
                              :color="valideDate(item2.SLA_FINAL) ? 'error' : 'success'"
                            >
                              {{
                                valideDate(item2.SLA_FINAL)
                                  ? 'Vencido:'
                                  : 'Prazo: ' + formatDate(item2.SLA_FINAL)
                              }}
                            </v-chip>
                            <v-chip v-else x-small>
                              {{ retirarS(item2.STATUS_GESTAO_SOLIC) }}
                            </v-chip>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </div>
                </template>
                <span>
                  <p class="pa-0 ma-0" style="font-weight: 600">
                    #{{ item2.NUM_SOLICITACAO }} -
                    {{ item2.MOTIVO_SOLICITACAO }}
                  </p>
                  <p class="pa-0 ma-0">Solicitante: {{ item2.USUARIO_SOLICITACAO }}</p>
                  <p class="pa-0 ma-0">Titulo: {{ item2.TITULO_SOLICITACAO }}</p>
                  <p class="pa-0 ma-0">Motivo: {{ item2.MOTIVO_SOLICITACAO }}</p>
                  <p class="pa-0 ma-0">Prazo: {{ formatDate(item2.DATA_SOLICITACAO) }}</p>
                </span>
              </v-tooltip>
            </v-card>
          </div>
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'project-board',
    props: {
      items: {
        type: [Array, Object]
      },
      itemFilter: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      select: null
    }),
    computed: {
      dateComputed() {
        this.moment.locale('pt-br')
        let d = new Date()
        return this.moment(d)
      }
    },
    methods: {
      retirarS(string) {
        if (!string) return
        let s = string[string.length - 1]
        if (s.toLowerCase() == 's') return string.slice(0, string.length - 1)
        else return string
      },
      itemsFilter(items) {
        if (this.itemFilter == '' || this.itemFilter == null) {
          return items
        } else {
          return items.filter(el => {
            return (
              (el.DESIGNADO_PARA &&
                el.DESIGNADO_PARA.toLowerCase().indexOf(this.itemFilter.toLowerCase()) > -1) ||
              el.MOTIVO_SOLICITACAO.toLowerCase().indexOf(this.itemFilter.toLowerCase()) > -1 ||
              el.USUARIO_SOLICITACAO.toLowerCase().indexOf(this.itemFilter.toLowerCase()) > -1 ||
              el.DETALHE_SOLICITACAO.toLowerCase().indexOf(this.itemFilter.toLowerCase()) > -1 ||
              el.NUM_SOLICITACAO.toString().toLowerCase().indexOf(this.itemFilter.toLowerCase()) >
                -1
              // el.DETALHE_SOLICITACAO.toLowerCase().indexOf(this.itemsFilter.toLowerCase()) > -1
            )
          })
        }
        // return items;
      },
      valideDate(date) {
        let data1 = this.moment(date)
        let dateNow = this.moment().format('YYYY-MM-DD h:mm:ss')
        return data1.isAfter(dateNow) ? false : true
      },
      formatDate(string) {
        if (!string) return
        this.moment.locale('pt-br')
        return this.moment(string).fromNow()
      }
    }
  }
</script>

<style scoped>
  .board-container {
    width: 400px;
    max-width: 400px;
    background-color: #eeeeee65;
    height: 100vh;
    overflow: auto;
    border-radius: 10px;
  }

  .board-header {
    padding: 10px;
    width: 400px;
    max-width: 400px;
    background-color: #eeeeee65;
    margin-bottom: 8px;
    display: flex;
  }

  .board-body {
    padding: 6px;
  }
  .card-container {
    cursor: pointer;
    margin: 10px 0 10px 0;
  }

  .card-container p {
    align-items: top;
    gap: 10px;
  }

  i {
    color: grey;
    text-align: center;
  }

  .card-boad {
    cursor: pointer;
  }

  .card-boad:hover .icon {
    display: none;
  }

  .card-boad:hover .icon-open {
    display: inline; /* ou 'block', dependendo do seu caso */
  }

  .icon-open {
    display: none;
  }

  .tooltip-custom {
    background-color: blue !important; /* Defina a cor desejada aqui */
    color: white; /* Cor do texto no tooltip */
  }
</style>
