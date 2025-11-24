<template>
  <!-- v-model="openEditPopup" -->
  <v-dialog
    width="900"
    persistent
    :model-value="openEditPopup"
    @update:modelValue="val => $emit('update:openEditPopup', val)"
  >
    <v-card>
      <div class="d-flex align-center justify-space-between">
        <div>
          <v-card-title>Informações sobre o popup:</v-card-title>
          <v-card-subtitle>
            Confira as informações antes de salvar, não resgataremos imagens...
          </v-card-subtitle>
        </div>
        <div class="mr-5">
          <v-btn icon @click="$emit('update:close')"><v-icon>fa-solid fa-xmark</v-icon></v-btn>
        </div>
      </div>
      <v-col>
        <ValidationObserver v-slot="{ invalid, validate }" ref="observer">
          <form @submit.prevent="validate().then(submit)">
            <v-row>
              <v-col cols="4">
                <ValidationProvider name="titulo" rules="required" v-slot="{ errors }">
                  <v-text-field
                    placeholder="Titulo"
                    label="Titulo"
                    outlined
                    dense
                    v-model="form.TITULO"
                    :error-messages="errors"
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col>
                <ValidationProvider name="produto" rules="required" v-slot="{ errors }">
                  <v-autocomplete
                    placeholder="Produto"
                    label="Produto"
                    outlined
                    dense
                    :items="['NET', 'CLARO', 'ENEL']"
                    v-model="form.PRODUTO"
                    :error-messages="errors"
                  ></v-autocomplete>
                </ValidationProvider>
              </v-col>
              <v-col cols="4">
                <ValidationProvider name="página do alerta" rules="required" v-slot="{ errors }">
                  <v-autocomplete
                    placeholder="Está sendo exibida..."
                    label="Está sendo exibida..."
                    outlined
                    dense
                    :error-messages="errors"
                    :items="rotas"
                    item-text="MENU"
                    item-value="ID_ROTA"
                    v-model="form.ID_MENU_ROTA"
                  ></v-autocomplete>
                </ValidationProvider>
              </v-col>
              <v-col style="margin-top: -10px" cols="6">
                <DatePicker
                  label="Selecione uma data para expirar..."
                  :dateMaxProps="false"
                  :dateMinProps="true"
                  :addDay="15"
                  v-model="form.DATA_EXPIRACAO"
                />
              </v-col>
              <v-col>
                <ValidationProvider name="regional" rules="required" v-slot="{ errors }">
                  <v-autocomplete
                    :items="['Almope', 'Regional']"
                    placeholder="Direcionar popup por?"
                    label="Direcionar popup por?"
                    v-model="regionalOrAlmope"
                    outlined
                    readonly
                    :error-messages="errors"
                    dense
                  ></v-autocomplete>
                </ValidationProvider>
              </v-col>
              <v-col>
                <ValidationProvider name="status" rules="required" v-slot="{ errors }">
                  <v-autocomplete
                    :items="[
                      { text: 'Ativar', value: 1 },
                      { text: 'Desativar', value: 0 }
                    ]"
                    placeholder="Status popup"
                    label="Status popup"
                    v-model="form.STATUS"
                    outlined
                    :error-messages="errors"
                    dense
                  ></v-autocomplete>
                </ValidationProvider>
              </v-col>
              <v-col v-if="regionalOrAlmope == 'Regional'" cols="12">
                <ValidationProvider name="regional" rules="required" v-slot="{ errors }">
                  <v-autocomplete
                    placeholder="Regional direcionada"
                    label="Regional direcionada"
                    outlined
                    dense
                    :items="regionaisFiltro"
                    v-model="form.ALVO_LIBERACAO"
                    :error-messages="errors"
                    multiple
                    item-text="REGIONAL"
                    no-data-text="Selecione o produto primeiro"
                  >
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index === 0" small>{{ item.REGIONAL }}</v-chip>
                      <span v-if="index === 1" class="grey--text text-caption">
                        (+{{ form.ALVO_LIBERACAO.length - 1 }} outros)
                      </span>
                    </template>
                  </v-autocomplete>
                </ValidationProvider>
                <!-- v-model="form.regionais" -->
              </v-col>
              <v-col cols="12" v-if="regionalOrAlmope == 'Almope'">
                <ValidationProvider name="almope" rules="required" v-slot="{ errors }">
                  <v-textarea
                    outlined
                    dense
                    :error-messages="errors"
                    placeholder="Direcionar por almope (Copie e cole os almopes do excel)"
                    label="Direcionar por almope"
                    v-model="form.ALVO_LIBERACAO"
                    rows="2"
                  ></v-textarea>
                </ValidationProvider>
              </v-col>
              <v-col cols="12">
                <ValidationProvider
                  name="anexar"
                  rules="required|image"
                  v-slot="{ errors }"
                  ref="provider"
                >
                  <v-file-input
                    label="Anexar arte do popup"
                    placeholder="Anexar arte do popup"
                    :error-messages="errors"
                    outlined
                    dense
                    ref="file-input"
                    @change="inputFile"
                    v-model="arteDoPopup"
                  ></v-file-input>
                </ValidationProvider>
              </v-col>
              <v-col class="mt-n4">
                <v-btn color="warning" block @click="submit" :disabled="invalid">Atualizar</v-btn>
              </v-col>
            </v-row>
          </form>
        </ValidationObserver>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  import FileService from '@/data/services/file/fileService'

  import DatePicker from '@/shared/components/DatePicker/DatePicker.vue'

  import { PopupLabService } from '@/data/services/Acoes'
  import { EventBus } from '@/eventBus'

  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  // const md5 = require('md5.js')
  export default {
    components: { DatePicker, ValidationObserver, ValidationProvider },
    props: {
      openEditPopup: {
        type: Boolean,
        default: false
      },
      regionais: {
        type: [Object, Array],
        required: true
      },
      rotas: {
        type: [Object, Array],
        required: true
      },
      dadosEdit: {
        type: [Object, Array],
        required: true
      }
    },
    data: () => ({
      direcionarPopup: null,
      regionalOrAlmope: null,
      arteDoPopup: null,
      editNewhashAttc: null,
      form: {
        ID_POPUP: null,
        TITULO: null,
        PRODUTO: null,
        ARQUIVO_POPUP: null,
        ALVO_LIBERACAO: null,
        ID_MENU_ROTA: null,
        DATA_EXPIRACAO: null,
        STATUS: null,
        NOME_ARQUIVO: null
      }
    }),
    computed: {
      almopesAlvo() {
        if (!this.dadosEdit && this.regionalOrAlmope == 'Almope') return
        let texto = this.form.ALVO_LIBERACAO
        const linhas = texto && texto?.trim().split('\n')
        if (linhas && linhas.length > 1) {
          return linhas
        } else {
          return linhas && linhas[0].split(';')
        }
      },
      usuario() {
        return this.$store.getters.usuario
      },
      regionaisFiltro() {
        let regionais = this.regionais
        if (!regionais) return
        return regionais.filter(item => {
          return item.PRODUTO === this.form.PRODUTO
        })
      }
    },
    methods: {
      async inputFile(file) {
        const { valid } = await this.$refs.provider.validate(file)
        if (valid) {
          this.arteDoPopup = file
        }
      },
      async uploadArquivo(file) {
        try {
          const fileExtension = file.name.split('.').pop()
          const newFileId = `${this.usuario.almope}_${this.form.TITULO}_${new Date().getTime()}`

          const hashAttc = null //new md5().update(newFileId).digest('hex')
          this.editNewhashAttc = `${hashAttc}.${fileExtension}`

          const renamedFile = new File([file], `${hashAttc}.${fileExtension}`, { type: file.type })

          await FileService.upload('popup_lab', renamedFile)
        } catch (error) {
          console.error(error)
          EventBus.$emit('snackbar', {
            text: 'Não foi possivel concluir o cadastro. Tente novamente.',
            color: 'error'
          })
        }
      },
      async submit() {
        try {
          if (this.editNewhashAttc) {
            await this.uploadArquivo(this.arteDoPopup)
          }
          let obj = {
            Id_Popup: this.form.ID_POPUP,
            Titulo: this.form.TITULO,
            Produto: this.form.PRODUTO,
            Id_Menu_Rota: this.form.ID_MENU_ROTA,
            Arquivo_Popup: this.editNewhashAttc ?? this.form.NOME_ARQUIVO,
            Data_Expiracao: this.form.DATA_EXPIRACAO,
            Status: this.form.STATUS == 1 ? true : false,
            Almope_Alteracao: this.usuario.almope.toString(),
            Data_Alteracao: this.moment().format('YYYY-MM-DD'),
            Regional_Direcionada:
              this.regionalOrAlmope == 'Regional' ? this.form.ALVO_LIBERACAO : null,
            Almope_Liberacao: this.regionalOrAlmope == 'Almope' ? this.almopesAlvo : null //? this.form.almopeLiberacao.split(';') : null
          }

          await PopupLabService.atualizarDadosPopup(obj)
          EventBus.$emit('snackbar', { text: 'Alerta atualizado com sucesso.', color: 'success' })
        } catch (error) {
          console.error(error)
          EventBus.$emit('snackbar', {
            text: 'Não foi possivel concluir o cadastro. Tente novamente.',
            color: 'error'
          })
        }
      }
    },
    watch: {
      dadosEdit: function (newVal) {
        const iniciaisAlmopes = ['41', '42', '43', '44', '45', '46', '47', '48', '49', '50']
        if (!newVal) return
        for (let key in newVal) {
          if (key === 'ALVO_LIBERACAO') {
            if (iniciaisAlmopes?.some(some => newVal['ALVO_LIBERACAO'].includes(some))) {
              this.regionalOrAlmope = 'Almope'
              this.form['ALVO_LIBERACAO'] = newVal[key]
            } else {
              this.regionalOrAlmope = 'Regional'
              this.form['ALVO_LIBERACAO'] = newVal[key].split(';')
            }
          } else {
            if (key === 'STATUS') {
              if (newVal[key] == 'True') {
                this.form[key] = 1
              } else {
                this.form[key] = 0
              }
            } else {
              this.form[key] = newVal[key]
            }
          }
        }
      }
    }
  }
</script>

<style></style>
