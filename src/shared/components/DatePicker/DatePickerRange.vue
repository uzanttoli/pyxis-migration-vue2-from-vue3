<template>
  <v-menu
    v-model="localShowDatePicker"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
    persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="dateRangeText"
        dense
        outlined
        label="Data inicio/Data fim"
        prepend-inner-icon="fa-regular fa-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="datesRange"
      range
      locale="pt-br"
      @change="checkDateIntervalInverted"
      no-title
    >
      <slot name="action"></slot>
    </v-date-picker>
  </v-menu>
</template>

<script>
  import { checkDateIntervalInverted, formatedDate } from '@/utils/checkDateIntervalInverted.js'
  export default {
    name: 'DatePickerRange',
    props: {
      dates: {
        type: Array,
        default: () => []
      },
      showDatePicker: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      datesRange: [],
      dateCheck: []
    }),
    computed: {
      dateRangeText() {
        return this.dateCheck.join(' ~ ')
      },
      localShowDatePicker: {
        get() {
          return this.showDatePicker
        },
        set(value) {
          this.$emit('update:showDatePicker', value)
        }
      }
    },
    methods: {
      checkDateIntervalInverted() {
        let dateFormated = formatedDate(checkDateIntervalInverted(this.datesRange))
        let dateCheck = checkDateIntervalInverted(this.datesRange)
        this.dateCheck = dateFormated
        this.$emit('update:dates', dateCheck)
      }
    }
  }
</script>

<style></style>
