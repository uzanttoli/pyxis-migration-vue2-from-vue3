<template>
  <!-- v-model="modalEdit" -->
  <v-dialog
    width="2000"
    persistent
    :model-value="modalEdit"
    @update:modelValue="val => $emit('update:modalEdit', val)"
  >
    <v-card class="rounded-xl">
      <v-row class="ma-0 pa-0">
        <v-col cols="6">
          <v-card elevation="0">
            <div style="display: flex; justify-content: space-between; align-items: center">
              <v-card-title>
                <i class="fa-solid fa-sliders mr-2" style="color: green"></i>
                Configurar relatório para download
              </v-card-title>
              <!-- <v-btn icon @click="$emit('update:closeEdit')" class="mr-2">
                                <v-icon>fas fa-close</v-icon>
                            </v-btn> -->
            </div>
            <v-card-subtitle>Após as mudanças, basta clicar em finalizar</v-card-subtitle>
            <v-divider></v-divider>
            <v-col>
              <validation-observer v-slot="{ invalid, validate }" ref="observer">
                <form @submit.prevent="validate().then(submit)">
                  <v-row>
                    <v-col cols="3">
                      <validation-provider
                        v-slot="{ errors }"
                        name="nome arquivo rede"
                        rules="required"
                      >
                        <v-text-field
                          outlined
                          dense
                          :error-messages="errors"
                          readonly
                          v-model="dadosForm.NOME_ARQUIVO_REDE"
                          placeholder="Nome arquivo rede"
                          label="Nome arquivo rede"
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="3">
                      <validation-provider
                        v-slot="{ errors }"
                        name="nome arquivo exibir"
                        rules="required"
                      >
                        <v-text-field
                          outlined
                          dense
                          :error-messages="errors"
                          readonly
                          v-model="dadosForm.NOME_ARQUIVO_FANTASIA"
                          placeholder="Nome arquivo [exibido na pyxis]"
                          label="Nome arquivo [exibido na pyxis]"
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="3">
                      <validation-provider v-slot="{ errors }" name="extensão" rules="required">
                        <v-select
                          outlined
                          dense
                          :error-messages="errors"
                          v-model="dadosForm.EXTENSAO"
                          :items="tiposArquivos"
                          item-text="FORMATO_ARQUIVO"
                          placeholder="Extensão"
                          label="Extensão"
                        ></v-select>
                      </validation-provider>
                    </v-col>
                    <v-col cols="3">
                      <validation-provider v-slot="{ errors }" name="fonte" rules="required">
                        <v-select
                          outlined
                          dense
                          :error-messages="errors"
                          v-model="dadosForm.FONTE"
                          :items="fonte"
                          placeholder="Fonte"
                          label="Fonte"
                        ></v-select>
                      </validation-provider>
                    </v-col>
                    <v-col cols="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="perfil liberação"
                        rules="required"
                      >
                        <v-select
                          outlined
                          dense
                          :error-messages="errors"
                          v-model="dadosForm.PERFIL_LIBERACAO"
                          placeholder="Perfil liberação"
                          :items="tipoPerfil"
                          item-text="TIPO_PERFIL"
                          label="Perfil liberação"
                          multiple
                        >
                          <template v-slot:selection="{ item, index }">
                            <v-chip v-if="index === 0" small>
                              <span>{{ item.TIPO_PERFIL }}</span>
                            </v-chip>
                            <span v-if="index === 1" class="grey--text text-caption">
                              (+{{ dadosForm.PERFIL_LIBERACAO.length - 1 }} outros)
                            </span>
                          </template>
                        </v-select>
                      </validation-provider>
                    </v-col>
                    <v-col cols="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="status relatório"
                        rules="required"
                      >
                        <v-select
                          outlined
                          dense
                          :error-messages="errors"
                          v-model="dadosForm.STATUS"
                          placeholder="Status relatório"
                          :items="status"
                          label="Status relatório"
                        ></v-select>
                      </validation-provider>
                    </v-col>
                    <v-col cols="4">
                      <validation-provider v-slot="{ errors }" name="tipo arquivo" rules="required">
                        <v-select
                          outlined
                          dense
                          :error-messages="errors"
                          v-model="dadosForm.TIPO_ARQUIVO"
                          :items="['RELATORIO', 'ARQUIVO UPLOAD']"
                          placeholder="Tipo arquivo"
                          label="Tipo arquivo"
                        ></v-select>
                      </validation-provider>
                    </v-col>
                    <v-col cols="6">
                      <validation-provider v-slot="{ errors }" name="liberar por exceção">
                        <v-tooltip top>
                          <template v-slot:activator="{ attrs, on }">
                            <v-textarea
                              outlined
                              dense
                              :error-messages="errors"
                              v-bind="attrs"
                              v-on="on"
                              v-model="dadosForm.LIBERACAO_ALMOPE"
                              placeholder="Liberar por exceção (almopes separados por virgulas)"
                              label="Liberar por exceção"
                            ></v-textarea>
                          </template>
                          <span
                            v-if="dadosLiberacaoAlmope.length > 0"
                            v-html="dadosLiberacaoAlmope.map(dados => dados).join('')"
                          ></span>
                          <span v-else>Nenhum almope liberado</span>
                        </v-tooltip>
                      </validation-provider>
                    </v-col>
                    <v-col cols="6">
                      <validation-provider v-slot="{ errors }" name="bloquear por exceção">
                        <v-tooltip top>
                          <template v-slot:activator="{ attrs, on }">
                            <v-textarea
                              outlined
                              dense
                              :error-messages="errors"
                              v-bind="attrs"
                              v-on="on"
                              v-model="dadosForm.RESTRICAO_ALMOPE"
                              placeholder="Bloquear por exceção (almopes separados por virgulas)"
                              label="Bloquear por exceção"
                            ></v-textarea>
                          </template>
                          <span
                            v-if="dadosRestricaoAlmope.length > 0"
                            v-html="dadosRestricaoAlmope.map(dados => dados).join('')"
                          ></span>
                          <span v-else>Nenhum almope restringido</span>
                        </v-tooltip>
                      </validation-provider>
                    </v-col>
                  </v-row>
                  <v-btn type="submit" color="success" class="mt-1" :disabled="invalid">
                    Finalizar
                  </v-btn>
                </form>
              </validation-observer>
            </v-col>
          </v-card>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="6">
          <v-card elevation="0">
            <div style="display: flex; justify-content: space-between; align-items: center">
              <v-card-title>
                <i class="fa-solid fa-sliders mr-2" style="color: orangered"></i>
                Configurar permissões para atualizar relatórios
              </v-card-title>
              <v-btn icon @click="$emit('update:closeEdit')" class="mr-2">
                <v-icon>fas fa-close</v-icon>
              </v-btn>
            </div>
            <v-card-subtitle>Após as mudanças, basta clicar em finalizar</v-card-subtitle>
            <v-divider></v-divider>
            <gerenciar-criar-atualizar
              :idRelatorio="dadosDataTableSelecionado.ID"
            ></gerenciar-criar-atualizar>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
  import { EventBus } from '@/eventBus'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'

  import config from '@/core/config'
  import Utils from '@/data/services/common/Utils'
  import GerenciarRelatoriosService from '@/data/services/portalCco/GerenciarRelatorios'
  import GerenciarCriarAtualizar from './gerenciarCriarAtualizar.vue'
  export default {
    components: { ValidationObserver, ValidationProvider, GerenciarCriarAtualizar },
    props: {
      modalEdit: {
        type: Boolean,
        default: false
      },
      dadosDataTableSelecionado: {
        type: [Object, Array],
        default: () => {}
      }
    },
    data: () => ({
      dadosForm: {
        ID: null,
        NOME_ARQUIVO_REDE: null,
        NOME_ARQUIVO_FANTASIA: null,
        EXTENSAO: null,
        FONTE: null,
        LIBERACAO_ALMOPE: null,
        RESTRICAO_ALMOPE: null,
        PERFIL_LIBERACAO: null,
        TIPO_ARQUIVO: null,
        STATUS: null,
        EDITADO_POR: null
      },
      snackbar: {
        show: false,
        text: '',
        color: 'success'
      },
      tiposArquivos: [],
      tipoPerfil: [],
      dadosLiberacaoAlmope: [],
      dadosRestricaoAlmope: [],
      status: [
        { text: 'Habilitado', value: 1 },
        { text: 'Desabilitado', value: 0 }
      ],
      fonte: [
        { text: 'CCO', value: 'CCO' },
        { text: 'QUALIDADE', value: 'QUALIDADE' }
      ]
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async submit() {
        this.dadosForm.EDITADO_POR = this.usuario.almope
        const res = await GerenciarRelatoriosService.atualizarRelatorio(
          this.dadosForm.ID,
          this.dadosForm
        )

        EventBus.$emit('snackbar', { text: res.message, color: res.status })
        this.$emit('update:dadosAtualizados')
        this.$emit('update:closeEdit')
      },
      async loadGetAlmopes(almopesIn) {
        if (!almopesIn) return ''
        const almopes = await Utils.getAlmopes(almopesIn)
        return almopes.map(almope => {
          return `<div>${almope.ALMOPE} - ${almope.NOME} (${almope.FILTRO})</div>`
        })
      },
      loadTipoArquivo() {
        let urlData = `${config.baseUrl}api/shared/relatorios/arquivos/tipos`
        this.$api.get(urlData).then(res => {
          this.tiposArquivos = res.data
        })
      },
      loadTipoPerfil() {
        let urlData = `${config.baseUrl}api/shared/admin/painel/listar_tipo_perfil/`
        this.$api.get(urlData).then(res => {
          this.tipoPerfil = res.data
        })
      }
    },
    watch: {
      dadosDataTableSelecionado: {
        async handler(newVal) {
          // await this.loadRelatoriosPermissoes()
          this.dadosLiberacaoAlmope = []
          this.dadosRestricaoAlmope = []
          for (const key in newVal) {
            this.dadosForm[key] = newVal[key]

            if (key == 'PERFIL_LIBERACAO') {
              this.dadosForm.PERFIL_LIBERACAO = newVal[key].split(',')
            }
          }

          // if (this.dadosForm.LIBERACAO_ALMOPE && this.dadosForm.LIBERACAO_ALMOPE != '-') {
          //     this.dadosLiberacaoAlmope = await this.loadGetAlmopes(this.dadosForm.LIBERACAO_ALMOPE)
          // }

          // if (this.dadosForm.RESTRICAO_ALMOPE && this.dadosForm.RESTRICAO_ALMOPE != '-') {
          //     this.dadosRestricaoAlmope = await this.loadGetAlmopes(this.dadosForm.RESTRICAO_ALMOPE)
          // }
        }
      },
      'dadosForm.LIBERACAO_ALMOPE': async function (newVal) {
        if (newVal.length >= 7) {
          let obj = newVal.split(',').map(almope => {
            if (almope.trim().length == 7) {
              return 'executar'
            } else {
              return 'não executar'
            }
          })

          if (!obj.includes('não executar')) {
            this.dadosLiberacaoAlmope = await this.loadGetAlmopes(newVal.trim())
          }
        }
      },
      'dadosForm.RESTRICAO_ALMOPE': async function (newVal) {
        if (newVal.length >= 7) {
          let obj = newVal.split(',').map(almope => {
            if (almope.trim().length == 7) {
              return 'executar'
            } else {
              return 'não executar'
            }
          })

          if (!obj.includes('não executar')) {
            this.dadosLiberacaoAlmope = this.dadosRestricaoAlmope = await this.loadGetAlmopes(
              newVal.trim()
            )
          }
        }
      }
    },
    created() {
      this.loadTipoArquivo()
      this.loadTipoPerfil()
    }
  }
</script>

<style scoped></style>
