<template>
  <div>
    <TextField
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
    ></TextField>
    <Select
      v-if="selectTypes.includes(type)"
      :label="label"
      :items="value"
      :required="required"
      :textKey="textKey"
      :textValue="textValue"
      @change="handleValue"
    ></Select>
    <Textarea v-if="type === 'textarea'" :label="label" :value="value || ''" @input="handleValue" />
  </div>
</template>

<script>
  import TextField from '../TextField/TextField.vue'
  import Select from '../Select'
  import Textarea from '../TextArea'
  import { AcceptedTypes as inputTypes } from '../TextField/const'
  import { AcceptedTypes as selectTypes } from '../Select/const'

  /**
   * Componente DynamicFormField
   *
   * Este componente renderiza dinamicamente diferentes campos de formulário com base na prop `type`.
   *
   * @component
   * @param {number} [id] - O ID do campo do formulário.
   * @param {string} type - O tipo do campo do formulário. Pode ser 'text', 'select' ou 'textarea'.
   * @param {string} [label=""] - O rótulo do campo do formulário.
   * @param {string} [placeholder=""] - Descrição do campo do formulário.
   * @param {boolean} [required=false] - Indica se o campo do formulário é obrigatório.
   * @param {string|Array} [value] - O valor do campo do formulário.
   * @example
   * <DynamicFormField type="text" label="Nome" value="John Doe" />
   */
  export default {
    name: 'DynamicFormField',
    components: {
      TextField,
      Select,
      Textarea
    },
    props: {
      /**
       * O ID do campo do formulário.
       * @type {number}
       */
      id: {
        type: Number,
        required: false
      },
      /**
       * O tipo do campo do formulário. Pode ser 'text', 'select' ou 'textarea'.
       * @type {string}
       * @required
       */
      type: {
        type: String,
        required: true
      },
      /**
       * O texto que ajuda no entendimento do campo do formulário.
       * @type {string}
       * @required
       */
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
      /**
       * O rótulo do campo do formulário.
       * @type {string}
       * @default ""
       */
      label: {
        type: String,
        required: false,
        default: ''
      },
      /**
       * O valor padrão do campo do formulário.
       * @type {String}
       */
      default: {
        type: String,
        required: false,
        default: ''
      },
      /**
       * A chave de texto usada para exibir o rótulo.
       * @type {String}
       */
      textKey: {
        type: String,
        required: false,
        default: 'label'
      },
      /**
       * A chave de texto usada para exibir o valor.
       * @type {String}
       */
      textValue: {
        type: String,
        required: false,
        default: 'value'
      },
      /**
       * O valor do campo do formulário.
       * @type {Array|String}
       */
      value: {
        type: [Array, String],
        required: false
      },
      /**
       * O valor máximo permitido.
       * @type {Number}
       */
      max: {
        type: [Number, String],
        required: false
      },
      /**
       * O valor mínimo permitido.
       * @type {Number|String}
       */
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
