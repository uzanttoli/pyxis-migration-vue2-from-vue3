<template>
  <v-card-text>
    <v-container fluid>
      <v-row>
        <v-col cols="12" v-if="selectAcceptedTypes.includes(field.type)">
          <validation-provider v-slot="{ errors }" name="Opções" rules="required">
            <v-textarea
              :error-messages="errors"
              v-model="value"
              label="Adicione aqui as opções (uma por linha)"
              placeholder="Adicione aqui as opções (uma por linha)"
              outlined
              @input="updateValue"
            />
          </validation-provider>
        </v-col>
        <div v-if="selectAcceptedTypes.includes(field.type) && showAddButton" style="width: 100%">
          <div class="mb-4 text-danger">
            <i class="fa-solid fa-triangle-exclamation red--text"></i>
            Para as opções realmente serem adicionadas/atualizadas é necessário clicar em 'Adicionar
            Opções'
          </div>

          <div>
            <v-icon class="mr-4 opcoes" color="red">fa-solid fa-hand-point-right</v-icon>
            <v-btn outlined color="indigo" @click="addItems">Salvar Opções</v-btn>
          </div>
        </div>
        <v-col cols="12" class="mb-n3">
          <v-switch
            v-if="availableFields.length > 0 && field.id != availableFields[0].id"
            inset
            v-model="hasDependentField"
            label="Este campo terá um campo dependente?"
            @change="updateDependentField"
          />
        </v-col>

        <v-col v-if="hasDependentField" cols="6">
          <validation-provider v-slot="{ errors }" name="Campo relacionado" rules="required">
            <v-select
              :error-messages="errors"
              v-model="parentField"
              outlined
              :items="filteredFields"
              item-text="question"
              item-value="id"
              label="Selecione o campo relacionado"
              placeholder="Selecione o campo relacionado"
              @change="updateParentField"
            />
          </validation-provider>
        </v-col>
        <v-col cols="6" v-if="hasDependentField && selectAcceptedTypes.includes(parentFieldType)">
          <validation-provider v-slot="{ errors }" name="Opção pai" rules="required">
            <v-select
              outlined
              v-model="parentOption"
              :error-messages="errors"
              :items="parentOptions"
              item-text="label"
              item-value="value"
              label="Selecione a opção pai"
              placeholder="Selecione a opção pai"
              @change="updateParentOption"
            />
          </validation-provider>
        </v-col>
      </v-row>
    </v-container>
  </v-card-text>
</template>

<script>
  import { AcceptedTypes } from '../Select/const'
  import { ValidationProvider } from 'vee-validate'
  export default {
    name: 'CardBody',
    components: {
      ValidationProvider
    },
    inject: ['generateUUID'],
    props: {
      field: {
        type: Object,
        required: true
      },
      availableFields: {
        type: Array,
        required: true,
        default: () => []
      }
    },
    created() {
      this.items = this.field.value ? this.field.value : []
      this.value = this.items.map(item => item.label).join('\n')
      this.hasDependentField = this.field.parentField ? true : false
      this.parentField = this.field.parentField
      this.parentOption = this.field.parentOption
    },
    data() {
      return {
        selectAcceptedTypes: AcceptedTypes,
        value: '', // Utilizado para armazenar o texto que irá se tornar as OPTIONS em this.items
        originalValue: '',
        showAddButton: true,
        hasDependentField: false,
        parentField: null,
        parentOption: null,
        items: [] // armazenam as OPTIONS dos SELECTS
      }
    },
    computed: {
      parentFieldType() {
        const parent = this.availableFields.find(field => field.id === this.parentField)
        return parent ? parent.type : null
      },
      parentOptions() {
        const parent = this.availableFields.find(field => field.id === this.parentField)
        return parent && parent.value ? parent.value : []
      },
      filteredFields() {
        return this.availableFields.filter(field => field.id !== this.field.id)
      }
    },
    methods: {
      addItems() {
        if (!this.value) return

        // Extrair as linhas do textarea
        const lines = this.value.split('\n').filter(line => line.trim() !== '')

        // Manter os itens existentes e atualizar com os novos
        const updatedItems = []

        // Processar as linhas do textarea
        lines.forEach(line => {
          // Verificar se o item já existe nos itens existentes
          const existingItem = this.items.find(item => item.label === line)
          if (existingItem) {
            updatedItems.push(existingItem) // Preservar o item existente
          } else {
            // Adicionar um novo item
            updatedItems.push({
              label: line,
              value: this.generateUUID(),
              parentFieldId: this.field.id,
              parentId: this.field.parentOption
            })
          }
        })

        // Atualizar os itens
        this.items = updatedItems

        // Atualizar o valor emitido para o componente pai
        this.updateValue()
        this.showAddButton = false
      },
      updateValue() {
        this.$emit('update:value', this.items)
      },
      removeItem(label) {
        // Remover o item com o label especificado
        this.items = this.items.filter(item => item.label !== label)

        // Atualizar o valor emitido para o componente pai
        this.updateValue()
      },
      updateDependentField() {
        this.$emit('update:hasDependentField', this.hasDependentField)
      },
      updateParentField() {
        this.$emit('update:parentField', this.parentField)
      },
      updateParentOption() {
        this.$emit('update:parentOption', this.parentOption)
      }
    },
    watch: {
      value(newValue) {
        const hasChanged = newValue !== this.originalValue
        if (hasChanged) {
          this.updateValue()
        }
        this.showAddButton = hasChanged
      }
    },
    mounted() {
      this.originalValue = this.value
    }
  }
</script>
<style scoped>
  .opcoes {
    animation: opcoes 1s infinite;
  }
  @keyframes opcoes {
    0% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(8px);
    }
    100% {
      transform: translateX(0px);
    }
  }
</style>
