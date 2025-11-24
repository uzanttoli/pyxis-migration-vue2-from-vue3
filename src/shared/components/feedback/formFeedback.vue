<template>
  <v-card elevation="0" class="rounded-xl">
    <v-container>
      <card-app-bar
        customClass="rounded-xl"
        :minHeight="100"
        style="margin-top: 10px"
        styleCustom="display: flex; height: 100px; padding: 25px; align-items:center; color: #fafafa;"
        :isButtonReturn="true"
        @update:click="$router.go(-1)"
      >
        <template v-slot:title>
          <h3>
            <v-icon color="white" class="mr-3" size="25">fa-solid fa-headphones-simple</v-icon>
            Hub de Monitorias
          </h3>
        </template>
      </card-app-bar>
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-col>
            <fieldset>
              <legend class="mb-2" style="display: flex; align-items: center">
                <i class="fa-solid fa-circle-nodes mr-1 red--text"></i>
                Dados Operador
              </legend>
              <v-row>
                <v-col cols="3" class="mb-n4">
                  <validation-provider name="'Almope'" rules="required|numeric" v-slot="{ errors }">
                    <v-text-field
                      dense
                      outlined
                      :error-messages="errors"
                      placeholder="Almope"
                      label="Almope"
                      v-model="form.almope"
                    >
                      <template v-slot:append>
                        <v-btn
                          style="margin-top: -4px"
                          fab
                          x-small
                          elevation="0"
                          color="blue"
                          @click="loadDadosMonitorado"
                        >
                          <v-icon color="white">fa-solid fa-magnifying-glass</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="3" class="mb-n4">
                  <validation-provider name="'Nome'">
                    <v-text-field
                      dense
                      outlined
                      placeholder="Nome"
                      label="Nome"
                      readonly
                      filled
                      v-model="dadosMonitorado.NOME"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="3" class="mb-n4">
                  <validation-provider name="'Supervisor'">
                    <v-text-field
                      dense
                      outlined
                      placeholder="Supervisor"
                      label="Supervisor"
                      filled
                      readonly
                      v-model="dadosMonitorado.SUPERVISOR"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="3" class="mb-n4">
                  <validation-provider name="'Coordenador'">
                    <v-text-field
                      dense
                      outlined
                      filled
                      placeholder="Coordenador"
                      label="Coordenador"
                      readonly
                      v-model="dadosMonitorado.COORDENADOR"
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <span
                  style="
                    font-size: 12px;
                    color: red;
                    margin-left: 14px;
                    margin-right: 10px;
                    margin-top: -10px;
                  "
                >
                  *Para iniciar a monitoria insira o almope e clique no icone
                  <v-icon size="15" color="blue">fa-solid fa-magnifying-glass</v-icon>
                </span>
              </v-row>
            </fieldset>
            <fieldset>
              <legend class="mb-2" style="display: flex; align-items: center">
                <i class="fa-solid fa-circle-nodes mr-1 red--text"></i>
                Informações da Monitoria
              </legend>
              <!-- <pre>{{perguntas}}</pre> -->
              <v-row>
                <v-col
                  class="mb-n4"
                  :cols="item.TIPO == 'v-text-area' ? '12' : '3'"
                  v-for="(item, i) in perguntas"
                  :key="`${i}_${item.ID}`"
                  v-show="perguntas"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    name="acima"
                    :rules="
                      item.OBRIGATORIO
                        ? `required${
                            item.ATRIBUTO == 'text' || item.ATRIBUTO == null
                              ? ''
                              : '|' + item.ATRIBUTO
                          }`
                        : ''
                    "
                  >
                    <component
                      v-if="item.MASCARA"
                      :is="item.TIPO"
                      pretend
                      :maxlength="item.TIPO == 'v-text-area' ? 500 : false"
                      :counter="item.TIPO == 'v-text-area' ? 500 : false"
                      :placeholder="item.PERGUNTA"
                      :label="item.PERGUNTA"
                      outlined
                      dense
                      :error-messages="errors"
                      :items="item.items || []"
                      item-text="RESPOSTA"
                      item-value="ID_RESPOSTA"
                      v-mask="mascara(item.MASCARA)"
                      v-model="form[item.ID]"
                      @change="item.items ? handleChange(item, form[item.ID]) : ''"
                      no-data-text="Não há items"
                    >
                      <template v-slot:append>
                        <v-icon class="loading" v-if="loading">fa-solid fa-spinner</v-icon>
                      </template>
                    </component>
                    <component
                      v-else
                      :is="item.TIPO"
                      pretend
                      :placeholder="item.PERGUNTA"
                      :label="item.PERGUNTA"
                      outlined
                      :maxlength="item.TIPO == 'v-text-area' ? 500 : false"
                      :counter="item.TIPO == 'v-text-area' ? 500 : false"
                      dense
                      :disabled="loading"
                      :error-messages="errors"
                      :items="item.items || []"
                      item-text="RESPOSTA"
                      item-value="ID_RESPOSTA"
                      v-model="form[item.ID]"
                      @change="item.items ? handleChange(item, form[item.ID]) : ''"
                      no-data-text="Não há items"
                    >
                      <template v-slot:append>
                        <v-icon class="loading" v-if="loading">fa-solid fa-spinner</v-icon>
                      </template>
                    </component>
                  </validation-provider>
                </v-col>
                <v-col v-if="perguntas != '' && $route.query.gravacao" cols="12">
                  <div
                    v-show="dadosMonitorado != ''"
                    @click="openFileInputGravacao"
                    style="
                      padding: 15px;
                      border: 1px solid #3333;
                      border-radius: 8px;
                      cursor: pointer;
                      box-shadow: inset 0 0 8px #3333;
                    "
                  >
                    <v-icon class="mr-2" color="red">fa-solid fa-music</v-icon>
                    <span style="font-weight: 600">Anexar gravação do atendimento (mp3, wav)</span>
                    <div>
                      <span style="font-size: 12px">Clique para anexar a gravação</span>
                    </div>
                    <div class="barra-carregamento" style="display: flex; gap: 5px"></div>
                    <v-progress-linear
                      v-if="isFile"
                      :value="progressoAnexo"
                      height="20"
                      striped
                      color="light-blue"
                      rounded
                    >
                      <span id="porcentagem" style="font-weight: 600; color: #ffff">0%</span>
                    </v-progress-linear>
                  </div>
                  <div id="file-input">
                    <input
                      type="file"
                      id="file"
                      accept=".mp3,.wav"
                      style="display: none"
                      ref="gravacaoAudio"
                      @change="dadosFile"
                    />
                  </div>
                </v-col>
                <v-col v-show="perguntas == ''">
                  <div style="width: 100%; display: flex; justify-content: center">
                    <p style="color: grey">Carregando perguntas da monitoria...</p>
                  </div>
                </v-col>
              </v-row>
            </fieldset>
            <div style="display: flex; justify-content: start">
              <v-col>
                <v-btn
                  type="submit"
                  class="mr-2"
                  :disabled="invalid || dadosMonitorado == ''"
                  color="success"
                  :loading="loadingSend"
                >
                  Enviar
                </v-btn>
                <v-btn color="error" @click="limparForm">Limpar</v-btn>
              </v-col>
            </div>
          </v-col>
        </form>
      </validation-observer>
    </v-container>
  </v-card>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'
  import config from '@/core/config'
  import VSelect from 'vuetify/lib/components/VSelect'
  import VTextField from 'vuetify/lib/components/VTextField'
  import VTextArea from 'vuetify/lib/components/VTextarea'
  import alerts from '@/mixins/alerts.mixins'
  import cardAppBar from '@/shared/components/cards/modern/cardAppBar.vue'
  import { ValidationObserver, ValidationProvider, Validator } from 'vee-validate'

  Validator.extend('dateFormat', {
    validate(value) {
      if (value.length === 10) {
        const year = parseInt(value.split('/')[2], 10)
        const currentYear = new Date().getFullYear()
        const nextYear = currentYear + 1

        if (year === currentYear || year === nextYear) {
          return moment(value, 'DD/MM/YYYY', true).isValid()
        }
      }
      return false
    },
    getMessage: field => `${field} deve estar no formato "DD/MM/YYYY" e ser válido.`
  })

  export default {
    components: {
      ValidationObserver,
      ValidationProvider,
      VSelect,
      VTextField,
      VTextArea,
      cardAppBar
    },
    data: () => ({
      form: {
        almope: null
      },
      perguntas: [],
      dadosMonitorado: [],
      arrayPerguntasDep: [],
      loading: false,
      fileAudio: null,
      isFile: false,
      progressoAnexo: null,
      extension: null,
      idGerado: null,
      loadingSend: false
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      hashComputed() {
        return this.gerarIDReserva()
      }
    },
    mixins: [alerts],
    methods: {
      gerarID() {
        let urlData = `${config.baseUrl}api/shared/feedback/formulario/gerar_id`
        this.$api.get(urlData).then(res => {
          this.idGerado = res.data[0]?.ID_RESERVA
        })
      },
      openFileInputGravacao() {
        this.$refs.gravacaoAudio.click()
      },
      async dadosFile(e) {
        this.isFile = true
        this.fileAudio = e.target.files[0]
        this.$refs.gravacaoAudio.value = null
      },
      async uploadFile() {
        try {
          let extension = this.fileAudio.name.split('.').pop()
          this.extension = extension
          if (extension == 'wav' || extension == 'mp3') {
            const renamedFile = new File([this.fileAudio], `${this.idGerado}.${extension}`, {
              type: this.fileAudio.type
            })

            const formData = new FormData()
            formData.append('arquivo', renamedFile)
            let urlData = `http://10.64.175.49:4300/receptivo/index.php/api/arquivos/upload_arquivo_2/feedback`
            await axios.post(urlData, formData, {
              onUploadProgress: progressEvent => {
                const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                const barraCarregamento = document.querySelector('.barra-carregamento')
                const porcentagem = document.getElementById('porcentagem')
                if (barraCarregamento) {
                  barraCarregamento.style.width = percentage + '%'
                }
                if (porcentagem && percentage != 0) {
                  porcentagem.textContent = percentage + '%'
                }
                this.progressoAnexo = percentage
                porcentagem.textContent = percentage + '%'
              }
            })
            this.isFile = false
          } else {
            this.toast('Formato de arquivo não permitido!', 'top-right', false, 2000, 'warning')
            this.fileAudio = null
            this.extension = null
            this.$refs.gravacaoAudio.value = null
          }
        } catch (e) {
          this.toast('Não foi possivel salvar o anexo.', 'top-right', false, 2000, 'error')
        }
      },
      loadDadosMonitorado() {
        this.gerarID()
        let urlData = `${config.baseUrl}api/shared/operador/organico_portal/${this.form.almope}`
        this.$api.get(urlData).then(res => {
          if (res.data.length == 0) {
            this.toast(
              'Não foi possivel localizar o almope informado!',
              'top-right',
              false,
              2000,
              'info'
            )
          }
          if (
            res?.data[0]?.SUPERVISOR == this.usuario.nome ||
            res?.data[0]?.COORDENADOR == this.usuario.nome
          ) {
            this.dadosMonitorado = res?.data[0] ?? []
          } else {
            this.toast(
              'O almope informado não pertence a sua hierarquia.',
              'top-right',
              false,
              2000,
              'warning'
            )
          }
        })
        this.$refs.observer.reset()
      },
      mascara(item) {
        if (!item) return
        return item.split(',') ?? ''
      },
      gerarIDReserva() {
        if (!this.form.almope) return
        const date = Date.now()
        let hash = `${date.toString()}`
        let almopeArray = Array.from(this.form.almope.toString())
        let transform = almopeArray.reduce(
          (accumulator, currentValue) => accumulator * 1 * currentValue * 1
        )
        return `${transform}${hash}`
      },
      async salvarDados() {
        try {
          this.form.idForm = this.$route.query.id
          this.form.almopeGestor = this.usuario.almope
          this.form.anexo = this.extension ? 1 : 0
          this.form.idReserva = this.idGerado
          this.form.extension = this.extension
          let urlData = `${config.baseUrl}api/shared/feedback/formulario/tabulacao`
          await this.$api.post(urlData, this.form)
          this.limparForm()
          this.toast('Monitoria realizada com sucesso!', 'top-right', false, 2000, 'success')
        } catch (e) {
          this.toast('Erro ao salvar monitoria. Tente novamente', 'top-right', false, 2000, 'error')
        }
      },
      async submit() {
        try {
          // await this.gerarIDReserva();
          this.loadingSend = true
          if (this.fileAudio) {
            let ext = this.fileAudio.name.split('.').pop()
            if (ext != 'mp3' && ext != 'wav') {
              this.toast('Tipo de arquivo invalido!', 'top-right', false, 2000, 'warning')
              this.$refs.gravacaoAudio.value = null
              this.loadingSend = false
              this.fileAudio = null
            } else {
              await this.uploadFile().then(async () => {
                await this.salvarDados()
                this.loadingSend = false
              })
            }
          } else {
            await this.salvarDados()
            this.loadingSend = false
          }
        } catch (e) {
          this.loadingSend = false
          console.error(e)
        }
      },
      limparForm() {
        this.form = {}
        this.form.almope = null
        this.$refs.observer.reset()
        this.fileAudio = null
        this.extension = null
        this.$refs.gravacaoAudio.value = null
        this.progressoAnexo = 0
        this.dadosMonitorado = ''
      },
      loadPerguntas() {
        let urlData = `${config.baseUrl}api/shared/feedback/formulario/perguntas`
        this.$api
          .get(urlData, {
            params: {
              idForm: this.$route.query.id
            }
          })
          .then(async res => {
            const campos = res.data

            // Ordenar as perguntas por 'ORDEM_CAMPO'
            const sortedCampos = campos.sort((a, b) => a.ORDEM_CAMPO - b.ORDEM_CAMPO)
            const updatedCampos = await Promise.all(
              sortedCampos.map(async campo => {
                if (campo.TIPO === 'v-select') {
                  campo.items = await this.loadItemsForSelect(campo.ID)
                }
                return campo
              })
            )

            this.perguntas = updatedCampos
            updatedCampos.forEach(element => {
              this.$set(this.form, element.ID, null)
            })
          })
      },
      async loadItemsForSelect(id) {
        if (!id) return []
        let urlData = `${config.baseUrl}api/shared/feedback/formulario/respostas`
        const response = await this.$api.get(urlData, {
          params: { idForm: this.$route.query.id, idPergunta: id }
        })
        return response.data
      },
      handleChange(item, selectedValue) {
        if (!item) return
        const selectedItem = item.items.find(i => i.ID_RESPOSTA === selectedValue)
        this.loadPerguntaDependecia(item.ID, selectedItem.ID_RESPOSTA)
      },
      loadPerguntaDependecia(idPergunta, idResposta) {
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/feedback/formulario/perguntas_resposta`
        this.$api
          .get(urlData, {
            params: { idPergunta, idResposta, idForm: this.$route.query.id }
          })
          .then(res => {
            if (this.arrayPerguntasDep) {
              for (let i = 0; i < this.arrayPerguntasDep.length; i++) {
                if (this.arrayPerguntasDep[i]?.id_pergunta == idPergunta) {
                  const perguntasAtuais = this.perguntas.filter(
                    item => item.ID !== this.arrayPerguntasDep[i].id_pergunta_dep
                  )

                  this.perguntas = [...perguntasAtuais]
                }
              }
            }

            if (res.data && res.data.length > 0) {
              const perguntasDependentes = res.data

              perguntasDependentes.forEach(async depPergunta => {
                const perguntaExistente = this.perguntas.find(p => p.ID === depPergunta.ID)

                if (!perguntaExistente) {
                  if (depPergunta.TIPO === 'v-select') {
                    depPergunta.items = await this.loadItemsForSelect(depPergunta.ID)
                  }

                  this.insertPerguntaEmOrdem(depPergunta)
                  this.$set(this.form, depPergunta.ID, null)
                }
              })
            } else {
              this.removePerguntasDependentesPorResposta(idPergunta, idResposta)
            }
            this.loading = false
          })
          .catch(error => {
            console.error('Erro ao carregar perguntas dependentes:', error)
            this.loading = false
          })
      },

      insertPerguntaEmOrdem(depPergunta) {
        const perguntaExistente = this.perguntas.find(p => p.ID === depPergunta.ID)

        if (perguntaExistente) {
          return
        }

        this.arrayPerguntasDep.push({
          id_pergunta: depPergunta.FK_ID_PERGUNTA,
          id_pergunta_dep: depPergunta.ID
        })

        const index = this.perguntas.findIndex(p => p.ORDEM_CAMPO > depPergunta.ORDEM_CAMPO)
        if (index === -1) {
          this.perguntas.push(depPergunta)
        } else {
          this.perguntas.splice(index, 0, depPergunta)
        }
      },
      removePerguntasDependentesPorResposta(idPergunta, idResposta) {
        const dependentes = this.arrayPerguntasDep.filter(
          dep => dep.id_pergunta === idPergunta && dep.id_resposta_dep === idResposta
        )

        dependentes.forEach(dep => {
          const perguntaIndex = this.perguntas.findIndex(p => p.ID === dep.id_pergunta_dep)
          if (perguntaIndex !== -1) {
            this.perguntas.splice(perguntaIndex, 1)
            this.$set(this.form, dep.id_pergunta_dep, null)
          }
        })
        this.arrayPerguntasDep = this.arrayPerguntasDep.filter(
          dep => !(dep.id_pergunta === idPergunta && dep.id_resposta_dep === idResposta)
        )
      }
    },
    created() {
      this.loadPerguntas()
    }
  }
</script>

<style scoped>
  fieldset {
    padding: 15px;
    border: 1px solid #3333;
    border-radius: 10px;
    margin-bottom: 15px;
  }
  legend {
    padding: 0 10px;
    font-size: 18.5px;
  }
  .loading {
    animation: transition 3s infinite;
    color: rgb(7, 156, 149);
  }

  @keyframes transition {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
</style>
