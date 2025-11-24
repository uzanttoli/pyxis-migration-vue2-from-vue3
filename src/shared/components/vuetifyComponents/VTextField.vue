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
    <div style="display: flex; position: relative">
      <v-text-field
        v-if="isMasks"
        dense
        :class="className"
        :label="label"
        @input="updateValue"
        outlined
        @change="updateChange"
        @keyup.enter="keyEnterChange"
        :value="value"
        :error-messages="errorMessages"
        :readonly="readonly"
        :placeholder="placeholder"
        :disabled="disabled"
        v-mask="mascara()"
        :rules="rules"
      ></v-text-field>
      <v-text-field
        v-else
        dense
        :class="className"
        :label="label"
        outlined
        @input="updateValue"
        @change="updateChange"
        :error-messages="errorMessages"
        @keyup.enter="keyEnterChange"
        :value="value"
        :readonly="readonly"
        :placeholder="placeholder"
        :disabled="disabled"
        :rules="rules"
      ></v-text-field>
      <v-progress-circular
        v-if="false"
        indeterminate
        color="primary"
        style="position: absolute; right: 1px"
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
  import masks from '../../masks/masks'
  export default {
    props: {
      label: {
        type: String
      },
      value: {
        require: true
      },
      readonly: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      className: {
        type: String,
        default: ''
      },
      propsMasks: {
        type: [String, Array],
        default: ''
      },
      isMasks: {
        type: Boolean,
        default: false
      },
      isLoading: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      errorMessages: {
        type: String,
        default: ''
      },
      rules: {
        type: Array
      }
    },
    computed: {
      masks() {
        return masks
      }
    },
    methods: {
      mascara() {
        if (this.propsMasks == '') {
          return
        } else {
          if (Array.isArray(this.propsMasks) == true) {
            return this.propsMasks.map(maskIndex => masks[maskIndex])
          } else {
            return masks[this.propsMasks]
          }
        }
      },
      updateValue(event) {
        const newValue = event
        this.$emit('input', newValue)
      },
      updateChange(event) {
        const newValue = event
        this.$emit('change', newValue)
      },
      keyEnterChange(event) {
        const newValue = event
        this.$emit('keyEnterChange', newValue)
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
