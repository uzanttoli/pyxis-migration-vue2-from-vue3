<template>
  <v-card>
    <title-negative-margin title="Solicitação de acessos" className="rounded-r-xl">
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn fab color="#00695C" @click="openDialog" v-bind="attrs" v-on="on" small>
            <v-icon color="white">fa-brands fa-readme</v-icon>
          </v-btn>
        </template>
        <span>Acompanhar Solicitações</span>
      </v-tooltip>
      <v-tooltip
        bottom
        v-if="
          usuarioAlmope == '4573576' ||
          usuarioAlmope == '4628656' ||
          usuarioAlmope == '4665667' ||
          filtro == 'ADMINISTRADOR'
        "
      >
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            fab
            small
            v-bind="attrs"
            v-on="on"
            color="#00695C"
            class="ml-2"
            target="_blank"
            href="/pyxis/utilitarios/solicitacao-acessos/tratamento"
          >
            <v-icon color="white">fa-solid fa-chalkboard-user</v-icon>
          </v-btn>
        </template>
        <span>Tratar solicitações</span>
      </v-tooltip>
    </title-negative-margin>
    <v-col>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <div class="field-form">
            <div class="form-pri">
              <v-col class="pa-0 ma-0">
                <ValidationProvider
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
                    v-model="formAcesso.almope"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col class="pa-0 ma-0">
                <ValidationProvider v-slot="{ errors }" name="Dx" rules="required">
                  <v-select
                    outlined
                    dense
                    placeholder="DX"
                    :error-messages="errors"
                    v-model="formAcesso.dx"
                    :items="listDx"
                    item-text="VALOR_CAMPO"
                    item-value="VALOR_CAMPO"
                    required
                    no-data-text="Não há nada por aqui!"
                  ></v-select>
                </ValidationProvider>
              </v-col>
              <v-col class="pa-0 ma-0">
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Grupo de Atendimento"
                  rules="required"
                >
                  <v-select
                    dense
                    outlined
                    placeholder="Grupo Atendimento"
                    :error-messages="errors"
                    :items="listGpAtendimento"
                    item-text="VALOR_CAMPO"
                    item-value="VALOR_CAMPO"
                    v-model="formAcesso.gpAtendimento"
                    required
                    no-data-text="Não há nada por aqui!"
                  ></v-select>
                </ValidationProvider>
              </v-col>
              <v-col class="pa-0 ma-0">
                <ValidationProvider v-slot="{ errors }" name="Tipo de Atendimento" rules="required">
                  <v-select
                    placeholder="Tipo De Atendimento"
                    dense
                    outlined
                    :items="itemsLista"
                    item-text="TIPO_SOLICITACAO"
                    item-value="TIPO_SOLICITACAO"
                    :error-messages="errors"
                    required
                    v-model="formAcesso.tipoAtendimento"
                    no-data-text="Não há nada por aqui!"
                  ></v-select>
                </ValidationProvider>
              </v-col>
            </div>
            <v-col class="pa-0 ma-0">
              <ValidationProvider v-slot="{ errors }" name="BR" rules="required">
                <v-text-field
                  :error-messages="errors"
                  placeholder="BR"
                  dense
                  outlined
                  required
                  :items="listSistema"
                  item-text="VALOR_CAMPO"
                  item-value="VALOR_CAMPO"
                  v-model="formAcesso.loginBr"
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col class="pa-0 ma-0">
              <ValidationProvider v-slot="{ errors }" name="Sistema" rules="required">
                <v-select
                  dense
                  outlined
                  required
                  :items="listSistema"
                  item-text="SISTEMA"
                  item-value="SISTEMA"
                  placeholder="Sistema Com Erro?"
                  :error-messages="errors"
                  v-model="formAcesso.sistema"
                  multiple
                  no-data-text="Não há nada por aqui!"
                ></v-select>
              </ValidationProvider>
            </v-col>
            <v-col class="pa-0 ma-0">
              <ValidationProvider v-slot="{ errors }" name="Improdutivo" rules="required">
                <v-select
                  dense
                  outlined
                  required
                  :items="listImprodutivo"
                  item-text="VALOR_CAMPO"
                  item-value="VALOR_CAMPO"
                  :error-messages="errors"
                  placeholder="Colaborador Improdutivo?"
                  v-model="formAcesso.improdutivo"
                  no-data-text="Não há nada por aqui!"
                ></v-select>
              </ValidationProvider>
            </v-col>
            <v-col class="pa-0 ma-0" cols="12">
              <ValidationProvider v-slot="{ errors }" name="Descrição do Erro" rules="required">
                <v-textarea
                  outlined
                  required
                  rows="3"
                  placeholder="Descrição do Erro"
                  :error-messages="errors"
                  v-model="formAcesso.descricao"
                ></v-textarea>
              </ValidationProvider>
            </v-col>
            <v-col class="pa-0 ma-0" cols="12">
              <div class="anexo">
                <div class="container-img" v-if="imageData != null">
                  <img :src="imageData" alt="" />
                </div>
                <div class="anexar-imagem">
                  <i class="fa-solid fa-paperclip"></i>
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    name="Imagem evidência"
                    ref="provider"
                  >
                    <input
                      type="file"
                      id="fileUpload"
                      accept="image/*"
                      ref="imagemAnexo"
                      @change="changeInputAnexo"
                    />
                    <span>{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
              </div>
            </v-col>
          </div>
          <v-row class="mb-2 mt-n3" justify="end" style="margin: 0 1px 0 1px">
            <v-btn color="error" @click="clearForm" depressed class="mr-3">Limpar</v-btn>
            <v-btn type="submit" :disabled="invalid" depressed color="success">Cadastrar</v-btn>
          </v-row>
        </form>
      </validation-observer>
    </v-col>
    <acompanhar-solicitacao-acesso
      :dialogAcompanharSolicitacao="dialogAcompanharSolicitacao"
      @update:close="dialogAcompanharSolicitacao = !dialogAcompanharSolicitacao"
    ></acompanhar-solicitacao-acesso>
  </v-card>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import config from '../../../../core/config'
  import alerts from '../../../../mixins/alerts.mixins'
  import AcompanharSolicitacaoAcesso from './acompanharSolicitacaoAcesso.vue'
  export default {
    components: {
      ValidationObserver,
      ValidationProvider,
      AcompanharSolicitacaoAcesso
    },
    data: () => ({
      formAcesso: {
        almope: null,
        dx: null,
        gpAtendimento: null,
        tipoAtendimento: null,
        loginBr: null,
        sistema: null,
        improdutivo: null,
        descricao: null
      },
      fileName: null,
      dialogAcompanharSolicitacao: false,
      items: [],
      itemsLista: [],
      imageData: null,
      arquivoUpload: null
    }),
    mixins: [alerts],
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      listDx() {
        let items = this.items.filter(item => {
          return item.NOME_CAMPO == 'DX'
        })
        return items
      },
      listGpAtendimento() {
        let items = this.items.filter(item => {
          return item.NOME_CAMPO == 'GRUPO DE ATENDIMENTO '
        })
        return items
      },
      listTipoSolicitacao() {
        let items = this.items.filter(item => {
          return item.NOME_CAMPO == 'TIPO DE SOLICITAÇÃO '
        })
        return items
      },
      listSistema() {
        let items = this.itemsLista
        let filter = items.filter(item => {
          return item.TIPO_SOLICITACAO == this.formAcesso.tipoAtendimento
        })
        return filter
        // let items = this.items.filter((item) => {
        //   return item.NOME_CAMPO == "SISTEMA";
        // });
        // return items;
      },
      listImprodutivo() {
        let items = this.items.filter(item => {
          return item.NOME_CAMPO == 'IMPRODUTIVO '
        })
        return items
      },
      filtro() {
        return this.$store.getters.usuario.filtro
      }
    },
    methods: {
      clickInputAnexo() {
        let anexo = this.$refs.imagemAnexo.click()
        return anexo
      },
      changeInputAnexo(e) {
        const isValid = this.$refs.provider.validate(e)
        if (isValid) {
          let file = e.target.files[0]
          const reader = new FileReader()
          const hashName = this.generateHashName()
          const newName = `${this.formAcesso.almope}_evidencia_acesso_enel_${hashName}`

          const fileExtension = file.name.split('.').pop()
          const fileRenamed = new File([file], `${newName}.${fileExtension}`, {
            type: file.type
          })
          this.fileName = `${fileRenamed.name}`
          this.arquivoUpload = fileRenamed

          reader.onload = e => {
            this.imageData = e.target.result
          }

          reader.readAsDataURL(fileRenamed)
        }
      },
      generateHashName() {
        const date = new Date()
        return date.getTime().toString()
      },
      openDialog() {
        this.dialogAcompanharSolicitacao = false
        setTimeout(() => {
          this.dialogAcompanharSolicitacao = true
        }, 100)
      },
      async submit() {
        try {
          const isValid = await this.$refs.observer.validate()
          if (isValid) {
            if (this.arquivoUpload == null || this.arquivoUpload == null) {
              this.toast(
                'Necessário anexar imagem antes de Salvar',
                'top-right',
                false,
                2000,
                'info'
              )
            } else {
              await this.submitImage()

              this.formAcesso.almopeCadastro = this.$store.getters.usuario.almope
              this.formAcesso.nomeArquivoUpload = this.fileName
              let urlData = `${config.baseUrl}api/shared/formularios/solicitacao_acessos/solicitacao_acesso`
              await this.$api.post(urlData, this.formAcesso)
              this.clearForm()
              this.toast('Cadastro realizado com sucesso!', 'bottom-right', false, 2500, 'success')
              this.$refs.observer.reset()
            }
          }
        } catch (error) {
          this.toast('Cadastro não foi realizado!', 'bottom-right', false, 2500, 'error')
        }
        // 🐿 ship it
      },
      async submitImage() {
        if (this.arquivoUpload != null) {
          const formaData = new FormData()
          formaData.append('imagem', this.arquivoUpload)
          let urlUpload = `${config.baseUrl}api/shared/formularios/solicitacao_acessos/upload_file_image`
          await this.$api.post(urlUpload, formaData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        }
      },
      loadItemsSolicitacao() {
        let urlData = `${config.baseUrl}api/shared/formularios/solicitacao_acessos/validacao_soli_acesso`
        this.$api.get(urlData).then(res => {
          this.items = res.data
        })
      },
      loadListaItemsValidacao() {
        let urlData = `${config.baseUrl}api/shared/formularios/solicitacao_acessos/listar_campos_validacao`
        this.$api.get(urlData).then(res => {
          this.itemsLista = res.data
        })
      },
      clearForm() {
        let newForm = Object.assign({}, this.formAcesso)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        // this.$refs.provider.resetValidation();
        this.$refs.observer.reset()
        this.$refs.imagemAnexo.value = ''
        this.imageData = null
        this.arquivoUpload = null
        this.fileName = null
        this.formAcesso = newForm
      }
    },
    created() {
      this.loadItemsSolicitacao()
      this.loadListaItemsValidacao()
    }
  }
</script>

<style scoped>
  .field-form {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .form-pri {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .anexar-imagem {
    border: 1px solid #a3a3a3;
    border-radius: 5px;
    padding: 10px;
    width: 100%;
    display: flex;
    font-weight: 600;
    gap: 8px;
    color: #868686;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: -20px;
    margin-bottom: 20px;
    transition: background 1s;
    cursor: pointer;
  }

  .anexar-imagem:hover {
    background-color: #e6e6e6;
    cursor: pointer;
  }

  .anexar-imagem i {
    font-size: 30px;
    color: #868686;
  }

  .container-img {
    border: 1px solid #a3a3a3;
    border-radius: 5px;
    display: flex;
    width: 50%;
    padding: 10px;
    justify-content: center;
    margin-top: -20px;
    margin-bottom: 20px;
  }

  img {
    width: 125px;
    height: 125px;
  }

  .anexo {
    display: flex;
    width: 100%;
    gap: 10px;
    justify-content: space-around;
  }
</style>
