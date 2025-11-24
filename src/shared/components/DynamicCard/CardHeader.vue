<template>
  <v-card-title>
    <v-container fluid>
      <v-row dense>
        <v-col cols="6">
          <validation-provider v-slot="{ errors }" name="Digite a pergunta" rules="required">
            <v-text-field
              v-model="field.question"
              label="Digite a pergunta"
              placeholder="Digite a pergunta"
              :error-messages="errors"
              outlined
            ></v-text-field>
          </validation-provider>
        </v-col>
        <v-col cols="6">
          <validation-provider v-slot="{ errors }" name="Selecione o tipo" rules="required">
            <v-select
              :error-messages="errors"
              v-model="localType"
              :items="types"
              label="Selecione o tipo"
              placeholder="Selecione o tipo"
              itemText="label"
              itemValue="value"
              outlined
            ></v-select>
          </validation-provider>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col v-if="!selectAcceptedTypes.includes(localType)" cols="4">
          <validation-provider v-slot="{ errors }" name="descrição" rules="required">
            <v-text-field
              :error-messages="errors"
              v-model="field.placeholder"
              label="Descrição ex: 'Endereço do cliente'"
              placeholder="Descrição"
              outlined
            ></v-text-field>
          </validation-provider>
        </v-col>
        <v-col cols="4">
          <validation-provider v-slot="{ errors }" name="colunas" rules="required">
            <v-select
              :error-messages="errors"
              :items="[
                { text: 'Auto', value: '' },
                { text: 1, value: 1 },
                { text: 2, value: 2 },
                { text: 3, value: 3 },
                { text: 4, value: 4 },
                { text: 6, value: 6 },
                { text: 12, value: 12 }
              ]"
              label="Colunas"
              placeholder="Selecione o número de colunas"
              outlined
              v-model="field.columns"
            ></v-select>
          </validation-provider>
        </v-col>
        <v-col cols="4">
          <validation-provider v-slot="{ errors }" name="ordem" rules="required">
            <v-select
              :error-messages="errors"
              :items="orderList"
              label="Ordem"
              placeholder="Selecione a ordem"
              outlined
              v-model="field.order"
            ></v-select>
          </validation-provider>
        </v-col>
      </v-row>
    </v-container>
  </v-card-title>
</template>

<script>
  import { AcceptedTypes } from '../Select/const'
  import { ValidationProvider } from 'vee-validate'
  export default {
    components: { ValidationProvider },
    name: 'CardHeader',
    props: {
      field: {
        type: Object,
        required: true
      },
      types: {
        type: Array,
        required: true
      },
      orderList: {
        type: Array
      },
      allFields: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        selectAcceptedTypes: AcceptedTypes,
        localType: this.field.type,
        previousOrder: null
      }
    },
    methods: {
      handleOrderChange(newOrder) {
        const conflictingField = this.allFields.find(f => f.order === newOrder && f !== this.field)
        if (conflictingField) {
          this.field.order = newOrder
          conflictingField.order = this.previousOrder
          this.$emit('update:fieldOrder', conflictingField)
        }
      }
    },
    watch: {
      'field.order': {
        handler(newOrder, oldOrder) {
          this.previousOrder = oldOrder
          this.handleOrderChange(newOrder)
        },
        immediate: true
      },
      localType(newVal) {
        this.$emit('update:type', newVal)
      }
    }
  }
</script>
