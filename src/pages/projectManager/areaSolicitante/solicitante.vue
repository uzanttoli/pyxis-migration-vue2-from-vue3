<template>
  <v-container fluid>
    <configuracao-component :isBtn="false" title="Área do Solicitante" to="/">
      <v-row class="mr-3 mt-4" justify="space-between">
        <v-btn depressed color="info" to="/pyxis/project-manager/nova-solicitacao/">
          <i class="fa-solid fa-plus mr-2"></i>
          Nova solicitação
        </v-btn>
        <!-- <v-col cols="2">
          <v-text-field
            dense
            outlined
            placeholder="Pesquisar demanda"
          ></v-text-field>
        </v-col> -->
      </v-row>
      <status-component :lists="lists"></status-component>
      <div style="margin-top: 70px">
        <v-card elevation="1">
          <v-col cols="2">
            <v-text-field
              dense
              v-model="search"
              outlined
              placeholder="Pesquisar demanda"
              label="Pesquisar demandar"
            ></v-text-field>
          </v-col>
          <v-data-table
            :headers="getHeaders"
            :search="search"
            :items="listRecentes"
            no-data-text="Não há solicitações no momento!"
            dense
          >
            <template v-slot:item.ACTION="{ item }">
              <v-btn
                icon
                :to="{
                  name: 'SolicitacaoProjectId',
                  params: { id: item['NUM. SOLICITAÇÃO'] }
                }"
              >
                <v-icon color="green" size="18">fa-solid fa-eye</v-icon>
              </v-btn>
            </template>
            <template v-slot:item.STATUS_SOLICITAÇÃO="{ item }">
              <v-chip
                x-small
                :style="'color: #ffff; background-color:' + getColor(item.STATUS_SOLICITAÇÃO)"
              >
                {{ item['STATUS_SOLICITAÇÃO'] }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </div>
    </configuracao-component>
  </v-container>
</template>

<script>
  import config from '../../../core/config'
  import ConfiguracaoComponent from '../../../shared/components/configuracao/Configuracao.component.vue'
  import StatusComponent from '../status.component.vue'
  // import CardStatusSolicitacao from "../cardStatusSolicitacao.vue";
  export default {
    components: { ConfiguracaoComponent, StatusComponent },
    data: () => ({
      lists: [],
      listRecentes: [],
      search: null
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      getHeaders() {
        let list = this.listRecentes[0]
        if (list) {
          let header = []

          Object.keys(list).forEach(item => {
            header.push({
              text: this.normalizeText(item),
              sortable: false,
              value: item,
              align: 'center',
              class: 'blue darken-1 white--text'
            })
          })
          header.push({
            text: 'AÇÕES',
            sortable: false,
            value: 'ACTION',
            align: 'center',
            class: 'blue darken-1 white--text'
          })
          return header
        }
        return []
      }
    },
    methods: {
      getColor(color) {
        if (!color) return
        let colors = this.lists
        let considerar = colors.filter(item => {
          return item.COLUNA == color
        })
        return considerar[0]?.COLOR
      },
      formatedText(string) {
        if (!string) return
        let pri = string[0]
        return pri + string.slice(1, string.length).toLowerCase()
      },
      normalizeText(string) {
        if (!string) return
        let n = string.split('_').join(' ')
        return n
      },
      loadListQtdSolicitacao() {
        let urlData = `${config.baseUrl}api/shared/project_manager/solicitacao/qtd_solicitacao_status/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.lists = res.data
        })
      },
      loadListDadosRecentes() {
        let urlData = `${config.baseUrl}api/shared/project_manager/solicitacao/recentes/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.listRecentes = res.data
        })
      }
    },
    created() {
      this.loadListQtdSolicitacao()
      this.loadListDadosRecentes()
    }
  }
</script>

<style scoped>
  .border {
    border: 2px solid #0a0a94 !important;
  }
  .v-btn--fab.v-size--default.v-btn--absolute.v-btn--top {
    top: 65px !important;
  }
  .v-btn--absolute.v-btn--left,
  .v-btn--fixed.v-btn--left {
    left: -26px !important;
  }
</style>
