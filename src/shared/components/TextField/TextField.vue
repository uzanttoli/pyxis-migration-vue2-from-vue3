<template>
  <v-text-field
    persistent-placeholder
    v-if="computedMask"
    :type="type"
    :placeholder="computedPlaceholder"
    :label="label"
    :max="max"
    :prepend-inner-icon="prependIcon"
    :prefix="prependText"
    :min="min"
    :value="value"
    :disabled="disabled"
    class="text-center"
    v-mask="computedMask"
    @input="updateValue"
    @blur="handleBlur"
    :outlined="outlined"
  ></v-text-field>
  <v-text-field
    v-else
    persistent-placeholder
    :type="type"
    class="text-center"
    :placeholder="computedPlaceholder"
    :label="label"
    :max="max"
    :prepend-inner-icon="prependIcon"
    :prefix="prependText"
    :min="min"
    :value="value"
    :disabled="disabled"
    @input="updateValue"
    @blur="handleBlur"
    :outlined="outlined"
  ></v-text-field>
</template>

<script>
  // import { mask } from 'vue-the-mask'
  import masks from '../../masks/masks'
  import { AcceptedTypes } from './const'
  export default {
    name: 'TextField',
    directives: {
      // mask
    },
    props: {
      value: {
        type: String || Number,
        required: false
      },
      type: {
        type: String,
        required: true,
        validator: function (value) {
          return AcceptedTypes.includes(value)
        }
      },
      fullWidth: {
        required: false,
        type: Boolean,
        default: true
      },
      placeholder: {
        type: String,
        required: false
      },
      label: {
        type: String,
        required: false
      },
      required: {
        type: Boolean,
        required: false,
        default: false
      },
      outlined: {
        type: Boolean,
        required: false,
        default: true
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      max: {
        type: Number,
        required: false
      },
      min: {
        type: Number,
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
        inputValue: ''
      }
    },
    computed: {
      masks() {
        return masks
      },
      computedMask() {
        return this.masks[this.type] || ''
      },
      computedPlaceholder() {
        if (this.placeholder && this.placeholder.length > 0) {
          return this.placeholder
        }
        const returnMask =
          Array.isArray(masks[this.type]) && masks[this.type].length > 1
            ? masks[this.type].join(' ou ')
            : masks[this.type]
        return returnMask || ''
      }
    },
    methods: {
      handleBlur(event) {
        this.$emit('blur', event)
      },
      updateValue(value) {
        this.$emit('input', value)
      }
    }
  }
</script>
