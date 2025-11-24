<template>
  <v-card elevation="0">
    <v-tabs
      v-model="tab"
      color="blue"
      next-icon="fa-light fa-arrow-right"
      prev-icon="fa-light fa-arrow-left"
      show-arrows
    >
      <template v-for="(item, i) in itemsCard" :key="i">
        <v-tab @click="loadListConfigPorFila(item.TITULO), loadDadosFilaBotoes(item.PARAMS_FILA)">
          {{ item.TITULO }}
        </v-tab>
      </template>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(item, index) in itemsCard" :key="index">
        <v-data-table
          fixed-header
          dense
          :headers="getHeaders"
          :items="configCard"
          :search="search"
          class="text-no-wrap mt-3"
          :items-per-page="5"
        >
          <!-- @click:row="openDialog" -->

          <template v-slot:item.STATUS_MOV="{ item }">
            <v-btn icon color="error" :disabled="item.STATUS == 0" @click="alterStatus(0, item)">
              <i class="fa-solid fa-trash"></i>
            </v-btn>

            <v-btn icon color="warning" @click="alterStatus(1, item)">
              <i class="fa-solid fa-rotate-left"></i>
            </v-btn>
          </template>

          <template v-slot:item.STATUS="{ item }">
            <span>
              <i
                class="fa-solid fa-circle mr-2"
                :style="`color:${item.STATUS == 1 ? 'green' : 'red'}`"
              ></i>
              {{ item.STATUS == 1 ? 'Ativo' : 'Inativo' }} {{ item.TITULO }}
            </span>
          </template>

          <template v-slot:item.FILA="{ item }">
            <v-menu bottom :close-on-content-click="false">
              <template v-slot:activator="{ attrs, on }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="loadDadosControleBtn(item.ALMOPE_LIBERACAO)"
                >
                  <v-icon size="18" color="orange">fa-solid fa-sitemap</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-card elevation="0" width="300">
                  <v-col>
                    <v-autocomplete
                      placeholder="Selecione uma fila"
                      label="Selecione uma fila"
                      :items="filaBotoes"
                      v-model="filaDisponivelAlmope"
                      multiple
                      item-text="NOME_BTN"
                      item-value="VALOR_BTN"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip v-if="index === 0" small>
                          <span>{{ item.NOME_BTN }}</span>
                        </v-chip>

                        <span v-if="index === 1" class="grey--text text-caption">
                          (+{{ filaDisponivelAlmope.length - 1 }} outros)
                        </span>
                      </template>
                    </v-autocomplete>

                    <v-btn small block color="success" @click="salvarFilaAtualizada(item)">
                      Atualizar fila
                    </v-btn>
                  </v-col>
                </v-card>

                <!-- <v-list-item v-for="(item2, index) in filaBotoes" :key="index">
                  <v-list-item-title>{{ item2.NOME_BTN }}</v-list-item-title>
                </v-list-item> -->
              </v-list>
            </v-menu>
          </template>

          <template v-slot:top>
            <tr>
              <td>
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Buscar"
                  outlined
                  dense
                  single-line
                  hide-details
                ></v-text-field>
              </td>

              <td>
                <v-text-field
                  class="ml-2"
                  outlined
                  dense
                  type="number"
                  label="Adicionar usuário"
                  v-model="almope"
                ></v-text-field>
              </td>

              <td colspan="4">
                <v-btn
                  class="ml-2"
                  depressed
                  color="success"
                  :disabled="!almope"
                  @click="inserirUsuario(item)"
                >
                  <i class="fa-solid fa-user-plus"></i>
                  Adicionar
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
  import config from '../../../../../../core/config'
  import alerts from '../../../../../../mixins/alerts.mixins'
  export default {
    data: () => ({
      configCard: [],
      itemsCard: [],
      tipoFila: [],
      subfilaTratativa: [],
      filaBotoes: [],
      filaDisponivelAlmope: [],
      search: null,
      almope: null,
      tab: null
    }),
    computed: {
      usuarioPerfil() {
        return this.$store.getters.usuario.filtro
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      getHeaders() {
        let data = this.configCard[0]
        if (!data) return []
        let header = Object.keys(data)
          .map(item => {
            return {
              text: item,
              value: item,
              f: this.itemsCard[this.tab].TITULO,
              sortable: false,
              align: 'center',
              class: 'teal darken-4 white--text'
            }
          })
          .filter(item2 => {
            return item2.text != 'ID'
          })

        if (this.itemsCard[this.tab].TITULO == 'CHECKOUT TRATATIVAS') {
          // for (let i = 0; i < this.tipoFila.length; i++) {
          header.push({
            text: 'FILA',
            value: 'FILA',
            sortable: false,
            align: 'center',
            class: 'teal darken-4 white--text'
          })
          // }
        }
        header.push({
          text: 'STATUS_MOV',
          value: 'STATUS_MOV',
          sortable: false,
          align: 'center',
          class: 'teal darken-4 white--text'
        })
        return header
      }
    },
    mixins: [alerts],
    methods: {
      async salvarFilaAtualizada(item) {
        try {
          let data = {
            valorBtn: this.filaDisponivelAlmope,
            almope: item.ALMOPE_LIBERACAO,
            almopeCadastro: this.usuarioAlmope,
            produtoTratativa: 'NET MTF'
          }

          let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/atualizar_dados_fila_tratativa`
          await this.$api.post(urlData, data)
          this.toast('Fila liberada com sucesso!', 'top-right', false, 2500, 'success')
        } catch (e) {
          this.toast('Não foi possível realizar a liberação.', 'top-right', false, 2500, 'error')
        }
      },
      loadDadosFilaBotoes(fila) {
        if (!fila) return
        let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/fila_botoes`
        this.$api
          .get(urlData, {
            params: {
              fila: fila
            }
          })
          .then(res => {
            this.filaBotoes = res.data
          })
      },
      loadDadosSubfilaTratativa() {
        let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/subfila_tratativa`
        this.$api.get(urlData).then(res => {
          this.subfilaTratativa = res.data
        })
      },
      loadDadosControleBtn(usuarioConsulta) {
        let urlData = `${config.baseUrl}api/shared/service_to_sales/validacao_venda/listar_btn_disponivel/OPERADOR/${usuarioConsulta}`
        this.$api.get(urlData).then(res => {
          let data = res.data.map(item => {
            return item.VALOR_BTN
          })
          this.filaDisponivelAlmope = data
        })
      },
      async alterStatus(action, data) {
        try {
          let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/alter_dados_config`
          await this.$api.post(urlData, {
            status: action,
            id: data.ID
          })
          this.loadListConfigPorFila()
          this.toast('Status alterado com sucesso!', 'top-right', false, 2500, 'success')
        } catch (e) {
          this.toast('Não foi possivel mudar o status!', 'top-right', false, 2500, 'warning')
        }
      },
      async inserirUsuario(item) {
        try {
          let almopeIsExist = false
          for (let key in this.configCard) {
            if (this.configCard[key].ALMOPE_LIBERACAO == this.almope) {
              this.toast(
                'Esse almope já possui liberação a está fila!',
                'top-right',
                false,
                2500,
                'info'
              )
              almopeIsExist = true
              break
            }
          }
          if (!almopeIsExist) {
            let data = {
              ALMOPE_LIBERACAO: this.almope,
              ALMOPE_CADASTRO: this.usuarioAlmope,
              STATUS: 1,
              ...item
            }

            let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/dados_fila`
            await this.$api.post(urlData, data)
            this.toast('Almope liberado com sucesso!', 'top-right', false, 2500, 'success')
            this.loadListConfigPorFila()
          }
        } catch (e) {
          this.toast('Não foi possivel inserir!', 'top-right', false, 2500, 'warning')
        }
      },
      loadListConfigFila() {
        let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/config_fila/ADMINISTRADOR/${this.usuarioAlmope}`
        this.$api
          .get(urlData)
          .then(res => {
            this.itemsCard = res.data
          })
          .then(() => {
            this.loadListConfigPorFila()
          })
      },
      loadListConfigPorFila(item) {
        let urlData = `${config.baseUrl}api/shared/service_to_sales/silente/fila/dados_fila`
        this.$api
          .get(urlData, {
            params: {
              fila: item ?? this.itemsCard[this.tab].TITULO
              // fila: this.itemsCard[this.tab].TITULO,
            }
          })
          .then(res => (this.configCard = res.data))
      }
    },
    created() {
      this.loadListConfigFila()
      // this.loadDadosControleBtn();
      this.loadDadosFilaBotoes()
    }
  }
</script>

<style></style>
