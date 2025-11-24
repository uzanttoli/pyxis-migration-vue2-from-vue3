<template>
  <fieldset :style="'border:0.5px solid' + colorBorderField" v-if="items.length">
    <legend :style="'color:' + colorTitleField">{{ title }}</legend>
    <div style="display: flex; align-items: center">
      <v-btn-toggle class="rounded-lg" mandatory v-model="localValue" dense>
        <v-btn
          class="text-capitalize"
          :class="item.value === localValue ? 'white--text blue darken-3' : ''"
          v-for="(item, i) in items"
          :key="i"
          :value="item.value"
          @click="handleChange(item.value)"
        >
          <i
            v-if="item.value === localValue"
            class="fa-solid fa-circle-check"
            style="color: greenyellow; margin-right: 5px"
          ></i>
          {{ item.text }}
        </v-btn>
      </v-btn-toggle>
    </div>
    <div v-if="!items.length">
      <span style="color: #fff; font-size: 1rem">Buscando informações...</span>
    </div>
    <div class="loader" v-if="loading"></div>
  </fieldset>
</template>

<script>
  /**
   * Componente genérico de seleção de itens com botão toggle
   *
   * @example
   * <ItemSelector
   *   v-model="itemSelecionado"
   *   :items="[{ value: '1', text: 'Item 1' }]"
   *   title="Itens"
   * />
   */
  export default {
    name: 'ItemSelector',
    props: {
      value: {
        type: String,
        default: null
      },
      items: {
        type: Array,
        default: () => []
      },
      title: {
        type: String,
        default: 'Bloco'
      },
      colorBorderField: {
        type: String,
        default: '#fff'
      },
      colorTitleField: {
        type: String,
        default: '#fff'
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      localValue: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      handleChange(itemText) {
        this.localValue = itemText

        this.$nextTick(() => {
          this.$emit('change', this.localValue)
        })
      }
    }
  }
</script>

<style scoped>
  fieldset {
    padding: 7px;
    border: 0.5px solid #fff;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  legend {
    font-size: 13px;
    margin: 0 5px;
    color: #fff;
    padding: 0;
    margin-bottom: -5px;
    padding: 0 4px;
  }

  .loader {
    height: 4px;
    width: 100%;
    position: absolute;
    bottom: 0px;
    --c: no-repeat linear-gradient(#1e1e1f 0 0);
    background: var(--c), var(--c), #e0e0e0;
    background-size: 60% 100%;
    animation: l16 3s infinite;
  }
  @keyframes l16 {
    0% {
      background-position: -150% 0, -150% 0;
    }
    66% {
      background-position: 250% 0, -150% 0;
    }
    100% {
      background-position: 250% 0, 250% 0;
    }
  }
</style>
