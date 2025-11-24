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
    <v-select
      solo
      dense
      class="rounded-bl-xl rounded-r-xl"
      :label="label"
      @input="updateValue"
      :value="value"
      no-data-text="Itens não encontrados"
      :items="items"
      :disabled="disabled"
      :error-messages="errorMessages"
      item-text="text"
      item-value="value"
    ></v-select>
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
      errorMessages: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      updateValue(event) {
        const newValue = event
        this.$emit('input', newValue)
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
