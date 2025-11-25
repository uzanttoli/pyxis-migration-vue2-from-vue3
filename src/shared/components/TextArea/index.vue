<template>
  <v-textarea
    auto-grow
    persistent-placeholder
    outlined
    :label="label"
    :value="value"
    block
    :required="required"
    @input="updateValue"
  ></v-textarea>
</template>
<script>
  export default {
    name: 'ui-textarea',
    components: {},
    props: {
      label: {
        type: String,
        required: false,
        default: ''
      },
      value: {
        type: String,
        required: true
      },
      required: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    methods: {
      updateValue(value) {
        this.$emit('input', value)
      }
    }
  }
</script>
