<template>
  <div>
    <card-app-bar
      customClass="rounded-xl mb-8"
      :minHeight="135"
      style="margin-top: 10px"
      styleCustom="display: flex; height: 135px; padding: 25px; align-items:center; color: #fafafa;"
    >
      <template v-slot:title>
        <h3>
          <v-icon color="white" x-large class="mr-3">fa-solid fa-book</v-icon>
          PyForms
        </h3>
      </template>
    </card-app-bar>

    <v-form ref="form" v-model="valid">
      <div class="mb-8">
        <!-- Configuração do Form -->

        <div class="d-flex justify-space-between">
          <v-text-field label="Título do Formulário" v-model="formData.formName"></v-text-field>

          <v-switch
            v-model="hasPreview"
            inset
            label="Prévia"
            class="ml-8"
            @change="$emit('update:hasPreview', hasPreview)"
          />
        </div>

        <v-text-field
          label="Descrição do Formulário e sua finalidade"
          v-model="formData.formDescription"
        ></v-text-field>

        <v-select
          v-model="rolePermissionSchema"
          :items="Object.keys(ROLE_PERMISSION)"
          label="Seleciona a regra de permissão"
          @change="rolePermissionSchema = $event"
        />

        <v-textarea
          v-if="rolePermissionSchema === ROLE_PERMISSION.ALMOPE"
          placeholder="Cole uma lista com os almopes aqui..."
          label="Cole uma lista com os almopes aqui..."
          required
          rows="1"
          v-model="formData.almopeList"
        ></v-textarea>

        <v-autocomplete
          v-if="rolePermissionSchema === ROLE_PERMISSION.REGIONAL"
          label="Selecione pra quais regionais o formulário ficará disponível"
          placeholder="Selecione pra quais regionais o formulário ficará disponível"
          hide-no-data
          :items="regionais"
          item-text="CAMPANHA"
          item-value="CAMPANHA"
          v-model="formData.selectedRegions"
          multiple
        >
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index === 0" small>{{ item.CAMPANHA }}</v-chip>

            <span v-if="index === 1" class="grey--text text-caption">
              (+{{ formData.selectedRegions.length - 1 }} outros)
            </span>
          </template>
        </v-autocomplete>
      </div>

      <Section class="my-8" v-show="!formData.id">
        <custom-button-root plain depressed @click="addForm" :disabled="isFormInvalid">
          <custom-button-with-text text="Continuar" />

          <custom-button-with-icon class="mx-2" icon="fa-solid fa-arrow-down" />
        </custom-button-root>
      </Section>

      <template v-if="formData.id">
        <div v-for="(block, blockIndex) in formData.blocks" :key="block.id">
          <div class="my-8">
            <div class="d-flex justify-space-between">
              <v-text-field
                label="Título da seção"
                v-model="formData.blocks[blockIndex].title"
                class="flex-grow-1 flex-shrink-0 mr-2"
              />

              <v-select
                :items="Array.from({ length: formData.blocks.length }, (_, i) => i + 1)"
                label="Ordem"
                class="flex-grow-0 flex-shrink-1"
                v-model="block.order"
              ></v-select>
            </div>

            <Section class="my-8">
              <template v-slot:action-top>
                <div class="d-flex justify-center">
                  <custom-button-root
                    plain
                    color="black"
                    @click="dialogDeleteBlock(blockIndex)"
                    class="border-dashed bg-white"
                    depressed
                    outlined
                  >
                    <custom-button-with-text text="Remover Seção" class="text-danger" />

                    <custom-button-with-icon class="mx-2" icon="fa-solid fa-trash" color="red" />
                  </custom-button-root>
                </div>
              </template>

              <div v-for="(field, fieldIndex) in block.questions" :key="field.id">
                <v-card class="pa-4 mb-4">
                  <dynamic-card-header
                    :field="field"
                    :types="types"
                    :allFields="formData.blocks[blockIndex].questions"
                    :orderList="Array.from({ length: block.questions.length }, (_, i) => i + 1)"
                    @update:fieldOrder="handleChangeFieldOrder(blockIndex, $event)"
                    @update:field="field = $event"
                    @update:type="updateType(delete field.value, (field.type = $event))"
                  />

                  <dynamic-card-body
                    v-if="field.type"
                    :field="field"
                    :availableFields="formData.blocks[blockIndex].questions"
                    @update:value="updateFieldValue(blockIndex, fieldIndex, $event)"
                    @update:hasDependentField="updateFieldDependent(blockIndex, fieldIndex, $event)"
                    @update:parentField="updateFieldParent(blockIndex, fieldIndex, $event)"
                    @update:parentOption="updateFieldParentOption(blockIndex, fieldIndex, $event)"
                  />

                  <dynamic-card-footer
                    v-model:isRequired="field.required"
                    @duplicate="duplicateField(blockIndex, fieldIndex)"
                    @delete="dialogDeleteField(blockIndex, fieldIndex)"
                    @update:isRequired="
                      formData.blocks[blockIndex].questions[fieldIndex].required = $event
                    "
                  />
                </v-card>
              </div>

              <Section class="my-8">
                <custom-button-root plain depressed @click="addField(blockIndex)">
                  <custom-button-with-text text="Adicionar" />

                  <custom-button-with-icon class="mx-2" icon="fa-solid fa-plus" />
                </custom-button-root>
              </Section>
            </Section>
          </div>

          <v-container class="d-flex justify-center">
            <custom-button-root plain depressed @click="addSection()">
              <custom-button-with-text text="Adicionar Seção" />

              <custom-button-with-icon class="mx-2" icon="fa-solid fa-plus" />
            </custom-button-root>
          </v-container>
        </div>
      </template>

      <custom-button-root plain depressed :loading="loading" @click="submit()">
        <custom-button-with-text text="Salvar" />

        <custom-button-with-icon class="mx-2" icon="fa-solid fa-arrow-up" />
      </custom-button-root>
    </v-form>

    <ConfirmModal
      :dialog="confirmDeleteBlockModal"
      :title="`CONFIRMAR AÇÃO?`"
      :text="`DELETAR esta seção irá deletar também TODOS OS CAMPOS desta seção`"
      confirmModal
      @update:dialog="confirmDeleteBlockModal = false"
      @action="deleteBlock(currentBlock)"
    />

    <ConfirmModal
      :dialog="confirmDeleteFieldModal"
      :title="`CONFIRMAR AÇÃO?`"
      :text="`você está prestes a DELETAR este campo, deseja continuar?`"
      confirmModal
      @update:dialog="confirmDeleteFieldModal = false"
      @action="deleteField(currentBlock, currentField)"
    />
  </div>
