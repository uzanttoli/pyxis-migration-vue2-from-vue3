<template>
  <v-container fluid>
    <v-row v-if="!isLoading && formData">
      <v-col :cols="hasPreview ? '6' : '12'" class="pa-8">
        <PyxFormsContent
          :formData="formData"
          :loading="isLoading"
          @update:value="checkboxOptions = $event"
          @submit="handleSubmit"
          @update:hasPreview="hasPreview = $event"
        />
      </v-col>

      <v-col cols="6" class="pa-8" v-if="hasPreview">
        <PyxFormsPreview :formData="formData" :checkboxOptions="checkboxOptions" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import PyxFormsContent from './pyxforms/PyxFormsContent.vue'
  import PyxFormsPreview from './pyxforms/PyxFormsPreview.vue'
  import { ROLE_PERMISSION } from '../../enums/RolePermission'

  import {
    FormGeneratorSchemaService,
    FormGeneratorBlocksService,
    FormGeneratorQuestionService,
    FormGeneratorSelectOptionsService,
    FormGeneratorPermissionsService
  } from '../../data/services/formGenerator'
  import generateUUID from '../../utils/UUID.js'
  import { useDevPre } from '../../utils/useDevPre.js'
  import alerts from '../../mixins/alerts.mixins'
  import { AcceptedTypes } from '../../shared/components/Select/const'
  import { reverseMapAndConvertKeys } from '../../utils/mapAndConvertKeys'
  import Vue from 'vue'

  // TODO Verifica multiplos envios ao salvar respostas
  // TODO Incluir calendário para campos de data e hora [datetime-local]

  export default {
    components: {
      PyxFormsContent,
      PyxFormsPreview
    },
    provide() {
      return {
        generateUUID
      }
    },
    mixins: [alerts],
    data() {
      return {
        hasPreview: true,
        formData: Vue.observable({
          id: '',
          formName: '',
          formDescription: '',
          selectedRegions: null,
          almopeList: null,
          blocks: []
        }),
        isLoading: false,
        checkboxOptions: '',
        selectAcceptedTypes: AcceptedTypes,
        isEdit: false
      }
    },
    async created() {
      try {
        this.isLoading = true
        // Se for Edição segue o fluxo
        this.isEdit = this.$route.query.isEdit
        if (!this.isEdit) return

        // Carrega o Schema em caso de Edição.
        const schemaResponse = await FormGeneratorSchemaService.getById(this.$route.query.id)
        const schema = reverseMapAndConvertKeys(schemaResponse, FormGeneratorSchemaService.modelMap)
        this.$set(this, 'formData', schema)

        // Carrega as permissões
        const permissionsResponse = await FormGeneratorPermissionsService.getAll(
          this.$route.query.id
        )
        const permissions = permissionsResponse.map(permission =>
          reverseMapAndConvertKeys(permission, FormGeneratorPermissionsService.modelMap)
        )
        if (permissionsResponse[0].ROLE_TYPE === 'REGIONAL')
          this.$set(this.formData, 'selectedRegions', permissions)
        if (permissionsResponse[0].ROLE_TYPE === 'ALMOPE')
          this.$set(this.formData, 'almopeList', permissions)

        // Carrega os Blocos
        const blocksResponse = await FormGeneratorBlocksService.getAll(schema.id)
        const blocks = blocksResponse.map(block =>
          reverseMapAndConvertKeys(block, FormGeneratorBlocksService.modelMap)
        )
        this.$set(this.formData, 'blocks', blocks)

        // Carrega as Questões
        for (const block of this.formData.blocks) {
          const questionsResponse = await FormGeneratorQuestionService.getAll(block.id)
          const questions = questionsResponse.map(question =>
            reverseMapAndConvertKeys(question, FormGeneratorQuestionService.modelMapResponse)
          )
          this.$set(block, 'questions', questions)

          // Carrega as Options
          for (const question of block.questions) {
            if (!this.selectAcceptedTypes.includes(question.type)) continue
            const optionsResponse = await FormGeneratorSelectOptionsService.getAll(question.id)
            const options = optionsResponse.map(option =>
              reverseMapAndConvertKeys(option, FormGeneratorSelectOptionsService.modelMap)
            )
            this.$set(question, 'value', options)
          }
        }
      } catch (error) {
        console.error('#### Error', error)
      } finally {
        this.isLoading = false
      }
    },
    computed: {
      devPre() {
        return useDevPre(this.formData)
      }
    },
    methods: {
      async handleSubmit() {
        this.isEdit ? this.updateForm() : this.submitForm()
      },
      async submitForm() {
        try {
          this.isLoading = true
          // TODO HIGH Tentar Otimizar enviando todo o objeto formData para o back e fazendo as inserções lá
          // CRIA O SCHEMA
          const formResponse = await FormGeneratorSchemaService.insert(this.formData)

          // Cria as permissões por regional
          if (this.formData.selectedRegions && this.formData.selectedRegions.length > 0) {
            const permissionPayload = {
              formId: this.formData.id,
              roleId: this.formData.selectedRegions,
              roleType: ROLE_PERMISSION.REGIONAL
            }
            await FormGeneratorPermissionsService.insert(permissionPayload)
          }

          // Cria as permissões por ALMOPE
          if (this.formData.almopeList && this.formData.almopeList.length > 0) {
            const permissionPayload = {
              formId: this.formData.id,
              roleId: this.formData.almopeList.split('\n').filter(line => line.trim() !== ''),
              roleType: ROLE_PERMISSION.ALMOPE
            }
            await FormGeneratorPermissionsService.insert(permissionPayload)
          }

          // CRIA O(S) BLOCO(S)
          formResponse.status == 200 &&
            this.formData.blocks.forEach(async block => {
              const blockResponse = await FormGeneratorBlocksService.insert({
                ...block,
                formId: this.formData.id
              })

              // CRIA O(S) CAMPO(S)
              !!blockResponse &&
                block.questions.forEach(async field => {
                  const fieldResponse = await FormGeneratorQuestionService.insert({
                    ...field,
                    formId: this.formData.id,
                    blockId: block.id
                  })

                  // ADICIONA OPTIONS SE HOUVER
                  if (!!fieldResponse && field.value && field.value.length > 0) {
                    await FormGeneratorSelectOptionsService.insertArray({
                      value: field.value,
                      parentFieldId: field.id,
                      parentId: field.parentOption
                    })
                  }
                })
            })
          this.toast('Formulário salvo com sucesso', 'top-right', false, 3000, 'success')
          this.$router.push('/pyxis/tabuladores/')
        } catch (error) {
          this.toast(error, 'top-right', false, 3500, 'error')
        } finally {
          this.isLoading = false
        }
      },
      async updateForm() {
        try {
          this.isLoading = true
          // ATUALIZA O SCHEMA
          const formResponse = await FormGeneratorSchemaService.update(
            this.formData.id,
            this.formData
          )

          // ATUALIZA AS PERMISSÕES POR REGIONAL
          if (this.formData.selectedRegions && this.formData.selectedRegions.length > 0) {
            const permissionPayload = {
              formId: this.formData.id,
              roleId: this.formData.selectedRegions,
              roleType: ROLE_PERMISSION.REGIONAL
            }
            await FormGeneratorPermissionsService.update(this.formData.id, permissionPayload)
          }

          // ATUALIZA AS PERMISSÕES POR ALMOPE
          if (this.formData.almopeList && this.formData.almopeList.length > 0) {
            const permissionPayload = {
              formId: this.formData.id,
              roleId: this.formData.almopeList.split('\n').filter(line => line.trim() !== ''),
              roleType: ROLE_PERMISSION.ALMOPE
            }
            await FormGeneratorPermissionsService.update(this.formData.id, permissionPayload)
          }

          // ATUALIZA O(S) BLOCO(S)
          !!formResponse &&
            this.formData.blocks.forEach(async block => {
              const blockResponse = await FormGeneratorBlocksService.update(block.id, {
                ...block,
                formId: this.formData.id
              })

              //ATUALIZA O(S) CAMPO(S)
              !!blockResponse &&
                block.questions.forEach(async field => {
                  const fieldResponse = await FormGeneratorQuestionService.update(field.id, {
                    ...field,
                    formId: this.formData.id,
                    blockId: block.id
                  })

                  // ATUALIZA OPTIONS SE HOUVER
                  if (!!fieldResponse && field.value && field.value.length > 0) {
                    fieldResponse &&
                      (await FormGeneratorSelectOptionsService.update(field.id, field.value))
                  }
                })
            })
          this.toast('Formulário atualizado com sucesso', 'top-right', false, 3000, 'success')
          this.$router.go(-1)
        } catch (error) {
          this.toast(error, 'top-right', false, 3500, 'error')
        } finally {
          this.isLoading = false
        }
      },
      generateUUID() {
        generateUUID()
      }
    }
  }
</script>

<style scoped>
  .preview-container {
    position: fixed;
    top: 0;
    right: 0; /* Fixa no lado direito */
    width: 50%; /* Ajuste o tamanho conforme necessário */
    height: 100vh; /* Ocupa a altura total da janela */
    overflow-y: auto; /* Adiciona rolagem interna, se necessário */
    background-color: #fff; /* Opcional: adicione um fundo */
    z-index: 10; /* Mantém o preview acima de outros elementos, se necessário */
  }

  .content-container {
    width: 50%; /* Ajuste para o espaço restante ao lado do preview */
    margin-right: 50%; /* Compensa o espaço ocupado pelo preview */
  }
</style>
