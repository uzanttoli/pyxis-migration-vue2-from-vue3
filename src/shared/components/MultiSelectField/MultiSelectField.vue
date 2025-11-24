<template>
  <v-autocomplete
    v-model="internalValue"
    :disabled="disabled"
    :items="items"
    :loading="loading"
    :no-data-text="noDataText"
    chips
    multiple
    deletable-chips
    :color="color"
    :label="label"
    :item-text="itemText"
    :item-value="itemValue"
    clearable
  >
    <template v-slot:selection="{ item, index }">
      <v-chip v-if="index === 0" small>{{ displayItem(item) }}</v-chip>
      <span v-if="index === 1" class="grey--text text-caption">
        (+{{ internalValue.length - 1 }} outros)
      </span>
    </template>
  </v-autocomplete>
</template>

<script>
  export default {
    name: 'MultiSelectField',
    props: {
      modelValue: { type: Array, default: () => [] },
      disabled: Boolean,
      items: { type: Array, default: () => [] },
      loading: Boolean,
      noDataText: String,
      color: { type: String, default: 'blue-grey lighten-2' },
      label: String,
      itemText: { type: String, default: 'name' },
      itemValue: { type: String, default: 'name' },
      displayKey: { type: String, default: '' }
    },
    computed: {
      internalValue: {
        get() {
          return this.modelValue
        },
        set(val) {
          this.$emit('update:modelValue', val)
        }
      }
    },
    methods: {
      displayItem(item) {
        if (this.displayKey && item && typeof item === 'object') {
          return item[this.displayKey]
        }
        return item
      }
    }
  }
</script>
