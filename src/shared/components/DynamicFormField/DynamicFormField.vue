<template>
  <div>
    <UiTextField
      v-if="inputTypes.includes(type)"
      :type="type"
      :label="label"
      :value="value"
      :placeholder="placeholder"
      :max="numericMax"
      :prependIcon="prependIcon"
      :prependText="prependText"
      :min="numericMin"
      @input="handleValue"
    ></UiTextField>
    <UiSelect
      v-if="selectTypes.includes(type)"
      :label="label"
      :items="value"
      :required="required"
      :textKey="textKey"
      :textValue="textValue"
      @change="handleValue"
    ></UiSelect>
    <UiTextarea v-if="type === 'textarea'" :label="label" :value="value || ''" @input="handleValue" />
  </div>
</template>
<script>
  import UiTextField from '../TextField/TextField.vue'
  import UiSelect from '../Select'
  import UiTextarea from '../TextArea'
  import { AcceptedTypes as inputTypes } from '../TextField/const'
  import { AcceptedTypes as selectTypes } from '../Select/const'
  export default {
    name: 'DynamicFormField',
    components: {
      UiTextField,
      UiSelect,
      UiTextarea
    },
    props: {
      id: {
        type: Number,
        required: false
      },
      type: {
        type: String,
        required: true
      },
      placeholder: {
        type: String,
        required: false,
        default: ''
      },
      required: {
        type: Boolean,
        required: false,
        default: false
      },
      label: {
        type: String,
        required: false,
        default: ''
      },
      default: {
        type: String,
        required: false,
        default: ''
      },
      textKey: {
        type: String,
        required: false,
        default: 'label'
      },
      textValue: {
        type: String,
        required: false,
        default: 'value'
      },
      value: {
        type: [Array, String],
        required: false
      },
      max: {
        type: [Number, String],
        required: false
      },
      min: {
        type: [Number, String],
        required: false
      },
      prependIcon: {
        type: String,
        required: false
      },
      prependText: {
        type: String,
        required: false
      }
    },
    data() {
      return {
        selectTypes: selectTypes,
        inputTypes: inputTypes
      }
    },
    computed: {
      numericMin() {
        return this.min ? Number(this.min) : null
      },
      numericMax() {
        return this.max ? Number(this.max) : null
      }
    },
    methods: {
      handleValue(event) {
        this.$emit('update', event)
      }
    }
  }
</script>
