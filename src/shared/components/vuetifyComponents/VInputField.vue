<template>
  <div>
    <!-- <label :for="inputId">{{ label }}</label> -->
    <div class="input">
      <input
        :disabled="disabled"
        type="datetime-local"
        :id="inputId"
        :name="inputId"
        :value="value"
        :min="minDate"
        @input="updateValue($event.target.value)"
      />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      label: {
        type: String,
        default: ''
      },
      value: {
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      inputId() {
        return 'dateTimeInput_' + this._uid
      },
      minDate() {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const hours = String(now.getHours()).padStart(2, '0')
        const minutes = String(now.getMinutes()).padStart(2, '0')

        return `${year}-${month}-${day}T${hours}:${minutes}`
      }
    },
    methods: {
      updateValue(newValue) {
        // Passa o valor diretamente para o método
        this.$emit('input', newValue)
      }
    }
  }
</script>

<style scoped>
  .input {
    padding: 6px;
    /* border-bottom-left-radius: 30px; */
    /* border-bottom-right-radius: 30px; */
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.447);
    margin-bottom: 26px;
    /* box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12); */
  }

  input {
    font-size: 16px;
    text-indent: 10px;
    width: 90%;
    border: none;
    outline: none;
    color: gray;
    font-family: Arial, sans-serif;
    font-size: 16px;
    caret-color: auto;
    cursor: pointer;
  }

  input::placeholder {
    font-size: 20px;
  }

  label {
    font-size: 13px;
    color: gray;
    line-height: 20px;
    letter-spacing: normal;
  }
</style>
