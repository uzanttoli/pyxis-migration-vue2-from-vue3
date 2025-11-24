<template>
  <div>
    <div class="label">
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <label v-on="on" v-bind="attrs">{{ label }}</label>
        </template>
        <span>{{ label }}</span>
      </v-tooltip>
    </div>
    <v-autocomplete
      solo
      dense
      class="rounded-bl-xl rounded-r-xl"
      :label="label"
      @input="updateValue"
      :value="value"
      no-data-text="Nada encontrado!"
      :items="items"
      :error-messages="errorMessages"
      :item-text="text"
      :item-value="value2"
      :readonly="readonly"
      :disabled="disabled"
      :multiple="multiple"
      @change="handleChange"
    ></v-autocomplete>
  </div>
</template>

<script>
  export default {
    props: {
      label: {
        type: String
      },
      value: {
        require: true
      },
      items: {
        type: [Array, Object],
        require: true
      },
      readonly: {
        type: Boolean,
        default: false
      },
      text: {
        type: String,
        default: 'text'
      },
      value2: {
        type: String,
        default: 'value'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: false
      },
      errorMessages: {
        type: String,
        default: ''
      }
    },
    methods: {
      updateValue(event) {
        const newValue = event
        this.$emit('input', newValue)
      },
      handleChange(event) {
        this.$emit('change', event)
      }
    }
  }
</script>

<style scoped>
  label {
    font-size: 13px;
    color: gray;
  }

  .label {
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
