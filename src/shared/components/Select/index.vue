<template>
  <v-select
    outlined
    persistent-placeholder
    :itemText="textKey"
    :itemValue="valueKey"
    :items="items"
    :label="label"
    :placeholder="label"
    @change="handleChange"
  />
</template>

<script>
  export default {
    components: {},
    name: 'ui-select',
    props: {
      items: {
        type: Array,
        required: true,
        default: () => [{ label: 'SELECIONE', value: '' }]
      },
      label: {
        type: String,
        required: true
      },
      textKey: {
        type: String,
        default: 'label'
      },
      valueKey: {
        type: String,
        default: 'value'
      },
      required: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    methods: {
      handleChange(event) {
        this.$emit('change', event)
      }
    }
  }
</script>
