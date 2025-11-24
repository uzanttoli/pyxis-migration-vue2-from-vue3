<template>
  <!-- v-model="abrirModalAbs" -->
  <v-dialog
    :model-value="abrirModalAbs"
    @update:modelValue="val => $emit('update:abrirModalAbs', val)"
    persistent
    width="1500"
  >
    <v-card tile>
      <div style="display: flex; align-items: center; justify-content: space-between">
        <v-card-title>Justifique seu ABS</v-card-title>
        <v-btn icon @click="$emit('update:close-dialog')" class="mr-2">
          <v-icon>fas fa-close</v-icon>
        </v-btn>
      </div>
      <v-divider></v-divider>
      <v-card height="700" class="overflow-auto" elevation="0">
        <v-col>
          <v-card elevation="1" class="rounded-lg">
            <title-negative-margin
              title="Absenteístas"
              className="rounded-r-xl"
            ></title-negative-margin>
            <v-data-table
              dense
              :loading="loading"
              loading-text="Carregando..."
              :items="justificativaAbs"
              :headers="getHeaders"
              class="text-no-wrap"
              no-data-text="Nada para justificar!"
              :footer-props="{
                'items-per-page-text': 'Itens por página'
              }"
            >
              <template v-slot:item.JUSTIFICAR="{ item }">
                <v-edit-dialog
                  @open="open(item)"
                  @save="submit"
                  ref="editDialog"
                  large
                  save-text="Salvar"
                  cancel-text="Cancelar"
                  persistent
                >
                  <v-btn icon small>
                    <v-icon color="red" size="20">fa-solid fa-person-circle-check</v-icon>
                  </v-btn>
                  <template v-slot:input>
                    <v-col>
                      <div style="display: flex; align-items: center; margin: 5px 0 15px 0">
                        <v-icon size="18" color="green">fa-solid fa-user-check</v-icon>
                        <p class="font-weight-bold pa-0 ma-0">Justificando {{ item.ALMOPE }}</p>
                      </div>
                      <validation-observer v-slot="{ invalid, validate }" ref="observer">
                        <form @submit.prevent="validate().then(submit)">
                          <validation-provider
                            v-slot="{ errors }"
                            rules="required"
                            name="justificativa"
                          >
                            <v-autocomplete
                              :items="itemsJustificativasSupervisor"
                              item-value="ID"
                              outlined
                              dense
                              autofocus
                              no-data-text="Nada encontrado!"
                              item-text="DESCRICAO"
                              required
                              :error-messages="errors"
                              placeholder="Selecione à justificativa *"
                              label="Selecione à justificativa *"
                              v-model="justificativaAbsSupervisor.descricao"
                            ></v-autocomplete>
                          </validation-provider>
                          <validation-provider
                            v-slot="{ errors }"
                            name="descrição"
                            rules="required"
                          >
                            <v-textarea
                              auto-grow
                              required
                              label="Descreva aqui*"
                              placeholder="Descreva aqui*"
                              rows="4"
                              :error-messages="errors"
                              outlined
                              row-height="25"
                              v-model="justificativaAbsSupervisor.observacao"
                            ></v-textarea>
                          </validation-provider>
                        </form>
                      </validation-observer>
                    </v-col>
                  </template>
                </v-edit-dialog>
              </template>
            </v-data-table>
          </v-card>

          <v-card class="mt-5 rounded-lg" elevation="1">
            <title-negative-margin
              title="Histórico"
              className="rounded-r-xl"
            ></title-negative-margin>
            <v-data-table
              :loading="loadingHistorico"
              dense
              loading-text="Carregando..."
              :headers="headers"
              no-data-text="Não histórico no momento!"
              :items="historicoJustificativaAbs"
              :search="search"
              class="text-no-wrap"
              :footer-props="{
                'items-per-page-text': 'Itens por página'
              }"
            >
              <template v-slot:item.DATA_JUSTIFICATIVA="{ item }">
                {{ item.DATA_JUSTIFICATIVA.substr(0, 10).split('-').reverse().join('/') }}
              </template>
              >
            </v-data-table>
          </v-card>
        </v-col>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
  import alerts from '../../../../mixins/alerts.mixins'
  import config from '../../../../core/config'

  import { ValidationProvider, ValidationObserver } from 'vee-validate'
  import { DadosOnlineOperadorJustificativaAbsService } from '@/data/services/operacoes/dadosOnline/index'
  export default {
    name: 'justificativa-abs',
    components: { ValidationProvider, ValidationObserver },
    props: {
      usuarioConsulta: {
        type: [String, Number],
        default: null
      },
      abrirModalAbs: {
        type: Boolean,
        default: false
      }
    },
    mixins: [alerts],
    data: () => ({
      edit: false,
      alertJustificativaAbs: false,
      loadingHistorico: false,
      loading: false,
      search: null,
      justificativaAbs: [],
      itemsJustificativasSupervisor: [],
      historicoJustificativaAbs: [],
      itemSelecionado: [],
      justificativaAbsSupervisor: {
        chave: '',
        observacao: null,
        descricao: null
      },
      headers: [
        {
          text: 'Data da Justificativa',
          align: 'center',
          value: 'DATA_JUSTIFICATIVA',
          class: 'grey lighten-3'
        },
        {
          text: 'Almope',
          value: 'ALMOPE',
          align: 'center',
          class: 'grey lighten-3'
        },
        { text: 'Nome', value: 'NOME', align: 'center', class: 'grey lighten-3' },
        {
          text: 'Justificativa',
          value: 'DESCRICAO',
          align: 'center',
          class: 'grey lighten-3'
        },
        {
          text: 'Observação',
          value: 'OBSERVACAO',
          align: 'center',
          class: 'grey lighten-3'
        }
      ]
    }),
    computed: {
      usuarioAlmope() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.almope
      },
      usuarioNome() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.nome
      },
      getHeaders() {
        let data = this.justificativaAbs[0]
        if (data) {
          let header = []
          Object.keys(data).forEach(item => {
            header.push({
              text: item,
              value: item,
              align: 'center',
              class: 'grey lighten-3'
            })
          })
          header.unshift({
            text: 'Justificar',
            value: 'JUSTIFICAR',
            align: 'center',
            class: 'grey lighten-3'
          })
          return header
        }
        return []
      }
    },
    methods: {
      clearForm() {
        let newForm = Object.assign({}, this.justificativaAbsSupervisor)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.justificativaAbsSupervisor = newForm
      },
      open(item) {
        this.clearForm()
        this.itemSelecionado = item
      },
      async submit() {
        let isValid = await this.$refs.observer.validate()
        if (isValid) {
          let data = {
            almope: this.itemSelecionado.ALMOPE,
            nome: this.itemSelecionado.NOME,
            superior1: this.itemSelecionado.SUPERIOR1,
            superior2: this.itemSelecionado.SUPERIOR2,
            campanha: this.itemSelecionado.REGIONAL,
            chave: this.itemSelecionado.ALMOPE + this.dateConvert(),
            justificativa: this.justificativaAbsSupervisor.observacao,
            descricao: this.justificativaAbsSupervisor.descricao,
            usuarioCadastro: this.usuarioAlmope
          }

          let urlData = `${config.baseUrl}api/shared/abs/create/`
          await this.$api.post(urlData, data)
          this.resetarFormularioJustificativaAbs()
          this.clearForm()
          this.$refs.observer.reset()
          this.itemSelecionado = []
          this.toast('Abs justificado com sucesso!', 'top-right', false, 2000, 'success')
        } else {
          this.toast('Necessário preencher todos os campos!', 'top-right', false, 2000, 'error')
        }
      },
      resetarFormularioJustificativaAbs() {
        this.loadAbsParaJustificar()
        this.loadHistoricoJustificativaAbs()
      },
      async loadAbsParaJustificar() {
        this.loading = true
        const dados = await DadosOnlineOperadorJustificativaAbsService.getAbsenteistas(
          this.usuarioNome
        )
        this.justificativaAbs = dados
        this.loading = false
      },
      async loadItemsJustificativas() {
        const dados = await DadosOnlineOperadorJustificativaAbsService.getItemsOptionsJustificar()
        this.itemsJustificativasSupervisor = dados
      },
      async loadHistoricoJustificativaAbs() {
        this.loadingHistorico = true
        const dados = await DadosOnlineOperadorJustificativaAbsService.getHistoricoJustificativas(
          this.usuarioNome
        )
        this.historicoJustificativaAbs = dados
        this.loadingHistorico = false
      },
      dateConvert() {
        let data = new Date()
        let dia = data.getDate().toString()
        let diaF = dia.length == 1 ? '0' + dia : dia
        let mes = (data.getMonth() + 1).toString()
        let mesF = mes.length == 1 ? '0' + mes : mes
        let anoF = data.getFullYear()

        return diaF + '/' + mesF + '/' + anoF
      }
    },
    created() {},
    watch: {
      abrirModalAbs: function (newVal) {
        if (newVal) {
          this.loadAbsParaJustificar()

          this.loadItemsJustificativas()
          this.loadHistoricoJustificativaAbs()
        }
      }
    }
  }
</script>

<style scoped></style>
