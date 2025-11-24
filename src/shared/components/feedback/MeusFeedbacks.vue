<template>
  <div>
    <card-info-display title="Meus Feedbacks">
      <template v-slot:body>
        <div style="display: flex; justify-content: end">
          <div style="width: 300px; margin-right: 10px">
            <v-select
              dense
              outlined
              :items="listarFeedback"
              item-text="NOME"
              item-value="NOME"
              v-model="feedbackFiltrado"
              solo
              placeholder="Selecione um Feedbacks"
              class="rounded-xl"
            ></v-select>
          </div>
          <div style="width: 300px">
            <v-text-field
              v-model="search"
              dense
              outlined
              solo
              placeholder="Pesquisar"
              class="rounded-xl"
            ></v-text-field>
          </div>
        </div>
        <v-data-table
          class="rounded-xl"
          :search="search"
          no-data-text="Nenhum feedback encontrado!"
          :headers="getHeaders"
          :items="dataFilter"
          :footer-props="footerProps"
          :loading="loading"
          loading-text="Carregando..."
        >
          <template v-slot:[`item.${Visualizar}`]="{ item }">
            <v-btn
              icon
              target="_blank"
              :to="{
                name: 'FeedbackId',
                query: { id: item.ID, form: item.ID_FORM }
              }"
            >
              <v-icon color="info" small style="margin-right: -1px">fa-solid fa-eye</v-icon>
            </v-btn>
          </template>
          <template v-slot:[`item.${Possui_Anexo}`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-icon
                  size="20"
                  v-show="item.Possui_Anexo == 1"
                  color="success"
                  v-bind="attrs"
                  v-on="on"
                >
                  fa-solid fa-headphones-simple
                </v-icon>
              </template>
              <span>Possui anexo</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <div v-show="item.Possui_Anexo == 0" v-bind="attrs" v-on="on">
                  <v-icon color="orange" size="20">fa-solid fa-headphones-simple</v-icon>
                  <v-icon size="14" class="ml-n3 mt-n3" color="red">
                    fa-solid fa-triangle-exclamation
                  </v-icon>
                </div>
              </template>
              <span>Não possui anexo</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </template>
    </card-info-display>
  </div>
</template>

<script>
  import config from '@/core/config'
  import CardInfoDisplay from '@/pages/operacao/net/retencao/desconexao/CardInfoDisplay.vue'

  export default {
    components: { CardInfoDisplay },
    props: {
      listarFeedback: {
        type: [Array, Object]
      }
    },
    data: () => ({
      feedbacks: [],
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      },
      loading: false,
      feedbackFiltrado: null,
      search: null
    }),
    computed: {
      dataFilter() {
        let data = this.feedbacks
        if (data) {
          if (this.feedbackFiltrado) {
            let filter = data.filter(item => {
              return item['Nome Formulário'] == this.feedbackFiltrado
            })
            return filter
          }
          return data
        }
        return []
      },
      usuario() {
        return this.$store.getters.usuario
      },
      getHeaders() {
        let data = this.feedbacks[0]
        if (!data) return
        let headers = Object.keys(data)
          .map(item => {
            return {
              text: item.split('_').join(' '),
              value: item,
              align: 'center',
              class: ''
            }
          })
          .filter(itemFilter => {
            return (
              itemFilter.text != 'ID' &&
              itemFilter.text != 'ID_FORM' &&
              itemFilter.text != 'ID FORM' &&
              itemFilter.text != 'Ordem Tabulacao'
            )
          })
        headers.unshift({
          text: 'Visualizar',
          value: 'Visualizar',
          align: 'center',
          class: ''
        })
        return headers
      }
    },
    methods: {
      normalizeText(string) {
        if (!string) return
        let stringSplit = string.split('_')
        let newString = null
        for (let i of stringSplit) {
          newString += ` ${i[0]}${i.substring(1, i.length).toLowerCase()}`
        }
        return newString
      },
      async loadMeusFeedbacks() {
        try {
          this.loading = true
          let urlData = `${config.baseUrl}api/shared/feedback/formulario/listar_feedbacks_aplicados`
          let res = await this.$api.get(urlData, {
            params: {
              almope: this.usuario.almope
            }
          })
          this.feedbacks = res.data
          this.loading = false
        } catch (e) {
          console.error(e)
        }
      }
    },
    async created() {
      await this.loadMeusFeedbacks()
    }
  }
</script>

<style scoped>
  .cor-padrao {
    background-image: linear-gradient(260deg, rgb(0, 236, 255), #8f0e8f);
  }
  .v-card {
    border-radius: 16px;
  }

  .v-icon {
    margin-right: 8px;
  }

  .headline {
    font-size: 20px;
  }
</style>
