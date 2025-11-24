<template>
  <div>
    <slot name="title">
      <v-list-item-title>
        <slot></slot>
      </v-list-item-title>
    </slot>
    <slot name="subtitle">
      <v-list-item-subtitle>
        <slot></slot>
      </v-list-item-subtitle>
    </slot>
  </div>
</template>

<script>
  export default {}
</script>

<style></style>
