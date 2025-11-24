<template>
  <td v-if="!formatableValue">
    {{ item }}
  </td>
  <td v-else :class="classTable(item)">
    {{ valueIsNull(item) }}
  </td>
</template>
<script>
  export default {
    name: 'table-column',
    props: {
      formatableValue: {
        type: Boolean,
        default: false
      },
      item: {
        type: [String, Number]
      }
    },
    methods: {
      classTable(value) {
        if (value == null) return '-'
        if (value < 4) {
          return 'orange darken-3 white--text'
        } else if (value == 4) {
          return 'cyan accent-4 white--text'
        } else {
          return 'light-blue darken-4 white--text'
        }
      },
      valueIsNull(value) {
        return value == null ? '-' : value
      }
    }
  }
</script>
