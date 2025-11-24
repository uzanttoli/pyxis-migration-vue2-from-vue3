<template>
  <div>
    <v-col>
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="2">
              <validation-provider
                v-slot="{ errors }"
                name="almope"
                rules="required|numeric|min:7|max:7"
              >
                <v-text-field
                  outlined
                  dense
                  :error-messages="errors"
                  placeholder="Almope"
                  required
                  label="Almope"
                  v-model="permissoes.almope"
                  @change="permissoes.almope.length == 7 ? loadGetAlmopes() : undefined"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <v-text-field
                outlined
                dense
                placeholder="Nome"
                label="Nome"
                :value="nomeAlmope"
                filled
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="3">
              <validation-provider v-slot="{ errors }" name="criar relatório" rules="required">
                <v-select
                  outlined
                  dense
                  :error-messages="errors"
                  placeholder="Criar relatório"
                  item-text="text"
                  item-value="value"
                  :items="status"
                  label="Criar relatório"
                  v-model="permissoes.criar"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3">
              <validation-provider v-slot="{ errors }" name="atualizar relatório" rules="required">
                <v-select
                  outlined
                  dense
                  :error-messages="errors"
                  placeholder="Atualizar relatório"
                  item-text="text"
                  item-value="value"
                  :items="status"
                  label="Atualizar relatório"
                  v-model="permissoes.atualizar"
                ></v-select>
              </validation-provider>
            </v-col>
          </v-row>
          <v-btn
            type="submit"
            color="warning"
            class="mt-n2 mb-5 font-weight-bold"
            block
            :disabled="invalid"
          >
            Salvar permissões
          </v-btn>
          <v-divider></v-divider>
          <v-card elevation="0">
            <v-card-title>
              <v-icon class="mr-2" style="color: orangered" size="20">
                fa-solid fa-users-gear
              </v-icon>
              Pessoas com permissões
            </v-card-title>
            <v-data-table
              :headers="getHeaders"
              :items="dadosRelatoriosPermissoes"
              dense
              :items-per-page="2"
              hide-default-footer
              @page-count="pageCount = $event"
              v-model:page="page"
              no-data-text="Nenhum dado encontrado"
              :loading="loading"
              no-results-text="Nenhum dado encontrado"
            >
              <template v-slot:item.CRIAR_RELATORIO="{ item }">
                <v-switch
                  v-model="item.CRIAR_RELATORIO"
                  :true-value="1"
                  :false-value="0"
                  @change="atualizarPermissoes(item)"
                ></v-switch>
              </template>
              <template v-slot:item.ATUALIZAR_RELATORIO="{ item }">
                <v-switch
                  v-model="item.ATUALIZAR_RELATORIO"
                  :true-value="1"
                  :false-value="0"
                  @change="atualizarPermissoes(item)"
                ></v-switch>
              </template>
              <template v-slot:item.ACOES="{ item }">
                <v-btn icon @click="deleteItem(item)">
                  <v-icon color="red" size="18">fa-solid fa-trash</v-icon>
                </v-btn>
              </template>
            </v-data-table>
            <v-pagination v-model="page" :length="pageCount"></v-pagination>
          </v-card>
        </form>
      </validation-observer>
    </v-col>
  </div>
</template>

<script>
  import GerenciarRelatoriosService from '@/data/services/portalCco/GerenciarRelatorios'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import Utils from '@/data/services/common/Utils'
  import { EventBus } from '@/eventBus'
  export default {
    name: 'GerenciarCriarAtualizar',
    components: { ValidationObserver, ValidationProvider },
    props: {
      idRelatorio: {
        type: [String, Number],
        default: null
      }
    },
    data: () => ({
      permissoes: {
        almope: null,
        criar: null,
        atualizar: null
      },
      status: [
        { text: 'Habilitado', value: 1 },
        { text: 'Desabilitado', value: 0 }
      ],
      dadosRelatoriosPermissoes: [],
      page: 1,
      pageCount: 0,
      loading: false,
      nomeAlmope: null
    }),
    computed: {
      getHeaders() {
        const dados = this.dadosRelatoriosPermissoes[0] || {}
        let headers = Object.keys(dados).map(key => {
          return {
            text: key,
            value: key,
            align: 'center',
            sortable: false
          }
        })
        headers.push({
          text: 'AÇÕES',
          value: 'ACOES',
          align: 'center',
          sortable: false
        })
        return headers
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async submit() {
        if (this.nomeAlmope && this.nomeAlmope == '') return
        this.permissoes.autorizadoPor = this.usuario.almope
        const res = await GerenciarRelatoriosService.inserirPermissoesRelatorios(
          this.idRelatorio,
          this.permissoes
        )
        EventBus.$emit('snackbar', { text: res.message, color: res.status })
        await this.loadRelatoriosPermissoes()
        this.permissoes.almope = null
        this.permissoes.criar = null
        this.permissoes.atualizar = null
        this.$refs.observer.reset()
        this.nomeAlmope = null
      },
      async deleteItem(item) {
        const res = await GerenciarRelatoriosService.deletarPermissoesRelatorios(
          this.idRelatorio,
          item.ALMOPE
        )
        EventBus.$emit('snackbar', { text: res.message, color: res.status })
        await this.loadRelatoriosPermissoes()
      },
      async atualizarPermissoes(item) {
        const data = {
          ALMOPE: item.ALMOPE,
          CRIAR_RELATORIO: item.CRIAR_RELATORIO,
          ATUALIZAR_RELATORIO: item.ATUALIZAR_RELATORIO
        }

        const res = await GerenciarRelatoriosService.atualizarPermissoesRelatorios(
          this.idRelatorio,
          data
        )
        EventBus.$emit('snackbar', { text: res.message, color: res.status })
      },
      async loadRelatoriosPermissoes() {
        this.loading = true
        const res = await GerenciarRelatoriosService.getRelatoriosPermissoes(this.idRelatorio)
        this.dadosRelatoriosPermissoes = res
        this.loading = false
      },
      async loadGetAlmopes() {
        if (!this.permissoes.almope) return ''
        const almopes = await Utils.getAlmopes(this.permissoes.almope)
        if (almopes != '') {
          this.nomeAlmope = almopes.map(almope => {
            return `${almope.NOME} (${almope.FILTRO})`
          })
        } else {
          this.nomeAlmope = 'Almope não encontrado'
        }
      }
    },
    created() {
      this.loadRelatoriosPermissoes()
    },
    watch: {
      idRelatorio: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadRelatoriosPermissoes()
        }
      }
    }
  }
</script>
