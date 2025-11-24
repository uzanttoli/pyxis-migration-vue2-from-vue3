<template>
  <v-text-field
    outlined
    dense
    placeholder="Pesquisar"
    label="Pesquisar"
    :value="value"
    @input="$emit('input', $event)"
  ></v-text-field>
</template>

<script>
  export default {
    props: {
      value: String
    }
  }
</script>
