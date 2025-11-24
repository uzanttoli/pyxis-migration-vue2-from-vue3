<template>
  <component
    :is="type"
    :label="label"
    :items="items"
    outlined
    dense
    :error-messages="errorsMessages"
    no-data-text="Sem itens disponíveis"
    v-model="modelValue"
  ></component>
</template>

<script>
  import VTextField from 'vuetify/lib/components/VTextField'
  import VSelect from 'vuetify/lib/components/VSelect'
  export default {
    components: { VTextField, VSelect },
    props: {
      type: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      items: {
        type: Array,
        default: () => [] // Relevante para v-select
      },
      modelValue: {
        type: [String, Number, Array],
        default: null
      },
      errorsMessages: {
        type: Array,
        default: () => []
      }
    },
    emits: ['update:modelValue']
  }
</script>

<style></style>
