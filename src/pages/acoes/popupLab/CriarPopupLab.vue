<template>
  <v-card elevation="1" class="pa-2 rounded-xl">
    <v-card-title class="grey--text">
      Preencha as informações que serão exibidas no popup
    </v-card-title>
    <v-col>
      <ValidationObserver v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col>
              <ValidationProvider name="titulo" rules="required" v-slot="{ errors }">
                <v-text-field
                  placeholder="Titulo do Alerta"
                  label="Titulo do Alerta"
                  outlined
                  dense
                  :error-messages="errors"
                  v-model="form.titulo"
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col>
              <ValidationProvider name="produto" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  placeholder="Produto"
                  label="Produto"
                  outlined
                  :error-messages="errors"
                  dense
                  :items="['NET', 'CLARO', 'ENEL']"
                  v-model="form.produto"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col>
              <ValidationProvider name="página do alerta" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  placeholder="Qual página será exibido o alerta?"
                  label="Qual página será exibido o alerta?"
                  outlined
                  dense
                  :error-messages="errors"
                  :items="rotas"
                  item-text="MENU"
                  item-value="ID_ROTA"
                  v-model="form.idRota"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col style="margin-top: -10px">
              <DatePicker
                label="Selecione uma data para expirar..."
                :dateMaxProps="false"
                :dateMinProps="true"
                :addDay="15"
                v-model="form.dataExpiracao"
              />
            </v-col>
            <v-col>
              <ValidationProvider name="regional" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  :items="['Almope', 'Regional']"
                  placeholder="Direcionar regional por?"
                  label="Direcionar regional por?"
                  v-model="direcionarPopup"
                  :error-messages="errors"
                  outlined
                  dense
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col v-if="direcionarPopup == 'Regional'">
              <ValidationProvider name="regional" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  placeholder="Regional direcionada"
                  label="Regional direcionada"
                  outlined
                  :error-messages="errors"
                  dense
                  :items="regionaisFiltro"
                  multiple
                  item-text="REGIONAL"
                  no-data-text="Selecione o produto primeiro"
                  v-model="form.regionais"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="12" v-if="direcionarPopup == 'Almope'">
              <ValidationProvider name="almope" rules="required" v-slot="{ errors }">
                <v-textarea
                  outlined
                  dense
                  :error-messages="errors"
                  placeholder="Direcionar por almope (Copie e cole os almopes do excel) ou separe os almopes por ';'"
                  label="Direcionar por almope (Copie e cole os almopes do excel) ou separe os almopes por ';'"
                  rows="2"
                  v-model="form.almopeLiberacao"
                ></v-textarea>
              </ValidationProvider>
            </v-col>
            <v-col cols="12">
              <ValidationProvider name="anexar" rules="required" v-slot="{ errors }">
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
            <v-col>
              <v-row class="justify-end mr-1">
                <v-btn type="submit" :disabled="invalid" color="success" class="mr-2">Salvar</v-btn>
                <v-btn @click="clearForm" color="error">Limpar</v-btn>
              </v-row>
            </v-col>
          </v-row>
        </form>
      </ValidationObserver>
    </v-col>
  </v-card>
</template>

<script>
  import FileService from '@/data/services/file/fileService'

  import { PopupLabService } from '@/data/services/Acoes'
  import DatePicker from '@/shared/components/DatePicker/DatePicker.vue'

  import { EventBus } from '@/eventBus'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  // const md5 = require('md5.js')
  export default {
    components: { DatePicker, ValidationObserver, ValidationProvider },
    props: {
      regionais: {
        type: [Object, Array],
        required: true
      },
      rotas: {
        type: [Object, Array],
        required: true
      }
    },
    data: () => ({
      direcionarPopup: null,
      arteDoPopup: null,
      newhashAttc: null,
      form: {
        titulo: null,
        produto: null,
        idRota: null,
        dataExpiracao: null,
        regionais: null,
        almopeLiberacao: null
      }
    }),
    computed: {
      almopesAlvo() {
        let texto = this.form.almopeLiberacao
        const linhas = texto?.trim().split('\n')
        if (linhas && linhas.length > 1) {
          return linhas
        } else {
          return linhas && linhas[0].split(';')
        }
      },
      regionaisFiltro() {
        let regionais = this.regionais
        if (!regionais) return
        return regionais.filter(item => {
          return item.PRODUTO === this.form.produto
        })
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      clearForm() {
        let newForm = Object.assign({}, this.form)
        Object.keys(newForm).map(item => {
          if (item === 'dataExpiracao') return
          newForm[item] = null
        })
        this.$refs.observer.reset()
        this.arteDoPopup = null
        this.form = newForm
      },
      async uploadArquivo(file) {
        const fileExtension = file.name.split('.').pop()
        //const newFileId = `${this.usuario.almope}_${this.form.titulo}_${new Date().getTime()}`

        const hashAttc = null //new md5().update(newFileId).digest('hex')
        this.newhashAttc = `${hashAttc}.${fileExtension}`

        const renamedFile = new File([file], `${hashAttc}.${fileExtension}`, { type: file.type })

        await FileService.upload('popup_lab', renamedFile)
      },
      async inputFile(file) {
        this.arteDoPopup = file
      },
      async submit() {
        try {
          await this.uploadArquivo(this.arteDoPopup)
          let obj = {
            Titulo: this.form.titulo,
            Produto: this.form.produto,
            Id_Menu_Rota: this.form.idRota,
            Arquivo_Popup: this.newhashAttc,
            Data_Expiracao: this.form.dataExpiracao,
            Almope_Cadastro: this.usuario.almope.toString(),
            Regional_Direcionada: this.form.regionais,
            Almope_Liberacao: this.almopesAlvo //? this.form.almopeLiberacao.split(';') : null
          }

          await PopupLabService.criarPopup(obj)
          EventBus.$emit('snackbar', { text: 'Alerta criado com sucesso!', color: 'success' })
          this.clearForm()
        } catch (error) {
          EventBus.$emit('snackbar', {
            text: 'Não foi possivel concluir o cadastro. Tente novamente',
            color: 'error'
          })
        }
      }
    },
    created() {}
  }
</script>

<style></style>
