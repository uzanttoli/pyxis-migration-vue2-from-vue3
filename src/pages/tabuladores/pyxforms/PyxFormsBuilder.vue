<template>
  <v-container>
    <div>
      <CardAppBar
        isButtonReturn
        customClass="rounded-xl mb-8"
        :minHeight="135"
        style="margin-top: 10px"
        styleCustom="display: flex; height: 135px; padding: 25px; align-items:center; color: #fafafa;"
        @update:click="goBack"
      >
        <template v-slot:title>
          <h3>
            <v-icon color="white" x-large class="mr-3">fa-solid fa-book</v-icon>
            [PyxForms] Formulários Dinâmicos
          </h3>
        </template>
      </CardAppBar>

      <div v-if="isLoading">
        <template v-for="i in 5" :key="i">
          <v-skeleton-loader v-bind="attrs" type="article"></v-skeleton-loader>
        </template>
      </div>

      <template v-else>
        <v-form ref="formBuilder" v-model="valid">
          <div v-for="block in schema.blocks" :key="block.ID">
            <fieldset class="my-8 pa-4">
              <legend class="mb-2" style="display: flex; align-items: center">
                <i class="fa-solid fa-circle-nodes mr-1 red--text"></i>
                {{ block.TITLE }}
              </legend>

              <v-container fluid>
                <v-row>
                  <template v-for="field in block.questions">
                    <AlmopeField
                      v-if="field.TIPO === 'dadosAlmope'"
                      :key="field.ID"
                      hasSearch
                      :almope="field.VALUE"
                    />

                    <template v-else>
                      <v-col
                        :key="field.ID"
                        :cols="field.COLUNAS || 4"
                        :sm="field.COLUNAS || 6"
                        :md="field.COLUNAS || 4"
                        :lg="field.COLUNAS || 3"
                        v-if="!field.OPTION_PARENT"
                      >
                        <DynamicFormField
                          v-if="!field.OPTION_PARENT"
                          :type="field.TIPO"
                          :label="field.PERGUNTA"
                          :placeholder="field.DESCRICAO"
                          :value="field.VALUE"
                          textKey="DESCRICAO"
                          textValue="ID"
                          @update="updateFormData(field.ID, $event)"
                        />
                      </v-col>

                      <v-col
                        :key="field.ID"
                        :cols="field.COLUNAS || 4"
                        :sm="field.COLUNAS || 6"
                        :md="field.COLUNAS || 4"
                        :lg="field.COLUNAS || 3"
                        v-if="
                          field.PARENT && isOptionParentSelected(field.PARENT, field.OPTION_PARENT)
                        "
                      >
                        <DynamicFormField
                          :type="field.TIPO"
                          v-model:label="field.PERGUNTA"
                          v-model:placeholder="field.DESCRICAO"
                          :value="field.VALUE"
                          textKey="DESCRICAO"
                          textValue="ID"
                          @update="updateFormData(field.ID, $event)"
                        />
                      </v-col>
                    </template>
                  </template>
                </v-row>
              </v-container>
            </fieldset>
          </div>

          <custom-button-root plain depressed @click="handleSubmit">
            <custom-button-with-text text="Finalizar" />

            <custom-button-with-icon class="mx-2" icon="fa-solid fa-arrow-up" />
          </custom-button-root>
        </v-form>
      </template>
    </div>
  </v-container>
</template>

<script>
  import {
    FormGeneratorSchemaService,
    FormGeneratorBlocksService,
    FormGeneratorQuestionService,
    FormGeneratorSelectOptionsService,
    FormGeneratorAnswerService
  } from '../../../data/services/formGenerator'
  import { AcceptedTypes } from '../../../shared/components/Select/const'
  import AlmopeField from '../../../shared/components/AlmopeField/AlmopeField.vue'
  import cardAppBar from '../../../shared/components/cards/modern/cardAppBar.vue'
  import { CustomButton } from '../../../shared/components/Button'
  import DynamicFormField from '../../../shared/components/DynamicFormField/DynamicFormField.vue'
  import generateUUID from '../../../utils/UUID.js'
  import alerts from '../../../mixins/alerts.mixins'

  export default {
    name: 'PyxFormsBuilder',
    components: {
      DynamicFormField,
      CustomButtonRoot: CustomButton.Root,
      CustomButtonWithText: CustomButton.WithText,
      CustomButtonWithIcon: CustomButton.WithIcon,
      CardAppBar: cardAppBar,
      AlmopeField
    },
    mixins: [alerts],
    data() {
      return {
        optionTypes: AcceptedTypes,
        attrs: {
          class: 'mb-6',
          boilerplate: true,
          elevation: 2
        },
        isLoading: false,
        valid: false,
        schema: {
          blocks: {
            questions: []
          }
        },
        formData: { id: null, answers: {} }
      }
    },
    async created() {
      try {
        this.isLoading = true
        const schema = await FormGeneratorSchemaService.getById(this.$route.query.id)

        this.$set(this.formData, 'formId', schema.ID)
        this.$set(this.formData, 'id', generateUUID())

        const blocks = await FormGeneratorBlocksService.getAll(schema.ID)

        this.schema = schema
        this.$set(this.schema, 'blocks', blocks)

        for (const block of this.schema.blocks) {
          const questions = await FormGeneratorQuestionService.getAll(block.ID)
          this.$set(block, 'questions', questions)

          for (const question of block.questions) {
            if (this.optionTypes.includes(question.TIPO)) {
              const options = await FormGeneratorSelectOptionsService.getAll(question.ID)
              this.$set(question, 'VALUE', options)
            }
          }
        }
      } catch (error) {
        console.error('#### Error', error)
      } finally {
        this.isLoading = false
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      generateUUID() {
        generateUUID()
      },
      updateFormData(fieldId, e) {
        this.$set(this.formData.answers, fieldId, e)
      },
      reset() {
        this.formData = {
          id: generateUUID(),
          formId: this.schema.ID,
          answers: {}
        }
      },
      async handleSubmit() {
        try {
          this.isLoading = true
          const filledData = { id: '', formId: '', answers: [] }
          for (const key in this.formData) {
            if (this.formData[key]) {
              filledData[key] = this.formData[key]
            }
          }
          const answers = Object.entries(filledData.answers).map(([key, value]) => ({
            questionId: key,
            value: value,
            id: this.formData.id,
            formId: this.formData.formId
          }))
          const payload = { answers }
          await FormGeneratorAnswerService.insert(payload)
          this.toast('Dados salvos com sucesso', 'top-right', false, 3000)
          this.reset()
        } catch (error) {
          console.error('#### Error', error)
          this.toast(error, 'top-right', false, 3500, 'error')
        } finally {
          this.$set(this.formData, 'id', generateUUID())
          this.isLoading = false
        }
      },
      isOptionParentSelected(parentId, optionParentId) {
        // Obtém as opções da pergunta pai
        const parentField = this.schema.blocks
          .flatMap(block => block.questions)
          .find(question => question.ID === parentId)

        if (!parentField || !this.formData.answers[parentId]) {
          return false
        }

        // Encontra a opção pelo ID e verifica se o label selecionado corresponde
        const selectedLabel = this.formData.answers[parentId]
        const option = parentField.VALUE.find(opt => opt.ID === optionParentId)
        return option && option.DESCRICAO === selectedLabel
      }
    },
    computed: {
      user() {
        return this.$store.getters.usuario
      }
    }
  }
</script>
