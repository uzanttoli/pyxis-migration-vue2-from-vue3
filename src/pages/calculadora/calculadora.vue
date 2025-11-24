<template>
  <div class="_container" v-if="calculator">
    <div
      class="calculator-container"
      :style="{
        top: top + 'px',
        left: left + 'px'
      }"
    >
      <div class="window-header" @mousedown="startDrag">
        Calculadora
        <v-btn icon @click="$emit('close:calculadora')">
          <v-icon color="white">fas fa-close</v-icon>
        </v-btn>
      </div>
      <div class="calculator">
        <Display
          :value="displayValue"
          :operationCurrent="operation"
          :valueIndex1="values[0]"
          :valueIndex2="values[1]"
          :operation="operation"
        ></Display>
        <Button label="Limpar" triple clear @onClick="clearMemory"></Button>
        <Button label="/" operation @onClick="setOperation"></Button>
        <Button label="7" @onClick="addDigito"></Button>
        <Button label="8" @onClick="addDigito"></Button>
        <Button label="9" @onClick="addDigito"></Button>
        <Button label="*" operation @onClick="setOperation"></Button>
        <Button label="4" @onClick="addDigito"></Button>
        <Button label="5" @onClick="addDigito"></Button>
        <Button label="6" @onClick="addDigito"></Button>
        <Button label="-" operation @onClick="setOperation"></Button>
        <Button label="1" @onClick="addDigito"></Button>
        <Button label="2" @onClick="addDigito"></Button>
        <Button label="3" @onClick="addDigito"></Button>
        <Button label="+" operation @onClick="setOperation"></Button>
        <Button label="0" double @onClick="addDigito"></Button>
        <Button label="." @onClick="addDigito"></Button>
        <Button label="=" operation @onClick="setOperation"></Button>
      </div>
    </div>
  </div>
</template>

<script>
  import Display from './display.vue'
  import Button from './button.vue'
  export default {
    props: {
      calculator: {
        type: Boolean,
        default: false
      }
    },
    components: { Display, Button },
    data: function () {
      return {
        displayValue: '0',
        clearDisplay: false,
        operation: null,
        values: [0, 0],
        current: 0,
        top: 400,
        left: 400,
        dragging: false,
        startX: 0,
        startY: 0,
        history: []
      }
    },
    mounted() {
      window.addEventListener('keydown', this.keyPress)
    },
    methods: {
      startDrag(e) {
        this.dragging = true
        this.startX = e.clientX - this.left
        this.startY = e.clientY - this.top
        window.addEventListener('mousemove', this.dragWindow)
        window.addEventListener('mouseup', this.stopDrag)
      },
      dragWindow(e) {
        if (this.dragging) {
          this.top = e.clientY - this.startY
          this.left = e.clientX - this.startX
        }
      },
      stopDrag() {
        this.dragging = false
        window.removeEventListener('mousemove', this.dragWindow)
        window.removeEventListener('mouseup', this.stopDrag)
      },
      keyPress(key) {
        let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.']
        let operations = ['/', '-', '+', '*']
        let clearMemory = ['Escape', 'Delete', 'Backspace']

        if (clearMemory.includes(key.key)) {
          this.clearMemory()
        }

        if (operations.includes(key.key)) {
          this.setOperation(key.key)
        }

        if (numbers.includes(key.key)) {
          this.addDigito(key.key)
        }

        if (key.key === 'Enter') {
          this.setOperation('=')
        }
      },
      clearMemory() {
        this.displayValue = '0'
        this.clearDisplay = false
        this.operation = null
        this.values = [0, 0]
        this.current = 0
      },
      setOperation(operation) {
        if (this.current === 0) {
          this.operation = operation
          this.current = 1
          this.clearDisplay = true
        } else {
          const equals = operation === '='
          const currentOperation = this.operation

          if (currentOperation == equals) {
            return
          }

          try {
            const calc = eval(`${this.values[0]} ${currentOperation} ${this.values[1]}`)

            if (this.values[1] != 0) {
              this.history.push({
                value1: this.values[0],
                value2: this.values[1],
                operation: currentOperation,
                calc: eval(`${this.values[0]} ${currentOperation} ${this.values[1]}`)
              })
            }
            this.values[0] = calc
          } catch (e) {
            this.$emit('onError', e)
          }

          this.values[1] = 0
          this.displayValue = this.values[0]

          this.operation = equals ? null : operation
          this.current = equals ? 0 : 1
          this.clearDisplay = !equals
        }
      },
      addDigito(n) {
        if (n === '.' && this.displayValue.includes('.')) {
          return
        }

        const clearDisplay = this.displayValue === '0' || this.clearDisplay
        const currentValue = clearDisplay ? '' : this.displayValue
        const displayValue = currentValue + n

        this.displayValue = displayValue
        this.clearDisplay = false
        this.values[this.current] = displayValue

        if (n !== '.') {
          const i = this.current
          const newValue = parseFloat(displayValue)
          this.values[i] = newValue
        }
      }
    }
  }
</script>

<style scoped>
  .calculator {
    height: 390px;
    width: 310px;
    border-radius: 5px;
    padding: 1px;
    overflow: hidden;
    background-color: #ffff;
    display: grid;
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: 1fr, 60px 60px 60px 60px;
  }

  .calculator-container {
    position: absolute;
    z-index: 1000;
    background-color: #fff;
    box-shadow: 0px 10px 15px 11px rgba(0, 0, 0, 0.1);
  }

  .window-header {
    background-color: #333;
    color: #fff;
    padding: 5px;
    cursor: move;
    display: flex;
    font-weight: 600;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
  }
</style>
