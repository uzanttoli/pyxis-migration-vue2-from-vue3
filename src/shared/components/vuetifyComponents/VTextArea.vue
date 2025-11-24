<template>
  <div>
    <!-- <div class="label">
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <label v-on="on" v-bind="attrs">{{ label }}</label>
        </template>
        <span>{{ label }}</span>
      </v-tooltip>
    </div> -->
    <v-textarea
      dense
      outlined
      :label="label"
      @input="updateValue"
      :value="value"
      :auto-grow="autoGrow"
      rows="4"
      :counter="counter"
      :maxlength="maxlength"
      row-height="30"
      :readonly="readonly"
      :error-messages="errorMessages"
      :disabled="disabled"
    ></v-textarea>
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
      autoGrow: {
        type: Boolean,
        default: true
      },
      maxlength: {
        type: Number,
        default: 500
      },
      counter: {
        type: String,
        default: '500'
      },
      readonly: {
        type: Boolean,
        default: false
      },
      disabled: {
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
