<template>
  <v-col>
    <validation-observer v-slot="{ invalid, validate }" ref="observer">
      <form @submit.prevent="validate().then(submit)">
        <v-row>
          <v-col cols="3">
            <validation-provider v-slot="{ errors }" name="status" rules="required">
              <v-select
                placeholder="Status"
                label="Status"
                :error-messages="errors"
                outlined
                v-model="formEditar.STATUS"
                dense
                item-text="text"
                item-value="value"
                :items="[
                  { text: 'HABILITADO', value: 1 },
                  { text: 'DESABILITADO', value: 0 }
                ]"
              ></v-select>
            </validation-provider>
          </v-col>

          <v-col cols="3">
            <validation-provider v-slot="{ errors }" name="produto" rules="required">
              <v-select
                placeholder="Produto"
                label="Produto"
                :error-messages="errors"
                outlined
                v-model="formEditar.PRODUTO"
                dense
                :items="produto"
                multiple
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0" small>{{ item }}</v-chip>
                  <span v-if="index === 1" class="grey--text text-caption">
                    (+{{ formEditar.PRODUTO.length - 1 }}
                    outros)
                  </span>
                </template>
              </v-select>
            </validation-provider>
          </v-col>

          <v-col cols="3">
            <validation-provider v-slot="{ errors }" name="titulo" rules="required">
              <v-text-field
                placeholder="Titulo"
                label="Titulo"
                :error-messages="errors"
                outlined
                v-model="formEditar.TITLE"
                dense
                :items="produto"
                multiple
              ></v-text-field>
            </validation-provider>
          </v-col>
          <v-col cols="3">
            <validation-provider v-slot="{ errors }" name="grupo" rules="required">
              <v-select
                placeholder="Tipo grupo"
                label="Tipo grupo"
                v-model="formEditar.TIPO_GRUPO"
                :error-messages="errors"
                outlined
                :items="['Tabuladores', 'Utilitários']"
                dense
              ></v-select>
            </validation-provider>
          </v-col>
          <v-col cols="6">
            <validation-provider v-slot="{ errors }" name="tipo acesso" rules="required">
              <v-select
                placeholder="Tipo acesso"
                label="Tipo acesso"
                v-model="formEditar.TIPO_ACESSO_LIBERACAO"
                item-text="TIPO_PERFIL"
                item-value="TIPO_PERFIL"
                :error-messages="errors"
                outlined
                dense
                :items="filtro_permisao"
                multiple
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0" small>{{ item.TIPO_PERFIL }}</v-chip>
                  <span v-if="index === 1" class="grey--text text-caption">
                    (+{{ formEditar.TIPO_ACESSO_LIBERACAO.length - 1 }}
                    outros)
                  </span>
                </template>
              </v-select>
            </validation-provider>
          </v-col>
          <v-col cols="6">
            <validation-provider v-slot="{ errors }" name="regional acesso" rules="required">
              <v-autocomplete
                no-data-text="Regional não encontrada!"
                outlined
                dense
                label="Regional acesso"
                :items="regionais"
                item-text="REGIONAL"
                item-value="REGIONAL"
                :error-messages="errors"
                multiple
                v-model="formEditar.REGIONAL_ACESSO_LIBERACAO"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0" small>{{ item.REGIONAL }}</v-chip>
                  <span v-if="index === 1" class="grey--text text-caption">
                    (+{{ formEditar.REGIONAL_ACESSO_LIBERACAO.length - 1 }}
                    outros)
                  </span>
                </template>
              </v-autocomplete>
            </validation-provider>
          </v-col>
          <v-col cols="12">
            <validation-provider v-slot="{ errors }" name="descrição" rules="required">
              <v-textarea
                placeholder="Descrição"
                label="Descrição"
                :error-messages="errors"
                rows="2"
                outlined
                v-model="formEditar.DESCRICAO"
                dense
                :items="produto"
                multiple
              ></v-textarea>
            </validation-provider>
          </v-col>
          <v-col cols="6">
            <validation-provider v-slot="{ errors }" name="almope acesso">
              <v-tooltip top>
                <template v-slot:activator="{ attrs, on }">
                  <v-textarea
                    v-bind="attrs"
                    v-on="on"
                    placeholder="Almope acesso (separado por virgulas)"
                    label="Almope acesso"
                    rows="2"
                    :error-messages="errors"
                    v-model="formEditar.ALMOPE_LIBERACAO"
                    outlined
                    dense
                    :items="produto"
                    multiple
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
            <validation-provider v-slot="{ errors }" name="almope restrição">
              <v-tooltip top>
                <template v-slot:activator="{ attrs, on }">
                  <v-textarea
                    v-bind="attrs"
                    v-on="on"
                    placeholder="Almope restrição (separado por virgulas)"
                    label="Almope restrição"
                    :error-messages="errors"
                    outlined
                    v-model="formEditar.ALMOPE_RESTRICAO"
                    dense
                    :items="produto"
                    multiple
                    rows="2"
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
        <v-btn :disabled="invalid" type="submit" color="success">Atualizar</v-btn>
      </form>
    </validation-observer>
  </v-col>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import { UtilitariosService } from '@/data/services/tabuladores'
  import config from '@/core/config'
  import Utils from '@/data/services/common/Utils'
  import { EventBus } from '@/eventBus'
  export default {
    components: { ValidationObserver, ValidationProvider },
    props: {
      items: {
        type: [Object, Array],
        default: () => []
      }
    },
    data: () => ({
      produto: ['NET', 'CLARO', 'ENEL', 'QUALIDADE', 'PLANEJAMENTO'],
      regionais: [],
      formEditar: {
        PRODUTO: null,
        TITLE: null,
        TIPO_GRUPO: null,
        TIPO_ACESSO_LIBERACAO: null,
        REGIONAL_ACESSO_LIBERACAO: null,
        ALMOPE_RESTRICAO: null,
        ALMOPE_LIBERACAO: null,
        STATUS: null,
        DESCRICAO: null
      },
      filtro_permisao: [],
      dadosRestricaoAlmope: [],
      dadosLiberacaoAlmope: []
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      arrayToString(array, separator) {
        if (!array) return
        let mapArray = array.map(e => e)
        return mapArray.join(separator)
      },
      async loadGetAlmopes(almopesIn) {
        if (!almopesIn) return ''
        const almopes = await Utils.getAlmopes(almopesIn)
        return almopes.map(almope => {
          return `<div>${almope.ALMOPE} - ${almope.NOME} (${almope.FILTRO})</div>`
        })
      },
      async submit() {
        this.formEditar.ALTERADO_POR = this.usuario.almope
        const res = await UtilitariosService.atualizarUtilitarios(this.items.ID, {
          ...this.formEditar,
          REGIONAL_ACESSO_LIBERACAO: this.arrayToString(
            this.formEditar.REGIONAL_ACESSO_LIBERACAO
          ).toLowerCase()
        })
        EventBus.$emit('snackbar', { text: res.message, color: res.status })
        this.$emit('update:reload')
      },
      async loadRegionais() {
        if (this.regionais != '') return
        let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/regionais/`
        var res = await this.$api.get(urlData)
        this.regionais = res.data
        this.regionais.push({
          REGIONAL: 'ADMINISTRADOR',
          PRODUTO: 'NET'
        })
      },
      loadFiltroPermissao() {
        if (this.filtro_permisao != '') return
        let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/filtro_permissao`
        this.$api.get(urlData).then(res => {
          this.filtro_permisao = res.data
        })
      }
    },

    async created() {},
    watch: {
      items: {
        async handler(newVal) {
          this.dadosRestricaoAlmope = []
          this.dadosLiberacaoAlmope = []
          this.loadRegionais()
          this.loadFiltroPermissao()
          for (const key in newVal) {
            if (this.formEditar[key] !== undefined) {
              this.formEditar[key] = newVal[key]
            }

            if (key === 'PRODUTO') {
              let value = newVal[key].split(',')
              let array = []
              for (const keyD of value) {
                array.push(keyD.trim())
              }

              this.formEditar.PRODUTO = array
            }

            if (key === 'REGIONAL_ACESSO_LIBERACAO') {
              let value = newVal[key].toUpperCase().split(',')
              let array = []
              for (const keyD of value) {
                array.push(keyD.trim())
              }
              this.formEditar.REGIONAL_ACESSO_LIBERACAO = array
            }

            if (key === 'TIPO_ACESSO_LIBERACAO') {
              let value = newVal[key].toUpperCase().split(',')
              let array = []
              for (const keyD of value) {
                array.push(keyD.trim())
              }
              this.formEditar.TIPO_ACESSO_LIBERACAO = array
            }
          }
        }
      },
      'formEditar.ALMOPE_LIBERACAO': async function (newVal) {
        if (!newVal) return
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
      'formEditar.ALMOPE_RESTRICAO': async function (newVal) {
        if (!newVal) return
        if (newVal.length >= 7) {
          let obj = newVal.split(',').map(almope => {
            if (almope.trim().length == 7) {
              return 'executar'
            } else {
              return 'não executar'
            }
          })

          if (!obj.includes('não executar')) {
            this.dadosRestricaoAlmope = await this.loadGetAlmopes(newVal.trim())
          }
        }
      }
    }
  }
</script>

<style></style>
