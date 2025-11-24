<template>
  <v-card>
    <title-negative-margin title="Ação Jornada Plena" className="rounded-r-xl">
      <!-- <v-btn icon color="orange"><v-icon>fa-solid fa-cloud-arrow-down</v-icon></v-btn> -->
    </title-negative-margin>
    <v-divider></v-divider>
    <v-col class="mt-3">
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col>
              <FieldSet title="Dados do colaborador" classCustom="my-0 pa-4 mt-n2">
                <v-row>
                  <v-col cols="2" class="my-0 py-0">
                    <validation-provider v-slot="{ errors }" name="Almope" rules="required">
                      <v-text-field
                        outlined
                        dense
                        persistent-placeholder
                        placeholder="Almope"
                        label="Almope"
                        ref="almope"
                        :error-messages="errors"
                        required
                        v-model="dadosFormulario.almopeConsulta"
                        @change="
                          dadosFormulario.almopeConsulta.length <= 7
                            ? getDadosColaborador()
                            : undefined
                        "
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="4" class="my-0 py-0">
                    <v-text-field
                      outlined
                      dense
                      persistent-placeholder
                      placeholder="Nome"
                      readonly
                      filled
                      label="Nome"
                      :value="dadosFormulario.camposView.nome_operador"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3" class="my-0 py-0">
                    <v-text-field
                      outlined
                      dense
                      persistent-placeholder
                      placeholder="CPF"
                      readonly
                      filled
                      label="CPF"
                      :value="dadosFormulario.camposView.cpf"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3" class="my-0 py-0">
                    <v-text-field
                      outlined
                      dense
                      persistent-placeholder
                      placeholder="Campanha"
                      readonly
                      filled
                      label="Campanha"
                      :value="dadosFormulario.camposView.campanha"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="4" class="my-0 py-0">
                    <v-text-field
                      outlined
                      dense
                      persistent-placeholder
                      placeholder="Supervisor"
                      readonly
                      filled
                      label="Supervisor"
                      :value="dadosFormulario.camposView.superior1"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" class="my-0 py-0">
                    <v-text-field
                      outlined
                      dense
                      persistent-placeholder
                      placeholder="Coordenador"
                      readonly
                      filled
                      label="Coordenador"
                      :value="dadosFormulario.camposView.superior2"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="4" class="my-0 py-0">
                    <v-text-field
                      outlined
                      dense
                      persistent-placeholder
                      placeholder="Gerente"
                      readonly
                      filled
                      label="Gerente"
                      :value="dadosFormulario.camposView.superior3"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </FieldSet>
              <FieldSet title="Tratativa" classCustom="my-0 pa-4 mt-2 mb-4">
                <v-row class="">
                  <v-col style="margin-top: -21px">
                    <DatePicker
                      label="Data Apuração"
                      v-model="dadosFormulario.preenchimento.data_apuracao"
                      :dateMaxProps="true"
                    />
                  </v-col>
                  <v-col cols="4" class="my-0 py-0">
                    <ValidationProvider name="tempo logado" rules="required" v-slot="{ errors }">
                      <v-text-field
                        placeholder="Tempo logado"
                        label="Tempo logado"
                        :error-messages="errors"
                        dense
                        outlined
                        v-model="dadosFormulario.preenchimento.tempo_logado"
                        v-mask="['##:##:##']"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="4" class="my-0 py-0">
                    <ValidationProvider name="motivo" rules="required" v-slot="{ errors }">
                      <v-autocomplete
                        placeholder="Motivo"
                        label="Motivo"
                        :error-messages="errors"
                        dense
                        outlined
                        v-model="dadosFormulario.preenchimento.motivo"
                        :items="motivos"
                        item-text="VALOR_CAMPO"
                      ></v-autocomplete>
                    </ValidationProvider>
                  </v-col>
                  <!-- <v-col cols="4" class="my-0 py-0">
                    <ValidationProvider name="o que foi feita" rules="required" v-slot="{ errors }">
                      <v-autocomplete
                        placeholder="O que foi feita?"
                        label="O que foi feita?"
                        :error-messages="errors"
                        dense
                        outlined
                        v-model="dadosFormulario.preenchimento.oque_foi_feito"
                        :items="oqueFoiFeito"
                        item-text="VALOR_CAMPO"
                        @change="loadFormOptionsParent"
                      ></v-autocomplete>
                    </ValidationProvider>
                  </v-col> -->
                  <v-col cols="4" class="my-0 py-0" v-if="regulamentoDosimétrico != ''">
                    <ValidationProvider
                      name="regulamento dosimetrico"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <v-autocomplete
                        placeholder="Regulamento dosimétrico"
                        label="Regulamento dosimétrico"
                        :error-messages="errors"
                        dense
                        outlined
                        v-model="dadosFormulario.preenchimento.regulamento_dosimetrico"
                        :items="regulamentoDosimétrico"
                        item-text="VALOR_CAMPO"
                      ></v-autocomplete>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="4" class="my-0 py-0" v-if="escalaPunitiva != ''">
                    <ValidationProvider name="escala punitiva" rules="required" v-slot="{ errors }">
                      <v-autocomplete
                        placeholder="Escala punitiva"
                        label="Escala punitiva"
                        :error-messages="errors"
                        dense
                        outlined
                        v-model="dadosFormulario.preenchimento.escala_punitiva"
                        :items="escalaPunitiva"
                        item-text="VALOR_CAMPO"
                      ></v-autocomplete>
                    </ValidationProvider>
                  </v-col>
                  <v-col style="margin-top: -21px" cols="4">
                    <DatePicker
                      label="Data da ação"
                      v-model="dadosFormulario.preenchimento.data_acao"
                      :dateMaxProps="true"
                    />
                  </v-col>
                  <v-col cols="4" class="my-0 py-0">
                    <ValidationProvider
                      name="protoco|chamado|id medida"
                      rules="required|min:8|numeric"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        placeholder="Protocolo | Chamado | ID Medida"
                        label="Protocolo | Chamado | ID Medida"
                        :error-messages="errors"
                        dense
                        outlined
                        v-model="dadosFormulario.preenchimento.identificacao_medida"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="4" class="my-0 py-0 mt-n2">
                    <DatePicker
                      label="Data da ação protocolo|chamado|ID medida"
                      v-model="dadosFormulario.preenchimento.data_identificacao_medida"
                      :dateMaxProps="true"
                    />
                  </v-col>
                  <v-col cols="12" class="my-0 py-0">
                    <ValidationProvider name="observação" rules="max:500" v-slot="{ errors }">
                      <v-textarea
                        label="Observação"
                        placeholder="Observação"
                        outlined
                        dense
                        counter="500"
                        :error-messages="errors"
                        rows="2"
                        v-model="dadosFormulario.preenchimento.observacao"
                      ></v-textarea>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="12" class="my-0 py-0">
                    <ValidationProvider name="evidência" rules="required" v-slot="{ errors }">
                      <v-file-input
                        label="Anexar Evidência"
                        placeholder="Anexar Evidência"
                        outlined
                        dense
                        :error-messages="errors"
                        ref="file-input"
                        @change="inputFile"
                        v-model="dadosFormulario.evidencia"
                      ></v-file-input>
                    </ValidationProvider>
                  </v-col>
                </v-row>
              </FieldSet>
            </v-col>
          </v-row>
          <v-btn type="submit" :disabled="invalid" color="success" class="mr-2">Salvar</v-btn>
          <v-btn @click="clearFormulario" color="warning">Limpar</v-btn>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import { loadFormOptions, loadFormOptionsParent } from '@/utils/formOptions'
  import { UtilitariosService } from '@/data/services/tabuladores'

  import FileService from '@/data/services/file/fileService'

  import FieldSet from '@/shared/components/Fieldset/Fieldset.vue'
  import DatePicker from '@/shared/components/DatePicker/DatePicker.vue'

  import config from '@/core/config'
  import alerts from '@/mixins/alerts.mixins'

  import { EventBus } from '@/eventBus'

  // const md5 = require('md5.js')
  // import md5 from 'md5.js'
  export default {
    components: { ValidationObserver, ValidationProvider, FieldSet, DatePicker },
    data: () => ({
      tabulador: 'ACAO JORNADA PLENA',
      dadosFormulario: {
        hashAttc: null,
        almopeConsulta: null,
        evidencia: null,
        camposView: {
          nome_operador: null,
          cpf: null,
          campanha: null,
          superior1: null,
          superior2: null,
          superior3: null
        },
        preenchimento: {
          data_apuracao: null,
          data_acao: null,
          data_identificacao_medida: null,
          tempo_logado: null,
          motivo: null,
          oque_foi_feito: null,
          regulamento_dosimetrico: null,
          escala_punitiva: null,
          identificacao_medida: null,
          observacao: null
        }
      },
      motivos: [],
      escalaPunitiva: [],
      regulamentoDosimétrico: [],
      oqueFoiFeito: []
    }),
    mixins: [alerts],
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async submit() {
        try {
          await this.uploadArquivo(this.dadosFormulario.evidencia)
          this.dadosFormulario.preenchimento.almope_operador = this.dadosFormulario.almopeConsulta
          this.dadosFormulario.preenchimento.tempo_logado =
            this.dadosFormulario.preenchimento.tempo_logado.replaceAll(':', '§**§')
          const data = {
            ...this.dadosFormulario.preenchimento,
            ...this.dadosFormulario.camposView,
            almope: this.dadosFormulario.almope,
            evidencia: this.dadosFormulario.hashAttc
          }

          let formTabulacao = {
            idForm: '16326992-BF5F-4B1E-BD20-67D16131118F',
            analiseCaso: [{ ...data }],
            usuario: this.usuario.almope
          }

          await UtilitariosService.processarTabulacao(formTabulacao)
          EventBus.$emit('snackbar', { text: 'Cadastro realizado com sucesso', color: 'success' })

          this.clearFormulario()
        } catch (error) {
          console.error(error)
          EventBus.$emit('snackbar', {
            text: 'Não foi possivel concluir o cadastro. Tente novamente',
            color: 'error'
          })
        }
      },
      async uploadArquivo(file) {
        const fileExtension = file.name.split('.').pop()
        const newFileId = `${this.dadosFormulario.almopeConsulta}_${new Date().getTime()}`

        const hashAttc = null //new md5().update(newFileId).digest('hex')
        this.dadosFormulario.hashAttc = `${hashAttc}.${fileExtension}`

        const renamedFile = new File([file], `${hashAttc}.${fileExtension}`, { type: file.type })

        this.extension = fileExtension

        await FileService.upload('acao_jornada_plena', renamedFile)
      },
      async inputFile(file) {
        this.dadosFormulario.evidencia = file
      },
      async loadFormOptions() {
        await loadFormOptions(this.tabulador, 'MOTIVO', 'motivos', this)
        await loadFormOptions(this.tabulador, 'O QUE FOI FEITO', 'oqueFoiFeito', this)
      },
      async loadFormOptionsParent(value) {
        await loadFormOptionsParent(
          this.tabulador,
          'REGULAMENTO DOSIMETRICO',
          'O QUE FOI FEITO',
          value,
          'regulamentoDosimétrico',
          this
        )
        await loadFormOptionsParent(
          this.tabulador,
          'ESCALA PUNITIVA',
          'O QUE FOI FEITO',
          value,
          'escalaPunitiva',
          this
        )
      },
      clearFormulario() {
        this.dadosFormulario.almopeConsulta = null
        let newFormCamposView = Object.assign({}, this.dadosFormulario.camposView)
        let newFormPreenchimento = Object.assign({}, this.dadosFormulario.preenchimento)

        Object.keys(newFormCamposView).forEach(item => {
          newFormCamposView[item] = null
        })

        Object.keys(newFormPreenchimento).forEach(item => {
          if (
            item === 'data_apuracao' ||
            item === 'data_acao' ||
            item === 'data_identificacao_medida'
          )
            return
          newFormPreenchimento[item] = null
        })

        this.dadosFormulario.camposView = newFormCamposView
        this.dadosFormulario.preenchimento = newFormPreenchimento
        this.$refs.observer.reset()
      },

      async getDadosColaborador() {
        try {
          let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/dados_cadastrais/${this.dadosFormulario.almopeConsulta}`
          const res = await this.$api.get(urlData)
          const dados = res.data[0]

          const camposMapeados = {
            nome_operador: dados.nome,
            cpf: dados.cpf.padStart(11, '0').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
            campanha: dados.regional,
            superior1: dados.superior1,
            superior2: dados.superior2,
            superior3: dados.superior3
          }

          Object.assign(this.dadosFormulario.camposView, camposMapeados)
        } catch (e) {
          return e
        }
      }
    },
    created() {
      this.loadFormOptions()
    }
  }
</script>
, DatePicker
<style scoped>
  fieldset {
    padding: 15px;
    border: 1px solid #3333;
    margin-bottom: 15px;
    border-radius: 8px;
  }

  legend {
    padding: 0 10px;
    font-size: 18.5px;
  }
</style>
