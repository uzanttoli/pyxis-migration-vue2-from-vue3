<template>
  <!-- v-model="modalEdit" -->
  <v-dialog
    width="1200"
    persistent
    :model-value="modalEdit"
    @update:modelValue="val => $emit('update:modalEdit', val)"
  >
    <v-card class="rounded-xl">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <v-card-title>
          <i class="fa-solid fa-sliders mr-2" style="color: green"></i>
          Configurar Base Download
        </v-card-title>
        <v-btn icon @click="$emit('update:closeEdit')" class="mr-2">
          <v-icon>fas fa-close</v-icon>
        </v-btn>
      </div>
      <v-card-subtitle>Após as mudanças, basta clicar em finalizar</v-card-subtitle>
      <v-divider></v-divider>
      <v-col>
        <validation-observer v-slot="{ invalid, validate }" ref="observer">
          <form @submit.prevent="validate().then(submit)">
            <v-row>
              <v-col cols="3">
                <validation-provider v-slot="{ errors }" name="produto">
                  <v-select
                    outlined
                    dense
                    multiple
                    :error-messages="errors"
                    placeholder="Produto"
                    label="Produto"
                    :items="produto"
                    item-text="text"
                    item-value="value"
                    v-model="form.produto"
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index === 0" small>
                        <span>{{ item.text }}</span>
                      </v-chip>
                      <span v-if="index === 1" class="grey--text text-caption">
                        (+{{ form.produto.length - 1 }} outros)
                      </span>
                    </template>
                  </v-select>
                </validation-provider>
              </v-col>
              <v-col cols="3">
                <validation-provider v-slot="{ errors }" name="permissão downloads">
                  <v-select
                    multiple
                    rows="2"
                    outlined
                    dense
                    :items="dadosControlePerfil"
                    item-text="PERFIL"
                    item-value="ID_PERFIL"
                    :error-messages="errors"
                    placeholder="Permissão downloads"
                    label="Permissão downloads"
                    v-model="form.permissaoDownload"
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index === 0" small>
                        {{ item.PERFIL }}
                      </v-chip>
                      <span v-if="index === 1" class="grey--text text-caption">
                        ({{ form.permissaoDownload.length - 1 }} outros)
                      </span>
                    </template>
                  </v-select>
                </validation-provider>
              </v-col>
              <v-col cols="3">
                <validation-provider v-slot="{ errors }" name="'maximo dias'" rules="numeric">
                  <v-text-field
                    outlined
                    dense
                    :error-messages="errors"
                    placeholder="Max dias consulta"
                    label="Max dias consulta"
                    v-model="form.diasConsulta"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="3">
                <validation-provider v-slot="{ errors }" name="visivel">
                  <v-select
                    outlined
                    dense
                    :error-messages="errors"
                    placeholder="Visivel"
                    label="Visivel"
                    v-model="form.visivel"
                    :items="status"
                    item-text="text"
                    item-value="value"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col cols="6" class="mt-n7">
                <validation-provider v-slot="{ errors }" name="nome fantasia">
                  <v-textarea
                    rows="2"
                    outlined
                    dense
                    :error-messages="errors"
                    placeholder="Nome fantasia"
                    label="Nome fantasia"
                    v-model="form.nomeFantasia"
                  ></v-textarea>
                </validation-provider>
              </v-col>
              <v-col cols="6" class="mt-n7">
                <validation-provider v-slot="{ errors }" name="nome tabela">
                  <v-textarea
                    rows="2"
                    outlined
                    dense
                    :error-messages="errors"
                    placeholder="Nome tabela"
                    label="Nome tabela"
                    v-model="form.nomeTabela"
                  ></v-textarea>
                </validation-provider>
              </v-col>

              <v-col cols="6" class="mt-n7">
                <validation-provider v-slot="{ errors }" name="fonte">
                  <v-textarea
                    rows="2"
                    outlined
                    dense
                    :error-messages="errors"
                    placeholder="Fonte"
                    label="Fonte"
                    v-model="form.fonte"
                  ></v-textarea>
                </validation-provider>
              </v-col>
              <v-col cols="6" class="mt-n7">
                <validation-provider v-slot="{ errors }" name="responsavel">
                  <v-textarea
                    rows="2"
                    outlined
                    dense
                    :error-messages="errors"
                    placeholder="Responsavel"
                    label="Responsavel"
                    v-model="form.responsavel"
                  ></v-textarea>
                </validation-provider>
              </v-col>

              <v-col cols="6" class="mt-n7">
                <validation-provider v-slot="{ errors }" name="permissão almopes">
                  <v-textarea
                    rows="2"
                    outlined
                    dense
                    :error-messages="errors"
                    placeholder="Permissão Almopes (Use o separador ';')"
                    label="Permissão Almopes (Use o separador ';')"
                    v-model="form.permissaoAlmopes"
                  ></v-textarea>
                </validation-provider>
              </v-col>

              <v-col cols="6" class="mt-n7">
                <validation-provider v-slot="{ errors }" name="restrição almopes">
                  <v-textarea
                    rows="2"
                    outlined
                    dense
                    :error-messages="errors"
                    placeholder="Restrição por almopes (Use o separador ';')"
                    label="Restrição por almopes (Use o separador ';')"
                    v-model="form.restricaoAlmope"
                  ></v-textarea>
                </validation-provider>
              </v-col>
              <v-col cols="12" class="mt-n7">
                <validation-provider v-slot="{ errors }" name="consulta">
                  <v-textarea
                    rows="4"
                    outlined
                    dense
                    :error-messages="errors"
                    placeholder="Consulta (Antes de salvar verifique se a consulta está funcionando)"
                    label="Consulta (Antes de salvar verifique se a consulta está funcionando)"
                    v-model="form.consulta"
                  ></v-textarea>
                </validation-provider>
              </v-col>
            </v-row>
            <div style="display: flex; justify-content: end">
              <v-btn :disabled="invalid" type="submit" color="success" :loading="isLoading">
                Finalizar
              </v-btn>
            </div>
          </form>
        </validation-observer>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import config from '../../../../core/config'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    components: { ValidationObserver, ValidationProvider },
    props: {
      modalEdit: {
        type: Boolean,
        default: false
      },
      dadosEdit: {
        type: [Array, Object]
      }
    },
    data: () => ({
      isLoading: false,
      form: {
        produto: [],
        nomeFantasia: null,
        nomeTabela: null,
        visivel: [],
        fonte: null,
        responsavel: null,
        permissaoDownload: [],
        permissaoAlmopes: null,
        diasConsulta: null,
        restricaoAlmope: null,
        consulta: null
      },
      dadosControlePerfil: [],
      produto: [
        { text: 'ENEL', value: 'ENEL' },
        { text: 'NET', value: 'NET' },
        { text: 'QUALIDADE', value: 'QUALIDADE' },
        { text: 'PLANEJAMENTO', value: 'PLANEJAMENTO' },
        { text: 'CLARO', value: 'CLARO' }
      ],
      status: [
        { text: 'Visivel', value: 1 },
        { text: 'Não visivel', value: 0 }
      ]
    }),
    mounted() {},
    mixins: [alerts],
    methods: {
      async submit() {
        try {
          this.isLoading = true
          this.form.id = this.dadosEdit.ID
          let urlData = `${config.baseUrl}api/shared/bases/atualiza_dados_base`
          await this.$api.post(urlData, this.form)
          this.toast('Alterações realizadas com sucesso!', 'top-right', false, 2500, 'success')
          this.$emit('updated:reload-base')
          this.isLoading = false
        } catch (e) {
          this.toast('Alterações não realizadas!', 'top-right', false, 2500, 'warning')
          this.isLoading = false
        }
      },
      preencherForm() {
        this.form.produto = this.dadosEdit.PRODUTO.replaceAll(';', ',').split(',')
        this.form.nomeFantasia = this.dadosEdit.NOME_FANTASIA
        this.form.nomeTabela = this.dadosEdit.NOME_TABELA
        this.form.visivel = this.dadosEdit.VISIVEL
        this.form.fonte = this.dadosEdit.FONTE
        this.form.responsavel = this.dadosEdit.RESPONSAVEL
        this.form.permissaoDownload = this.dadosEdit.PERMISSAO_DOWNLOADS.replaceAll(';', ',')
          .split(',')
          .map(item => item * 1)
        this.form.permissaoAlmopes = this.dadosEdit.PERMISSAO_ALMOPE_LIBERACAO
        this.form.diasConsulta = this.dadosEdit.MAX_DIAS_CONSULTA
        this.form.restricaoAlmope = this.dadosEdit.PERMISSAO_ALMOPE_RESTRICAO
        this.form.consulta = this.dadosEdit.CONSULTA
      },
      loadDadosControlePerfil() {
        let urlData = `${config.baseUrl}api/shared/admin/painel/controle_perfil/ADMINISTRADOR`
        this.$api.get(urlData).then(res => {
          this.dadosControlePerfil = res.data.map(item => {
            return {
              ID_PERFIL: item.ID_PERFIL,
              PERFIL: item.TIPO_PERFIL
            }
          })
        })
      }
    },
    created() {
      this.loadDadosControlePerfil()
    },
    watch: {
      modalEdit: function (newVal) {
        if (newVal) {
          this.preencherForm()
        }
      }
    }
  }
</script>

<style scoped></style>