</template>

<script>
  import cardAppBar from '../../../shared/components/cards/modern/cardAppBar.vue'
  import Section from '../../../shared/components/Section/Section.vue'
  import ConfirmModal from '../../../shared/components/ConfirmModal/ConfirmModal.vue'
  import { ROLE_PERMISSION } from '../../../enums/RolePermission'
  import { CustomButton } from '../../../shared/components/Button'
  import { DynamicCard } from '../../../shared/components/DynamicCard/index'
  import { acceptedTypes } from './acceptedTypes'
  import {
    FormGeneratorBlocksService,
    FormGeneratorQuestionService
    // FormGeneratorSelectOptionsService,
  } from '../../../data/services/formGenerator'

  export default {
    name: 'PyxFormsContent',
    inject: ['generateUUID'],
    components: {
      cardAppBar,
      Section,
      CustomButtonRoot: CustomButton.Root,
      CustomButtonWithText: CustomButton.WithText,
      CustomButtonWithIcon: CustomButton.WithIcon,
      DynamicCardHeader: DynamicCard.Header,
      DynamicCardFooter: DynamicCard.Footer,
      DynamicCardBody: DynamicCard.Body,
      ConfirmModal
    },
    props: {
      formData: {
        type: Object,
        required: true
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        confirmDeleteBlockModal: false,
        confirmDeleteFieldModal: false,
        currentBlock: null,
        currentField: null,
        valid: false,
        types: acceptedTypes,
        rolePermissionSchema: '',
        ROLE_PERMISSION: ROLE_PERMISSION,
        hasPreview: true,
        isEdit: this.$route.query.isEdit
      }
    },
    computed: {
      regionais() {
        return this.$store.getters.regionais
      },
      isFormInvalid() {
        return (
          !this.formData.formName ||
          !this.formData.formDescription ||
          (!this.formData.selectedRegions && !this.formData.almopeList)
        )
      },
      user() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      updateType(field, value) {
        delete field.value
        field.type = value
      },
      /**
       * Submete o formulário.
       */
      submit() {
        this.$emit('submit')
      },
      /**
       * Adiciona um novo formulário.
       */
      addForm() {
        this.formData.id = this.generateUUID()
        this.addSection()
      },
      /**
       * Adiciona um novo campo ao formulário.
       * @param blockId string ID do bloco.
       */
      addField(blockId) {
        this.formData.blocks[blockId].questions.push({
          id: this.generateUUID(),
          question: '',
          type: '',
          placeholder: '',
          order: this.formData.blocks[blockId].questions.length + 1,
          columns: null,
          required: false
        })
      },
      /**
       * Adiciona uma nova seção ao formulário.
       */
      addSection() {
        this.formData.blocks.push({
          id: this.generateUUID(),
          title: 'Titulo da seção',
          order: this.formData.blocks.length + 1,
          questions: []
        })
      },
      /**
       * Remove uma seção do formulário.
       */
      async deleteBlock(blockIndex) {
        if (this.isEdit)
          await FormGeneratorBlocksService.delete(
            this.formData.blocks[blockIndex].id,
            this.user.almope
          )
        this.formData.blocks.splice(blockIndex, 1)
        this.confirmDeleteBlockModal = false
      },
      updateFieldValue(blockIndex, fieldIndex, value) {
        this.$set(this.formData.blocks[blockIndex].questions[fieldIndex], 'value', value)
      },
      updateFieldDependent(blockIndex, fieldIndex, hasDependentField) {
        this.$set(
          this.formData.blocks[blockIndex].questions[fieldIndex],
          'hasDependentField',
          hasDependentField
        )
      },
      updateFieldParent(blockIndex, fieldIndex, parentField) {
        this.$set(
          this.formData.blocks[blockIndex].questions[fieldIndex],
          'parentField',
          parentField
        )
      },
      /**
       * Atualiza a opção pai de um campo.
       * @param {number} blockIndex - Índice do bloco.
       * @param {number} fieldIndex - Índice do campo.
       * @param {string} parentOption - Opção pai a ser atualizada.
       */
      updateFieldParentOption(blockIndex, fieldIndex, parentOption) {
        this.$set(
          this.formData.blocks[blockIndex].questions[fieldIndex],
          'parentOption',
          parentOption
        )
      },
      /**
       * Duplica um campo do formulário.
       * @param {string} blockId - ID da seção.
       * @param {number} index - Índice do campo.
       */
      duplicateField(blockId, index) {
        const card = this.formData.blocks[blockId].questions[index]
        this.formData.blocks[blockId].questions.push({
          ...card,
          id: this.generateUUID()
        })
      },
      /**
       * Deleta um campo do formulário.
       * @param {number} blockIndex - Índice do bloco.
       * @param {number} index - Índice do campo.
       */
      async deleteField(blockIndex, index) {
        const questions = this.formData.blocks[blockIndex].questions
        if (this.isEdit)
          await FormGeneratorQuestionService.delete(questions[index].id, this.user.almope)
        questions.splice(index, 1)
        this.confirmDeleteFieldModal = false
      },
      /**
       * Altera a ordem de um campo.
       * @param {number} blockIndex - Índice do bloco.
       * @param {Object} field - Campo a ser ordenado.
       * @param {string} field.id - ID do campo.
       * @param {number} field.order - Nova ordem do campo.
       */
      handleChangeFieldOrder(blockIndex, field) {
        const questions = this.formData.blocks[blockIndex].questions
        const fieldIndex = questions.findIndex(f => f.id === field.id)

        if (fieldIndex !== -1) {
          this.$set(this.formData.blocks[blockIndex].questions[fieldIndex], 'order', field.order)
        }
      },
      /**
       * Carrega as regionais.
       * @returns {Promise} - Promessa que resolve quando as regionais são carregadas.
       */
      loadRegionais() {
        return this.$store.dispatch('loadRegionais')
      },
      /**
       * Exibe o modal de confirmação de exclusão de bloco.
       * @param {number} blockIndex - Índice do bloco.
       */
      dialogDeleteBlock(blockIndex) {
        this.currentBlock = blockIndex
        this.confirmDeleteBlockModal = true
      },
      /**
       * Exibe o modal de confirmação de exclusão de bloco.
       * @param {number} blockIndex - Índice do bloco.
       */
      dialogDeleteField(blockIndex, fieldIndex) {
        this.currentBlock = blockIndex
        this.currentField = fieldIndex
        this.confirmDeleteFieldModal = true
      }
    },
    async created() {
      await this.loadRegionais()
      // Verifica tipo de permissão e seta o valor caso haja
      if (this.formData.selectedRegions && this.formData.selectedRegions.length > 0) {
        this.rolePermissionSchema = 'REGIONAL'
        this.formData.selectedRegions = this.formData.selectedRegions.map(region => region.roleId)
      }
      if (this.formData.almopeList && this.formData.almopeList.length > 0) {
        this.rolePermissionSchema = 'ALMOPE'
        this.formData.almopeList = this.formData.almopeList.map(region => region.roleId)
      }
    }
  }
</script>
