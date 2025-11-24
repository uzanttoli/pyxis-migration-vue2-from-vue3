<template>
  <v-row v-if="hasSearch">
    <Column :cols="3" :sm="3" :md="3" :lg="3">
      <TextField
        :max="7"
        :min="7"
        type="almope"
        append-icon="mdi-magnify"
        label="Almope"
        :value="almope"
        @input="handleValue"
        @keyup.enter.native="handleSearch($event.target.value)"
        @blur="handleBlur"
      />
    </Column>
    <Column :cols="6" :sm="6" :md="6" :lg="6">
      <TextField
        :max="7"
        :min="7"
        type="text"
        append-icon="mdi-magnify"
        label="Nome"
        :value="almopeResponse.nome"
        disabled
      />
    </Column>
    <Column :cols="3" :sm="3" :md="3" :lg="3">
      <TextField
        :max="7"
        :min="7"
        type="text"
        append-icon="mdi-magnify"
        label="Regional"
        :value="almopeResponse.regional"
        disabled
      />
    </Column>
    <Column :cols="6" :sm="6" :md="6" :lg="6">
      <TextField
        :max="7"
        :min="7"
        type="text"
        append-icon="mdi-magnify"
        label="Superior 1"
        :value="almopeResponse.superior1"
        disabled
      />
    </Column>
    <Column :cols="6" :sm="6" :md="6" :lg="6">
      <TextField
        :max="7"
        :min="7"
        type="text"
        append-icon="mdi-magnify"
        label="Superior 2"
        :value="almopeResponse.superior2"
        disabled
      />
    </Column>
  </v-row>

  <TextField
    v-else
    :max="7"
    :min="7"
    type="almope"
    append-icon="mdi-magnify"
    label="Almope"
    :value="almope"
  />
</template>

<script>
  import TextField from '@/shared/components/TextField/TextField.vue'
  import Column from '@/shared/components/Column/Column.vue'
  import { reverseMapAndConvertKeys } from '../../../utils/mapAndConvertKeys.js'
  import ColaboradorService from '../../../data/services/colaborador/Colaborador.js'
  export default {
    name: 'AlmopeField',
    components: {
      TextField,
      Column
    },
    props: {
      hasSearch: {
        type: Boolean,
        default: false
      },
      almope: {
        type: String,
        required: false
      }
    },
    data() {
      return {
        almopeResponse: {
          almope: '',
          nome: '',
          regional: '',
          superior1: '',
          superior2: ''
        }
      }
    },
    methods: {
      handleBlur(event) {
        this.handleSearch(event.target.value)
      },
      handleValue(event) {
        this.$emit('update', event)
      },
      async handleSearch(event) {
        const response = await ColaboradorService.getByAlmope(event)
        const almopeData = reverseMapAndConvertKeys(response[0], {
          almope: 'almope',
          nome: 'nome',
          regional: 'regional',
          superior1: 'superior1',
          superior2: 'superior2'
        })
        this.$set(this, 'almopeResponse', almopeData)
      }
    }
  }
</script>

<style></style>
